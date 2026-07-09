import api from './axiosInstance';

export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const updateProfile = (data) => api.put('/users/me', data);