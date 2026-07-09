const Message = require('../models/Message.model');
const Conversation = require('../models/Conversation.model');
const Notification = require('../models/Notification.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('sendMessage', async ({ conversationId, senderId, receiverId, text }) => {
      try {
        const message = await Message.create({ conversation: conversationId, sender: senderId, text });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          updatedAt: new Date()
        });

        await Notification.create({
          user: receiverId,
          type: 'message',
          message: 'You have a new message'
        });

        // push the new message to everyone in this conversation's "room"
        io.to(conversationId).emit('newMessage', message);
      } catch (err) {
        console.error('Socket sendMessage error:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};