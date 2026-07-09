import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, getReceivedBookings } from '../api/bookings';
import { getMyFavorites } from '../api/favourite';
import { getMyListings } from '../api/listing';
import BookingCard from '../components/booking/BookingCard';

const TABS = ['overview', 'listings', 'bookings', 'favorites'];

export default function Dashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [myListings, setMyListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSellerOrAdmin = user?.role === 'seller' || user?.role === 'admin';

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [listingsRes, myBookingsRes, receivedRes, favRes] = await Promise.all([
        getMyListings(),
        getMyBookings(),
        getReceivedBookings(),
        getMyFavorites()
      ]);
      setMyListings(listingsRes.data.listings || []);
      setMyBookings(myBookingsRes.data.bookings || []);
      setReceivedBookings(receivedRes.data.bookings || []);
      setFavorites(favRes.data.favorites || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (err.response?.status === 401) return; // Let interceptor handle it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500 capitalize">Account Type: {user?.role}</p>
        </div>
        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <Link to="/admin" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Go to Admin Panel
            </Link>
          )}
          {isSellerOrAdmin && (
            <Link to="/listings/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              + Create New Listing
            </Link>
          )}
          {!isSellerOrAdmin && (
            <Link to="/listings" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              + Add Booking
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
        {TABS.map((tab) => {
          if (tab === 'listings' && !isSellerOrAdmin) return null;
          return (
            <button
              key={tab}
              onClick={() => setSearchParams({ tab })}
              className={`pb-4 px-2 capitalize text-sm font-medium transition-all ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isSellerOrAdmin && <StatCard label="My Listings" value={myListings.length} />}
          <StatCard label="Bookings Sent" value={myBookings.length} />
          {isSellerOrAdmin && <StatCard label="Requests Received" value={receivedBookings.length} />}
          <StatCard label="Saved Items" value={favorites.length} />
        </div>
      )}

      {activeTab === 'listings' && isSellerOrAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((l) => (
            <div key={l._id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 truncate pr-4">{l.title}</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${l.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {l.status}
                </span>
              </div>
              <p className="text-blue-600 font-bold">Rs. {l.pricing}</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/listings/${l._id}`} className="text-xs text-blue-600 hover:underline">View</Link>
                <Link to={`/listings/${l._id}/edit`} className="text-xs text-gray-600 hover:underline">Edit</Link>
              </div>
            </div>
          ))}
          {myListings.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">You haven't created any listings yet.</p>
              <Link to="/listings/new" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Create Your First Listing</Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4 text-gray-800">My Booking Requests</h2>
            <div className="space-y-4">
              {myBookings.map((b) => (
                <BookingCard key={b._id} booking={b} viewAs="buyer" onStatusChange={fetchAll} />
              ))}
              {myBookings.length === 0 && <p className="text-gray-500 text-sm py-4 italic">No outgoing requests.</p>}
            </div>
          </div>
          {isSellerOrAdmin && (
            <div>
              <h2 className="text-lg font-bold mb-4 text-gray-800">Requests for My Services</h2>
              <div className="space-y-4">
                {receivedBookings.map((b) => (
                  <BookingCard key={b._id} booking={b} viewAs="seller" onStatusChange={fetchAll} />
                ))}
                {receivedBookings.length === 0 && <p className="text-gray-500 text-sm py-4 italic">No incoming requests.</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <Link key={f._id} to={`/listings/${f.listing?._id}`} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow block">
              <h3 className="font-bold text-gray-900 truncate">{f.listing?.title}</h3>
              <p className="text-blue-600 font-bold mt-1">Rs. {f.listing?.pricing}</p>
              <p className="text-xs text-gray-500 mt-2">By {f.listing?.owner?.name}</p>
            </Link>
          ))}
          {favorites.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No favorite listings yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
    </div>
  );
}
