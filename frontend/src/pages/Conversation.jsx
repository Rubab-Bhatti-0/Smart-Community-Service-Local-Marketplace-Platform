import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyConversations } from '../api/conversation';

export default function Conversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getMyConversations().then((res) => setConversations(res.data.conversations));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Messages</h1>
      <div className="space-y-2">
        {conversations.map((c) => {
          
          const otherUser = c.participants.find((p) => p._id !== user.id);
          return (
            <Link
              key={c._id}
              to={`/messages/${c._id}`}
              className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-50"
            >
              <img
                src={otherUser?.Picture || otherUser?.avatar || 'https://placehold.co/40x40?text=U'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{otherUser?.Name || otherUser?.name}</p>
                <p className="text-sm text-gray-500 truncate">{c.lastMessage || 'No messages yet'}</p>
              </div>
            </Link>
          );
        })}
        {conversations.length === 0 && <p className="text-gray-500">No conversations yet.</p>}
      </div>
    </div>
  );
}