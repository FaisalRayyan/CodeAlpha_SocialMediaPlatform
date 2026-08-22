import Post from '../models/Post.js';

const populatePost = (query) => query
  .populate('author', 'name username avatar')
  .populate('comments.user', 'name username avatar');

export async function createPost(req, res) {
  const text = String(req.body.text || '').trim();
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  if (!text && !image) return res.status(400).json({ message: 'Write something or add an image.' });
  const post = await Post.create({ author: req.user._id, text, image });
  const populated = await populatePost(Post.findById(post._id));
  res.status(201).json({ post: populated });
}

export async function getFeed(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 15;
  const authors = [req.user._id, ...req.user.following];
  const filter = authors.length > 1 ? { author: { $in: authors } } : {};
  const posts = await populatePost(Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit));
  res.json({ posts, page, hasMore: posts.length === limit });
}

export async function getExplore(req, res) {
  const posts = await populatePost(Post.find().sort({ createdAt: -1 }).limit(30));
  res.json({ posts });
}

export async function toggleLike(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const liked = post.likes.some((id) => String(id) === String(req.user._id));
  liked ? post.likes.pull(req.user._id) : post.likes.addToSet(req.user._id);
  await post.save();
  res.json({ liked: !liked, likesCount: post.likes.length });
}

export async function addComment(req, res) {
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Comment cannot be empty.' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  post.comments.push({ user: req.user._id, text });
  await post.save();
  const populated = await populatePost(Post.findById(post._id));
  res.status(201).json({ post: populated });
}

export async function deletePost(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed.' });
  await post.deleteOne();
  res.json({ message: 'Post deleted.' });
}
