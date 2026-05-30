import express from 'express';
import {
  getStudentDashboard,
  getInstructorDashboard,
  getAdminDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student', protect, authorize('student', 'admin'), getStudentDashboard);
router.get('/instructor', protect, authorize('instructor', 'admin'), getInstructorDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

export default router;
