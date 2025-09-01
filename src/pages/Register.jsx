import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { api } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      nav(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <Card>
        <h2 className="text-2xl font-bold">Create your account</h2>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
          <Button disabled={loading} className="w-full">
            {loading ? 'Please wait…' : 'Register'}
          </Button>
        </form>
        <p className="text-sm text-white/60 mt-4">
          Already have an account?{' '}
          <Link className="text-brand-400" to="/login">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
