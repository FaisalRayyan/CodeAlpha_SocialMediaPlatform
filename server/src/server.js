import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { validateEnv } from './config/env.js';

let server;

async function shutdown(signal) {
  console.log(`${signal} received. Closing SocialSphere safely...`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close().catch(() => {});
  process.exit(0);
}

try {
  validateEnv();
  const port = Number(process.env.PORT) || 5000;
  await connectDB();
  server = app.listen(port, () => console.log(`SocialSphere API running on http://localhost:${port}`));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} catch (error) {
  console.error(`Server startup failed: ${error.message}`);
  process.exit(1);
}
