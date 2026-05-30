import express from 'express';
import {
  doubtAssistant,
  codeMentor,
  quizGenerator,
  learningRecommender
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/doubt', protect, doubtAssistant);
router.post('/mentor', protect, codeMentor);
router.post('/quiz-generate', protect, authorize('instructor', 'admin'), quizGenerator);
router.get('/recommendations', protect, learningRecommender);

export default router;
