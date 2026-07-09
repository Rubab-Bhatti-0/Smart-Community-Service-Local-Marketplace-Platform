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
    try {
      await updateBookingStatus(booking._id, status);
      onStatusChange(); 
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{booking.listing?.title}</h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-medium text-gray-700">Date:</span> {new Date(booking.date).toLocaleDateString()}
              {booking.time && <span> at {booking.time}</span>}
            </p>
            {viewAs === 'seller' && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="font-medium text-gray-700">Buyer:</span> {booking.buyer?.name}
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
              <button onClick={() => handleAction('accepted')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors">
                Accept
              </button>
              <button onClick={() => handleAction('rejected')} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-md text-xs font-bold transition-colors">
                Reject
              </button>
            </>
          )}
          {viewAs === 'seller' && booking.status === 'accepted' && (
            <button onClick={() => handleAction('completed')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors">
              Complete
            </button>
          )}
          {viewAs === 'buyer' && booking.status === 'pending' && (
            <button onClick={() => handleAction('cancelled')} className="text-gray-500 hover:text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md text-xs font-bold transition-colors">
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
