import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
        const userData = profileRes.data.user;
        setProfile({
          ...userData,
          name: userData.name || userData.Name,
          ratingAvg: userData.RatingAvg,
          ratingCount: userData.RatingCount,
          bio: userData.Bio,
          location: userData.Location,
          Picture: userData.Picture,
          avatar: userData.Picture
        });
        setListings(listingsRes.data.Listings || listingsRes.data.listings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profile) return <p className="p-6">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profile.Picture || 'https://placehold.co/100x100?text=User'}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl font-bold">{profile.Name || profile.name}</h1>
          <p className="text-gray-500">{profile.Location || profile.location}</p>
          <p className="text-sm">⭐ {profile.RatingAvg || 'No ratings yet'} ({profile.RatingCount || profile.ratingCount} reviews)</p>
        </div>
        {isOwnProfile && (
          <button className="ml-auto border px-4 py-2 rounded">Edit Profile</button>
        )}
      </div>

      <p className="text-gray-700 mb-6">{profile.Bio || profile.bio || 'No bio yet.'}</p>

      <h2 className="font-semibold mb-3">Listings by {profile.Name || profile.name}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {listings.map((l) => (
          <div key={l._id} className="border rounded p-2 text-sm">{l.title}</div>
        ))}
        {listings.length === 0 && <p className="text-gray-500 text-sm">No listings yet.</p>}
      </div>

      <h2 className="font-semibold mb-3">Reviews</h2>

     
      {currentUser && !isOwnProfile && (
        <div className="mb-6">
          <ReviewForm
            targetUserId={profile._id}
            onSubmitted={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      )}

      <ReviewList userId={profile._id} refreshKey={refreshKey} />
    </div>
  );
}