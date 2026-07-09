import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createListing, updateListing, getListingById } from '../api/listing';

export default function ListingForm() {
  const { id } = useParams(); 
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'product', 
    title: '', 
    description: '', 
    pricing: '', 
    serviceCategory: '',
    location: '', 
    stock: '', 
    deliveryTime: '', 
    availability: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    const loadListing = async () => {
      try {
        const res = await getListingById(id);
        const l = res.data.listing;
        setForm({
          type: l.type, 
          title: l.title,
          description: l.description,
          pricing: l.pricing,
          serviceCategory: l.serviceCategory || '',
          location: l.location || '',
          stock: l.stock || '',
          deliveryTime: l.deliveryTime || '',
          availability: l.availability || ''
        });
      } catch (err) {
        setError('Failed to load listing data');
      }
    };
    loadListing();
  }, [id, isEditMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages(Array.from(e.target.files)); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== '') data.append(key, value);
    });
    images.forEach((file) => data.append('images', file)); 

    try {
      if (isEditMode) {
        await updateListing(id, data);
      } else {
        await createListing(data);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Listing Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input name="title" placeholder="e.g. Professional Web Design" value={form.title} onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" placeholder="Describe your product or service in detail..." value={form.description} onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Price (Rs.)</label>
              <input name="pricing" type="number" placeholder="0.00" value={form.pricing} onChange={handleChange} required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <input name="serviceCategory" placeholder="e.g. Technology" value={form.serviceCategory} onChange={handleChange} required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input name="location" placeholder="e.g. Islamabad, Pakistan" value={form.location} onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {form.type === 'product' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <input name="stock" type="number" placeholder="Available units" value={form.stock} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}

          {form.type === 'service' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Delivery Time</label>
                <input name="deliveryTime" placeholder="e.g. 3-5 business days" value={form.deliveryTime} onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Availability</label>
                <input name="availability" placeholder="e.g. Mon-Fri, 9am-5pm" value={form.availability} onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange}
              className="w-full border border-dashed rounded-md px-3 py-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Processing...' : isEditMode ? 'Update Listing' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
