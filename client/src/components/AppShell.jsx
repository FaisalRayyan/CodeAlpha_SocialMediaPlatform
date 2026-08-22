import { Compass, Home, LogOut, Search, UserRound } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login'); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('/')}><span>S</span>SocialSphere</button>
        <nav>
          <NavLink to="/"><Home size={21} /> <span>Home</span></NavLink>
          <NavLink to="/explore"><Compass size={21} /> <span>Explore</span></NavLink>
          <NavLink to="/search"><Search size={21} /> <span>Find people</span></NavLink>
          <NavLink to={`/u/${user?.username}`}><UserRound size={21} /> <span>Profile</span></NavLink>
        </nav>
        <div className="sidebar-profile">
          <Avatar user={user} size={40} />
          <div><strong>{user?.name}</strong><small>@{user?.username}</small></div>
          <button className="icon-btn" onClick={signOut} title="Log out"><LogOut size={18} /></button>
        </div>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}
