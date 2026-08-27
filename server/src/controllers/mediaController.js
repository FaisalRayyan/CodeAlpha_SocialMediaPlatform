import mongoose from 'mongoose';
import Media from '../models/Media.js';

export async function getMedia(req, res) {
  if (!mongoose.isValidObjectId(req.params.mediaId)) return res.status(404).end();
  const media = await Media.findById(req.params.mediaId).select('+data');
  if (!media) return res.status(404).end();

  res.set({
    'Content-Type': media.contentType,
    'Content-Length': media.size,
    'Cache-Control': 'public, max-age=86400, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
  return res.send(media.data);
}
