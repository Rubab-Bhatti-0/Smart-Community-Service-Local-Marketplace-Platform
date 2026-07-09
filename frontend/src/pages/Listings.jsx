import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListings } from '../api/listing';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', type: '', serviceCategory: '', minPrice: '', maxPrice: '', page: 1, limit: 12
  });

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const cleanParams = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );
        if (cleanParams.page) cleanParams.page = Number(cleanParams.page);
        const res = await getListings(cleanParams);
        setListings(res.data.Listings || res.data.listings || []);
        setPagination({ page: Number(filters.page), total: res.data.total || 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-6">
        <aside className="w-64 shrink-0 space-y-4">
          <input
            type="text"
            placeholder="Search listings..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
          <input
            type="text"
            placeholder="Service Category"
            value={filters.serviceCategory}
            onChange={(e) => updateFilter('serviceCategory', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="w-1/2 border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-1/2 border rounded px-3 py-2"
            />
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <p>Loading...</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-500">No listings match your filters.</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{pagination.total} results</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateFilter('page', p)}
                    className={`px-3 py-1 rounded ${p === pagination.page ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing._id}`} className="border rounded-lg overflow-hidden hover:shadow-md transition">
      <img
        src={listing.Images?.[0] || listing.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <span className="text-xs uppercase text-gray-400">{listing.type}</span>
        <h3 className="font-semibold truncate">{listing.title}</h3>
        <p className="text-blue-600 font-bold">Rs. {listing.Pricing || listing.price}</p>
        <p className="text-sm text-gray-500">{listing.owner?.Name || listing.owner?.name}</p>
      </div>
    </Link>
  );
}