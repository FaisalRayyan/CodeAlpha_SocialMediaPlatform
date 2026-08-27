import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      if (isLogin) await login(form.identifier, form.password);
      else await register({ name: form.name, username: form.username, email: form.email, password: form.password });
      navigate('/');
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <label>{label}<input type={type} value={form[name]} placeholder={placeholder} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required autoComplete={name === 'password' ? (isLogin ? 'current-password' : 'new-password') : undefined} /></label>
  );

  return (
    <div className="auth-layout">
      <section className="auth-visual">
        <div className="auth-visual-copy"><div className="logo-mark">S</div><h1>SocialSphere</h1><p>Share moments, follow people you care about, and keep every conversation in one clean space.</p><div className="auth-points"><span>Real profiles</span><span>Posts & comments</span><span>Likes & follows</span></div></div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={submit}>
          <div className="mobile-brand"><span>S</span> SocialSphere</div>
          <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p>{isLogin ? 'Sign in to continue to your feed.' : 'Join the community in less than a minute.'}</p>
          {!isLogin && field('name', 'Full name', 'text', 'Your full name')}
          {!isLogin && field('username', 'Username', 'text', 'e.g. faisal.dev')}
          {!isLogin && field('email', 'Email', 'email', 'you@example.com')}
          {isLogin && field('identifier', 'Email or username', 'text', 'you@example.com or username')}
          <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={form.password} minLength={8} placeholder={isLogin ? 'Your password' : 'At least 8 characters'} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete={isLogin ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn wide auth-submit" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}</button>
          <small>{isLogin ? "Don't have an account?" : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register' : 'Sign in'}</Link></small>
        </form>
      </section>
    </div>
  );
}
