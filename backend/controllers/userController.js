import User from '../models/User.js';
import Forum from '../models/Forum.js';
import Notification from '../models/Notification.js';

// ==========================================
// WISHLIST CONTROLLER
// ==========================================

export const toggleWishlist = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const index = user.wishlist.indexOf(courseId);
    let action = 'added';

    if (index > -1) {
      user.wishlist.splice(index, 1);
      action = 'removed';
    } else {
      user.wishlist.push(courseId);
    }

    await user.save();
    res.json({ success: true, action, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// NOTIFICATIONS CONTROLLER
// ==========================================

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DISCUSSION FORUM CONTROLLER
// ==========================================

export const getForumThreads = async (req, res, next) => {
  try {
    const threads = await Forum.find({ course: req.params.courseId })
      .populate('user', 'name avatar role')
      .populate('replies.user', 'name avatar role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: threads.length, threads });
  } catch (error) {
    next(error);
  }
};

export const createForumThread = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const courseId = req.params.courseId;

    const thread = await Forum.create({
      course: courseId,
      user: req.user.id,
      title,
      content,
      replies: [],
      upvotes: [],
    });

    const populated = await Forum.findById(thread._id).populate('user', 'name avatar role');

    res.status(201).json({ success: true, thread: populated });
  } catch (error) {
    next(error);
  }
};

export const replyToThread = async (req, res, next) => {
  try {
    const { content } = req.body;
    const thread = await Forum.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Discussion thread not found' });
    }

    thread.replies.push({
      user: req.user.id,
      content,
    });

    await thread.save();

    const updated = await Forum.findById(thread._id)
      .populate('user', 'name avatar role')
      .populate('replies.user', 'name avatar role');

    res.json({ success: true, thread: updated });
  } catch (error) {
    next(error);
  }
};

export const upvoteThread = async (req, res, next) => {
  try {
    const thread = await Forum.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Thread not found' });
    }

    const index = thread.upvotes.indexOf(req.user.id);
    if (index > -1) {
      thread.upvotes.splice(index, 1);
    } else {
      thread.upvotes.push(req.user.id);
    }

    await thread.save();
    res.json({ success: true, upvotes: thread.upvotes });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN WORKFLOWS
// ==========================================

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
