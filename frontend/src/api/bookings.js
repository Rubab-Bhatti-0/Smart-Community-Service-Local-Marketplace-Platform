import api from './axiosInstance';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/mine');
export const getReceivedBookings = () => api.get('/bookings/received');
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });