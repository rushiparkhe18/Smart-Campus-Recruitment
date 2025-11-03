const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'company', 'admin'],
    default: 'student'
  },
  isApproved: {
    type: Boolean,
    default: true  // Auto-approve all users (companies included)
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Student Profile
  studentProfile: {
    rollNumber: String,
    department: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']
    },
    batch: {
      type: Number,
      min: 2020,
      max: 2030
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10
    },
    phone: String,
    address: String,
    skills: [String],
    education: [{
      degree: String,
      institution: String,
      year: Number,
      percentage: Number
    }],
    projects: [{
      title: String,
      description: String,
      link: String,
      technologies: [String]
    }],
    resumeUrl: String,
    resumeFileName: String,
    savedJobs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    }]
  },
  
  // Company Profile
  companyProfile: {
    companyName: String,
    industry: String,
    website: String,
    logo: String,
    about: String,
    location: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    founded: Number
  },
  
  // Auth tokens
  refreshToken: String,
  passwordResetOTP: String,
  passwordResetExpires: Date,
  
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.passwordResetOTP;
  delete user.passwordResetExpires;
  return user;
};

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isApproved: 1 });
userSchema.index({ 'studentProfile.department': 1, 'studentProfile.batch': 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
