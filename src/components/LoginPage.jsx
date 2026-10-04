import { useState } from 'react';
import { signUp, logIn } from '../lib/authApi';
import logo from '../assets/roq-logo.png';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await logIn(username, password);
      else await signUp(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img className="login-page__logo" src={logo} alt="Right On Queue" />
        <h1 className="text-main-heading">Right On Queue</h1>
        {mode === 'signup' && <h2 className="login-page__subheading text-heading-1">New Account</h2>}
        <form onSubmit={submit}>
          <label className="text-small">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex. PanExpert"
              required
            />
          </label>
          <label className="text-small">
            Password
            <div className="login-page__password">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="login-page__password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          {error && <p className="login-page__error text-small">{error}</p>}
          <button type="submit" className="login-page__submit" disabled={busy}>
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
          {busy && (
            <p className="login-page__status text-small">
              {mode === 'login' ? 'Dusting off the Cook Book…' : 'A blank Cook Book is being issued…'}
            </p>
          )}
        </form>
        <button
          type="button"
          className="login-page__toggle text-small"
          onClick={() => {
            setError('');
            setMode(mode === 'login' ? 'signup' : 'login');
          }}
        >
          {mode === 'login' ? "Don't have an account? Sign up here!" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
}
