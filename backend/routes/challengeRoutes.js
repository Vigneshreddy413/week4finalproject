import express from 'express';
import {
  getChallenges,
  getChallenge,
  createChallenge,
  submitChallenge,
  getLeaderboard
} from '../controllers/challengeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getChallenges)
  .post(protect, authorize('instructor', 'admin'), createChallenge);

router.get('/leaderboard', getLeaderboard);

router.route('/:id')
  .get(getChallenge);

router.post('/:id/submit', protect, submitChallenge);

export default router;
