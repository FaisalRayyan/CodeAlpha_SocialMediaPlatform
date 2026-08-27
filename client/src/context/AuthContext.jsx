import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('socialsphere:unauthorized', handleUnauthorized);

    const token = localStorage.getItem('socialsphere_token');
    if (!token) setLoading(false);
    else {
      api.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }

    return () => window.removeEventListener('socialsphere:unauthorized', handleUnauthorized);
  }, []);

  async function login(identifier, password) {
    const { data } = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('socialsphere_token', data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('socialsphere_token', data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('socialsphere_token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, setUser, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
