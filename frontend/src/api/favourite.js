import api from './axiosInstance';

export const toggleFavorite = (listingId) => api.patch(`/favorites/${listingId}`);
export const getMyFavorites = () => api.get('/favorites/mine');