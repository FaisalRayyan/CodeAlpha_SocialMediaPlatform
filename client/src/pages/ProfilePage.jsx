import { Camera, Edit3, UserPlus, UserRoundCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/client.js';
import Avatar from '../components/Avatar.jsx';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me, setUser: setMe } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });
  const [avatar, setAvatar] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const mine = profile && profile.username === me.username;
  const meId = String(me.id || me._id);
  const following = profile?.followers?.some((id) => String(id?._id || id) === meId);

  async function load() {
    setError('');
    try {
      const { data } = await api.get(`/users/${username}`);
      setProfile(data.user); setPosts(data.posts); setForm({ name: data.user.name, bio: data.user.bio || '' });
    } catch (err) { setError(errorMessage(err, 'Could not load profile.')); }
  }
  useEffect(() => { setProfile(null); load(); }, [username]);

  async function follow() {
    if (busy) return; setBusy(true);
    try {
      const { data } = await api.post(`/users/${profile._id}/follow`);
      setProfile((current) => ({ ...current, followers: data.following ? [...(current.followers || []), me.id || me._id] : (current.followers || []).filter((id) => String(id?._id || id) !== meId) }));
      const { data: meData } = await api.get('/auth/me'); setMe(meData.user);
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }

  async function save(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const fd = new FormData(); fd.append('name', form.name); fd.append('bio', form.bio); if (avatar) fd.append('avatar', avatar);
      const { data } = await api.patch('/users/me', fd);
      setProfile(data.user); setMe(data.user); setEditing(false); setAvatar(null);
    } catch (err) { setError(errorMessage(err, 'Could not update profile.')); }
    finally { setBusy(false); }
  }

  if (error && !profile) return <div className="page"><div className="empty surface"><h3>Profile unavailable</h3><p>{error}</p></div></div>;
  if (!profile) return <div className="page"><div className="empty surface">Loading profile...</div></div>;

  return <div className="page profile-page">
    <section className="profile-header surface">
      <div className="profile-avatar-wrap"><Avatar user={profile} size={104} />{mine && editing && <button className="camera-btn" type="button" onClick={() => fileRef.current?.click()}><Camera size={17}/></button>}</div>
      <div className="profile-info">
        <div className="profile-name-row"><div><h1>{profile.name}</h1><span>@{profile.username}</span></div>{mine ? <button className="outline-btn" onClick={() => setEditing((value) => !value)}><Edit3 size={17}/> {editing ? 'Cancel' : 'Edit profile'}</button> : <button className={following ? 'outline-btn' : 'primary-btn'} onClick={follow} disabled={busy}>{following ? <UserRoundCheck size={17}/> : <UserPlus size={17}/>} {following ? 'Following' : 'Follow'}</button>}</div>
        <p>{profile.bio || (mine ? 'Add a short bio to tell people about yourself.' : 'No bio yet.')}</p>
        <div className="profile-stats"><span><strong>{posts.length}</strong> posts</span><Link to={`/u/${profile.username}/followers`}><strong>{profile.followers?.length || 0}</strong> followers</Link><Link to={`/u/${profile.username}/following`}><strong>{profile.following?.length || 0}</strong> following</Link></div>
      </div>
    </section>
    {error && <div className="page-error surface">{error}</div>}
    {mine && editing && <form className="edit-profile surface" onSubmit={save}><input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setAvatar(e.target.files?.[0] || null)} /><label>Name<input maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required/></label><label>Bio<textarea maxLength={180} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}/><small>{form.bio.length}/180</small></label>{avatar && <span className="file-selected">New avatar selected: {avatar.name}</span>}<button className="primary-btn" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></form>}
    <div className="profile-posts"><h2>Posts</h2>{posts.length ? posts.map((post) => <PostCard key={post._id} post={post} onDeleted={(id) => setPosts((all) => all.filter((item) => item._id !== id))}/>) : <div className="empty surface">No posts yet.</div>}</div>
  </div>;
}
