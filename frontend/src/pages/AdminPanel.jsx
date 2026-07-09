import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getAllUsers, toggleSuspendUser, getAllListingsAdmin, updateListingStatus, getPlatformStats
} from '../api/admin';

const TABS = ['stats', 'users', 'listings'];

export default function AdminPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'stats';

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  const fetchAll = async () => {
    const [statsRes, usersRes, listingsRes] = await Promise.all([
      getPlatformStats(), getAllUsers(), getAllListingsAdmin()
    ]);
    setStats(statsRes.data.stats);
    setUsers(usersRes.data.users);
    setListings(listingsRes.data.listings);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSuspend = async (id) => {
    await toggleSuspendUser(id);
    fetchAll();
  };

  const handleListingStatus = async (id, status) => {
    await updateListingStatus(id, status);
    fetchAll();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

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

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.userCount} />
          <StatCard label="Total Listings" value={stats.listingCount} />
          <StatCard label="Active Listings" value={stats.activeListingCount} />
          <StatCard label="Total Bookings" value={stats.bookingCount} />
        </div>
      )}

      {activeTab === 'users' && (
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.Name || u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <span className={u.isSuspended ? 'text-red-600' : 'text-green-600'}>
                    {u.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="p-2">
                  <button onClick={() => handleSuspend(u._id)} className="text-blue-600 text-xs">
                    {u.isSuspended ? 'Reactivate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'listings' && (
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Owner</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l._id} className="border-t">
                <td className="p-2">{l.title}</td>
                <td className="p-2">{l.owner?.Name || l.owner?.name}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2 space-x-2">
                  {l.status !== 'active' && (
                    <button onClick={() => handleListingStatus(l._id, 'active')} className="text-green-600 text-xs">
                      Approve
                    </button>
                  )}
                  {l.status !== 'removed' && (
                    <button onClick={() => handleListingStatus(l._id, 'removed')} className="text-red-600 text-xs">
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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