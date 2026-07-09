import api from './axiosInstance';

export const getUserProfile = (userId) => api.get(`/users/${userId}`); // you'll need to add this simple GET route to your backend today if it's not there yet
export const updateProfile = (data) => api.put('/users/me', data);