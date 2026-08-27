import { Search } from 'lucide-react';
import { useState } from 'react';
import api, { errorMessage } from '../api/client.js';
import UserRow from '../components/UserRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SearchPage() {
  const { user: me } = useAuth();
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function search(e) {
    e?.preventDefault();
    if (!q.trim()) return;
    setBusy(true); setError(''); setSearched(true);
    try { const { data } = await api.get('/users/search', { params: { q: q.trim() } }); setUsers(data.users); }
    catch (err) { setError(errorMessage(err, 'Search failed.')); }
    finally { setBusy(false); }
  }

  async function toggleFollow(target) {
    try {
      const isFollowing = target.followers?.some((id) => String(id?._id || id) === String(me.id || me._id));
      const { data } = await api.post(`/users/${target._id}/follow`);
      setUsers((all) => all.map((user) => user._id === target._id ? {
        ...user,
        followers: data.following ? [...(user.followers || []), me.id] : (user.followers || []).filter((id) => String(id?._id || id) !== String(me.id)),
        _following: data.following,
      } : user));
    } catch (err) { setError(errorMessage(err)); }
  }

  return <div className="page search-page">
    <div className="page-title"><h1>Find people</h1><p>Search by full name or username.</p></div>
    <form className="search-box surface" onSubmit={search}><Search size={20} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SocialSphere" autoFocus/><button className="primary-btn" disabled={busy || !q.trim()}>{busy ? 'Searching...' : 'Search'}</button></form>
    {error && <div className="page-error surface">{error}</div>}
    <div className="people-list">
      {users.map((user) => {
        const isMe = String(user._id) === String(me.id || me._id);
        const following = user._following ?? user.followers?.some((id) => String(id?._id || id) === String(me.id || me._id));
        return <div className="surface person-card" key={user._id}><UserRow user={user} trailing={!isMe && <button className={following ? 'outline-btn compact' : 'primary-btn compact'} onClick={() => toggleFollow(user)}>{following ? 'Following' : 'Follow'}</button>} /></div>;
      })}
      {searched && !busy && !users.length && <div className="empty surface"><h3>No people found</h3><p>Try a different name or username.</p></div>}
    </div>
  </div>;
}
