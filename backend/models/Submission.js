import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp'],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Compile Error', 'Runtime Error', 'Time Limit Exceeded'],
    required: true,
  },
  runtime: {
    type: Number, // In milliseconds
    default: 0,
  },
  failedTestCase: {
    input: String,
    expected: String,
    actual: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Submission = mongoose.model('Submission', SubmissionSchema);
export default Submission;
