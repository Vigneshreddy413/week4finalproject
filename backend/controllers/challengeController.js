import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { executeCode } from '../utils/codeExecutor.js';

/**
 * @desc    Get all coding challenges
 * @route   GET /api/challenges
 * @access  Public
 */
export const getChallenges = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const challenges = await Challenge.find(query).select('title difficulty category points acceptedCount submissionCount');
    res.json({ success: true, count: challenges.length, challenges });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single challenge detail (with code templates)
 * @route   GET /api/challenges/:id
 * @access  Public
 */
export const getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.json({ success: true, challenge });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a coding challenge (Admin/Instructor only)
 * @route   POST /api/challenges
 * @access  Private (Admin/Instructor)
 */
export const createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json({ success: true, challenge });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit challenge solution & execute tests
 * @route   POST /api/challenges/:id/submit
 * @access  Private
 */
export const submitChallenge = async (req, res, next) => {
  try {
    const { language, code } = req.body;
    const challengeId = req.params.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Update submission count
    challenge.submissionCount += 1;

    // Run sandboxed code executor against all test cases
    const result = await executeCode(language, code, challenge.testCases);

    let submissionStatus = result.status;
    let failedTestCase = result.failedTestCase || null;
    let runtime = result.runtime || 0;

    // Create a Submission record
    const submission = await Submission.create({
      user: req.user.id,
      challenge: challengeId,
      language,
      code,
      status: submissionStatus,
      runtime,
      failedTestCase
    });

    if (submissionStatus === 'Accepted') {
      challenge.acceptedCount += 1;

      // Update user stats
      const user = await User.findById(req.user.id);
      
      // If first time solving this challenge
      if (!user.solvedChallenges.includes(challengeId)) {
        user.solvedChallenges.push(challengeId);
        user.points += challenge.points;

        // Gamification awards based on solved count
        if (user.solvedChallenges.length === 1) {
          user.badges.push({
            title: 'Code Ninja',
            description: 'Successfully solved your first programming challenge on EduAI.',
            icon: 'Terminal',
          });
        } else if (user.solvedChallenges.length === 5) {
          user.badges.push({
            title: 'Algo Guru',
            description: 'Solved 5 programming challenges.',
            icon: 'Zap',
          });
        }
        
        await user.save();
      }
    }

    await challenge.save();

    res.json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user leaderboard
 * @route   GET /api/challenges/leaderboard
 * @access  Public
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find({ role: 'student' })
      .select('name avatar points solvedChallenges learningStreak')
      .sort({ points: -1 })
      .limit(10);

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};
