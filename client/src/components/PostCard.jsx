import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mediaUrl } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

function timeAgo(date) {
  const sec = Math.floor((Date.now() - new Date(date)) / 1000);
  if (sec < 60) return `${Math.max(sec, 1)}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  return `${Math.floor(sec / 86400)}d`;
}

export default function PostCard({ post, onDeleted }) {
  const { user } = useAuth();
  const [item, setItem] = useState(post);
  const [comment, setComment] = useState('');
  const liked = item.likes?.some((id) => String(id?._id || id) === String(user.id || user._id));

  async function like() {
    const { data } = await api.post(`/posts/${item._id}/like`);
    setItem((p) => ({ ...p, likes: data.liked ? [...p.likes, user.id] : p.likes.filter((id) => String(id?._id || id) !== String(user.id)) }));
  }

  async function addComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    const { data } = await api.post(`/posts/${item._id}/comments`, { text: comment });
    setItem(data.post); setComment('');
  }

  async function remove() {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${item._id}`); onDeleted?.(item._id);
  }

  return (
    <article className="post-card surface">
      <header className="post-head">
        <Link to={`/u/${item.author.username}`}><Avatar user={item.author} /></Link>
        <div className="post-meta"><Link to={`/u/${item.author.username}`}><strong>{item.author.name}</strong></Link><span>@{item.author.username} · {timeAgo(item.createdAt)}</span></div>
        {String(item.author._id) === String(user.id || user._id) && <button className="icon-btn danger" onClick={remove}><Trash2 size={18} /></button>}
      </header>
      {item.text && <p className="post-text">{item.text}</p>}
      {item.image && <img className="post-image" src={mediaUrl(item.image)} alt="Post media" />}
      <div className="post-stats"><span>{item.likes?.length || 0} likes</span><span>{item.comments?.length || 0} comments</span></div>
      <div className="post-actions">
        <button className={liked ? 'liked' : ''} onClick={like}><Heart size={20} fill={liked ? 'currentColor' : 'none'} /> Like</button>
        <button onClick={() => document.getElementById(`comment-${item._id}`)?.focus()}><MessageCircle size={20} /> Comment</button>
      </div>
      {item.comments?.length > 0 && <div className="comments">{item.comments.slice(-3).map((c) => <div className="comment" key={c._id}><Avatar user={c.user} size={30} /><p><strong>{c.user?.name}</strong> {c.text}</p></div>)}</div>}
      <form className="comment-form" onSubmit={addComment}>
        <Avatar user={user} size={30} />
        <input id={`comment-${item._id}`} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." maxLength={500} />
        <button disabled={!comment.trim()}><Send size={17} /></button>
      </form>
    </article>
  );
}
