import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';

export default function UserRow({ user, trailing }) {
  return (
    <div className="user-row">
      <Link to={`/u/${user.username}`}><Avatar user={user} size={44} /></Link>
      <Link className="user-row-copy" to={`/u/${user.username}`}>
        <strong>{user.name}</strong>
        <span>@{user.username}</span>
        {user.bio && <small>{user.bio}</small>}
      </Link>
      {trailing}
    </div>
  );
}
