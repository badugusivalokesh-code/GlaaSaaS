import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="text-body-md font-semibold text-fg-primary">PulseBoard</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-display-lg text-fg-primary">See your projects clearly.</h1>
        <p className="mt-4 max-w-md text-body-lg text-fg-secondary">
          PulseBoard turns your projects into a real-time dashboard — status, activity, and deadlines, all in one
          place.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link to="/register">
            <Button size="md">Create a free account</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="md">
              Log in
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
