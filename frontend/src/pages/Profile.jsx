import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateProfile } from '../api/users';
import { getListings } from '../api/listing';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';

export default function Profile() {
  const { id: paramId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const id = paramId || currentUser?.id;
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '', bio: '', contact: '', location: '', picture: ''
  });

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, listingsRes] = await Promise.all([
          getUserProfile(id),
          getListings({})
        ]);
        const p = profileRes.data.user;
        setProfile(p);
        setEditForm({
          name: p.name,
          bio: p.bio || '',
          contact: p.contact || '',
          location: p.location || '',
          picture: p.picture || ''
        });
        setListings(listingsRes.data.listings?.filter(l => l.owner?._id === id) || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile. The user may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, refreshKey]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg inline-block">
        <p className="text-red-700">{error}</p>
        <button onClick={() => navigate('/listings')} className="text-blue-600 underline mt-4 inline-block">Back to Listings</button>
      </div>
    </div>
  );
  if (!profile) return <div className="p-6 text-center text-red-500">User not found.</div>;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      setRefreshKey(k => k + 1);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.picture || 'https://placehold.co/100x100?text=' + (profile.name?.[0] || 'U')}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
          />
          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Name</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-lg font-medium outline-none focus:ring-1 focus:ring-blue-500"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Location</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Location"
                    value={editForm.location}
                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Contact Details</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Contact"
                    value={editForm.contact}
                    onChange={e => setEditForm({ ...editForm, contact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-0.5">Profile Picture URL</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Profile Picture URL"
                    value={editForm.picture}
                    onChange={e => setEditForm({ ...editForm, picture: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 hover:bg-gray-300 px-4 py-1.5 rounded text-sm font-bold transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <span className="text-blue-600">📍</span> {profile.location || 'Location not specified'}
                </p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-4">
                  <div className="text-sm">
                    <span className="text-yellow-500 font-bold text-lg">★</span>
                    <span className="font-bold text-gray-900 ml-1">{profile.ratingAvg ? profile.ratingAvg.toFixed(1) : '0.0'}</span>
                    <span className="text-gray-400 ml-1">({profile.ratingCount || 0} reviews)</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    profile.role === 'admin' ? 'bg-red-50 text-red-600' : profile.role === 'seller' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {profile.role}
                  </span>
                </div>
                {profile.contact && (
                  <p className="text-sm text-gray-500 mt-2">📞 {profile.contact}</p>
                )}
              </>
            )}
          </div>
          {isOwnProfile && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-white border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md text-sm font-bold transition-colors">
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
          {isEditing ? (
            <textarea
              className="w-full border rounded px-3 py-2 text-gray-600 leading-relaxed"
              rows={4}
              value={editForm.bio}
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio provided yet.'}</p>
          )}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Listings by {profile.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <Link key={l._id} to={`/listings/${l._id}`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 truncate">{l.title}</h3>
              <p className="text-blue-600 font-bold mt-1">Rs. {l.pricing}</p>
            </Link>
          ))}
          {listings.length === 0 && (
            <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No active listings.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Feedback</h2>
        {currentUser && !isOwnProfile && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Leave a Review</h3>
            <ReviewForm
              targetUserId={profile._id}
              onSubmitted={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <ReviewList userId={profile._id} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
