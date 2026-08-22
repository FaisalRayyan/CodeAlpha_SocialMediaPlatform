import { mediaUrl } from '../api/client.js';

export default function Avatar({ user, size = 44 }) {
  const initials = (user?.name || user?.username || '?').split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase();
  return user?.avatar ? (
    <img className="avatar" src={mediaUrl(user.avatar)} alt={user.username || 'avatar'} style={{ width: size, height: size }} />
  ) : (
    <div className="avatar avatar-fallback" style={{ width: size, height: size }}>{initials}</div>
  );
}
