import mongoose from 'mongoose';

export async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 12_000 });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
}
