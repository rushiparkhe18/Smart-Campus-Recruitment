const ForumPost = require('../models/ForumPost');

// @desc    Create forum post
// @route   POST /api/forum/post
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const post = await ForumPost.create({
      author: req.user.id,
      title,
      content,
      tags
    });

    await post.populate('author', 'name studentProfile.department studentProfile.batch');

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all forum posts
// @route   GET /api/forum/posts
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const { tag, search, sort = '-upvoteCount', page = 1, limit = 20 } = req.query;

    const query = { isDeleted: false };

    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    const posts = await ForumPost.find(query)
      .populate('author', 'name role studentProfile.department companyProfile.companyName')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ForumPost.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/forum/post/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name role studentProfile companyProfile')
      .populate('comments.author', 'name role');

    if (!post || post.isDeleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/forum/post/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.comments.push({
      author: req.user.id,
      content
    });

    post.commentsCount = post.comments.length;
    await post.save();

    await post.populate('comments.author', 'name role');

    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Upvote post
// @route   POST /api/forum/post/:id/upvote
// @access  Private
const upvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const userId = req.user.id;

    // Remove from downvotes if exists
    post.downvotes = post.downvotes.filter(id => id.toString() !== userId);

    // Toggle upvote
    const upvoteIndex = post.upvotes.indexOf(userId);
    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
    } else {
      post.upvotes.push(userId);
    }

    post.upvoteCount = post.upvotes.length;
    await post.save();

    res.status(200).json({
      status: 'success',
      data: { upvoteCount: post.upvoteCount }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Downvote post
// @route   POST /api/forum/post/:id/downvote
// @access  Private
const downvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const userId = req.user.id;

    // Remove from upvotes if exists
    const upvoteIndex = post.upvotes.indexOf(userId);
    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
      post.upvoteCount = post.upvotes.length;
    }

    // Toggle downvote
    const downvoteIndex = post.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      post.downvotes.splice(downvoteIndex, 1);
    } else {
      post.downvotes.push(userId);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      data: { upvoteCount: post.upvoteCount }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Bookmark post
// @route   POST /api/forum/post/:id/bookmark
// @access  Private
const bookmarkPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const userId = req.user.id;
    const bookmarkIndex = post.bookmarkedBy.indexOf(userId);

    if (bookmarkIndex > -1) {
      post.bookmarkedBy.splice(bookmarkIndex, 1);
    } else {
      post.bookmarkedBy.push(userId);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      message: bookmarkIndex > -1 ? 'Bookmark removed' : 'Post bookmarked'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Report post
// @route   POST /api/forum/post/:id/report
// @access  Private
const reportPost = async (req, res) => {
  try {
    const { reason } = req.body;

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.reports.push({
      user: req.user.id,
      reason
    });

    post.isReported = true;
    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/forum/post/:id
// @access  Private (Author/Admin)
const deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  addComment,
  upvotePost,
  downvotePost,
  bookmarkPost,
  reportPost,
  deletePost
};
