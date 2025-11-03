# 🚀 CampusHire - Smart Campus Recruitment Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> A production-ready, enterprise-grade Virtual Campus Recruitment Platform that connects students with companies for placements, aptitude tests, coding practice, and community engagement.

## ✨ Features

### 👨‍🎓 For Students
- **Smart Job Matching** - AI-powered recommendations based on CGPA, department, batch & skills
- **One-Click Applications** - Apply instantly with saved resume
- **Aptitude Tests** - Timed MCQ tests with auto-scoring
- **Coding Playground** - Practice HTML/CSS/JS with live preview
- **Application Tracking** - Visual timeline from application to selection
- **Community Forum** - Ask questions, share tips, upvote helpful content
- **Saved Jobs** - Bookmark interesting opportunities
- **Real-time Notifications** - Get updates on application status

### 🏢 For Companies
- **Job Posting** - Create jobs with eligibility filters (CGPA, department, batch)
- **Applicant Management** - View, filter, shortlist candidates
- **Custom Aptitude Tests** - Build MCQ tests with shuffle & timer
- **Resume Preview** - View applicant resumes in-browser
- **Bulk Actions** - Shortlist multiple candidates at once
- **Export Applicants** - Download applicant data as CSV
- **Interview Scheduling** - Schedule & notify candidates
- **Analytics Dashboard** - Track applications, test scores, conversion

### 🔧 For Admins
- **User Management** - Approve companies, ban users
- **Platform Analytics** - Monitor users, jobs, applications, tests
- **Forum Moderation** - Review reports, delete inappropriate posts
- **System Logs** - Track platform activity

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18+
- **Database:** MongoDB Atlas
- **ODM:** Mongoose 7+
- **Authentication:** JWT (Access + Refresh tokens)
- **Validation:** Joi
- **Security:** Helmet, express-rate-limit, bcryptjs, express-mongo-sanitize
- **File Upload:** Multer + GridFS
- **Email:** Nodemailer

### Frontend
- **Core:** HTML5, CSS3, Tailwind CSS 3.4+, Vanilla JavaScript ES6+
- **UI Components:** shadcn-inspired components
- **Icons:** Heroicons
- **Fonts:** Inter, Poppins (Google Fonts)

### DevOps
- **Version Control:** Git + GitHub
- **Environment:** dotenv
- **Deployment:**
  - Frontend: Vercel / Netlify / Cloudflare Pages
  - Backend: Render / Railway / DigitalOcean
  - Database: MongoDB Atlas (M0 Free Tier)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Git
- Code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/campus-hire.git
cd campus-hire
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-recruitment?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@campushire.com

# File Upload
MAX_FILE_SIZE=2097152
ALLOWED_FILE_TYPES=application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Create upload directories

```bash
mkdir -p uploads/resumes
```

### 5. Start the development server

```bash
# Backend server (port 5000)
npm run dev

# Frontend (use live-server or any static server)
npm run client
```

### 6. Seed database (optional)

```bash
npm run seed
```

## 📁 Project Structure

```
smart-campus-recruitment/
├── client/                   # Frontend files
│   ├── index.html           # Landing page
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── student/             # Student dashboard pages
│   ├── company/             # Company dashboard pages
│   ├── admin/               # Admin panel pages
│   ├── js/                  # JavaScript files
│   └── assets/              # Images, fonts, etc.
├── server/                  # Backend files
│   ├── server.js            # Express app entry point
│   ├── config/              # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   └── upload.js       # File upload config
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── aptitudeController.js
│   │   ├── codeController.js
│   │   ├── forumController.js
│   │   ├── adminController.js
│   │   └── notificationController.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── AptitudeTest.js
│   │   ├── TestResult.js
│   │   ├── CodeSnippet.js
│   │   ├── ForumPost.js
│   │   └── Notification.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── aptitudeRoutes.js
│   │   ├── codeRoutes.js
│   │   ├── forumRoutes.js
│   │   ├── adminRoutes.js
│   │   └── notificationRoutes.js
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── utils/               # Utility functions
│   │   ├── jwt.js
│   │   └── validation.js
│   └── seed/                # Seed data scripts
│       └── seedData.js
├── uploads/                 # Uploaded files
│   └── resumes/
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/logout            - Logout
POST   /api/auth/forgot-password   - Send OTP
POST   /api/auth/reset-password    - Reset password
```

