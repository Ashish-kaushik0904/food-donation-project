import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, login, token } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setFormData({
        name: res.data.name,
        phone: res.data.phone,
        address: res.data.address || ''
      });
      setEmail(res.data.email);
    } catch (err) {
      console.error(err);
      setError('Could not load your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await api.put('/auth/me', formData);
      setSuccess('Profile updated successfully.');
      login({ ...user, name: res.data.user.name }, token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-bold mb-1">Your profile</h1>
        <p className="text-(--color-neutral) mb-8">Keep your contact details up to date.</p>

        {loading ? (
          <p className="text-(--color-neutral) text-sm">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-(--color-neutral)/15 space-y-4">
            {error && <div className="bg-(--color-secondary)/10 text-(--color-secondary) text-sm rounded-lg px-4 py-2">{error}</div>}
            {success && <div className="bg-(--color-primary)/10 text-(--color-primary) text-sm rounded-lg px-4 py-2">{success}</div>}

            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Email</label>
              <input value={email} disabled
                className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/20 bg-(--color-base) text-(--color-neutral)" />
              <p className="text-xs text-(--color-neutral) mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Full name</label>
              <input name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Phone number</label>
              <input name="phone" required value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Address</label>
              <input name="address" required value={formData.address} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-(--color-primary) text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}