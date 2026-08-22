import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', identifier: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      if (isLogin) await login(form.identifier, form.password);
      else await register({ name: form.name, username: form.username, email: form.email, password: form.password });
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong.'); }
    finally { setBusy(false); }
  }

  const field = (name, label, type = 'text', placeholder = '') => <label>{label}<input type={type} value={form[name]} placeholder={placeholder} onChange={(e) => setForm({ ...form, [name]: e.target.value })} required /></label>;

  return (
    <div className="auth-layout">
      <section className="auth-visual"><div><div className="logo-mark">S</div><h1>SocialSphere</h1><p>Share moments. Follow people. Build your circle.</p></div></section>
      <section className="auth-panel"><form className="auth-card" onSubmit={submit}><h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2><p>{isLogin ? 'Sign in to continue to your feed.' : 'Join the community in less than a minute.'}</p>{!isLogin && field('name', 'Full name')}{!isLogin && field('username', 'Username', 'text', 'e.g. ali.dev')}{!isLogin && field('email', 'Email', 'email')}{isLogin && field('identifier', 'Email or username')}{field('password', 'Password', 'password')} {error && <div className="form-error">{error}</div>}<button className="primary-btn wide" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}</button><small>{isLogin ? "Don't have an account?" : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register' : 'Sign in'}</Link></small></form></section>
    </div>
  );
}
