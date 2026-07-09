import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ Name: '', email: '', password: '', role: 'buyer' });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input name="Name" placeholder="Full Name" value={form.Name} onChange={handleChange} required
          className="w-full border rounded px-3 py-2 mb-3" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
          className="w-full border rounded px-3 py-2 mb-3" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
          className="w-full border rounded px-3 py-2 mb-3" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-4">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {submitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Log In</Link>
        </p>
      </form>
    </div>
  );
}