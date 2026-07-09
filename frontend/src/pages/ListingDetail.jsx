import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById } from '../api/listing';
import { toggleFavorite } from '../api/favourite';
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

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!listing) return <p className="p-6 text-center text-red-500">Listing not found.</p>;

  const isOwner = user && listing.owner._id === user.id;

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={listing.images?.[activeImage] || 'https://placehold.co/600x400?text=No+Image'}
          alt={listing.title}
          className="w-full h-96 object-cover rounded-lg shadow-sm"
        />
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {listing.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${listing.title} ${i + 1}`}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all ${i === activeImage ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">{listing.type}</span>
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          </div>
          <p className="text-2xl font-bold text-blue-600">Rs. {listing.pricing}</p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600 mt-1 leading-relaxed">{listing.description}</p>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            {listing.owner?.picture && (
              <img src={listing.owner.picture} alt={listing.owner.name} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <p className="font-semibold text-gray-900">Seller: {listing.owner?.name}</p>
              <p className="text-sm text-gray-500">
                Rating: {listing.owner?.ratingAvg ? `${listing.owner.ratingAvg} / 5` : 'No ratings yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {isOwner ? (
            <Link to={`/listings/${listing._id}/edit`} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md transition-colors">
              Edit Listing
            </Link>
          ) : (
            <>
              {listing.type === 'service' && (
                <Link to={`/book/${listing._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                  Request Booking
                </Link>
              )}
              {user ? (
                <>
                  <button onClick={handleFavorite} className="border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md transition-colors">
                    ♡ Favorite
                  </button>
                  <button onClick={handleMessage} className="border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-md transition-colors">
                    Message Seller
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-blue-600 hover:underline">Log in to book or message</Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
