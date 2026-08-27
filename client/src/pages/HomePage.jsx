import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api/client.js';
import Composer from '../components/Composer.jsx';
import PostCard from '../components/PostCard.jsx';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/posts/feed').then(({ data }) => { setPosts(data.posts); setHasMore(data.hasMore); })
      .catch((err) => setError(errorMessage(err, 'Could not load your feed.')))
      .finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { data } = await api.get('/posts/feed', { params: { page: next } });
      setPosts((all) => [...all, ...data.posts]); setPage(next); setHasMore(data.hasMore);
    } catch (err) { setError(errorMessage(err, 'Could not load more posts.')); }
    finally { setLoadingMore(false); }
  }

  return <div className="page feed-page">
    <div className="page-title"><h1>Home</h1><p>Your posts and updates from people you follow.</p></div>
    <Composer onCreated={(post) => setPosts((current) => [post, ...current])} />
    {error && <div className="page-error surface">{error}</div>}
    {loading ? <div className="empty surface">Loading your feed...</div> : posts.length ? <>
      {posts.map((post) => <PostCard key={post._id} post={post} onDeleted={(id) => setPosts((all) => all.filter((item) => item._id !== id))} />)}
      {hasMore && <button className="load-more" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading...' : 'Load more'}</button>}
    </> : <div className="empty surface"><h3>Your feed is quiet</h3><p>Create your first post or follow people from Explore and Find people.</p></div>}
  </div>;
}
