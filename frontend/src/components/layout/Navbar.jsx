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

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">CommunityMarket</Link>

      <div className="flex gap-4 items-center">
        <Link to="/listings">Browse</Link>
        {user ? (
          <>
            <NotificationBell />
            <Link to="/messages">Messages</Link>
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}