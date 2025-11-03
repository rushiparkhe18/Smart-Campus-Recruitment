const mongoose = require('mongoose');

const aptitudeTestSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  duration: {
    type: Number,
    required: true,
    min: 5,
    max: 180 // minutes
  },
  passingScore: {
    type: Number,
    default: 60,
    min: 0,
    max: 100
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      validate: [arr => arr.length === 4, 'Must have exactly 4 options']
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    marks: {
      type: Number,
      default: 1
    },
    category: {
      type: String,
      enum: ['Aptitude', 'Logical', 'Technical', 'Verbal', 'Programming']
    }
  }],
  shuffleQuestions: {
    type: Boolean,
    default: true
  },
  shuffleOptions: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attemptsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

aptitudeTestSchema.index({ company: 1, job: 1 });

const AptitudeTest = mongoose.model('AptitudeTest', aptitudeTestSchema);

module.exports = AptitudeTest;
