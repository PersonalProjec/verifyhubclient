import { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, setToken } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [tab, setTab] = useState('password'); // 'password' | 'code'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const nav = useNavigate();

  const loginPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    }
  };

  const sendCode = async () => {
    await api.post('/auth/request-login-code', { email });
    alert('Code sent (check email)');
  };

  const loginCode = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login-with-code', { email, code });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
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
            <Button className="w-full">Login</Button>
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
              <Button type="button" onClick={sendCode}>
                Send
              </Button>
            </div>
            <Button className="w-full">Login with Code</Button>
          </form>
        )}

        <p className="text-sm text-white/60 mt-4">
          No account?{' '}
          <Link className="text-brand-400" to="/register">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
