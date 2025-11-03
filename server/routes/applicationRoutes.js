const express = require('express');
const router = express.Router();
const {
  getMyApplications,
  getCompanyApplications,
  updateApplicationStatus,
  bulkUpdateApplications
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student routes
router.get('/', protect, authorize('student'), getMyApplications);

// Company routes
router.get('/company/all', protect, authorize('company'), getCompanyApplications);
router.patch('/:id/status', protect, authorize('company'), updateApplicationStatus);
router.post('/bulk-update', protect, authorize('company'), bulkUpdateApplications);

module.exports = router;
