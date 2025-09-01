import { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../lib/api';
import { notify } from '../lib/toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirm: '',
  });
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      notify.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/reset-password', {
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });
      notify.success('Password reset successful. Please log in.');
      nav('/login');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <Card>
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Reset Code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
          />
          <Input
            label="New Password"
            type="password"
            value={form.newPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, newPassword: e.target.value }))
            }
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={form.confirm}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirm: e.target.value }))
            }
          />
          <Button
            className="w-full"
            disabled={
              saving ||
              !form.email ||
              !form.code ||
              !form.newPassword ||
              !form.confirm
            }
          >
            {saving ? 'Resetting…' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
