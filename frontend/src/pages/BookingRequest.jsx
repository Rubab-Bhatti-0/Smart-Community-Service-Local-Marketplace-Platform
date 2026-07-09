import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../api/listings';
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

  if (!listing) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-1">Request Booking</h1>
      <p className="text-gray-500 mb-6">{listing.title} — Rs. {listing.price}</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
            min={new Date().toISOString().split('T')[0]} 
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {submitting ? 'Sending request...' : 'Send Booking Request'}
        </button>
      </form>
    </div>
  );
}