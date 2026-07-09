import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'donor', address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]"></div>
            <div className="w-4 h-px bg-[var(--color-neutral)]"></div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]"></div>
          </div>
          <h1 className="font-display text-4xl font-bold text-[var(--color-primary)]">
            FoodBridge
          </h1>
          <p className="text-sm mt-2 text-[var(--color-neutral)]">
            Create an account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-neutral)]/15">
          <h2 className="font-display text-2xl font-semibold mb-6">Sign up</h2>

          {error && <div className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm rounded-lg px-4 py-2 mb-4">{error}</div>}
          {success && <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm rounded-lg px-4 py-2 mb-4">{success}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[var(--color-neutral)]">Full name</label>
            <input name="name" required value={formData.name} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[var(--color-neutral)]">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[var(--color-neutral)]">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[var(--color-neutral)]">Phone number</label>
            <input name="phone" required value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[var(--color-neutral)]">Address</label>
            <input name="address" required value={formData.address} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-[var(--color-neutral)]">I am a</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-neutral)]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option value="donor">Donor (I have surplus food)</option>
              <option value="receiver">Receiver (I need food)</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-sm text-center mt-6 text-[var(--color-neutral)]">
            Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-medium">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}