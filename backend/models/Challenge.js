import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  isSample: {
    type: Boolean,
    default: false,
  }
});

const TemplateSchema = new mongoose.Schema({
  javascript: {
    type: String,
    default: '',
  },
  python: {
    type: String,
    default: '',
  },
  java: {
    type: String,
    default: '',
  },
  cpp: {
    type: String,
    default: '',
  }
});

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a challenge title'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a challenge description'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  category: {
    type: String,
    required: [true, 'Please specify a category (e.g. Arrays, Strings, dynamic programming)'],
  },
  points: {
    type: Number,
    default: 10,
  },
  constraints: [{
    type: String,
  }],
  templates: {
    type: TemplateSchema,
    required: true,
  },
  testCases: [TestCaseSchema],
  acceptedCount: {
    type: Number,
    default: 0,
  },
  submissionCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);
export default Challenge;
