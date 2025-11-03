const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aptitudeRoutes = require('./routes/aptitudeRoutes');
const codeRoutes = require('./routes/codeRoutes');
const forumRoutes = require('./routes/forumRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'https://prodigy-hire.netlify.app/'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Prodigy Hire API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login | /api/auth/register',
      users: '/api/users/profile',
      jobs: '/api/jobs',
      applications: '/api/applications',
      tests: '/api/aptitude/available',
      health: '/api/health'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🎓 Prodigy Hire - Smart Campus Recruitment Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      jobs: '/api/jobs',
      applications: '/api/applications',
      tests: '/api/aptitude',
      documentation: 'https://github.com/rushiparkhe18/Smart-Campus-Recruitment'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DB_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log('📦 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔧 Port:', PORT);
    
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`✅ Server is ready to accept connections`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

startServer();

module.exports = app;
