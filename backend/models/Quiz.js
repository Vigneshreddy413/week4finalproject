import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctOption: {
    type: Number, // Index (0 to 3)
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  questions: [QuestionSchema],
  timeLimit: {
    type: Number, // In minutes
    default: 10,
  },
  passingPercentage: {
    type: Number,
    default: 70, // 70% passing threshold
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
export default Quiz;
