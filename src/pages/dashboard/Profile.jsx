import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    company: '',
    country: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/user/me');
        setForm({
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          address: data.address || '',
          phone: data.phone || '',
          company: data.company || '',
          country: data.country || '',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patch = { ...form };
      delete patch.email; // read-only
      const { data } = await api.patch('/user/me', patch);
      setForm((f) => ({ ...f, ...data })); // reflect saved values
      notify.success('Profile updated');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout variant="user">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Card>
        {loading ? (
          <div className="opacity-70">Loading…</div>
        ) : (
          <form className="grid md:grid-cols-2 gap-4" onSubmit={save}>
            <Input
              label="Email (read only)"
              type="email"
              value={form.email}
              readOnly
            />
            <div />

            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            <Input
              label="Company"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
            />
            <label className="md:col-span-2 block space-y-1">
              <span className="text-sm text-white/80">Address</span>
              <textarea
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={3}
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
              />
            </label>

            <div className="md:col-span-2 flex justify-end">
              <Button disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </AppLayout>
  );
}
