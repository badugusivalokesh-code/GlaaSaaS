import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Copy, Check } from 'lucide-react';

interface LocationState {
  from?: { pathname: string };
}

export default function Login() {
  const { status, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState<'email' | 'password' | null>(null);

  // Already signed in — no reason to show the login form.
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  function validate(): boolean {
    const next: typeof fieldErrors = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address';
    }
    if (!password) {
      next.password = 'Password is required';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/dashboard', { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to log in right now');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyCredential(type: 'email' | 'password', value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedCredential(type);
    window.setTimeout(() => setCopiedCredential(null), 1600);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Card padding="lg">
        <h1 className="text-center text-display-md text-fg-primary">Log in to PulseBoard</h1>
        <p className="mt-1 text-center text-body-sm text-fg-secondary">Welcome back — enter your details below.</p>

        <div className="mt-5 rounded-secondary border border-glass-secondary bg-background-tertiary p-3">
          <p className="text-body-sm font-medium text-fg-primary">Demo account</p>
          <div className="mt-2 flex flex-col gap-2">
            {[
              ['Email', 'demo@example.com', 'email'],
              ['Password', '12345678', 'password'],
            ].map(([label, value, type]) => (
              <div key={type} className="flex items-center justify-between gap-3 rounded-quaternary bg-background-quaternary px-3 py-2">
                <div className="min-w-0">
                  <p className="text-caption text-fg-secondary">{label}</p>
                  <p className="truncate text-body-sm text-fg-primary">{value}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Copy demo ${label.toLowerCase()}`}
                  className="shrink-0 rounded-quaternary p-1.5 text-fg-secondary transition-colors hover:bg-background-interactive-secondary-hover hover:text-fg-primary focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  onClick={() => void copyCredential(type as 'email' | 'password', value)}
                >
                  {copiedCredential === type ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            disabled={isSubmitting}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            disabled={isSubmitting}
          />

          {formError && (
            <p role="alert" className="text-body-sm text-system-danger">
              {formError}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-body-sm text-fg-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-text hover:underline">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}
