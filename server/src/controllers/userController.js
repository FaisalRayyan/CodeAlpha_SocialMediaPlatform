import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { createNotification, removeNotification } from '../utils/notifications.js';
import { populatePost, serializePost } from '../utils/posts.js';
import { removeUpload, saveUpload } from '../utils/uploads.js';

const publicFields = 'name username bio avatar followers following createdAt';

export async function searchUsers(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ users: [] });
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const users = await User.find({ $or: [{ name: regex }, { username: regex }] })
    .select(publicFields)
    .limit(20)
    .lean();
  res.json({ users });
}

export async function getSuggestions(req, res) {
  const excluded = [req.user._id, ...req.user.following];
  const users = await User.find({ _id: { $nin: excluded } })
    .select(publicFields)
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
  res.json({ users });
}

export async function getUserProfile(req, res) {
  const user = await User.findOne({ username: String(req.params.username).toLowerCase() }).select(publicFields);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const posts = await populatePost(Post.find({ author: user._id }).sort({ createdAt: -1 }));
  res.json({ user, posts: posts.map((post) => serializePost(post, req.user)) });
}

export async function getConnections(req, res) {
  const type = req.params.type;
  if (!['followers', 'following'].includes(type)) return res.status(400).json({ message: 'Invalid connection type.' });
  const user = await User.findOne({ username: String(req.params.username).toLowerCase() })
    .populate(type, 'name username bio avatar followers following')
    .select(`name username ${type}`);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ user: { name: user.name, username: user.username }, users: user[type] });
}

export async function updateProfile(req, res) {
  const name = req.body.name === undefined ? undefined : String(req.body.name).trim();
  const bio = req.body.bio === undefined ? undefined : String(req.body.bio).trim();
  if (name !== undefined && !name) return res.status(400).json({ message: 'Name cannot be empty.' });
  if (name && name.length > 60) return res.status(400).json({ message: 'Name must be 60 characters or fewer.' });
  if (bio && bio.length > 180) return res.status(400).json({ message: 'Bio must be 180 characters or fewer.' });

  if (name !== undefined) req.user.name = name;
  if (bio !== undefined) req.user.bio = bio;

  let nextAvatar = '';
  const previousAvatar = req.user.avatar;
  try {
    if (req.file) {
      nextAvatar = await saveUpload(req.file, req.user._id, 'avatar');
      req.user.avatar = nextAvatar;
    }
    await req.user.save();
    if (nextAvatar && previousAvatar) await removeUpload(previousAvatar);
  } catch (error) {
    if (nextAvatar) await removeUpload(nextAvatar);
    throw error;
  }

  const updated = await User.findById(req.user._id).select(`${publicFields} email`);
  res.json({ user: updated });
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
  if (isFollowing) await removeNotification({ recipient: target._id, actor: req.user._id, type: 'follow' });
  else await createNotification({ recipient: target._id, actor: req.user._id, type: 'follow' });
  res.json({ following: !isFollowing, followersCount: target.followers.length, followingCount: req.user.following.length });
}
