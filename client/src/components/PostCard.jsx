import { Bookmark, Heart, Link2, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage, mediaUrl } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { timeAgo } from '../utils/time.js';
import Avatar from './Avatar.jsx';

export default function PostCard({ post, onDeleted, showAllComments = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(post);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const viewerId = String(user?.id || user?._id || '');
  const liked = item.likedByMe ?? item.likes?.some((id) => String(id?._id || id) === viewerId);
  const saved = Boolean(item.savedByMe);
  const ownPost = String(item.author?._id) === viewerId;
  const comments = showAllComments ? item.comments || [] : (item.comments || []).slice(-3);

  async function like() {
    if (busy) return;
    setBusy('like'); setError('');
    try {
      const { data } = await api.post(`/posts/${item._id}/like`);
      setItem((current) => ({
        ...current,
        likedByMe: data.liked,
        likes: data.liked
          ? [...(current.likes || []).filter((id) => String(id?._id || id) !== viewerId), viewerId]
          : (current.likes || []).filter((id) => String(id?._id || id) !== viewerId),
      }));
    } catch (err) { setError(errorMessage(err, 'Could not update like.')); }
    finally { setBusy(''); }
  }

  async function save() {
    if (busy) return;
    setBusy('save'); setError('');
    try {
      const { data } = await api.post(`/posts/${item._id}/save`);
      setItem((current) => ({ ...current, savedByMe: data.saved }));
    } catch (err) { setError(errorMessage(err, 'Could not save this post.')); }
    finally { setBusy(''); }
  }

  async function addComment(e) {
    e.preventDefault();
    if (!comment.trim() || busy) return;
    setBusy('comment'); setError('');
    try {
      const { data } = await api.post(`/posts/${item._id}/comments`, { text: comment.trim() });
      setItem(data.post); setComment('');
    } catch (err) { setError(errorMessage(err, 'Could not add comment.')); }
    finally { setBusy(''); }
  }

  async function removeComment(commentId) {
    if (busy || !window.confirm('Delete this comment?')) return;
    setBusy(`comment-${commentId}`); setError('');
    try {
      const { data } = await api.delete(`/posts/${item._id}/comments/${commentId}`);
      setItem(data.post);
    } catch (err) { setError(errorMessage(err, 'Could not delete comment.')); }
    finally { setBusy(''); }
  }

  async function remove() {
    if (busy || !window.confirm('Delete this post permanently?')) return;
    setBusy('delete'); setError('');
    try {
      await api.delete(`/posts/${item._id}`);
      onDeleted?.(item._id);
    } catch (err) { setError(errorMessage(err, 'Could not delete post.')); }
    finally { setBusy(''); }
  }

  async function share() {
    const url = `${window.location.origin}/post/${item._id}`;
    try {
      if (navigator.share) await navigator.share({ title: 'SocialSphere post', url });
      else await navigator.clipboard.writeText(url);
    } catch { /* User can cancel native share. */ }
  }

  return (
    <article className="post-card surface">
      <header className="post-head">
        <Link to={`/u/${item.author.username}`}><Avatar user={item.author} /></Link>
        <div className="post-meta">
          <Link to={`/u/${item.author.username}`}><strong>{item.author.name}</strong></Link>
          <button className="post-time" onClick={() => navigate(`/post/${item._id}`)}>@{item.author.username} · {timeAgo(item.createdAt)}</button>
        </div>
        {ownPost && <button className="icon-btn danger" onClick={remove} disabled={busy === 'delete'} title="Delete post"><Trash2 size={18} /></button>}
      </header>

      {item.text && <p className="post-text">{item.text}</p>}
      {item.image && <button className="post-image-link" onClick={() => navigate(`/post/${item._id}`)}><img className="post-image" src={mediaUrl(item.image)} alt="Post media" /></button>}

      <div className="post-stats">
        <span>{item.likes?.length || 0} {(item.likes?.length || 0) === 1 ? 'like' : 'likes'}</span>
        <button onClick={() => navigate(`/post/${item._id}`)}>{item.comments?.length || 0} {(item.comments?.length || 0) === 1 ? 'comment' : 'comments'}</button>
      </div>

      <div className="post-actions">
        <button className={liked ? 'liked' : ''} onClick={like} disabled={busy === 'like'}><Heart size={20} fill={liked ? 'currentColor' : 'none'} /> Like</button>
        <button onClick={() => document.getElementById(`comment-${item._id}`)?.focus()}><MessageCircle size={20} /> Comment</button>
        <button onClick={save} className={saved ? 'saved' : ''} disabled={busy === 'save'}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /> Save</button>
        <button onClick={share}><Link2 size={20} /> Share</button>
      </div>

      {comments.length > 0 && <div className="comments">
        {comments.map((entry) => {
          const canDelete = String(entry.user?._id || entry.user) === viewerId || ownPost;
          return <div className="comment" key={entry._id}>
            <Link to={`/u/${entry.user?.username || ''}`}><Avatar user={entry.user} size={30} /></Link>
            <div className="comment-bubble">
              <p><Link to={`/u/${entry.user?.username || ''}`}><strong>{entry.user?.name || 'User'}</strong></Link> {entry.text}</p>
              <small>{timeAgo(entry.createdAt)}</small>
            </div>
            {canDelete && <button className="comment-delete" onClick={() => removeComment(entry._id)} title="Delete comment"><Trash2 size={14} /></button>}
          </div>;
        })}
        {!showAllComments && (item.comments?.length || 0) > 3 && <button className="view-comments" onClick={() => navigate(`/post/${item._id}`)}>View all {item.comments.length} comments</button>}
      </div>}

      {error && <div className="inline-error post-error">{error}</div>}
      <form className="comment-form" onSubmit={addComment}>
        <Avatar user={user} size={30} />
        <input id={`comment-${item._id}`} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." maxLength={500} />
        <button disabled={!comment.trim() || busy === 'comment'} title="Send comment"><Send size={17} /></button>
      </form>
    </article>
  );
}
