const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getProfile,
  updateProfile,
  uploadResume,
  getSavedJobs,
  toggleSaveJob
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// All routes are private
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Student routes
router.post('/upload-resume', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/saved-jobs', protect, authorize('student'), getSavedJobs);
router.post('/save-job/:jobId', protect, authorize('student'), toggleSaveJob);

module.exports = router;
