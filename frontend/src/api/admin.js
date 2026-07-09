import api from './axiosInstance';

export const getAllUsers = () => api.get('/admin/users');
export const toggleSuspendUser = (id) => api.patch(`/admin/users/${id}/suspend`);
export const getAllListingsAdmin = () => api.get('/admin/listings');
export const updateListingStatus = (id, status) => api.patch(`/admin/listings/${id}/status`, { status });
export const getPlatformStats = () => api.get('/admin/stats');