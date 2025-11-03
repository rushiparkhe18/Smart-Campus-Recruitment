const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeTest',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  answers: [{
    questionIndex: Number,
    selectedOption: Number
  }],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  submitTime: {
    type: Date,
    required: true
  },
  timeTaken: {
    type: Number // in seconds
  }
}, {
  timestamps: true
});

testResultSchema.index({ test: 1, student: 1 }, { unique: true });
testResultSchema.index({ student: 1 });

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
