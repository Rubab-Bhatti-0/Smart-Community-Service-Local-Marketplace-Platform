import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import ListingForm from './pages/ListingForm';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import BookingRequest from './pages/BookingRequest';
import Conversation from './pages/Conversation';
import ChatWindow from './pages/ChatWindow';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/listings" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/profile/:id" element={<Profile />} />

        {/* Protected Routes (All Auth Users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookingRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:id"
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          }
        />

        {/* Seller/Admin Protected Routes */}
        <Route
          path="/listings/new"
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <ListingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <ListingForm />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/listings" replace />} />
      </Routes>
    </>
  );
}

export default App;
