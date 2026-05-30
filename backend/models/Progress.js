import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
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
  completedLessons: [{
    type: String, // Stored as lesson ID string
  }],
  bookmarkedLessons: [{
    type: String, // Stored as lesson ID string
  }],
  lastAccessedLesson: {
    type: String,
  },
  progressPercentage: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the timestamp on save
ProgressSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Progress = mongoose.model('Progress', ProgressSchema);
export default Progress;
