const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');


exports.startConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;

    
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, otherUserId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, otherUserId]
      });
    }

    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'Name Picture')
      .sort({ updatedAt: -1 });
    res.status(200).json({ conversations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    
    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not part of this conversation' });
    }

    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};