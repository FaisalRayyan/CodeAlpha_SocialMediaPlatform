import multer from 'multer';

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : err.message;
    return res.status(400).json({ message });
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return res.status(409).json({ message: `${field[0].toUpperCase()}${field.slice(1)} is already in use.` });
  }

  const status = err.status || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  return res.status(status).json({ message: err.message || 'Internal server error.' });
}
