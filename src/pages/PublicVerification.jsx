import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card';
// import Button from '../components/Button';
import { api } from '../lib/api';

export default function PublicVerification() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/verify/public/code/${code}`);
        setData(data);
      } catch (e) {
        console.error(e);
        setErr('Verification not found');
      }
    })();
  }, [code]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <Link to="/" className="font-semibold">
          Verify<span className="text-brand-500">Hub</span>
        </Link>
      </div>
      <Card>
        {!data && !err ? (
          'Loading…'
        ) : err ? (
          <div>{err}</div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-white/60">Type</div>
            <div className="text-xl font-semibold">{data.type}</div>
            <div className="text-sm text-white/60">Status</div>
            <div className="text-sm">
              <span
                className={`px-2 py-0.5 rounded ${
                  data.status === 'verified'
                    ? 'bg-green-500/20'
                    : data.status === 'failed'
                    ? 'bg-red-500/20'
                    : 'bg-white/10'
                }`}
              >
                {data.status}
              </span>
            </div>
            <div className="text-sm text-white/60">Created</div>
            <div className="text-sm">
              {new Date(data.createdAt).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">SHA-256</div>
            <div className="text-xs break-all">{data.fileHash || '—'}</div>
            {data.qrText && (
              <>
                <div className="text-sm text-white/60">QR Content</div>
                <div className="text-sm break-all">{data.qrText}</div>
              </>
            )}
            {data.evidenceUrl && (
              <div className="pt-2">
                <a
                  className="text-brand-400 underline"
                  href={data.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View evidence
                </a>
              </div>
            )}
            <div className="pt-2">
              <a
                className="text-brand-400 underline"
                href={`${
                  import.meta.env.VITE_API_URL
                }/verify/public/receipt/${code}.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                Download Receipt (PDF)
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
