import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';

export default function VerifyAPI() {
  const [catalog, setCatalog] = useState([]);
  const [prov, setProv] = useState('');
  const [fields, setFields] = useState({});
  const [credits, setCredits] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: cat }, { data: me }] = await Promise.all([
        api.get('/providers/catalog'),
        api.get('/billing/me'),
      ]);
      setCatalog(cat.providers || []);
      setProv(cat.providers?.[0]?.key || '');
      setCredits(me.credits || 0);
    })();
  }, []);

  const schema = catalog.find((c) => c.key === prov);

  const onChangeField = (name, val) => {
    setFields((f) => ({ ...f, [name]: val }));
  };

  const cost = schema?.cost || 5;

  const run = async () => {
    if (!prov) return notify.error('Select a provider');
    // quick client-side check
    if (credits < cost) {
      notify.error(
        `You need ${cost} credits (you have ${credits}). Please purchase first.`
      );
      return;
    }
    setRunning(true);
    try {
      const idem = crypto.randomUUID
        ? crypto.randomUUID()
        : String(Math.random());
      const { data } = await api.post(
        '/providers/run',
        { provider: prov, fields },
        {
          headers: { 'Idempotency-Key': idem },
        }
      );
      setResult(data);
      setCredits((c) => Math.max(0, c - (data.cost || cost)));
      notify.success(`Done: ${data.status}. (-${data.cost || cost} credits)`);
    } catch (e) {
      if (e.response?.status === 402) {
        const need = e.response?.data?.required ?? cost;
        const have = e.response?.data?.credits ?? 0;
        notify.error(`Payment required: ${need} credits (you have ${have}).`);
        return;
      }
      notify.error(e.response?.data?.error || 'Verification failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppLayout variant="user">
      <h1 className="text-2xl font-bold mb-4">API Verification</h1>
      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <label className="block flex-1">
            <span className="text-sm text-white/80">Provider</span>
            <select
              value={prov}
              onChange={(e) => {
                setProv(e.target.value);
                setFields({});
                setResult(null);
              }}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
            >
              {catalog.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label} (Cost: {p.cost})
                </option>
              ))}
            </select>
          </label>

          <div className="text-white/80">
            Credits: <b>{credits}</b>
            {schema && (
              <div className="text-white/60 text-sm">
                This check costs {schema.cost} credits
              </div>
            )}
          </div>
        </div>

        {schema && (
          <div className="grid md:grid-cols-2 gap-4">
            {schema.fields.map((f) => (
              <Input
                key={f.name}
                label={`${f.label}${f.required ? ' *' : ''}`}
                value={fields[f.name] || ''}
                onChange={(e) => onChangeField(f.name, e.target.value)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={run} disabled={running || !schema}>
            {running ? 'Verifying…' : 'Run Verification'}
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="mt-6">
          <div className="font-semibold">Result: {result.status}</div>
          <pre className="mt-2 text-xs bg-black/30 p-3 rounded-xl overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </AppLayout>
  );
}
