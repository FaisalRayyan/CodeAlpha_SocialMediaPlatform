import mongoose from 'mongoose';
import Media from '../models/Media.js';

export async function saveUpload(file, owner, kind) {
  if (!file) return '';
  const media = await Media.create({
    owner,
    kind,
    filename: file.originalname || 'image',
    contentType: file.mimetype,
    size: file.size,
    data: file.buffer,
  });
  return `/api/media/${media._id}`;
}

export async function removeUpload(publicPath) {
  if (!publicPath) return;
  const id = String(publicPath).split('/').pop();
  if (!mongoose.isValidObjectId(id)) return;
  await Media.findByIdAndDelete(id).catch(() => {});
}
