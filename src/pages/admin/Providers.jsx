import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';

function Row({ p, onEdit }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{p.label}</div>
          <div className="text-xs text-white/60">key: {p.key}</div>
        </div>
        <div className="text-right text-sm">
          <div>
            Enabled: <b>{p.enabled ? 'Yes' : 'No'}</b>
          </div>
          <div>
            Sandbox: <b>{p.sandbox ? 'Yes' : 'No'}</b>
          </div>
          <div>
            Cost: <b>{p.cost}</b>
          </div>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <Button
          className="bg-white/10 hover:bg-white/15"
          onClick={() => onEdit(p)}
        >
          Edit
        </Button>
        <Button
          className="bg-white/10 hover:bg-white/15"
          onClick={async () => {
            try {
              const { data } = await api.post(`/admin/providers/${p.key}/ping`);
              if (data.ok) notify.success('Ping ok');
              else notify.error(data.error || 'Ping failed');
            } catch (e) {
              notify.error(e.response?.data?.error || 'Ping failed');
            }
          }}
        >
          Ping
        </Button>
      </div>
    </div>
  );
}

export default function Providers() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    enabled: false,
    sandbox: true,
    cost: 5,
    baseUrl: '',
    apiKey: '',
  });

  const load = async () => {
    const { data } = await api.get('/admin/providers');
    setItems(data.items || []);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = async (p) => {
    const { data } = await api.get(`/admin/providers/${p.key}`);
    setEditing(data);
    setForm({
      enabled: !!data.enabled,
      sandbox: !!data.sandbox,
      cost: Number(data.cost || 5),
      baseUrl: data.baseUrl || '',
      apiKey: '',
    });
  };

  const save = async () => {
    try {
      const payload = {
        enabled: form.enabled,
        sandbox: form.sandbox,
        cost: Number(form.cost || 5),
        baseUrl: form.baseUrl.trim(),
      };
      if (form.apiKey) payload.apiKey = form.apiKey;

      await api.patch(`/admin/providers/${editing.key}`, payload);
      notify.success('Provider updated');
      setEditing(null);
      setForm({
        enabled: false,
        sandbox: true,
        cost: 5,
        baseUrl: '',
        apiKey: '',
      });
      load();
    } catch (e) {
      notify.error(e.response?.data?.error || 'Update failed');
    }
  };

  return (
    <AppLayout variant="admin">
      <h1 className="text-2xl font-bold mb-4">Providers</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((p) => (
          <Row key={p.key} p={p} onEdit={openEdit} />
        ))}
        {items.length === 0 && <Card>No providers yet</Card>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-ink p-6 border border-white/10">
            <div className="text-xl font-semibold mb-2">{editing.label}</div>
            <div className="text-white/60 text-sm mb-4">key: {editing.key}</div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, enabled: e.target.checked }))
                  }
                />
                <span>Enabled</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.sandbox}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sandbox: e.target.checked }))
                  }
                />
                <span>Sandbox</span>
              </label>

              <Input
                label="Cost (credits)"
                type="number"
                value={form.cost}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cost: Number(e.target.value || 0) }))
                }
              />
              <Input
                label="Base URL"
                value={form.baseUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, baseUrl: e.target.value }))
                }
              />
              <Input
                label="API Key (leave blank to keep)"
                value={form.apiKey}
                onChange={(e) =>
                  setForm((f) => ({ ...f, apiKey: e.target.value }))
                }
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                className="bg-white/10 hover:bg-white/15"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
