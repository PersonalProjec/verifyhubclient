import { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../lib/api';
import { notify } from '../lib/toast';
import { useNavigate } from 'react-router-dom';

const COOLDOWN_SECONDS = 60;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const canSend = useMemo(
    () => !!email && !sending && cooldown === 0,
    [email, sending, cooldown]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setCooldown(COOLDOWN_SECONDS);
      notify.info('Code sent… check your email.');
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (e) {
      if (e?.response?.status === 429) setCooldown(COOLDOWN_SECONDS);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <Card>
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="w-full" disabled={!canSend}>
            {sending
              ? 'Sending…'
              : cooldown > 0
              ? `Send (${cooldown}s)`
              : 'Send Reset Code'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
