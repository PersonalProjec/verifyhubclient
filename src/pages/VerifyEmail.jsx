import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../lib/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, code });
      nav('/login');
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    } finally {
      setLoading(false);
    }
  };

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
          <Button className="w-full" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
