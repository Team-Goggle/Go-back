import mongoose from 'mongoose';

const SgfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Sgf || mongoose.model('Sgf', SgfSchema);