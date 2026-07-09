import api from './axiosInstance';

export const startConversation = (otherUserId) => api.post('/conversations', { otherUserId });
export const getMyConversations = () => api.get('/conversations');
export const getMessages = (conversationId) => api.get(`/conversations/${conversationId}/messages`);