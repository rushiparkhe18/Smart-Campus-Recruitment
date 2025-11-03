const User = require('../models/User');
const upload = require('../config/upload');
const { profileUpdateValidation } = require('../utils/validation');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Validate input
    const { error } = profileUpdateValidation(req.body, user.role);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    // Update basic fields
    if (req.body.name) user.name = req.body.name;

    // Update role-specific profile
    if (user.role === 'student') {
      const allowedFields = [
        'rollNumber', 'department', 'batch', 'cgpa',
        'phone', 'address', 'skills', 'education', 'projects'
      ];

      // Handle nested studentProfile or flat fields
      const profileData = req.body.studentProfile || req.body;
      
      allowedFields.forEach(field => {
        if (profileData[field] !== undefined) {
          user.studentProfile[field] = profileData[field];
        }
      });
    } else if (user.role === 'company') {
      const allowedFields = [
        'companyName', 'industry', 'website', 'about', 'location', 'size', 'founded'
      ];

      // Handle nested companyProfile or flat fields
      const profileData = req.body.companyProfile || req.body;

      allowedFields.forEach(field => {
        if (profileData[field] !== undefined) {
          user.companyProfile[field] = profileData[field];
        }
      });
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Upload resume
// @route   POST /api/users/upload-resume
// @access  Private (Student)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a PDF file'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update resume URL in student profile
    user.studentProfile.resumeUrl = `/uploads/${req.file.filename}`;
    user.studentProfile.resumeFileName = req.file.originalname;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Resume uploaded successfully',
      data: {
        resumeUrl: user.studentProfile.resumeUrl,
        fileName: user.studentProfile.resumeFileName
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (Student)
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'studentProfile.savedJobs',
        populate: {
          path: 'company',
          select: 'name companyProfile.companyName companyProfile.logo'
        }
      });

    res.status(200).json({
      status: 'success',
      data: {
        savedJobs: user.studentProfile.savedJobs,
        count: user.studentProfile.savedJobs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Save/unsave job
// @route   POST /api/users/save-job/:jobId
// @access  Private (Student)
const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    const savedJobs = user.studentProfile.savedJobs;
    const jobIndex = savedJobs.indexOf(jobId);

    if (jobIndex > -1) {
      savedJobs.splice(jobIndex, 1);
      await user.save();
      return res.status(200).json({
        status: 'success',
        message: 'Job removed from saved list'
      });
    } else {
      savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({
        status: 'success',
        message: 'Job saved successfully'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getSavedJobs,
  toggleSaveJob
};
