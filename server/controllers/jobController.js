const Job = require('../models/Job');
const User = require('../models/User');
const { jobValidation } = require('../utils/validation');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Company)
const createJob = async (req, res) => {
  try {
    // Validate input
    const { error } = jobValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const jobData = {
      ...req.body,
      company: req.user.id
    };

    const job = await Job.create(jobData);
    await job.populate('company', 'name email companyProfile');

    res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      location,
      department,
      batch,
      minCGPA,
      workMode,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true, deadline: { $gte: new Date() } };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (jobType) query.jobType = jobType;
    if (location) query.location = new RegExp(location, 'i');
    if (workMode) query.workMode = workMode;
    if (department) query['eligibility.departments'] = department;
    if (batch) query['eligibility.batches'] = parseInt(batch);
    if (minCGPA) query['eligibility.minCGPA'] = { $lte: parseFloat(minCGPA) };

    // Pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('company', 'name companyProfile.companyName companyProfile.logo')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Job.countDocuments(query);

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

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name email companyProfile');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update job
// @route   PATCH /api/jobs/:id
// @access  Private (Company)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'name companyProfile');

    res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Company/Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check ownership (company) or admin
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get jobs by company
// @route   GET /api/jobs/company/my-jobs
// @access  Private (Company)
const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id })
      .sort('-createdAt')
      .populate('company', 'name companyProfile');

    res.status(200).json({
      status: 'success',
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  getCompanyJobs
};
