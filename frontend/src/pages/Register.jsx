import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">Join Us</h1>
        <p className="text-gray-500 text-center mb-8">Create your community account</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I want to be a</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
              <option value="buyer">Buyer / Customer</option>
              <option value="seller">Seller / Service Provider</option>
              <option value="admin">Administrator (Admin Panel Access)</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md mt-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-sm mt-6 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </p>
      </form>
    </div>
  );
}
