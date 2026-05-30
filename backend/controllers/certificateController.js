import Certificate from '../models/Certificate.js';

/**
 * @desc    Get user's certificates
 * @route   GET /api/certificates
 * @access  Private
 */
export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('course', 'title category thumbnail');
    res.json({ success: true, count: certificates.length, certificates });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single certificate by ID
 * @route   GET /api/certificates/:id
 * @access  Private
 */
export const getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name')
      .populate('course', 'title category description');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Verify ownership
    if (certificate.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this certificate' });
    }

    res.json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify certificate by unique hash (Public Route)
 * @route   GET /api/certificates/verify/:hash
 * @access  Public
 */
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateHash: req.params.hash })
      .populate('user', 'name bio avatar')
      .populate('course', 'title difficulty category');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid certificate hash. This certificate could not be verified.',
      });
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        hash: certificate.certificateHash,
        studentName: certificate.user.name,
        courseTitle: certificate.course.title,
        difficulty: certificate.course.difficulty,
        category: certificate.course.category,
        instructorName: certificate.instructorName,
        issuedAt: certificate.issuedAt,
      }
    });
  } catch (error) {
    next(error);
  }
};
