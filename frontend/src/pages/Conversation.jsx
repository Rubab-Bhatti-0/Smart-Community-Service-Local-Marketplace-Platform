import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyConversations } from '../api/conversation';

export default function Conversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyConversations()
      .then((res) => setConversations(res.data.conversations || []))
      .catch(err => console.error('Failed to load conversations'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Messages</h1>
      <div className="space-y-3">
        {conversations.map((c) => {
          const otherUser = c.participants.find((p) => p._id !== user.id);
          return (
            <Link
              key={c._id}
              to={`/messages/${c._id}`}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <img
                src={otherUser?.picture || 'https://placehold.co/40x40?text=U'}
                alt={otherUser?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{otherUser?.name}</p>
                  <span className="text-[10px] text-gray-400">
                    {new Date(c.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">{c.lastMessage || 'Start a conversation...'}</p>
              </div>
            </Link>
          );
        })}
        {conversations.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No conversations yet. Start browsing to connect with others!</p>
            <Link to="/listings" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Browse Listings</Link>
          </div>
        )}
      </div>
    </div>
  );
}
