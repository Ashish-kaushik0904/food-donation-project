import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

export default function DonorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    foodType: '', quantity: '', address: '', availableTill: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [actingId, setActingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/donate/my');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError('Could not load your requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/donate', formData);
      setSuccess('Your donation request has been posted.');
      setFormData({ foodType: '', quantity: '', address: '', availableTill: '' });
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setEditData({
      foodType: r.foodType,
      quantity: r.quantity,
      address: r.address,
      availableTill: r.availableTill
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    setActingId(id);
    try {
      await api.put(`/donate/${id}`, editData);
      setEditingId(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Could not update.');
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation request? This cannot be undone.')) return;
    setActingId(id);
    try {
      await api.delete(`/donate/${id}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Could not delete.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Donor dashboard</h1>
        <p className="text-(--color-neutral) mb-8">Post surplus food and track who picks it up.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-(--color-neutral)/15 h-fit">
            <h2 className="font-display text-lg font-semibold mb-4">Post a donation</h2>

            {error && <div className="bg-(--color-secondary)/10 text-(--color-secondary) text-sm rounded-lg px-4 py-2 mb-4">{error}</div>}
            {success && <div className="bg-(--color-primary)/10 text-(--color-primary) text-sm rounded-lg px-4 py-2 mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Food type</label>
                <input name="foodType" required placeholder="e.g. Rice and dal" value={formData.foodType} onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Quantity</label>
                <input name="quantity" required placeholder="e.g. 5 kg / serves 10" value={formData.quantity} onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Pickup address</label>
                <input name="address" required placeholder="e.g. College Mess A, Ludhiana" value={formData.address} onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-(--color-neutral)">Available until</label>
                <input name="availableTill" required placeholder="e.g. 8 PM today" value={formData.availableTill} onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-(--color-primary) text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50">
                {submitting ? 'Posting...' : 'Post donation'}
              </button>
            </form>
          </div>

          {/* List */}
          <div>
            <h2 className="font-display text-lg font-semibold mb-4">Your donations</h2>
            {loading ? (
              <p className="text-(--color-neutral) text-sm">Loading...</p>
            ) : requests.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-(--color-neutral)/15 text-center text-(--color-neutral) text-sm">
                No donations posted yet. Use the form to post your first one.
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm border border-(--color-neutral)/15">
                    {editingId === r._id ? (
                      <div className="space-y-2">
                        <input name="foodType" value={editData.foodType} onChange={handleEditChange}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
                        <input name="quantity" value={editData.quantity} onChange={handleEditChange}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
                        <input name="address" value={editData.address} onChange={handleEditChange}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
                        <input name="availableTill" value={editData.availableTill} onChange={handleEditChange}
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)" />
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => saveEdit(r._id)} disabled={actingId === r._id}
                            className="flex-1 bg-(--color-primary) text-white text-sm font-medium py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                            Save
                          </button>
                          <button onClick={cancelEdit}
                            className="flex-1 bg-white text-(--color-neutral) border border-(--color-neutral)/30 text-sm font-medium py-1.5 rounded-lg hover:bg-(--color-base) transition">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{r.foodType}</h3>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-(--color-neutral)">{r.quantity} · {r.address}</p>
                        <p className="text-xs text-(--color-neutral) mt-1">Available until {r.availableTill}</p>
                        {r.adminMessage && (
                          <div className="mt-3 bg-(--color-base) rounded-lg px-3 py-2 text-sm">
                            <span className="font-medium">Admin note: </span>{r.adminMessage}
                          </div>
                        )}
                        {r.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => startEdit(r)}
                              className="text-xs font-medium text-(--color-primary) border border-(--color-primary)/30 px-3 py-1 rounded-lg hover:bg-(--color-primary)/10 transition">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(r._id)} disabled={actingId === r._id}
                              className="text-xs font-medium text-(--color-secondary) border border-(--color-secondary)/30 px-3 py-1 rounded-lg hover:bg-(--color-secondary)/10 transition disabled:opacity-50">
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}