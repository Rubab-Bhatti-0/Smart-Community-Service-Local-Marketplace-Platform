import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSellerOrAdmin = user && (user.role === 'seller' || user.role === 'admin');

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/listings" className="text-xl font-bold text-blue-600">CommunityMarket</Link>

      <div className="flex gap-4 items-center">
        <Link to="/listings" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Browse</Link>
        {user ? (
          <>
            <NotificationBell />
            <Link to="/messages" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Messages</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Dashboard</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">Admin Panel</Link>
            )}
            {isSellerOrAdmin && (
              <Link to="/listings/new" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded font-medium transition-colors">
                Create Listing
              </Link>
            )}
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 font-medium">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
