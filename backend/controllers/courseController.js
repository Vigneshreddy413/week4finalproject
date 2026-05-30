import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';

/**
 * @desc    Get all courses with optional search and filters
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res, next) => {
  try {
    const { search, category, difficulty } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const courses = await Course.find(query).populate('instructor', 'name avatar');
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate({
        path: 'modules.quiz',
        select: 'title timeLimit passingPercentage questions.questionText'
      });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new course (Instructor only)
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin)
 */
export const createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user.id;
    const course = await Course.create(req.body);

    // Update active courses count for instructor
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'instructorStats.activeCoursesCount': 1 }
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update course (Instructor only)
 * @route   PUT /api/courses/:id
 * @access  Private (Instructor/Admin)
 */
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete course (Instructor only)
 * @route   DELETE /api/courses/:id
 * @access  Private (Instructor/Admin)
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Decrement instructor active count
    await User.findByIdAndUpdate(course.instructor, {
      $inc: { 'instructorStats.activeCoursesCount': -1 }
    });

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enroll in course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Student)
 */
export const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const student = await User.findById(req.user.id);

    // Check if already enrolled
    if (student.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Enroll student
    student.enrolledCourses.push(course._id);
    await student.save();

    // Create a Progress document
    await Progress.create({
      user: student._id,
      course: course._id,
      completedLessons: [],
      bookmarkedLessons: [],
      progressPercentage: 0,
    });

    // Update instructor analytics (studentCount)
    await User.findByIdAndUpdate(course.instructor, {
      $inc: { 'instructorStats.studentCount': 1 }
    });

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get course progress tracker
 * @route   GET /api/courses/:id/progress
 * @access  Private
 */
export const getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.id,
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found. Please enroll first.' });
    }

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a lesson as complete / incomplete & toggle bookmarks
 * @route   POST /api/courses/:id/lessons/:lessonId
 * @access  Private
 */
export const updateLessonProgress = async (req, res, next) => {
  try {
    const { action } = req.body; // 'complete', 'incomplete', 'bookmark', 'unbookmark', 'access'
    const { id: courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    // Count total lessons
    let totalLessons = 0;
    course.modules.forEach(mod => {
      totalLessons += mod.lessons.length;
    });

    if (totalLessons === 0) totalLessons = 1; // Prevent division by zero

    if (action === 'complete') {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
    } else if (action === 'incomplete') {
      progress.completedLessons = progress.completedLessons.filter(id => id !== lessonId);
    } else if (action === 'bookmark') {
      if (!progress.bookmarkedLessons.includes(lessonId)) {
        progress.bookmarkedLessons.push(lessonId);
      }
    } else if (action === 'unbookmark') {
      progress.bookmarkedLessons = progress.bookmarkedLessons.filter(id => id !== lessonId);
    } else if (action === 'access') {
      progress.lastAccessedLesson = lessonId;
    }

    // Recalculate completion percentage
    progress.progressPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
    await progress.save();

    // Check if course is 100% completed
    if (progress.progressPercentage === 100) {
      const student = await User.findById(req.user.id);
      if (!student.completedCourses.includes(courseId)) {
        student.completedCourses.push(courseId);
        
        // Award badge for first course completion
        if (student.completedCourses.length === 1) {
          student.badges.push({
            title: 'First Milestone',
            description: `Finished your first SynapseAI course: "${course.title}".`,
            icon: 'Award',
          });
        }
        await student.save();

        // Retrieve instructor name
        const instructorUser = await User.findById(course.instructor);

        // Auto-generate certificate
        await Certificate.create({
          user: req.user.id,
          course: courseId,
          instructorName: instructorUser ? instructorUser.name : 'EduAI Platform',
        });
      }
    }

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};
