import express from 'express';
import { getMyCertificates, getCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyCertificates);
router.get('/verify/:hash', verifyCertificate); // Public Route
router.get('/:id', protect, getCertificate);

export default router;
