import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const publicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  followers: user.followers,
  following: user.following,
  createdAt: user.createdAt,
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-z0-9._]+$/;

export async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const username = String(req.body.username || '').trim().toLowerCase();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Name, username, email and password are required.' });
  }
  if (name.length > 60) return res.status(400).json({ message: 'Name must be 60 characters or fewer.' });
  if (username.length < 3 || username.length > 30 || !usernamePattern.test(username)) {
    return res.status(400).json({ message: 'Username must be 3–30 characters and use only letters, numbers, dots or underscores.' });
  }
  if (!emailPattern.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: 'Email or username is already registered.' });

  const user = await User.create({ name, username, email, password });
  return res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
}

export async function login(req, res) {
  const identifier = String(req.body.identifier || '').toLowerCase().trim();
  const password = String(req.body.password || '');
  if (!identifier || !password) return res.status(400).json({ message: 'Email/username and password are required.' });

  const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email/username or password.' });
  }

  return res.json({ token: signToken(user._id), user: publicUser(user) });
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function changePassword(req, res) {
  const currentPassword = String(req.body.currentPassword || '');
  const newPassword = String(req.body.newPassword || '');
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both password fields are required.' });
  if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters.' });
  if (currentPassword === newPassword) return res.status(400).json({ message: 'Choose a different new password.' });

  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  await user.save();
  return res.json({ message: 'Password changed successfully.' });
}
