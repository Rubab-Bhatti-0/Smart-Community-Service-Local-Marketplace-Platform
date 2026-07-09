import { useState } from 'react';
import { updateBookingStatus } from '../../api/bookings';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-600'
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export default function BookingCard({ booking, viewAs, onStatusChange }) {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleAction = async (status) => {
    setActionLoading(true);
    setActionError('');
    try {
      await updateBookingStatus(booking._id, status);
      onStatusChange();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {actionError && (
        <p className="text-xs text-red-600 mb-2">{actionError}</p>
      )}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{booking.listing?.title || 'Unknown Listing'}</h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusColors[booking.status]}`}>
              {statusLabels[booking.status] || booking.status}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-medium text-gray-700">Date:</span> {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
              {booking.time && <span> at {booking.time}</span>}
            </p>
            {viewAs === 'seller' && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="font-medium text-gray-700">Buyer:</span> {booking.buyer?.name || 'Unknown'}
              </p>
            )}
            {viewAs === 'buyer' && booking.listing?.owner?.name && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="font-medium text-gray-700">Seller:</span> {booking.listing.owner.name}
              </p>
            )}
            {booking.notes && (
              <p className="text-xs text-gray-500 mt-2 italic">"{booking.notes}"</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {viewAs === 'seller' && booking.status === 'pending' && (
            <>
              <button onClick={() => handleAction('accepted')} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Accept'}
              </button>
              <button onClick={() => handleAction('rejected')} disabled={actionLoading} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50">
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
            </>
          )}
          {viewAs === 'seller' && booking.status === 'accepted' && (
            <button onClick={() => handleAction('completed')} disabled={actionLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50">
              {actionLoading ? 'Processing...' : 'Complete'}
            </button>
          )}
          {viewAs === 'buyer' && booking.status === 'pending' && (
            <button onClick={() => handleAction('cancelled')} disabled={actionLoading} className="text-gray-500 hover:text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50">
              {actionLoading ? 'Processing...' : 'Cancel Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
