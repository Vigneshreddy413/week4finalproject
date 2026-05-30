import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

/**
 * @desc    Get quiz details (without showing correct answers directly in questions)
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Strip out correct answers to prevent cheating
    const safeQuestions = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        course: quiz.course,
        timeLimit: quiz.timeLimit,
        passingPercentage: quiz.passingPercentage,
        questions: safeQuestions,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit quiz answers and score results
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of selected option indices corresponding to questions array
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const totalQuestions = quiz.questions.length;
    let score = 0;
    const review = [];

    quiz.questions.forEach((q, idx) => {
      const selectedOption = answers[idx];
      const isCorrect = selectedOption === q.correctOption;

      if (isCorrect) {
        score += 1;
      }

      review.push({
        questionText: q.questionText,
        options: q.options,
        selectedOption,
        correctOption: q.correctOption,
        isCorrect,
        explanation: q.explanation
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= quiz.passingPercentage;

    // Log the quiz score in user profile
    const user = await User.findById(req.user.id);
    user.quizScores.push({
      quizId,
      score,
      totalQuestions,
      percentage
    });

    // Check for "Quiz Master" badge if score is 100%
    if (percentage === 100) {
      const alreadyHasBadge = user.badges.some(b => b.title === 'Quiz Master');
      if (!alreadyHasBadge) {
        user.badges.push({
          title: 'Quiz Master',
          description: 'Achieved a perfect score of 100% on a course quiz.',
          icon: 'BookOpen',
        });
      }
    }

    await user.save();

    res.json({
      success: true,
      results: {
        score,
        totalQuestions,
        percentage,
        passed,
        review
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a quiz (Instructor only)
 * @route   POST /api/quizzes
 * @access  Private (Instructor/Admin)
 */
export const createQuiz = async (req, res, next) => {
  try {
    const { title, courseId, questions, timeLimit, passingPercentage } = req.body;
    
    const quiz = await Quiz.create({
      title,
      course: courseId,
      questions,
      timeLimit,
      passingPercentage
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};
