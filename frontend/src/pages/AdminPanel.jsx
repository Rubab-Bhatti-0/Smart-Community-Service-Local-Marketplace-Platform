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
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, listingsRes] = await Promise.all([
        getPlatformStats(), getAllUsers(), getAllListingsAdmin()
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setListings(listingsRes.data.listings);
    } catch (err) {
      console.error('AdminPanel fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSuspend = async (id) => {
    try {
      await toggleSuspendUser(id);
      fetchAll();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleListingStatus = async (id, status) => {
    try {
      await updateListingStatus(id, status);
      fetchAll();
    } catch (err) {
      alert('Failed to update listing status');
    }
  };

  if (loading && !stats) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Control Panel</h1>

      <div className="flex gap-6 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSearchParams({ tab })}
            className={`pb-4 px-2 capitalize text-sm font-medium transition-all ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={stats.userCount} />
          <StatCard label="Total Listings" value={stats.listingCount} />
          <StatCard label="Active Listings" value={stats.activeListingCount} />
          <StatCard label="Total Bookings" value={stats.bookingCount} />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${u.isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isSuspended ? 'bg-red-600' : 'bg-green-600'}`}></span>
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleSuspend(u._id)} className={`text-xs font-bold ${u.isSuspended ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}>
                      {u.isSuspended ? 'Reactivate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Listing Title</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {listings.map((l) => (
                <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{l.title}</td>
                  <td className="px-6 py-4 text-gray-500">{l.owner?.name || l.owner?.email}</td>
                  <td className="px-6 py-4">
                    <span className={`capitalize px-2 py-1 rounded-full text-[10px] font-bold ${l.status === 'active' ? 'bg-green-100 text-green-700' : l.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {l.status !== 'active' && (
                      <button onClick={() => handleListingStatus(l._id, 'active')} className="text-xs font-bold text-green-600 hover:text-green-700">
                        Approve
                      </button>
                    )}
                    {l.status !== 'removed' && (
                      <button onClick={() => handleListingStatus(l._id, 'removed')} className="text-xs font-bold text-red-600 hover:text-red-700">
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
