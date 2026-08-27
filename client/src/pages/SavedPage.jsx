import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api/client.js';
import PostCard from '../components/PostCard.jsx';

export default function SavedPage() {
  const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.get('/posts/saved').then(({ data }) => setPosts(data.posts)).catch((err) => setError(errorMessage(err))).finally(() => setLoading(false)); }, []);
  return <div className="page feed-page"><div className="page-title"><h1>Saved</h1><p>Posts you bookmarked for later.</p></div>{error && <div className="page-error surface">{error}</div>}{loading ? <div className="empty surface">Loading saved posts...</div> : posts.length ? posts.map((post) => <PostCard key={post._id} post={post} onDeleted={(id) => setPosts((all) => all.filter((item) => item._id !== id))}/>) : <div className="empty surface"><Bookmark size={30}/><h3>No saved posts</h3><p>Use Save on a post and it will appear here.</p></div>}</div>;
}
