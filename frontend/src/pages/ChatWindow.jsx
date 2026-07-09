import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getMessages, getMyConversations } from '../api/conversation';
import api from '../api/axiosInstance';

export default function ChatWindow() {
  const { id: conversationId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [conversationData, setConversationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchConversationDetails = useCallback(async () => {
    try {
      const res = await getMyConversations();
      const convos = res.data.conversations || [];
      const convo = convos.find((c) => c._id === conversationId);
      if (convo) {
        setConversationData(convo);
      }
    } catch (err) {
      console.error('Failed to fetch conversation details:', err);
    }
  }, [conversationId]);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await getMessages(conversationId);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
    fetchConversationDetails();
  }, [conversationId, fetchConversationDetails]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('joinConversation', conversationId);

    const handleNewMessage = (message) => {
      if (message.conversation === conversationId) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m._id === message._id);
          if (alreadyExists) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveConversation', conversationId);
    };
  }, [socket, conversationId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getReceiverId = () => {
    if (!conversationData || !user) return null;
    const otherUser = conversationData.participants?.find((p) => p._id !== user.id);
    return otherUser?._id;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || !user) return;

    const receiverId = getReceiverId();

    socket.emit('sendMessage', {
      conversationId,
      senderId: user.id,
      receiverId,
      text
    });

    setText('');
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  const otherUser = conversationData
    ? conversationData.participants?.find((p) => p._id !== user.id)
    : null;

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col h-[80vh]">
      {otherUser && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <img
            src={otherUser.picture || 'https://placehold.co/40x40?text=U'}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-50"
          />
          <div>
            <h2 className="font-bold text-gray-900">{otherUser.name}</h2>
            <p className="text-xs text-gray-500">
              {conversationData?.participants?.some((p) => p._id === user.id) ? 'Online' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
              m.sender === user.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {m.text}
            <p className={`text-[9px] mt-0.5 ${m.sender === user.id ? 'text-blue-200' : 'text-gray-400'}`}>
              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={!user}
        />
        <button
          type="submit"
          disabled={!text.trim() || !user}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
