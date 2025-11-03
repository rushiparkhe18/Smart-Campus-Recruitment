const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;
    const studentId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if job is still active
    if (!job.isActive || new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Job application deadline has passed'
      });
    }

    // Check eligibility
    const student = await User.findById(studentId);
    const studentProfile = student.studentProfile;

    if (studentProfile.cgpa < job.eligibility.minCGPA) {
      return res.status(400).json({
        status: 'error',
        message: `Minimum CGPA requirement is ${job.eligibility.minCGPA}`
      });
    }

    if (job.eligibility.departments.length > 0 && 
        !job.eligibility.departments.includes(studentProfile.department) &&
        !job.eligibility.departments.includes('ALL')) {
      return res.status(400).json({
        status: 'error',
        message: 'Your department is not eligible for this job'
      });
    }

    if (job.eligibility.batches.length > 0 && 
        !job.eligibility.batches.includes(studentProfile.batch)) {
      return res.status(400).json({
        status: 'error',
        message: 'Your batch is not eligible for this job'
      });
    }

    // Check if resume is uploaded
    if (!studentProfile.resumeUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload your resume before applying'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: studentId
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      student: studentId,
      resumeUrl: studentProfile.resumeUrl,
      resumeFileName: studentProfile.resumeFileName,
      coverLetter,
      timeline: [{
        status: 'applied',
        timestamp: new Date(),
        note: 'Application submitted'
      }]
    });

    // Update job applications count
    job.applicationsCount += 1;
    await job.save();

    // Create notification for company
    await Notification.create({
      user: job.company,
      type: 'application',
      title: 'New Application',
      message: `${student.name} applied for ${job.title}`,
      link: `/company/applicants/${jobId}`
    });

    await application.populate('job', 'title company');

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get student's applications
// @route   GET /api/applications
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title company jobType location deadline')
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name companyProfile.companyName companyProfile.logo'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { applications, count: applications.length }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get applicants for a job
// @route   GET /api/jobs/:id/applicants
// @access  Private (Company)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

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
        message: 'Not authorized'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const query = { job: req.params.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const applicants = await Application.find(query)
      .populate('student', 'name email studentProfile')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Application.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        applicants,
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

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note, interviewDate, interviewMode, interviewLink, rejectionReason } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    // Check ownership
    if (application.job.company.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    application.status = status;
    
    if (interviewDate) application.interviewDate = interviewDate;
    if (interviewMode) application.interviewMode = interviewMode;
    if (interviewLink) application.interviewLink = interviewLink;
    if (rejectionReason) application.rejectionReason = rejectionReason;

    application.timeline.push({
      status,
      timestamp: new Date(),
      note: note || status
    });

    await application.save();

    // Create notification for student
    const notificationMessages = {
      'shortlisted': 'Congratulations! You have been shortlisted',
      'test-scheduled': 'Aptitude test has been scheduled',
      'interview-scheduled': 'Interview has been scheduled',
      'selected': '🎉 Congratulations! You have been selected',
      'rejected': 'Application status updated'
    };

    await Notification.create({
      user: application.student,
      type: 'application',
      title: 'Application Update',
      message: `${application.job.title}: ${notificationMessages[status]}`,
      link: `/student/applications`
    });

    res.status(200).json({
      status: 'success',
      message: 'Application status updated',
      data: { application }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Bulk update applications
// @route   POST /api/applications/bulk-update
// @access  Private (Company)
const bulkUpdateApplications = async (req, res) => {
  try {
    const { applicationIds, status, note } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds)) {
      return res.status(400).json({
        status: 'error',
        message: 'Application IDs array is required'
      });
    }

    const applications = await Application.find({
      _id: { $in: applicationIds }
    }).populate('job');

    // Verify ownership
    const unauthorized = applications.some(
      app => app.job.company.toString() !== req.user.id
    );

    if (unauthorized) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update some applications'
      });
    }

    // Update applications
    const updatePromises = applications.map(async (app) => {
      app.status = status;
      app.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Bulk update to ${status}`
      });
      return app.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      status: 'success',
      message: `${applicationIds.length} applications updated successfully`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get all applications for company's jobs
// @route   GET /api/applications/company/all
// @access  Private (Company)
const getCompanyApplications = async (req, res) => {
  try {
    // Get all jobs posted by this company
    const companyJobs = await Job.find({ company: req.user.id }).select('_id');
    const jobIds = companyJobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('student', 'name email studentProfile')
      .populate('job', 'title jobType location')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  getCompanyApplications,
  updateApplicationStatus,
  bulkUpdateApplications
};
