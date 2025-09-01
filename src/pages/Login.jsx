import { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, setToken } from '../lib/api';
import { notify } from '../lib/toast';
import { useNavigate, Link } from 'react-router-dom';

const COOLDOWN_SECONDS = 60;

export default function Login() {
  const [tab, setTab] = useState('password'); // 'password' | 'code'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingInCode, setLoggingInCode] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const canSendCode = useMemo(
    () => !!email && cooldown === 0 && !sending,
    [email, cooldown, sending]
  );

  const loginPassword = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      notify.success('Logged in successfully!');
      nav('/dashboard');
    } finally {
      setLoggingIn(false);
    }
  };

  const sendCode = async () => {
    if (!canSendCode) return;
    setSending(true);
    try {
      await api.post('/auth/request-login-code', { email });
      setCooldown(COOLDOWN_SECONDS);
      notify.info('Code sent… check your email.');
    } catch (e) {
      if (e?.response?.status === 429) setCooldown(COOLDOWN_SECONDS);
    } finally {
      setSending(false);
    }
  };

  const loginCode = async (e) => {
    e.preventDefault();
    setLoggingInCode(true);
    try {
      const { data } = await api.post('/auth/login-with-code', { email, code });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      notify.success('Logged in successfully!');
      nav('/dashboard');
    } finally {
      setLoggingInCode(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <Card>
        <h2 className="text-2xl font-bold">Login</h2>

        <div className="mt-4 flex gap-2">
          <button
            className={`px-3 py-2 rounded-xl ${
              tab === 'password' ? 'bg-brand-500/20' : 'bg-white/5'
            }`}
            onClick={() => setTab('password')}
          >
            Password
          </button>
          <button
            className={`px-3 py-2 rounded-xl ${
              tab === 'code' ? 'bg-brand-500/20' : 'bg-white/5'
            }`}
            onClick={() => setTab('code')}
          >
            One-time code
          </button>
        </div>

        {tab === 'password' ? (
          <form className="mt-6 space-y-4" onSubmit={loginPassword}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="w-full"
              disabled={loggingIn || !email || !password}
            >
              {loggingIn ? 'Logging in…' : 'Login'}
            </Button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={loginCode}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex gap-2">
              <Input
                label="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                type="button"
                onClick={sendCode}
                disabled={!canSendCode}
                className="min-w-[110px]"
              >
                {sending
                  ? 'Sending…'
                  : cooldown > 0
                  ? `Send (${cooldown}s)`
                  : 'Send'}
              </Button>
            </div>

            <Button
              className="w-full"
              disabled={loggingInCode || !email || !code}
            >
              {loggingInCode ? 'Logging in…' : 'Login with Code'}
            </Button>
          </form>
        )}

        <p className="text-sm text-white/60 mt-4">
          No account?{' '}
          <Link className="text-brand-400" to="/register">
            Register
          </Link>
        </p>
        <p className="text-sm text-white/60">
          <Link className="text-brand-400" to="/forgot-password">
            Forgot password?
          </Link>
        </p>
      </Card>
    </div>
  );
}
