import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-(--color-neutral)/15">
      <p className="text-2xl font-bold font-display text-(--color-primary)">{value}</p>
      <p className="text-xs text-(--color-neutral) mt-1">{label}</p>
    </div>
  );
}

function RequestCard({ item, type, title, subtitle, messageDrafts, onDraftChange, onAction, actingId }) {
  const isPending = item.status === 'pending';
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-(--color-neutral)/15">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm text-(--color-neutral)">{subtitle}</p>

      {item.adminMessage && (
        <div className="mt-3 bg-(--color-base) rounded-lg px-3 py-2 text-sm text-(--color-text)">
          <span className="font-medium">Note sent: </span>{item.adminMessage}
        </div>
      )}

      {isPending && (
        <div className="mt-4 space-y-2">
          <input
            placeholder="Optional message (e.g. only 3kg available)"
            value={messageDrafts[item._id] || ''}
            onChange={(e) => onDraftChange(item._id, e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onAction(type, item._id, 'accept')}
              disabled={actingId === item._id}
              className="flex-1 bg-(--color-primary) text-white text-sm font-medium py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={() => onAction(type, item._id, 'reject')}
              disabled={actingId === item._id}
              className="flex-1 bg-white text-(--color-secondary) border border-(--color-secondary)/40 text-sm font-medium py-2 rounded-lg hover:bg-(--color-secondary)/10 transition disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageDrafts, setMessageDrafts] = useState({});
  const [actingId, setActingId] = useState(null);
  const [toast, setToast] = useState('');
  const [donateFilterStatus, setDonateFilterStatus] = useState('all');
  const [needFilterStatus, setNeedFilterStatus] = useState('all');
  const [donateSearch, setDonateSearch] = useState('');
  const [needSearch, setNeedSearch] = useState('');

  const fetchAll = async () => {
    try {
      const [donateRes, needRes, statsRes] = await Promise.all([
        api.get('/admin/donate-requests'),
        api.get('/admin/need-requests'),
        api.get('/admin/dashboard-stats')
      ]);
      setDonations(donateRes.data);
      setNeeds(needRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setToast('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const handleDraftChange = (id, value) => {
    setMessageDrafts({ ...messageDrafts, [id]: value });
  };

  const handleAction = async (type, id, action) => {
    setActingId(id);
    setToast('');
    try {
      const message = messageDrafts[id] || '';
      await api.post(`/admin/${type}/${id}/${action}`, { message });
      setToast(`Request ${action}ed successfully.`);
      fetchAll();
    } catch (err) {
      console.error(err);
      setToast(err.response?.data?.message || 'Action failed.');
    } finally {
      setActingId(null);
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchesStatus = donateFilterStatus === 'all' || d.status === donateFilterStatus;
    const search = donateSearch.toLowerCase();
    const matchesSearch =
      d.foodType.toLowerCase().includes(search) ||
      d.address.toLowerCase().includes(search) ||
      (d.donorId?.name || '').toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  const filteredNeeds = needs.filter((n) => {
    const matchesStatus = needFilterStatus === 'all' || n.status === needFilterStatus;
    const search = needSearch.toLowerCase();
    const matchesSearch =
      n.foodNeeded.toLowerCase().includes(search) ||
      n.address.toLowerCase().includes(search) ||
      (n.receiverId?.name || '').toLowerCase().includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Admin dashboard</h1>
        <p className="text-(--color-neutral) mb-8">Review and respond to donations and food requests.</p>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Pending donations" value={stats.pendingDonations ?? 0} />
            <StatCard label="Pending requests" value={stats.pendingNeeds ?? 0} />
            <StatCard label="Total accepted" value={(stats.acceptedDonations ?? 0) + (stats.acceptedNeeds ?? 0)} />
          </div>
        )}

        {toast && (
          <div className="bg-(--color-primary)/10 text-(--color-primary) text-sm rounded-lg px-4 py-2 mb-6">
            {toast}
          </div>
        )}

        {loading ? (
          <p className="text-(--color-neutral) text-sm">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-display text-lg font-semibold mb-3">Donation requests</h2>
              <div className="flex gap-2 mb-4">
                <input
                  placeholder="Search by food, address, donor..."
                  value={donateSearch}
                  onChange={(e) => setDonateSearch(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                />
                <select
                  value={donateFilterStatus}
                  onChange={(e) => setDonateFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {filteredDonations.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-(--color-neutral)/15 text-center text-(--color-neutral) text-sm">
                  {donations.length === 0 ? 'No donations yet.' : 'No donations match your search.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDonations.map((d) => (
                    <RequestCard
                      key={d._id}
                      item={d}
                      type="donate"
                      title={d.foodType}
                      subtitle={`${d.quantity} · ${d.address} · Donor: ${d.donorId?.name} (${d.donorId?.phone})`}
                      messageDrafts={messageDrafts}
                      onDraftChange={handleDraftChange}
                      onAction={handleAction}
                      actingId={actingId}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold mb-3">Food requests</h2>
              <div className="flex gap-2 mb-4">
                <input
                  placeholder="Search by food, address, receiver..."
                  value={needSearch}
                  onChange={(e) => setNeedSearch(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                />
                <select
                  value={needFilterStatus}
                  onChange={(e) => setNeedFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm rounded-lg border border-(--color-neutral)/30 focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {filteredNeeds.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-(--color-neutral)/15 text-center text-(--color-neutral) text-sm">
                  {needs.length === 0 ? 'No requests yet.' : 'No requests match your search.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNeeds.map((n) => (
                    <RequestCard
                      key={n._id}
                      item={n}
                      type="need"
                      title={n.foodNeeded}
                     subtitle={`${n.quantityNeeded} · ${n.address} · Receiver: ${n.receiverId?.name} (${n.receiverId?.phone}) · ${n.urgency} urgency`}
                      messageDrafts={messageDrafts}
                      onDraftChange={handleDraftChange}
                      onAction={handleAction}
                      actingId={actingId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}