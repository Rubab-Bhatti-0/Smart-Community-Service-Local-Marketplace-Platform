import { useState, useEffect, useCallback } from 'react';
import { getReviewsForUser } from '../../api/reviews';
import StarRating from './StarRating';

export default function ReviewList({ userId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReviewsForUser(userId);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshKey]); 

  if (loading) return <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div></div>;

  if (reviews.length === 0) return <p className="text-gray-500 text-sm py-4 italic">No reviews yet.</p>;

  return (
    <div className="space-y-6">
      {reviews.map((r) => (
        <div key={r._id} className="border-b border-gray-50 pb-4 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-bold text-gray-900">{r.buyer?.name}</p>
              <p className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <StarRating value={r.rating} readOnly />
          </div>
          {r.comment && <p className="text-gray-600 text-sm leading-relaxed">"{r.comment}"</p>}
        </div>
      ))}
    </div>
  );
}
