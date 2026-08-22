import { useEffect, useState } from 'react';
import api from '../api/client.js';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/posts/feed').then(({ data }) => setPosts(data.posts)).finally(() => setLoading(false)); }, []);
  return <div className="page feed-page"><div className="page-title"><h1>Home</h1><p>Your feed and the people you follow.</p></div><Composer onCreated={(post) => setPosts((p) => [post, ...p])} />{loading ? <div className="empty surface">Loading feed...</div> : posts.length ? posts.map((p) => <PostCard key={p._id} post={p} onDeleted={(id) => setPosts((all) => all.filter((x) => x._id !== id))} />) : <div className="empty surface"><h3>Your feed is quiet</h3><p>Follow people or create your first post.</p></div>}</div>;
}
