import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';

const API_BASE = import.meta.env.VITE_API_URL ?? '';
const DISABLE_AUTH = import.meta.env.VITE_DISABLE_AUTH === 'true';

export default function Login() {
  const navigate = useNavigate();
  const { setAccessToken } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (DISABLE_AUTH) {
      // GitHub Pages / demo mode: no backend.
      setAccessToken('dev');
      navigate('/map', { replace: true });
      setLoading(false);
      return;
    }

    if (!API_BASE && !import.meta.env.DEV) {
      setError('Backend not configured. Set VITE_API_URL or set VITE_DISABLE_AUTH=true for demo mode.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        return;
      }
      setAccessToken(data.token);
      navigate('/map', { replace: true });
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-header">
        <div className="auth-logo-wrap">
          <img src="images/logo/logo.png" alt="Tour Cheetah" className="auth-logo" />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to access your tour</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p role="alert" className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account?{' '}
        <Link to="/register" className="auth-link">Sign up</Link>
      </p>
    </div>
  );
}
