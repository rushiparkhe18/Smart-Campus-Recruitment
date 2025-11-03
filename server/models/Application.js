const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  resumeFileName: String,
  coverLetter: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: [
      'applied',
      'shortlisted',
      'test-scheduled',
      'test-completed',
      'interview-scheduled',
      'selected',
      'rejected'
    ],
    default: 'applied'
  },
  testScore: {
    type: Number,
    min: 0,
    max: 100
  },
  testTaken: {
    type: Boolean,
    default: false
  },
  interviewDate: Date,
  interviewMode: {
    type: String,
    enum: ['Online', 'On-site', 'Phone']
  },
  interviewLink: String,
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  rejectionReason: String
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

// Add timeline entry on status change
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
