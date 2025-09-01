import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        {/* put the overlay behind & ignore clicks */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none
               bg-[radial-gradient(circle_at_10%_10%,rgba(43,132,255,0.2),transparent_40%),radial-gradient(circle_at_90%_30%,rgba(43,132,255,0.15),transparent_35%)]"
        />

        {/* lift content above just in case */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Universal <span className="text-brand-500">Certificate</span>{' '}
            Verification Hub
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Verify WAEC/NECO tokens, NPC attestations, marriage records, and
            more — from a single, secure portal.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>

            {/* if you meant to scroll to features, keep #features; if you meant login, use <Link to="/login"> */}
            <a
              href="/login"
              className="px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 py-12"
      >
        <Card>
          <h3 className="font-semibold text-lg">One Account</h3>
          <p className="text-white/70 mt-2">
            Unified login for individuals & institutions.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg">Multi-Provider</h3>
          <p className="text-white/70 mt-2">
            API-first where available; guided flows where not.
          </p>
        </Card>
        <Card>
          <h3 className="font-semibold text-lg">Evidence Vault</h3>
          <p className="text-white/70 mt-2">
            Store receipts & signed results securely.
          </p>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-brand-500/20 to-brand-700/20 border border-brand-500/20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold">
            Start verifying in minutes
          </h2>
          <p className="text-white/80 mt-3">
            Create a free account and test with sandbox emails.
          </p>
          <div className="mt-6">
            <Link to="/register">
              <Button className="px-6">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-white/60">
        © {new Date().getFullYear()} VerifyHub. All rights reserved.
      </footer>
    </div>
  );
}
