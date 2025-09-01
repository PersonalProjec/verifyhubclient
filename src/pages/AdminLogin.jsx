import { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { api, setToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/login', { username, password });
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
      nav('/admin');
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <Card>
        <h2 className="text-2xl font-bold">Admin Login</h2>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full">Login</Button>
        </form>
      </Card>
    </div>
  );
}
