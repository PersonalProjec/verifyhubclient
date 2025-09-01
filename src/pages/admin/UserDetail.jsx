import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { api } from '../../lib/api';

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-1 border-b border-white/5">
      <div className="text-white/60">{label}</div>
      <div className="col-span-2">{value || '—'}</div>
    </div>
  );
}

export default function UserDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  // Verifications
  const [vPage, setVPage] = useState(1);
  const [vData, setVData] = useState({
    items: [],
    page: 1,
    limit: 20,
    total: 0,
  });
  // Payments
  const [pPage, setPPage] = useState(1);
  const [pData, setPData] = useState({
    items: [],
    page: 1,
    limit: 20,
    total: 0,
  });

  useEffect(() => {
    (async () => {
      const [{ data: prof }, { data: v }, { data: p }] = await Promise.all([
        api.get(`/admin/users/${id}`),
        api.get(`/admin/users/${id}/verifications`, {
          params: { page: 1, limit: 10 },
        }),
        api.get(`/admin/users/${id}/payments`, {
          params: { page: 1, limit: 10 },
        }),
      ]);
      setProfile(prof);
      setVData(v);
      setPData(p);
      setVPage(1);
      setPPage(1);
    })();
  }, [id]);

  const loadMoreVer = async () => {
    const next = vPage + 1;
    const { data } = await api.get(`/admin/users/${id}/verifications`, {
      params: { page: next, limit: 10 },
    });
    setVData((d) => ({ ...data, items: [...d.items, ...data.items] }));
    setVPage(next);
  };
  const loadMorePay = async () => {
    const next = pPage + 1;
    const { data } = await api.get(`/admin/users/${id}/payments`, {
      params: { page: next, limit: 10 },
    });
    setPData((d) => ({ ...data, items: [...d.items, ...data.items] }));
    setPPage(next);
  };

  return (
    <AppLayout variant="admin">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>

      {!profile ? (
        <Card>Loading…</Card>
      ) : (
        <>
          <Card className="mb-6">
            <h2 className="font-semibold mb-3">Profile</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Row label="Email" value={profile.email} />
                <Row label="First Name" value={profile.firstName} />
                <Row label="Last Name" value={profile.lastName} />
                <Row label="Phone" value={profile.phone} />
              </div>
              <div>
                <Row label="Company" value={profile.company} />
                <Row label="Country" value={profile.country} />
                <Row
                  label="Verified Email"
                  value={profile.emailVerified ? 'Yes' : 'No'}
                />
                <Row
                  label="Created"
                  value={new Date(profile.createdAt).toLocaleString()}
                />
              </div>
              <div className="md:col-span-2">
                <Row label="Address" value={profile.address} />
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <h2 className="font-semibold mb-3">Verifications</h2>
              {vData.items.length === 0 ? (
                <div className="text-white/60">No verifications</div>
              ) : (
                <div className="space-y-2">
                  {vData.items.map((v) => (
                    <div
                      key={v._id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {v.type} {v.targetId ? `• ${v.targetId}` : ''}
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded ${
                            v.status === 'verified'
                              ? 'bg-green-500/20'
                              : v.status === 'failed'
                              ? 'bg-red-500/20'
                              : 'bg-white/10'
                          }`}
                        >
                          {v.status}
                        </div>
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        Provider: {v.provider || '—'}
                      </div>
                      <div className="text-white/60 text-xs mt-1">
                        Created: {new Date(v.createdAt).toLocaleString()}
                      </div>
                      {v.evidenceUrl && (
                        <a
                          href={v.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 text-xs"
                        >
                          Evidence
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {vData.items.length < vData.total && (
                <Button
                  className="mt-3 bg-white/10 hover:bg-white/15"
                  onClick={loadMoreVer}
                >
                  Load more
                </Button>
              )}
            </Card>

            <Card>
              <h2 className="font-semibold mb-3">Payments</h2>
              {pData.items.length === 0 ? (
                <div className="text-white/60">No payments</div>
              ) : (
                <div className="space-y-2">
                  {pData.items.map((p) => (
                    <div
                      key={p._id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {(p.amount / 100).toFixed(2)} {p.currency}
                        </div>
                        <div className="text-xs px-2 py-0.5 rounded bg-white/10">
                          {p.status}
                        </div>
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        Provider: {p.provider || '—'} • Ref:{' '}
                        {p.reference || '—'}
                      </div>
                      <div className="text-white/60 text-xs mt-1">
                        Created: {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {pData.items.length < pData.total && (
                <Button
                  className="mt-3 bg-white/10 hover:bg-white/15"
                  onClick={loadMorePay}
                >
                  Load more
                </Button>
              )}
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
}
