const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  skills: [{
    type: String,
    required: true
  }],
  jobType: {
    type: String,
    enum: ['Full-Time', 'Internship', 'Part-Time'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  salary: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    }
  },
  eligibility: {
    minCGPA: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    departments: [{
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER', 'ALL']
    }],
    batches: [{
      type: Number
    }]
  },
  deadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  aptitudeTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeTest'
  }
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ company: 1, isActive: 1 });
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ 'eligibility.departments': 1 });
jobSchema.index({ 'eligibility.batches': 1 });
jobSchema.index({ deadline: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
