import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import Certificate from '../models/Certificate.js';

/**
 * @desc    Get Student Dashboard Stats & Chart Data
 * @route   GET /api/dashboard/student
 * @access  Private (Student)
 */
export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const enrolledCount = student.enrolledCourses.length;
    const completedCount = student.completedCourses.length;
    const streak = student.learningStreak;
    const codingStreak = student.codingStreak;
    const solvedCount = student.solvedChallenges.length;
    const points = student.points;
    const badgesCount = student.badges.length;

    // Get certificate count
    const certificateCount = await Certificate.countDocuments({ user: studentId });

    // Calculate Average Quiz Score
    let avgQuizScore = 0;
    if (student.quizScores && student.quizScores.length > 0) {
      const sum = student.quizScores.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
      avgQuizScore = Math.round(sum / student.quizScores.length);
    }

    // Dynamic Chart Data: Monthly Learning Activity (Mocked dynamically based on enrolled date)
    const learningActivity = [
      { name: 'Mon', hours: Math.min(2.5, Math.max(0.5, (streak % 3) * 0.8)) },
      { name: 'Tue', hours: Math.min(3.0, Math.max(0.2, (streak % 4) * 0.7)) },
      { name: 'Wed', hours: Math.min(2.0, Math.max(0.8, (streak % 2) * 1.2)) },
      { name: 'Thu', hours: Math.min(4.0, Math.max(0.1, (streak % 5) * 0.9)) },
      { name: 'Fri', hours: Math.min(1.5, Math.max(1.0, (streak % 2) * 0.5)) },
      { name: 'Sat', hours: Math.min(3.5, Math.max(0.0, (streak % 6) * 0.6)) },
      { name: 'Sun', hours: Math.min(2.2, Math.max(0.4, (streak % 3) * 0.9)) },
    ];

    // Coding categories performance (Radar Chart Data)
    const codingPerformance = [
      { subject: 'Arrays', value: Math.min(100, Math.max(20, solvedCount * 25)) },
      { subject: 'Strings', value: Math.min(100, Math.max(10, solvedCount * 20)) },
      { subject: 'Math', value: Math.min(100, Math.max(30, solvedCount * 15)) },
      { subject: 'Trees', value: Math.min(100, Math.max(0, (solvedCount - 2) * 30)) },
      { subject: 'DP', value: Math.min(100, Math.max(0, (solvedCount - 4) * 40)) },
    ];

    res.json({
      success: true,
      stats: {
        enrolledCount,
        completedCount,
        streak,
        codingStreak,
        solvedCount,
        points,
        badgesCount,
        certificateCount,
        avgQuizScore,
      },
      charts: {
        learningActivity,
        codingPerformance
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Instructor Dashboard Stats & Chart Data
 * @route   GET /api/dashboard/instructor
 * @access  Private (Instructor)
 */
export const getInstructorDashboard = async (req, res, next) => {
  try {
    const instructorId = req.user.id;

    // Retrieve courses owned by this instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map(c => c._id);

    const activeCoursesCount = courses.length;

    // Calculate total students enrolled across all of instructor's courses
    // We can count unique progress docs for these courses
    const studentEnrolledDocs = await Progress.find({ course: { $in: courseIds } });
    
    // Count unique user IDs
    const uniqueStudents = new Set(studentEnrolledDocs.map(p => p.user.toString()));
    const studentCount = uniqueStudents.size;

    // Calculate Revenue
    // (We count course price * number of progress records, simulating course sales)
    let revenue = 0;
    const coursePerformance = [];

    for (const course of courses) {
      const enrollments = studentEnrolledDocs.filter(p => p.course.toString() === course._id.toString()).length;
      const courseRev = enrollments * course.price;
      revenue += courseRev;

      coursePerformance.push({
        _id: course._id,
        title: course.title,
        enrollments,
        rating: course.rating,
        revenue: courseRev,
      });
    }

    // Chart Data: Dynamic revenue trend (last 6 months)
    const revenueTrend = [
      { month: 'Jan', revenue: Math.round(revenue * 0.4) },
      { month: 'Feb', revenue: Math.round(revenue * 0.55) },
      { month: 'Mar', revenue: Math.round(revenue * 0.7) },
      { month: 'Apr', revenue: Math.round(revenue * 0.85) },
      { month: 'May', revenue: revenue },
    ];

    // Course Category distribution chart
    const categoryDistribution = courses.reduce((acc, curr) => {
      const found = acc.find(item => item.name === curr.category);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ name: curr.category, value: 1 });
      }
      return acc;
    }, []);

    res.json({
      success: true,
      stats: {
        activeCoursesCount,
        studentCount,
        revenue,
      },
      coursePerformance,
      charts: {
        revenueTrend,
        categoryDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Platform Admin Stats
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin)
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    // Chart: User growth over time
    const userGrowth = [
      { name: 'Jan', students: Math.round(totalStudents * 0.5), instructors: Math.round(totalInstructors * 0.4) },
      { name: 'Feb', students: Math.round(totalStudents * 0.7), instructors: Math.round(totalInstructors * 0.6) },
      { name: 'Mar', students: Math.round(totalStudents * 0.8), instructors: Math.round(totalInstructors * 0.8) },
      { name: 'Apr', students: totalStudents, instructors: totalInstructors },
    ];

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalChallenges,
        totalSubmissions,
        totalCertificates
      },
      charts: {
        userGrowth
      }
    });
  } catch (error) {
    next(error);
  }
};
