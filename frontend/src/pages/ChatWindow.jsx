import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getMessages } from '../api/conversation';

export default function ChatWindow() {
  const { id: conversationId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null); 

  
  useEffect(() => {
    getMessages(conversationId).then((res) => setMessages(res.data.messages));
  }, [conversationId]);

  
  useEffect(() => {
    if (!socket) return;

    socket.emit('joinConversation', conversationId);

    const handleNewMessage = (message) => {
      
      if (message.conversation === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage); 
    };
  }, [socket, conversationId]);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;

    socket.emit('sendMessage', {
      conversationId,
      senderId: user.id,
      text
    });

    setText('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 p-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
              m.sender === user.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}