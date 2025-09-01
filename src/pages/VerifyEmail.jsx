import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../lib/api';
import { notify } from '../lib/toast';

const COOLDOWN_SECONDS = 60;

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const nav = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const canResend = useMemo(
    () => cooldown === 0 && !resending,
    [cooldown, resending]
  );

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, code });
      notify.success('Email verified! Please login.');
      nav('/login');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await api.post('/auth/resend-verify-code', { email });
      setCooldown(COOLDOWN_SECONDS);
      notify.info('Code sent… check your inbox.');
    } catch (e) {
      // interceptor shows error; reflect cooldown if 429
      if (e?.response?.status === 429) setCooldown(COOLDOWN_SECONDS);
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="max-w-md mx-auto pt-16 px-4">
        <Card>
          <h2 className="text-2xl font-bold">Verify your email</h2>
          <p className="text-white/70 mt-2">
            Missing email address. Please{' '}
            <Link className="text-brand-400" to="/register">
              register again
            </Link>
            .
          </p>
        </Card>
      </div>
    );
  }

  const verifyDisabled = loading || !code;

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <Card>
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <p className="text-white/60 text-sm mt-1">
          We sent a 6-digit code to <b>{email}</b>.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <Button className="w-[48%]" disabled={verifyDisabled}>
              {loading ? 'Verifying…' : 'Verify'}
            </Button>

            <Button
              type="button"
              className="w-[48%] bg-white/10 hover:bg-white/15"
              disabled={!canResend}
              onClick={resend}
            >
              {resending
                ? 'Sending…'
                : cooldown > 0
                ? `Resend (${cooldown}s)`
                : 'Resend code'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-white/50 mt-3">
          Didn’t get the email? Check spam/promotions, or wait{' '}
          {cooldown > 0 ? `${cooldown}s` : 'a moment'} and resend.
        </p>
      </Card>
    </div>
  );
}
