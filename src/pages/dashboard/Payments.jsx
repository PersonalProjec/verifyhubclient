// pages/dashboard/Payments.jsx
import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../lib/api';
import { notify } from '../../lib/toast';

export default function Payments() {
  const [credits, setCredits] = useState(0);
  const [price, setPrice] = useState({ amount: 100000, currency: 'NGN', credits: 1 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [{ data: me }, { data: pr }] = await Promise.all([
      api.get('/billing/me'),
      api.get('/billing/price')
    ]);
    setCredits(me.credits); setPrice(pr);
  };

  useEffect(() => { load(); }, []);

  const buy = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/billing/paystack/init', {
        amountKobo: price.amount, credits: price.credits
      });
      window.location.href = data.authorization_url;
    } catch (e) {
      notify.error(e.response?.data?.error || 'Failed to start payment');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout variant="user">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <Card>
        <div className="text-white/80">Credits: <b>{credits}</b></div>
        <div className="text-white/60 mt-2">
          Buy {price.credits} credit for {(price.amount/100).toLocaleString()} {price.currency}
        </div>
        <Button className="mt-4" onClick={buy} disabled={loading}>
          {loading ? 'Redirecting…' : 'Buy credit'}
        </Button>
      </Card>
    </AppLayout>
  );
}
