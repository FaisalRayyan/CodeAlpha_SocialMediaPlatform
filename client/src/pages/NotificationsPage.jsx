import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/client.js';
import Avatar from '../components/Avatar.jsx';
import { timeAgo } from '../utils/time.js';

export default function NotificationsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const navigate = useNavigate();
  async function load() { try { const { data } = await api.get('/notifications'); setItems(data.notifications); } catch (err) { setError(errorMessage(err)); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function readAll() { await api.patch('/notifications/read-all'); setItems((all) => all.map((item) => ({ ...item, read: true }))); window.dispatchEvent(new Event('socialsphere:notifications-updated')); }
  async function open(item) { if (!item.read) await api.patch(`/notifications/${item._id}/read`).catch(() => {}); window.dispatchEvent(new Event('socialsphere:notifications-updated')); if (item.post) navigate(`/post/${item.post}`); else navigate(`/u/${item.actor.username}`); }
  const iconFor = (type) => type === 'like' ? <Heart size={17}/> : type === 'comment' ? <MessageCircle size={17}/> : <UserPlus size={17}/>;
  const textFor = (item) => item.type === 'like' ? 'liked your post' : item.type === 'comment' ? 'commented on your post' : 'started following you';
  return <div className="page notifications-page"><div className="page-title title-with-action"><div><h1>Notifications</h1><p>Likes, comments and new followers.</p></div>{items.some((item) => !item.read) && <button className="outline-btn compact" onClick={readAll}>Mark all read</button>}</div>{error && <div className="page-error surface">{error}</div>}{loading ? <div className="empty surface">Loading notifications...</div> : items.length ? <div className="surface notification-list">{items.map((item) => <button className={`notification-row ${item.read ? '' : 'unread'}`} key={item._id} onClick={() => open(item)}><Avatar user={item.actor} size={44}/><span className="notification-copy"><span><strong>{item.actor?.name}</strong> {textFor(item)}.</span>{item.message && <small>“{item.message}”</small>}<em>{timeAgo(item.createdAt)}</em></span><i className={`notification-type ${item.type}`}>{iconFor(item.type)}</i></button>)}</div> : <div className="empty surface"><Bell size={30}/><h3>Nothing new yet</h3><p>Interactions with your account will appear here.</p></div>}</div>;
}
