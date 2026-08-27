import multer from 'multer';

function fileFilter(_req, file, cb) {
  const allowed = /^image\/(jpeg|png|webp|gif)$/;
  if (allowed.test(file.mimetype)) return cb(null, true);
  return cb(Object.assign(new Error('Only JPG, PNG, WEBP or GIF images are allowed.'), { status: 400 }));
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});
