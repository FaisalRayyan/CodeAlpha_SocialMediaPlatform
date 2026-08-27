import { mediaUrl } from '../api/client.js';

export default function Avatar({ user, size = 44, className = '' }) {
  const initials = (user?.name || user?.username || '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return user?.avatar ? (
    <img className={`avatar ${className}`} src={mediaUrl(user.avatar)} alt={`${user.name || user.username} avatar`} style={{ width: size, height: size }} />
  ) : (
    <div className={`avatar avatar-fallback ${className}`} style={{ width: size, height: size }} aria-label={`${user?.name || 'User'} avatar`}>{initials}</div>
  );
}
