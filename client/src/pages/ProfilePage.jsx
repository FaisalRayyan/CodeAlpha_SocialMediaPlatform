import { Camera, Edit3, UserPlus, UserRoundCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';
import Avatar from '../components/Avatar.jsx';
import PostCard from '../components/PostCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { username } = useParams(); const { user: me, setUser: setMe } = useAuth();
  const [profile, setProfile] = useState(null); const [posts, setPosts] = useState([]); const [editing, setEditing] = useState(false); const [form, setForm] = useState({ name: '', bio: '' }); const [avatar, setAvatar] = useState(null); const fileRef = useRef();
  const mine = profile && profile.username === me.username;
  const following = profile?.followers?.some((id) => String(id?._id || id) === String(me.id || me._id));

  async function load() { const { data } = await api.get(`/users/${username}`); setProfile(data.user); setPosts(data.posts); setForm({ name: data.user.name, bio: data.user.bio || '' }); }
  useEffect(() => { load(); }, [username]);
  async function follow() { const { data } = await api.post(`/users/${profile._id}/follow`); setProfile((p) => ({ ...p, followers: data.following ? [...p.followers, me.id] : p.followers.filter((id) => String(id) !== String(me.id)) })); const { data: meData } = await api.get('/auth/me'); setMe(meData.user); }
  async function save(e) { e.preventDefault(); const fd = new FormData(); fd.append('name', form.name); fd.append('bio', form.bio); if (avatar) fd.append('avatar', avatar); const { data } = await api.patch('/users/me', fd); setProfile(data.user); setMe(data.user); setEditing(false); setAvatar(null); }

  if (!profile) return <div className="page"><div className="empty surface">Loading profile...</div></div>;
  return <div className="page profile-page"><section className="profile-header surface"><div className="profile-avatar-wrap"><Avatar user={profile} size={104} />{mine && editing && <button className="camera-btn" onClick={() => fileRef.current?.click()}><Camera size={17}/></button>}</div><div className="profile-info"><div className="profile-name-row"><div><h1>{profile.name}</h1><span>@{profile.username}</span></div>{mine ? <button className="outline-btn" onClick={() => setEditing((x) => !x)}><Edit3 size={17}/> Edit profile</button> : <button className={following ? 'outline-btn' : 'primary-btn'} onClick={follow}>{following ? <UserRoundCheck size={17}/> : <UserPlus size={17}/>} {following ? 'Following' : 'Follow'}</button>}</div><p>{profile.bio || 'No bio yet.'}</p><div className="profile-stats"><span><strong>{posts.length}</strong> posts</span><span><strong>{profile.followers?.length || 0}</strong> followers</span><span><strong>{profile.following?.length || 0}</strong> following</span></div></div></section>{mine && editing && <form className="edit-profile surface" onSubmit={save}><input ref={fileRef} hidden type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} /><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label><label>Bio<textarea maxLength={180} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}/></label><button className="primary-btn">Save changes</button></form>}<div className="profile-posts"><h2>Posts</h2>{posts.length ? posts.map((p) => <PostCard key={p._id} post={p} onDeleted={(id) => setPosts((x) => x.filter((p) => p._id !== id))}/>) : <div className="empty surface">No posts yet.</div>}</div></div>;
}
