import api from './axiosInstance';

export const createBooking = (data) => api.post('/bookings/create', data);
export const getMyBookings = () => api.get('/bookings/getmine');
export const getReceivedBookings = () => api.get('/bookings/received');
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
