import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/client.js';
import PostCard from '../components/PostCard.jsx';

export default function PostPage() {
  const { postId } = useParams(); const navigate = useNavigate(); const [post, setPost] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get(`/posts/${postId}`).then(({ data }) => setPost(data.post)).catch((err) => setError(errorMessage(err, 'Post not found.'))); }, [postId]);
  return <div className="page feed-page"><div className="detail-header"><button className="icon-btn" onClick={() => navigate(-1)}><ArrowLeft size={21}/></button><div><h1>Post</h1><p>Conversation</p></div></div>{error ? <div className="empty surface"><h3>Post unavailable</h3><p>{error}</p></div> : post ? <PostCard post={post} showAllComments onDeleted={() => navigate('/')}/> : <div className="empty surface">Loading post...</div>}</div>;
}
