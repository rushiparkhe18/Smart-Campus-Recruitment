const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ForumPost = require('../models/ForumPost');
const AptitudeTest = require('../models/AptitudeTest');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        students: await User.countDocuments({ role: 'student' }),
        companies: await User.countDocuments({ role: 'company' }),
        pendingApproval: await User.countDocuments({ role: 'company', isApproved: false })
      },
      jobs: {
        total: await Job.countDocuments(),
        active: await Job.countDocuments({ isActive: true }),
        inactive: await Job.countDocuments({ isActive: false })
      },
      applications: {
        total: await Application.countDocuments(),
        applied: await Application.countDocuments({ status: 'applied' }),
        shortlisted: await Application.countDocuments({ status: 'shortlisted' }),
        selected: await Application.countDocuments({ status: 'selected' }),
        rejected: await Application.countDocuments({ status: 'rejected' })
      },
      forum: {
        totalPosts: await ForumPost.countDocuments({ isDeleted: false }),
        reportedPosts: await ForumPost.countDocuments({ isReported: true })
      },
      tests: {
        total: await AptitudeTest.countDocuments()
      }
    };

    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, isApproved, isActive, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        users,
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

// @desc    Approve company
// @route   PATCH /api/admin/users/:id/approve
// @access  Private (Admin)
const approveCompany = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.role !== 'company') {
      return res.status(400).json({
        status: 'error',
        message: 'Only companies can be approved'
      });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Company approved successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Ban/unban user
// @route   PATCH /api/admin/users/:id/ban
// @access  Private (Admin)
const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot ban admin users'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: user.isActive ? 'User activated' : 'User banned',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get reported forum posts
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getReports = async (req, res) => {
  try {
    const posts = await ForumPost.find({ isReported: true, isDeleted: false })
      .populate('author', 'name email')
      .populate('reports.user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { posts, count: posts.length }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete reported post
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin)
const deleteReportedPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
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

// @desc    Get all jobs (admin moderation)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .populate('company', 'name email companyProfile')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Job.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        jobs,
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

module.exports = {
  getStats,
  getAllUsers,
  approveCompany,
  toggleBanUser,
  getReports,
  deleteReportedPost,
  getAllJobs
};
