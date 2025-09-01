import AppLayout from '../components/AppLayout';
import Card from '../components/Card';

export default function AdminDashboard() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold">Overview</h3>
          <p className="text-white/70 mt-2">Stats & system health.</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Users</h3>
          <p className="text-white/70 mt-2">Manage users & roles.</p>
        </Card>
        <Card>
          <h3 className="font-semibold">Providers</h3>
          <p className="text-white/70 mt-2">
            Configure NECO/NIMC integrations.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
