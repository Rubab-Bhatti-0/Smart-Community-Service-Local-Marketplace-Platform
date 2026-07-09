import { useState } from 'react';
import { createReview } from '../../api/reviews';
import StarRating from './StarRating';

export default function ReviewForm({ targetUserId, listingId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await createReview({ targetUserId, listingId, rating, comment });
      setRating(0);
      setComment('');
      onSubmitted(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-3">
      <p className="font-medium">Leave a review</p>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        className="w-full border rounded px-3 py-2"
      />
      <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}