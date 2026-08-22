import User from '../models/User.js';
import Post from '../models/Post.js';

const selectPublic = 'name username email bio avatar followers following createdAt';

export async function searchUsers(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ users: [] });
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const users = await User.find({ $or: [{ name: regex }, { username: regex }] }).select(selectPublic).limit(20);
  res.json({ users });
}

export async function getUserProfile(req, res) {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(selectPublic);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate('author', 'name username avatar')
    .populate('comments.user', 'name username avatar');
  res.json({ user, posts });
}

export async function updateProfile(req, res) {
  const { name, bio } = req.body;
  if (name !== undefined) req.user.name = String(name).trim().slice(0, 60);
  if (bio !== undefined) req.user.bio = String(bio).trim().slice(0, 180);
  if (req.file) req.user.avatar = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ user: await User.findById(req.user._id).select(selectPublic) });
}

export async function toggleFollow(req, res) {
  if (String(req.user._id) === req.params.userId) return res.status(400).json({ message: 'You cannot follow yourself.' });
  const target = await User.findById(req.params.userId);
  if (!target) return res.status(404).json({ message: 'User not found.' });

  const isFollowing = req.user.following.some((id) => String(id) === String(target._id));
  if (isFollowing) {
    req.user.following.pull(target._id);
    target.followers.pull(req.user._id);
  } else {
    req.user.following.addToSet(target._id);
    target.followers.addToSet(req.user._id);
  }

  await Promise.all([req.user.save(), target.save()]);
  res.json({ following: !isFollowing, followersCount: target.followers.length });
}
