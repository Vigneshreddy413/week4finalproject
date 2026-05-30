import mongoose from 'mongoose';
import crypto from 'crypto';

const CertificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  instructorName: {
    type: String,
    required: true,
  },
  certificateHash: {
    type: String,
    unique: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  }
});

// Auto-generate a secure random hash for verification prior to saving
CertificateSchema.pre('save', function(next) {
  if (!this.certificateHash) {
    this.certificateHash = crypto.randomBytes(16).toString('hex').toUpperCase();
  }
  next();
});

const Certificate = mongoose.model('Certificate', CertificateSchema);
export default Certificate;
