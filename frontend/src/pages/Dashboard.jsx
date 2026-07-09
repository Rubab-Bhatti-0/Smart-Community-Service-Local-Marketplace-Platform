import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, getReceivedBookings } from '../api/bookings';
import { getMyFavorites } from '../api/favourite';
import { getListings } from '../api/listing';
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

  const fetchAll = async () => {
    const [listingsRes, myBookingsRes, receivedRes, favRes] = await Promise.all([
      getListings({ owner: user.id }),
      getMyBookings(),
      getReceivedBookings(),
      getMyFavorites()
    ]);
    setMyListings(listingsRes.data.listings);
    setMyBookings(myBookingsRes.data.bookings);
    setReceivedBookings(receivedRes.data.bookings);
    setFavorites(favRes.data.favorites);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
      <p className="text-gray-500 mb-6">Role: {user?.role}</p>

    
      <div className="flex gap-4 border-b mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSearchParams({ tab })}
            className={`pb-2 px-1 capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Active Listings" value={myListings.length} />
          <StatCard label="Bookings Made" value={myBookings.length} />
          <StatCard label="Requests Received" value={receivedBookings.length} />
          <StatCard label="Earnings (demo)" value={`Rs. ${myListings.length * 4500}`} />
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {myListings.map((l) => (
            <div key={l._id} className="border rounded p-3">
              <p className="font-medium">{l.title}</p>
              <p className="text-sm text-gray-500">Rs. {l.price}</p>
            </div>
          ))}
          {myListings.length === 0 && <p className="text-gray-500">No listings yet.</p>}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">My Booking Requests</h2>
            <div className="space-y-2">
              {myBookings.map((b) => (
                <BookingCard key={b._id} booking={b} viewAs="buyer" onStatusChange={fetchAll} />
              ))}
              {myBookings.length === 0 && <p className="text-gray-500 text-sm">No bookings yet.</p>}
            </div>
          </div>
          {user?.role === 'seller' && (
            <div>
              <h2 className="font-semibold mb-2">Requests on My Listings</h2>
              <div className="space-y-2">
                {receivedBookings.map((b) => (
                  <BookingCard key={b._id} booking={b} viewAs="seller" onStatusChange={fetchAll} />
                ))}
                {receivedBookings.length === 0 && <p className="text-gray-500 text-sm">No requests yet.</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {favorites.map((f) => (
            <div key={f._id} className="border rounded p-3">{f.listing?.title}</div>
          ))}
          {favorites.length === 0 && <p className="text-gray-500">No favorites yet.</p>}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}