import api from './axiosInstance';

export const getListings = (params) => api.get('/listings', { params }); // params = {page, category, search, etc.}
export const getListingById = (id) => api.get(`/listings/${id}`);
export const createListing = (formData) => api.post('/listings', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateListing = (id, formData) => api.put(`/listings/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteListing = (id) => api.delete(`/listings/${id}`);