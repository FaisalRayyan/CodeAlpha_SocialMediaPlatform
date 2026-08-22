import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Avatar from '../components/Avatar.jsx';

export default function SearchPage() {
  const [q, setQ] = useState(''); const [users, setUsers] = useState([]); const [busy, setBusy] = useState(false);
  async function search(e) { e.preventDefault(); if (!q.trim()) return; setBusy(true); try { const { data } = await api.get('/users/search', { params: { q } }); setUsers(data.users); } finally { setBusy(false); } }
  return <div className="page search-page"><div className="page-title"><h1>Find people</h1><p>Search by name or username.</p></div><form className="search-box surface" onSubmit={search}><Search size={20} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SocialSphere"/><button className="primary-btn">{busy ? 'Searching...' : 'Search'}</button></form><div className="people-list">{users.map((u) => <Link className="person-row surface" to={`/u/${u.username}`} key={u._id}><Avatar user={u} /><div><strong>{u.name}</strong><span>@{u.username}</span></div><small>{u.followers?.length || 0} followers</small></Link>)}</div></div>;
}
