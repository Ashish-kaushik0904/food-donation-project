export default function StatusBadge({ status }) {
  const config = {
    pending: { color: '#E8973A', bg: '#E8973A1A', label: 'Pending' },
    accepted: { color: '#1F6B5C', bg: '#1F6B5C1A', label: 'Accepted' },
    rejected: { color: '#C1440E', bg: '#C1440E1A', label: 'Rejected' }
  };
  const c = config[status] || config.pending;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }}></span>
      {c.label}
    </span>
  );
}