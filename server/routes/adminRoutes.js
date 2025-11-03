const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  approveCompany,
  toggleBanUser,
  getReports,
  deleteReportedPost,
  getAllJobs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are admin only
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/approve', approveCompany);
router.patch('/users/:id/ban', toggleBanUser);
router.get('/reports', getReports);
router.delete('/posts/:id', deleteReportedPost);
router.get('/jobs', getAllJobs);

module.exports = router;
