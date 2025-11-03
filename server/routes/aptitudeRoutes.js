const express = require('express');
const router = express.Router();
const {
  createTest,
  getCompanyTests,
  deleteTest,
  getAvailableTests,
  startTest,
  submitTest,
  getMyResults,
  getTestResults
} = require('../controllers/aptitudeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Company routes
router.post('/create', protect, authorize('company'), createTest);
router.get('/company', protect, authorize('company'), getCompanyTests);
router.delete('/:id', protect, authorize('company'), deleteTest);
router.get('/:id/results', protect, authorize('company'), getTestResults);

// Student routes
router.get('/available', protect, authorize('student'), getAvailableTests);
router.get('/:id/start', protect, authorize('student'), startTest);
router.post('/:id/submit', protect, authorize('student'), submitTest);
router.get('/results', protect, authorize('student'), getMyResults);

module.exports = router;