### Jobs
```
GET    /api/jobs                   - Get all jobs (filters: search, type, location, etc.)
GET    /api/jobs/:id               - Get single job
POST   /api/jobs                   - Create job (company)
PATCH  /api/jobs/:id               - Update job (company)
DELETE /api/jobs/:id               - Delete job (company/admin)
POST   /api/jobs/:id/apply         - Apply for job (student)
GET    /api/jobs/:id/applicants    - Get applicants (company)
```

### Applications
```
GET    /api/applications           - Get my applications (student)
PATCH  /api/applications/:id/status - Update status (company)
POST   /api/applications/bulk-update - Bulk update (company)
```

### Aptitude Tests
```
POST   /api/aptitude/create        - Create test (company)
GET    /api/aptitude/available     - Get available tests (student)
GET    /api/aptitude/:id/start     - Start test (student)
POST   /api/aptitude/:id/submit    - Submit test (student)
GET    /api/aptitude/results       - Get my results (student)
GET    /api/aptitude/:id/results   - Get test results (company)
```

### Code Playground
```
POST   /api/code/save              - Save snippet
GET    /api/code/mine              - Get my snippets
GET    /api/code/snippet/:id       - Get snippet
GET    /api/code/share/:token      - Get public snippet
DELETE /api/code/:id               - Delete snippet
```

### Forum
```
POST   /api/forum/post             - Create post
GET    /api/forum/posts            - Get all posts
GET    /api/forum/post/:id         - Get post
POST   /api/forum/post/:id/comment - Add comment
POST   /api/forum/post/:id/upvote  - Upvote
POST   /api/forum/post/:id/bookmark - Bookmark
POST   /api/forum/post/:id/report  - Report
DELETE /api/forum/post/:id         - Delete
```

### Admin
```
GET    /api/admin/stats            - Platform statistics
GET    /api/admin/users            - Get all users
PATCH  /api/admin/users/:id/approve - Approve company
PATCH  /api/admin/users/:id/ban    - Ban user
GET    /api/admin/reports          - Get reports
DELETE /api/admin/posts/:id        - Delete post
```

### Notifications
```
GET    /api/notifications          - Get notifications
PATCH  /api/notifications/:id/read - Mark as read
PATCH  /api/notifications/read-all - Mark all as read
```

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set build command: (none for static files)
4. Set output directory: `client`
5. Deploy

### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`
6. Deploy

### Database (MongoDB Atlas)

1. Create cluster (Free M0 tier)
2. Create database user
3. Whitelist IP (0.0.0.0/0 for development)
4. Get connection string
5. Update `MONGODB_URI` in environment variables

## 🧪 Testing

Test API endpoints using:
- Postman
- Thunder Client (VS Code)
- curl

Example:
```bash
# Register
curl -X POST https://smart-campus-recruitment.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Pass@1234","role":"student"}'

# Login
curl -X POST https://smart-campus-recruitment.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass@1234"}'
```

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT authentication (access + refresh tokens)
- Rate limiting on auth endpoints
- Input validation & sanitization
- MongoDB injection protection
- Helmet security headers
- CORS configuration
- File upload restrictions (PDF only, 2MB max)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Tailwind CSS for amazing utility-first CSS
- MongoDB for flexible NoSQL database
- Node.js & Express community
- All open-source contributors

## 📞 Support

For support, email support@campushire.com or join our Slack channel.

---

**Built with ❤️ for students and recruiters**
#   S m a r t - C a m p u s - R e c r u i t m e n t 
 
 