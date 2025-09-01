import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../lib/api';

export default function Status() {
  const [data, setData] = useState({ items: [], page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchList = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/verify', {
        params: { page, limit: 10 },
      });
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
  }, []);

  return (
    <AppLayout variant="user">
      <h1 className="text-2xl font-bold mb-4">Verification Status</h1>
      <Card>
        {loading ? (
          'Loading…'
        ) : (
          <div className="space-y-3">
            {data.items.map((v) => (
              <div
                key={v._id}
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex justify-between">
                  <div className="font-medium">{v.type}</div>
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
                <div className="text-white/60 text-xs mt-1">
                  Created: {new Date(v.createdAt).toLocaleString()}
                </div>
                <div className="text-white/60 text-xs mt-1 break-all">
                  Hash: {v.result?.fileHash || '—'}
                </div>
              </div>
            ))}
            {data.items.length === 0 && (
              <div className="text-white/60">No verifications yet.</div>
            )}
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
