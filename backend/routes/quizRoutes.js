import express from 'express';
import { getQuiz, submitQuiz, createQuiz } from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, submitQuiz);

export default router;
