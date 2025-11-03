const Joi = require('joi');

// User Registration Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      }),
    role: Joi.string().valid('student', 'company', 'admin').default('student'),
    
    // Student fields
    rollNumber: Joi.when('role', {
      is: 'student',
      then: Joi.string().optional(),
      otherwise: Joi.forbidden()
    }),
    department: Joi.when('role', {
      is: 'student',
      then: Joi.string().valid('CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER').optional(),
      otherwise: Joi.forbidden()
    }),
    batch: Joi.when('role', {
      is: 'student',
      then: Joi.number().min(2020).max(2030).optional(),
      otherwise: Joi.forbidden()
    }),
    cgpa: Joi.when('role', {
      is: 'student',
      then: Joi.number().min(0).max(10).optional(),
      otherwise: Joi.forbidden()
    }),
    
    // Company fields
    companyName: Joi.when('role', {
      is: 'company',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    industry: Joi.when('role', {
      is: 'company',
      then: Joi.string().optional(),
      otherwise: Joi.forbidden()
    }),
    website: Joi.when('role', {
      is: 'company',
      then: Joi.string().uri().optional(),
      otherwise: Joi.forbidden()
    }),
    location: Joi.when('role', {
      is: 'company',
      then: Joi.string().optional(),
      otherwise: Joi.forbidden()
    })
  });

  return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

// Job Creation Validation
const jobValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(20).required(),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    jobType: Joi.string().valid('Full-Time', 'Internship', 'Part-Time').required(),
    location: Joi.string().required(),
    salary: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0)
    }),
    eligibility: Joi.object({
      minCGPA: Joi.number().min(0).max(10).default(0),
      departments: Joi.array().items(Joi.string()),
      batches: Joi.array().items(Joi.number())
    }),
    deadline: Joi.date().greater('now').required()
  });

  return schema.validate(data);
};

// Profile Update Validation
const profileUpdateValidation = (data, role) => {
  if (role === 'student') {
    const schema = Joi.object({
      name: Joi.string().min(2).max(50),
      rollNumber: Joi.string(),
      department: Joi.string().valid('CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'),
      batch: Joi.number().min(2020).max(2030),
      cgpa: Joi.number().min(0).max(10),
      phone: Joi.string().pattern(/^[0-9]{10}$/),
      address: Joi.string(),
      skills: Joi.array().items(Joi.string()),
      education: Joi.array().items(Joi.object({
        degree: Joi.string(),
        institution: Joi.string(),
        year: Joi.number(),
        percentage: Joi.number().min(0).max(100)
      })),
      projects: Joi.array().items(Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        link: Joi.string().uri(),
        technologies: Joi.array().items(Joi.string())
      })),
      studentProfile: Joi.object().unknown(true)
    }).unknown(true); // Allow unknown fields
    return schema.validate(data);
  } else if (role === 'company') {
    const schema = Joi.object({
      name: Joi.string().min(2).max(50),
      companyName: Joi.string(),
      industry: Joi.string(),
      website: Joi.string().uri().allow(''),
      about: Joi.string().allow(''),
      location: Joi.string().allow(''),
      size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').allow(''),
      founded: Joi.number().min(1800).max(new Date().getFullYear()).allow(null),
      companyProfile: Joi.object().unknown(true)
    }).unknown(true); // Allow unknown fields
    return schema.validate(data);
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  jobValidation,
  profileUpdateValidation
};
