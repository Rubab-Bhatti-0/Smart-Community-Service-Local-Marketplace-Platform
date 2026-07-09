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
        setListings(res.data.listings || []);
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

  const totalPages = Math.ceil(pagination.total / filters.limit);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="font-semibold mb-3">Filters</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-1/2 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-1/2 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No listings match your filters.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">{pagination.total} results found</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', p)}
                      className={`px-4 py-2 rounded-md transition-colors ${p === pagination.page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing._id}`} className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={listing.images?.[0] || 'https://placehold.co/400x300?text=No+Image'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase px-2 py-1 rounded text-gray-700 shadow-sm">
            {listing.type}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{listing.title}</h3>
        <p className="text-blue-600 font-bold mt-1">Rs. {listing.pricing}</p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {listing.owner?.picture && (
            <img src={listing.owner.picture} className="w-6 h-6 rounded-full object-cover" alt="" />
          )}
          <p className="text-xs text-gray-500 truncate">Seller: {listing.owner?.name}</p>
        </div>
      </div>
    </Link>
  );
}
