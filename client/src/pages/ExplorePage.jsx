import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api/client.js';
import PostCard from '../components/PostCard.jsx';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    api.get('/posts/explore').then(({ data }) => { setPosts(data.posts); setHasMore(data.hasMore); })
      .catch((err) => setError(errorMessage(err, 'Could not load Explore.')))
      .finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { data } = await api.get('/posts/explore', { params: { page: next } });
      setPosts((all) => [...all, ...data.posts]); setPage(next); setHasMore(data.hasMore);
    } catch (err) { setError(errorMessage(err)); }
    finally { setLoadingMore(false); }
  }

  return <div className="page feed-page">
    <div className="page-title"><h1>Explore</h1><p>Fresh posts from across the community.</p></div>
    {error && <div className="page-error surface">{error}</div>}
    {loading ? <div className="empty surface">Loading Explore...</div> : posts.length ? <>
      {posts.map((post) => <PostCard key={post._id} post={post} onDeleted={(id) => setPosts((all) => all.filter((item) => item._id !== id))} />)}
      {hasMore && <button className="load-more" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading...' : 'Load more'}</button>}
    </> : <div className="empty surface"><h3>No posts yet</h3><p>Be the first person to share something.</p></div>}
  </div>;
}
