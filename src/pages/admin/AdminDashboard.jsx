import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import { api } from '../../lib/api';

function Stat({ label, value, sub }) {
  return (
    <Card>
      <div className="text-white/60 text-sm">{label}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
      {sub ? <div className="mt-1 text-white/60 text-sm">{sub}</div> : null}
    </Card>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/overview');
        setStats(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const revenueNGN = stats
    ? (stats.payments.revenueKobo / 100).toLocaleString()
    : '0';

  return (
    <AppLayout variant="admin">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {loading ? (
        <Card>Loading…</Card>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Stat
              label="Users (Total)"
              value={stats.users.total}
              sub={`Email Verified: ${stats.users.emailVerified}`}
            />
            <Stat
              label="Verifications (Total)"
              value={stats.verifications.total}
              sub={`✅ ${stats.verifications.verified} • ❌ ${stats.verifications.failed} • ⏳ ${stats.verifications.pending}`}
            />
            <Stat
              label="Payments"
              value={stats.payments.total}
              sub={`Revenue: ₦${revenueNGN}`}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Stat
              label="Providers"
              value={stats.providers.total}
              sub="Coming soon"
            />
            {/* Room for more cards: System health, S3 storage, OCR queue, etc. */}
          </div>
        </>
      )}
    </AppLayout>
  );
}
