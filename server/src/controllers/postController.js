import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { createNotification, removeNotification } from '../utils/notifications.js';
import { populatePost, serializePost } from '../utils/posts.js';
import { removeUpload, saveUpload } from '../utils/uploads.js';

async function populatedById(id) {
  return populatePost(Post.findById(id));
}

export async function createPost(req, res) {
  const text = String(req.body.text || '').trim();
  if (!text && !req.file) return res.status(400).json({ message: 'Write something or add an image.' });
  if (text.length > 1500) return res.status(400).json({ message: 'Post text must be 1500 characters or fewer.' });

  let image = '';
  try {
    if (req.file) image = await saveUpload(req.file, req.user._id, 'post');
    const post = await Post.create({ author: req.user._id, text, image });
    const populated = await populatedById(post._id);
    return res.status(201).json({ post: serializePost(populated, req.user) });
  } catch (error) {
    if (image) await removeUpload(image);
    throw error;
  }
}

export async function getFeed(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 15;
  const authors = [req.user._id, ...req.user.following];
  const posts = await populatePost(
    Post.find({ author: { $in: authors } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
  );
  res.json({ posts: posts.map((post) => serializePost(post, req.user)), page, hasMore: posts.length === limit });
}

export async function getExplore(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = 20;
  const posts = await populatePost(
    Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
  );
  res.json({ posts: posts.map((post) => serializePost(post, req.user)), page, hasMore: posts.length === limit });
}

export async function getPost(req, res) {
  const post = await populatedById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  res.json({ post: serializePost(post, req.user) });
}

export async function getSavedPosts(req, res) {
  const savedIds = [...req.user.savedPosts].reverse();
  if (!savedIds.length) return res.json({ posts: [] });
  const posts = await populatePost(Post.find({ _id: { $in: savedIds } }));
  const position = new Map(savedIds.map((id, index) => [String(id), index]));
  posts.sort((a, b) => position.get(String(a._id)) - position.get(String(b._id)));
  res.json({ posts: posts.map((post) => serializePost(post, req.user)) });
}

export async function toggleLike(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const liked = post.likes.some((id) => String(id) === String(req.user._id));

  if (liked) {
    post.likes.pull(req.user._id);
    await removeNotification({ recipient: post.author, actor: req.user._id, type: 'like', post: post._id });
  } else {
    post.likes.addToSet(req.user._id);
    await createNotification({ recipient: post.author, actor: req.user._id, type: 'like', post: post._id });
  }
  await post.save();
  res.json({ liked: !liked, likesCount: post.likes.length });
}

export async function toggleSave(req, res) {
  const post = await Post.findById(req.params.postId).select('_id');
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const saved = req.user.savedPosts.some((id) => String(id) === String(post._id));
  saved ? req.user.savedPosts.pull(post._id) : req.user.savedPosts.addToSet(post._id);
  await req.user.save();
  res.json({ saved: !saved });
}

export async function addComment(req, res) {
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Comment cannot be empty.' });
  if (text.length > 500) return res.status(400).json({ message: 'Comment must be 500 characters or fewer.' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });

  post.comments.push({ user: req.user._id, text });
  await post.save();
  await createNotification({ recipient: post.author, actor: req.user._id, type: 'comment', post: post._id, message: text.slice(0, 120) });
  const populated = await populatedById(post._id);
  res.status(201).json({ post: serializePost(populated, req.user) });
}

export async function deleteComment(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found.' });

  const isCommentOwner = String(comment.user) === String(req.user._id);
  const isPostOwner = String(post.author) === String(req.user._id);
  if (!isCommentOwner && !isPostOwner) return res.status(403).json({ message: 'Not allowed.' });

  const commentAuthor = comment.user;
  post.comments.pull(comment._id);
  await post.save();
  await removeNotification({ recipient: post.author, actor: commentAuthor, type: 'comment', post: post._id });
  const populated = await populatedById(post._id);
  res.json({ post: serializePost(populated, req.user) });
}

export async function deletePost(req, res) {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed.' });

  const image = post.image;
  await Promise.all([
    post.deleteOne(),
    Notification.deleteMany({ post: post._id }),
    User.updateMany({ savedPosts: post._id }, { $pull: { savedPosts: post._id } }),
  ]);
  await removeUpload(image);
  res.json({ message: 'Post deleted.' });
}
