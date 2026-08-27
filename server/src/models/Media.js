import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    kind: { type: String, enum: ['avatar', 'post'], required: true },
    filename: { type: String, default: 'image' },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true, select: false },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
