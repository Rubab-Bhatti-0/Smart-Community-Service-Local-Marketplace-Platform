import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById } from '../api/listing'; // <-- check this matches your actual file name, see note below
import { toggleFavorite } from '../api/favourite'; // <-- same check needed here
import { startConversation } from '../api/conversation';
import { useAuth } from '../context/AuthContext';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await getListingById(id);
        setListing(res.data.listing);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleFavorite = async () => {
    if (!user) return;
    await toggleFavorite(listing._id);
  };

  const handleMessage = async () => {
    if (!user) return;
    const res = await startConversation(listing.owner._id);
    navigate(`/messages/${res.data.conversation._id}`);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!listing) return <p className="p-6">Listing not found.</p>;

  const isOwner = user && listing.owner._id === user.id;

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={listing.images[activeImage] || 'https://placehold.co/600x400?text=No+Image'}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="flex gap-2 mt-2">
          {listing.images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${i === activeImage ? 'border-blue-600' : 'border-transparent'}`}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs uppercase text-gray-400">{listing.type}</span>
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        <p className="text-blue-600 text-xl font-bold my-2">Rs. {listing.price}</p>
        <p className="text-gray-700 mb-4">{listing.description}</p>

        <div className="border-t pt-4 mt-4">
          <p className="font-semibold">Seller: {listing.owner?.name}</p>
          <p className="text-sm text-gray-500">Rating: {listing.owner?.ratingAvg || 'No ratings yet'}</p>
        </div>

        <div className="flex gap-3 mt-6">
          {isOwner ? (
            <Link to={`/listings/${listing._id}/edit`} className="bg-gray-800 text-white px-4 py-2 rounded">
              Edit Listing
            </Link>
          ) : (
            <>
              {listing.type === 'service' && (
                <Link to={`/book/${listing._id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Request Booking
                </Link>
              )}
              {user && (
                <>
                  <button onClick={handleFavorite} className="border px-4 py-2 rounded">
                    ♡ Favorite
                  </button>
                  <button onClick={handleMessage} className="border px-4 py-2 rounded">
                    Message Seller
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}