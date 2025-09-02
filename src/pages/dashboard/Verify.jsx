import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const navigate = useNavigate();

  // global
  const [credits, setCredits] = useState(0);
  const [active, setActive] = useState('document'); // 'document' | 'api'

  // Document tab state
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('Generic');
  const [issuerEmail, setIssuerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [docResult, setDocResult] = useState(null);

  // API tab state
  const [catalog, setCatalog] = useState([]);
  const [prov, setProv] = useState('');
  const [fields, setFields] = useState({});
  const [running, setRunning] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const schema = useMemo(
    () => catalog.find((c) => c.key === prov),
    [catalog, prov]
  );
  const apiCost = schema?.cost ?? 5;
  const docCost = 5; // TODO: make dynamic per docType if required

  useEffect(() => {
    (async () => {
      try {
        // load credits + provider catalog in parallel
        const [{ data: me }, { data: cat }] = await Promise.all([
          api.get('/billing/me'),
          api.get('/providers/catalog'),
        ]);
        setCredits(Number(me?.credits || 0));
        const providers = cat?.providers || [];
        setCatalog(providers);
        if (providers.length && !prov) setProv(providers[0].key);
      } catch {
        // non-fatal, the page still renders; backend will enforce credits
      }
    })();
  }, []);

  // ---------------------------
  // Document submit
  // ---------------------------
  const submitDocument = async (e) => {
    e.preventDefault();
    if (!file) {
      notify.error('Please select a file');
      return;
    }

    // client-side guard
    if (credits < docCost) {
      notify.error(
        `You need ${docCost} credits (you have ${credits}). Please purchase first.`
      );
      navigate('/dashboard/payments');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', docType);
      if (issuerEmail) fd.append('issuerEmail', issuerEmail);
      if (notes) fd.append('notes', notes);

      const { data } = await api.post('/verify/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setDocResult(data);
      setCredits((c) => Math.max(0, c - (data.cost ?? docCost)));
      notify.success(
        `Verification created. (-${data.cost ?? docCost} credits, left: ${
          data.creditsLeft ?? '—'
        })`
      );
    } catch (e) {
      if (e.response?.status === 402) {
        const need = e.response?.data?.required ?? docCost;
        const have = e.response?.data?.credits ?? 0;
        notify.error(`Payment required: ${need} credits (you have ${have}).`);
        navigate('/dashboard/payments');
        return;
      }
      notify.error(e.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------
  // API run
  // ---------------------------
  const runAPI = async () => {
    if (!prov) return notify.error('Select a provider');

    // client-side guard
    if (credits < apiCost) {
      notify.error(
        `You need ${apiCost} credits (you have ${credits}). Please purchase first.`
      );
      return;
    }

    setRunning(true);
    try {
      const idem =
        window.crypto && 'randomUUID' in window.crypto
          ? window.crypto.randomUUID()
          : String(Math.random());

      const { data } = await api.post(
        '/providers/run',
        { provider: prov, fields },
        { headers: { 'Idempotency-Key': idem } }
      );

      setApiResult(data);
      setCredits((c) => Math.max(0, c - (data.cost ?? apiCost)));
      notify.success(
        `Done: ${data.status}. (-${data.cost ?? apiCost} credits)`
      );
    } catch (e) {
      if (e.response?.status === 402) {
        const need = e.response?.data?.required ?? apiCost;
        const have = e.response?.data?.credits ?? 0;
        notify.error(`Payment required: ${need} credits (you have ${have}).`);
        navigate('/dashboard/payments');
        return;
      }
      notify.error(e.response?.data?.error || 'Verification failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppLayout variant="user">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Verify</h1>
        <div className="text-white/80">
          Credits: <b>{credits}</b>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded-xl border border-white/10 ${
            active === 'document' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
          onClick={() => {
            setActive('document');
          }}
        >
          Document
        </button>
        <button
          className={`px-4 py-2 rounded-xl border border-white/10 ${
            active === 'api' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
          onClick={() => {
            setActive('api');
          }}
        >
          Registry (API)
        </button>
      </div>

      {/* Document tab */}
      {active === 'document' && (
        <>
          <Card>
            <form
              className="grid md:grid-cols-2 gap-4"
              onSubmit={submitDocument}
            >
              <label className="block space-y-1 md:col-span-2">
                <span className="text-sm text-white/80">
                  Document (PDF/JPG/PNG)
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-brand-500/20 file:text-white hover:file:bg-brand-500/30"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm text-white/80">Type</span>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option>Generic</option>
                  <option>WAEC</option>
                  <option>NECO</option>
                  <option>Birth Certificate</option>
                  <option>Marriage Certificate</option>
                  <option>Nursing Certificate</option>
                  <option>Diploma</option>
                </select>
                <div className="text-xs text-white/60 mt-1">
                  Cost: {docCost} credits
                </div>
              </label>

              <Input
                label="Issuer email (optional)"
                type="email"
                value={issuerEmail}
                onChange={(e) => setIssuerEmail(e.target.value)}
              />

              <label className="md:col-span-2 block space-y-1">
                <span className="text-sm text-white/80">Notes (optional)</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </label>

              <div className="md:col-span-2 flex justify-end">
                <Button disabled={uploading || !file}>
                  {uploading ? 'Uploading…' : 'Create Verification'}
                </Button>
              </div>
            </form>
          </Card>

          {docResult && (
            <Card className="mt-6 space-y-2">
              <div className="font-semibold">Verification created</div>
              <div className="text-white/70 text-sm">
                Status: {docResult.status}
              </div>
              <div className="text-white/70 text-sm">
                SHA-256 hash:{' '}
                <span className="break-all">{docResult.hash}</span>
              </div>
              {docResult.qrText && (
                <div className="text-white/70 text-sm">
                  QR: {docResult.qrText}
                </div>
              )}
              <div className="text-white/70 text-sm">
                Public link:{' '}
                <a
                  className="text-brand-400 underline"
                  href={docResult.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {docResult.publicUrl}
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(docResult.publicUrl)
                  }
                >
                  Copy Link
                </Button>
                <a
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15"
                  href={`${
                    import.meta.env.VITE_API_URL
                  }/verify/public/receipt/${docResult.code}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Receipt
                </a>
              </div>
            </Card>
          )}
        </>
      )}

      {/* API tab */}
      {active === 'api' && (
        <>
          <Card className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <label className="block flex-1">
                <span className="text-sm text-white/80">Provider</span>
                <select
                  value={prov}
                  onChange={(e) => {
                    setProv(e.target.value);
                    setFields({});
                    setApiResult(null);
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
                    onChange={(e) =>
                      setFields((s) => ({ ...s, [f.name]: e.target.value }))
                    }
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={runAPI} disabled={running || !schema}>
                {running ? 'Verifying…' : 'Run Verification'}
              </Button>
            </div>
          </Card>

          {apiResult && (
            <Card className="mt-6">
              <div className="font-semibold">Result: {apiResult.status}</div>
              <pre className="mt-2 text-xs bg-black/30 p-3 rounded-xl overflow-auto">
                {JSON.stringify(apiResult, null, 2)}
              </pre>
            </Card>
          )}
        </>
      )}
    </AppLayout>
  );
}
