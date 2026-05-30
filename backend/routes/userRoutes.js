import express from 'express';
import {
  toggleWishlist,
  getNotifications,
  markNotificationRead,
  getForumThreads,
  createForumThread,
  replyToThread,
  upvoteThread,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Wishlist
router.post('/wishlist', protect, toggleWishlist);

// Notifications
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id', protect, markNotificationRead);

// Forum / Discussion Boards
router.route('/forum/:courseId')
  .get(protect, getForumThreads)
  .post(protect, createForumThread);

router.post('/forum/reply/:id', protect, replyToThread);
router.post('/forum/upvote/:id', protect, upvoteThread);

// Admin controls
router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.put('/admin/users/:id', protect, authorize('admin'), updateUserRole);
router.delete('/admin/users/:id', protect, authorize('admin'), deleteUser);

export default router;
