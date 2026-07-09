import { updateBookingStatus } from '../../api/bookings';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-600'
};

export default function BookingCard({ booking, viewAs, onStatusChange }) {
  const handleAction = async (status) => {
    await updateBookingStatus(booking._id, status);
    onStatusChange(); 
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{booking.listing?.title}</p>
        <p className="text-sm text-gray-500">
          {new Date(booking.Date).toLocaleDateString()} {booking.Time && `at ${booking.Time}`}
        </p>
        {viewAs === 'seller' && <p className="text-sm text-gray-500">Requested by: {booking.buyer?.Name || booking.buyer?.name}</p>}
        <span className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="flex gap-2">
        {viewAs === 'seller' && booking.status === 'pending' && (
          <>
            <button onClick={() => handleAction('accepted')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Accept
            </button>
            <button onClick={() => handleAction('rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
              Reject
            </button>
          </>
        )}
        {viewAs === 'seller' && booking.status === 'accepted' && (
          <button onClick={() => handleAction('completed')} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
            Mark Completed
          </button>
        )}
        {viewAs === 'buyer' && booking.status === 'pending' && (
          <button onClick={() => handleAction('cancelled')} className="border px-3 py-1 rounded text-sm">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}