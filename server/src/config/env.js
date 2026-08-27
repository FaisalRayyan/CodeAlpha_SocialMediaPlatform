const required = ['MONGODB_URI', 'JWT_SECRET'];

export function validateEnv() {
  const missing = required.filter((key) => !String(process.env[key] || '').trim());
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  if (String(process.env.JWT_SECRET).length < 32) throw new Error('JWT_SECRET must be at least 32 characters long.');
  if (!/^mongodb(\+srv)?:\/\//.test(process.env.MONGODB_URI)) throw new Error('MONGODB_URI must be a valid MongoDB connection string.');
}
