import { Bell, Bookmark, Compass, Home, LogOut, Search, Settings, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import RightRail from './RightRail.jsx';

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    const refresh = () => api.get('/notifications', { params: { limit: 1 } })
      .then(({ data }) => { if (active) setUnread(data.unreadCount || 0); })
      .catch(() => {});
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('socialsphere:notifications-updated', refresh);
    return () => { active = false; clearInterval(timer); window.removeEventListener('socialsphere:notifications-updated', refresh); };
  }, []);

  function signOut() { logout(); navigate('/login'); }

  const links = [
    ['/', Home, 'Home'],
    ['/explore', Compass, 'Explore'],
    ['/search', Search, 'Find people'],
    ['/saved', Bookmark, 'Saved'],
    ['/notifications', Bell, 'Notifications'],
    [`/u/${user?.username}`, UserRound, 'Profile'],
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('/')}><span>S</span><b>SocialSphere</b></button>
        <nav>
          {links.map(([to, Icon, label]) => <NavLink key={label} to={to} end={to === '/'} title={label}>
            <span className="nav-icon"><Icon size={21} />{label === 'Notifications' && unread > 0 && <i className="notification-dot">{unread > 9 ? '9+' : unread}</i>}</span>
            <span>{label}</span>
          </NavLink>)}
        </nav>
        <div className="sidebar-profile">
          <button className="profile-jump" onClick={() => navigate(`/u/${user?.username}`)}><Avatar user={user} size={40} /><span><strong>{user?.name}</strong><small>@{user?.username}</small></span></button>
          <button className="icon-btn" onClick={() => navigate('/settings')} title="Settings"><Settings size={18} /></button>
          <button className="icon-btn" onClick={signOut} title="Log out"><LogOut size={18} /></button>
        </div>
      </aside>
      <div className="app-content">
        <main className="main"><Outlet /></main>
        <RightRail />
      </div>
    </div>
  );
}
