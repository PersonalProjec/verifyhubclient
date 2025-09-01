import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';

export default function Verify() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('Generic');
  const [issuerEmail, setIssuerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      notify.error('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);
      if (issuerEmail) fd.append('issuerEmail', issuerEmail);
      if (notes) fd.append('notes', notes);

      const { data } = await api.post('/verify/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      notify.success('Uploaded. Verification record created.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout variant="user">
      <h1 className="text-2xl font-bold mb-4">Verify a Document</h1>
      <Card>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={onSubmit}>
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
              value={type}
              onChange={(e) => setType(e.target.value)}
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

      {result && (
        <Card className="mt-6 space-y-2">
          <div className="font-semibold">Verification created</div>
          <div className="text-white/70 text-sm">Status: {result.status}</div>
          <div className="text-white/70 text-sm">
            SHA-256 hash: <span className="break-all">{result.hash}</span>
          </div>
          {result.qrText && (
            <div className="text-white/70 text-sm">QR: {result.qrText}</div>
          )}
          <div className="text-white/70 text-sm">
            Public link:{' '}
            <a
              className="text-brand-400 underline"
              href={result.publicUrl}
              target="_blank"
              rel="noreferrer"
            >
              {result.publicUrl}
            </a>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button
              type="button"
              onClick={() => navigator.clipboard.writeText(result.publicUrl)}
            >
              Copy Link
            </Button>
            <a
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15"
              href={`${import.meta.env.VITE_API_URL}/verify/public/receipt/${
                result.code
              }.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              Download Receipt
            </a>
          </div>
        </Card>
      )}
    </AppLayout>
  );
}
