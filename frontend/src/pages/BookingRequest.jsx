import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../api/listing';
import { createBooking } from '../api/bookings';

export default function BookingRequest() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getListingById(id).then((res) => setListing(res.data.listing));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createBooking({ listingId: id, date, time, notes });
      navigate('/dashboard?tab=bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (!listing) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Request Booking</h1>
        <p className="text-gray-500 text-sm mb-8">
          For: <span className="font-semibold text-gray-700">{listing.title}</span> • Rs. {listing.pricing}
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
              min={new Date().toISOString().split('T')[0]} 
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Time</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (optional)</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
              placeholder="Any specific requirements or questions?"
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending request...' : 'Send Booking Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
