import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { api } from '../lib/api';
import { notify } from '../lib/toast';

export default function PublicAttest() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const preDecision = params.get('decision'); // optional quick approve/reject link
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token && preDecision && ['verified', 'failed'].includes(preDecision)) {
      submit(preDecision);
    }
    // eslint-disable-next-line
  }, [token, preDecision]);

  const submit = async (decision) => {
    setSubmitting(true);
    try {
      // token encodes verificationId; backend validates both
      // we don't know id here, but backend parses it from token & compares
      // call to a dummy id path is unnecessary; we'll add endpoint variant:
      // POST /api/verify/attest with { token, decision }
      // If you prefer that signature, add that route. For now, we need the id.
      // To avoid roundtrip, add a special route:
      const { data } = await api.post('/verify/attest', { token, decision }); // <- see server route note below
      notify.success(`Updated: ${data.status}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <h2 className="text-xl font-semibold">Attestation</h2>
        <p className="text-sm text-white/70 mt-1">
          Please confirm whether the submitted document is legitimate.
        </p>

        {!token ? (
          <div className="mt-4 text-red-300">Missing token</div>
        ) : (
          <div className="mt-6 flex gap-2">
            <Button disabled={submitting} onClick={() => submit('verified')}>
              Approve
            </Button>
            <Button
              disabled={submitting}
              onClick={() => submit('failed')}
              className="bg-red-500/20 hover:bg-red-500/30"
            >
              Reject
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
