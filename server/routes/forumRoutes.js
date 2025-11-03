const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPost,
  addComment,
  upvotePost,
  downvotePost,
  bookmarkPost,
  reportPost,
  deletePost
} = require('../controllers/forumController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/posts', getAllPosts);
router.get('/post/:id', getPost);

// Private routes
router.post('/post', protect, createPost);
router.post('/post/:id/comment', protect, addComment);
router.post('/post/:id/upvote', protect, upvotePost);
router.post('/post/:id/downvote', protect, downvotePost);
router.post('/post/:id/bookmark', protect, bookmarkPost);
router.post('/post/:id/report', protect, reportPost);
router.delete('/post/:id', protect, deletePost);

module.exports = router;
