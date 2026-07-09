import api from './axiosInstance';

export const createReview = (data) => api.post('/reviews', data);
export const getReviewsForUser = (userId) => api.get(`/reviews/user/${userId}`);