import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  followers: user.followers,
  following: user.following,
  createdAt: user.createdAt,
});

export async function register(req, res) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Name, username, email and password are required.' });
  }

  const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
  if (exists) return res.status(409).json({ message: 'Email or username is already registered.' });

  const user = await User.create({ name, username, email, password });
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
}

export async function login(req, res) {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ message: 'Credentials are required.' });

  const needle = identifier.toLowerCase().trim();
  const user = await User.findOne({ $or: [{ email: needle }, { username: needle }] }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email/username or password.' });
  }

  user.password = undefined;
  res.json({ token: signToken(user._id), user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
