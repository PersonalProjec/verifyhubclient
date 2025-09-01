import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';

export default function Users() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0, limit: 20, page: 1 });

  const fetchUsers = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', {
        params: { page: p, limit: 20, search: q || undefined },
      });
      setData(data);
      setPage(data.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search); /* eslint-disable-next-line */
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const next = () => {
    if (data.items.length < data.limit) return;
    fetchUsers(page + 1, search);
  };
  const prev = () => {
    if (page <= 1) return;
    fetchUsers(page - 1, search);
  };

  return (
    <AppLayout variant="admin">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <Card>
        <form className="flex gap-2 mb-4" onSubmit={onSearch}>
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="self-end" disabled={loading}>
            {loading ? '...' : 'Search'}
          </Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-white/70">
              <tr>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Company</th>
                <th className="text-left py-2">Created</th>
                <th className="text-left py-2">Last Login</th>
                <th className="text-left py-2">Verifications</th>
                <th className="text-left py-2">Payments</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="py-2">
                    <div className="font-medium">
                      {u.firstName || u.lastName
                        ? `${u.firstName} ${u.lastName}`.trim()
                        : u.email}
                    </div>
                    <div className="text-white/60">{u.email}</div>
                  </td>
                  <td className="py-2">{u.company || '-'}</td>
                  <td className="py-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2">
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleString()
                      : '—'}
                  </td>
                  <td className="py-2">{u.verificationsCount}</td>
                  <td className="py-2">{u.paymentsCount}</td>
                  <td className="py-2 text-right">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && data.items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-white/60">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-white/60">Page {data.page}</div>
          <div className="flex gap-2">
            <Button
              onClick={prev}
              className="bg-white/10 hover:bg-white/15"
              disabled={loading || page <= 1}
            >
              Prev
            </Button>
            <Button
              onClick={next}
              className="bg-white/10 hover:bg-white/15"
              disabled={loading || data.items.length < data.limit}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
