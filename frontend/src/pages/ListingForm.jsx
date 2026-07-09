import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createListing, updateListing, getListingById } from '../api/listing';

export default function ListingForm() {
  const { id } = useParams(); 
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'product', title: '', description: '', price: '', serviceCategory: '',
    location: '', stock: '', deliveryTime: '', availability: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    const loadListing = async () => {
      const res = await getListingById(id);
      const l = res.data.listing;
      setForm({
        type: l.type, title: l.title,
        description: l.Description || l.description,
        price: l.Pricing || l.price,
        serviceCategory: l.serviceCategory || l.category || '',
        location: l.Location || l.location || '',
        stock: l.Stock || l.stock || '',
        deliveryTime: l.Delivery_Time || l.deliveryTime || '',
        availability: l.Availability || l.availability || ''
      });
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
      const mappedKey = key === 'price' ? 'Pricing' :
          key === 'description' ? 'Description' :
          key === 'serviceCategory' ? 'serviceCategory' :
          key === 'stock' ? 'Stock' :
          key === 'deliveryTime' ? 'Delivery_Time' :
          key === 'availability' ? 'Availability' : key;
      if (value !== '') data.append(mappedKey, value);
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
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Listing' : 'Create Listing'}</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="product">Product</option>
          <option value="service">Service</option>
        </select>

        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required
          className="w-full border rounded px-3 py-2" />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required
          className="w-full border rounded px-3 py-2" rows={4} />

        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required
          className="w-full border rounded px-3 py-2" />

        <input name="serviceCategory" placeholder="Service Category (e.g. Web Development)" value={form.serviceCategory} onChange={handleChange} required
          className="w-full border rounded px-3 py-2" />

        <input name="location" placeholder="Location" value={form.location} onChange={handleChange}
          className="w-full border rounded px-3 py-2" />

        {form.type === 'product' && (
          <input name="stock" type="number" placeholder="Stock quantity" value={form.stock} onChange={handleChange}
            className="w-full border rounded px-3 py-2" />
        )}

        {form.type === 'service' && (
          <>
            <input name="deliveryTime" placeholder="Delivery time (e.g. 3 days)" value={form.deliveryTime} onChange={handleChange}
              className="w-full border rounded px-3 py-2" />
            <input name="availability" placeholder="Availability (e.g. Mon-Fri)" value={form.availability} onChange={handleChange}
              className="w-full border rounded px-3 py-2" />
          </>
        )}

        <input type="file" multiple accept="image/*" onChange={handleImageChange}
          className="w-full border rounded px-3 py-2" />

        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {submitting ? 'Saving...' : isEditMode ? 'Update Listing' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}