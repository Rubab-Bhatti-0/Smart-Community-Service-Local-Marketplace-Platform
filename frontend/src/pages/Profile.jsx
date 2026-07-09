import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/users';
import { getListings } from '../api/listing'; 
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 

  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, listingsRes] = await Promise.all([
          getUserProfile(id),
          getListings({ owner: id })
        ]);
        setProfile(profileRes.data.user);
        setListings(listingsRes.data.listings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, refreshKey]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (!profile) return <div className="p-6 text-center text-red-500">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.picture || 'https://placehold.co/100x100?text=User'}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
          />
          <div className="text-center md:text-left flex-1">
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
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                {profile.role}
              </span>
            </div>
          </div>
          {isOwnProfile && (
            <button className="bg-white border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md text-sm font-bold transition-colors">
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio provided yet.'}</p>
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
