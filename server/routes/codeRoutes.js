const express = require('express');
const router = express.Router();
const {
  saveCode,
  getMySnippets,
  getSnippet,
  getSharedSnippet,
  deleteSnippet
} = require('../controllers/codeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/share/:token', getSharedSnippet);

// Private routes
router.post('/save', protect, saveCode);
router.get('/mine', protect, getMySnippets);
router.get('/snippet/:id', protect, getSnippet);
router.delete('/:id', protect, deleteSnippet);

module.exports = router;
