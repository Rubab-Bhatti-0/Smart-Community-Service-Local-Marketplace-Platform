import { useState, useEffect, useCallback } from 'react';
import { getReviewsForUser } from '../../api/reviews';
import StarRating from './StarRating';

export default function ReviewList({ userId, refreshKey }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = useCallback(async () => {
    const res = await getReviewsForUser(userId);
    setReviews(res.data.reviews);
  }, [userId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshKey]); 

  if (reviews.length === 0) return <p className="text-gray-500 text-sm">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">{r.buyer?.Name || r.buyer?.name}</span>
            <StarRating value={r.rating} readOnly />
          </div>
          {r.comment && <p className="text-gray-600 text-sm mt-1">{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}