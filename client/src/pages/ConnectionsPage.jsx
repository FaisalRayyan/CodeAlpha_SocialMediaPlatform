import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/client.js';
import UserRow from '../components/UserRow.jsx';

export default function ConnectionsPage() {
  const { username, type } = useParams(); const navigate = useNavigate(); const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get(`/users/${username}/connections/${type}`).then(({ data }) => setData(data)).catch((err) => setError(errorMessage(err))); }, [username, type]);
  const label = type === 'following' ? 'Following' : 'Followers';
  return <div className="page connections-page"><div className="detail-header"><button className="icon-btn" onClick={() => navigate(-1)}><ArrowLeft size={21}/></button><div><h1>{label}</h1><p>@{username}</p></div></div>{error && <div className="page-error surface">{error}</div>}{!data && !error ? <div className="empty surface">Loading...</div> : data?.users?.length ? <div className="surface connection-list">{data.users.map((user) => <UserRow key={user._id} user={user}/>)}</div> : data && <div className="empty surface">No {label.toLowerCase()} yet.</div>}</div>;
}
