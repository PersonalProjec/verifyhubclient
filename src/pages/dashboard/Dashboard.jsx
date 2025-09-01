import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';

export default function Dashboard() {
  return (
    <AppLayout variant="user">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold">Quick Verify</h3>
          <p className="text-white/70 mt-2">
            Kick off a WAEC/NECO/NPC verification.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold">Recent Results</h3>
          <p className="text-white/70 mt-2">
            Your latest verification outcomes.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold">Integrations</h3>
          <p className="text-white/70 mt-2">Connect institutional APIs.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
