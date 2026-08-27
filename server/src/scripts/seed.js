import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { validateEnv } from '../config/env.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const demos = [
  { name: 'Ayesha Khan', username: 'ayesha.demo', email: 'ayesha.demo@example.com', bio: 'Frontend developer • coffee • clean UI' },
  { name: 'Hamza Ali', username: 'hamza.demo', email: 'hamza.demo@example.com', bio: 'Building full-stack products one commit at a time.' },
  { name: 'Sara Ahmed', username: 'sara.demo', email: 'sara.demo@example.com', bio: 'Photography, travel and small everyday stories.' },
];

try {
  validateEnv();
  await connectDB();
  const users = [];
  for (const demo of demos) {
    let user = await User.findOne({ email: demo.email });
    if (!user) user = await User.create({ ...demo, password: 'Demo@12345' });
    else { user.name = demo.name; user.bio = demo.bio; await user.save(); }
    users.push(user);
  }

  const [ayesha, hamza, sara] = users;
  ayesha.following.addToSet(hamza._id, sara._id);
  hamza.followers.addToSet(ayesha._id);
  sara.followers.addToSet(ayesha._id);
  await Promise.all([ayesha.save(), hamza.save(), sara.save()]);

  const existing = await Post.countDocuments({ author: { $in: users.map((u) => u._id) } });
  if (!existing) {
    await Post.create([
      { author: ayesha._id, text: 'Just finished polishing a responsive dashboard. Small spacing decisions really do change the whole experience.' },
      { author: hamza._id, text: 'Today’s goal: ship something useful, document it properly, and push a clean commit. ✅' },
      { author: sara._id, text: 'A good social app should make conversation feel easy, not noisy. Loving the minimal feed here.' },
    ]);
  }

  console.log('Demo data ready. Login password for demo accounts: Demo@12345');
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close().catch(() => {});
}
