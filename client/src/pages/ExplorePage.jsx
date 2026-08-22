import { useEffect, useState } from 'react';
import api from '../api/client.js';
import PostCard from '../components/PostCard.jsx';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { api.get('/posts/explore').then(({ data }) => setPosts(data.posts)); }, []);
  return <div className="page feed-page"><div className="page-title"><h1>Explore</h1><p>See what the community is sharing.</p></div>{posts.map((p) => <PostCard key={p._id} post={p} onDeleted={(id) => setPosts((x) => x.filter((p) => p._id !== id))} />)}</div>;
}
