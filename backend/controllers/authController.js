import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'eduai_jwt_secret_key_12345', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user (student or instructor)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user (password hashing is done in User pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    });

    if (user) {
      // Award introductory badge for students
      if (user.role === 'student') {
        user.badges.push({
          title: 'SynapseAI Explorer',
          description: 'Joined the SynapseAI platform and began their coding journey.',
          icon: 'Sparkles',
        });
        await user.save();
      }

      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatar: user.avatar,
          learningStreak: user.learningStreak,
          codingStreak: user.codingStreak,
          badges: user.badges,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Gamification Streak System
    if (user.role === 'student') {
      const now = new Date();
      const lastActive = new Date(user.lastActiveDate);

      // Reset hours, minutes, seconds, ms to check date equality
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const activeDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

      if (activeDate.getTime() === yesterday.getTime()) {
        // Active yesterday, increment streak!
        user.learningStreak += 1;
        user.codingStreak += 1;
        
        // Award badge for 7-day streak
        if (user.learningStreak === 7) {
          user.badges.push({
            title: 'Weekly Warrior',
            description: 'Maintained a 7-day learning streak.',
            icon: 'Flame',
          });
        }
      } else if (activeDate.getTime() < yesterday.getTime()) {
        // Streak broken, reset to 1
        user.learningStreak = 1;
        user.codingStreak = 1;
      }
      
      user.lastActiveDate = now;
      await user.save();
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        learningStreak: user.learningStreak,
        codingStreak: user.codingStreak,
        badges: user.badges,
        enrolledCourses: user.enrolledCourses,
        completedCourses: user.completedCourses,
        solvedChallenges: user.solvedChallenges,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses')
      .populate('completedCourses')
      .populate('solvedChallenges');
      
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          learningStreak: updatedUser.learningStreak,
          codingStreak: updatedUser.codingStreak,
          badges: updatedUser.badges,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};
