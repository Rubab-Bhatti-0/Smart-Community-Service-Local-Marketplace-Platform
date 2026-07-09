import api from './axiosInstance';

export const getListings = (params) => api.get('/listings/viewall', { params });
export const getListingById = (id) => api.get(`/listings/${id}`);
export const getMyListings = () => api.get('/listings/getmine');
export const createListing = (formData) => api.post('/listings/create', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateListing = (id, formData) => api.put(`/listings/edit/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteListing = (id) => api.delete(`/listings/del/${id}`);
