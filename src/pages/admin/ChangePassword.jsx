import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';

export default function AdminChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      notify.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      notify.success('Password updated');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout variant="admin">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <Card>
        <form className="grid gap-4 max-w-md" onSubmit={submit}>
          <Input
            label="Current Password"
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, currentPassword: e.target.value }))
            }
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
            disabled={
              saving ||
              !form.currentPassword ||
              !form.newPassword ||
              !form.confirm
            }
          >
            {saving ? 'Updating…' : 'Update Password'}
          </Button>
        </form>
      </Card>
    </AppLayout>
  );
}
