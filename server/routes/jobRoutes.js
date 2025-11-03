const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  getCompanyJobs
} = require('../controllers/jobController');
const {
  applyForJob,
  getJobApplicants
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJob);

// Student routes
router.post('/:id/apply', protect, authorize('student'), applyForJob);

// Company routes
router.post('/', protect, authorize('company'), createJob);
router.get('/company/my-jobs', protect, authorize('company'), getCompanyJobs);
router.patch('/:id', protect, authorize('company'), updateJob);
router.delete('/:id', protect, authorize('company', 'admin'), deleteJob);
router.get('/:id/applicants', protect, authorize('company'), getJobApplicants);

module.exports = router;
