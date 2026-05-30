import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'text'],
    default: 'video',
  },
  contentUrl: {
    type: String, // Cloudinary video URL, local path, or text content
    required: true,
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  isFreePreview: {
    type: Boolean,
    default: false,
  }
});

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  lessons: [LessonSchema],
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please specify a course category'],
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  price: {
    type: Number,
    default: 0, // 0 means free
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
