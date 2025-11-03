# 📚 API Documentation - CampusHire

Base URL: `https://smart-campus-recruitment.onrender.com`

Production URL: `https://your-backend-url.com/api`

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Authentication Flow

1. Register/Login → Receive `accessToken` and `refreshToken`
2. Store tokens in localStorage
3. Use `accessToken` for API requests
4. When `accessToken` expires, use `refreshToken` to get new one
5. If `refreshToken` expires, user must login again

---

## 📋 Endpoints

### 1. Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "student",           // "student" | "company" | "admin"
  "companyName": "Google"      // Required if role = "company"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "isApproved": true
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

#### Refresh Access Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword@123"
}
```

---

### 2. User Routes

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

// For Student
{
  "name": "John Doe",
  "rollNumber": "CSE2021001",
  "department": "CSE",
  "batch": 2025,
  "cgpa": 8.5,
  "phone": "9876543210",
  "skills": ["JavaScript", "React", "Node.js"],
  "education": [{
    "degree": "B.Tech",
    "institution": "IIT Delhi",
    "year": 2025,
    "percentage": 85
  }],
  "projects": [{
    "title": "Project Name",
    "description": "Description",
    "link": "https://github.com/...",
    "technologies": ["React", "Node.js"]
  }]
}

// For Company
{
  "companyName": "Google Inc.",
  "industry": "Technology",
  "website": "https://google.com",
  "about": "Company description...",
  "location": "Mountain View, CA",
  "size": "500+",
  "founded": 1998
}
```

#### Upload Resume (Student)
```http
POST /api/users/upload-resume
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <PDF file>
```

#### Get Saved Jobs (Student)
```http
GET /api/users/saved-jobs
Authorization: Bearer <token>
```

#### Save/Unsave Job (Student)
```http
POST /api/users/save-job/:jobId
Authorization: Bearer <token>
```

---

### 3. Job Routes

#### Get All Jobs
```http
GET /api/jobs?search=software&jobType=Full-Time&location=Bangalore&department=CSE&batch=2025&minCGPA=7.5&workMode=Remote&page=1&limit=10&sort=-createdAt
```

**Query Parameters:**
- `search`: Text search in title/description
- `jobType`: Full-Time | Internship | Part-Time
- `location`: Location filter
- `department`: CSE | IT | ECE | EEE | MECH | CIVIL | OTHER
- `batch`: Year (2024, 2025, etc.)
- `minCGPA`: Minimum CGPA (0-10)
- `workMode`: On-site | Remote | Hybrid
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sort`: Sort field (default: -createdAt)

#### Get Single Job
```http
GET /api/jobs/:id
```

#### Create Job (Company)
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "Job description...",
  "skills": ["JavaScript", "React", "Node.js"],
  "jobType": "Full-Time",
  "location": "Bangalore",
  "workMode": "Hybrid",
  "salary": {
    "min": 1200000,
    "max": 1800000
  },
  "eligibility": {
    "minCGPA": 7.5,
    "departments": ["CSE", "IT"],
    "batches": [2025]
  },
  "deadline": "2025-12-31T23:59:59.999Z"
}
```

#### Update Job (Company)
```http
PATCH /api/jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isActive": false
}
```

#### Delete Job (Company/Admin)
```http
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

#### Apply for Job (Student)
```http
POST /api/jobs/:id/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "coverLetter": "I am interested in this position because..."
}
```

#### Get Job Applicants (Company)
```http
GET /api/jobs/:id/applicants?status=applied&page=1&limit=20
Authorization: Bearer <token>
```

#### Get My Jobs (Company)
```http
GET /api/jobs/company/my-jobs
Authorization: Bearer <token>
```

---

### 4. Application Routes

#### Get My Applications (Student)
```http
GET /api/applications
Authorization: Bearer <token>
```

#### Update Application Status (Company)
```http
PATCH /api/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shortlisted",  // applied | shortlisted | test-scheduled | interview-scheduled | selected | rejected
  "note": "Good profile",
  "interviewDate": "2025-12-01T10:00:00.000Z",
  "interviewMode": "Online",
  "interviewLink": "https://meet.google.com/...",
  "rejectionReason": "Does not meet requirements"
}
```

#### Bulk Update Applications (Company)
```http
POST /api/applications/bulk-update
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationIds": ["id1", "id2", "id3"],
  "status": "shortlisted",
  "note": "Selected for next round"
}
```

---

### 5. Aptitude Test Routes

#### Create Test (Company)
```http
POST /api/aptitude/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "job": "jobId",
  "title": "Software Engineer Test",
  "description": "Test description",
  "duration": 60,
  "passingScore": 60,
  "questions": [{
    "question": "What is 2+2?",
    "options": ["3", "4", "5", "6"],
    "correctAnswer": 1,
    "marks": 2,
    "category": "Aptitude"
  }],
  "shuffleQuestions": true,
  "shuffleOptions": true
}
```

#### Get Available Tests (Student)
```http
GET /api/aptitude/available
Authorization: Bearer <token>
```

#### Start Test (Student)
```http
GET /api/aptitude/:id/start
Authorization: Bearer <token>
```

**Response:** Questions without correct answers

#### Submit Test (Student)
```http
POST /api/aptitude/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "...",
  "startTime": "2025-11-03T10:00:00.000Z",
  "answers": [{
    "questionIndex": 0,
    "selectedOption": 1
  }]
}
```

#### Get My Results (Student)
```http
GET /api/aptitude/results
Authorization: Bearer <token>
```

#### Get Test Results (Company)
```http
GET /api/aptitude/:id/results
Authorization: Bearer <token>
```

---

### 6. Code Playground Routes

#### Save Code Snippet
```http
POST /api/code/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Counter",
  "description": "Simple counter component",
  "language": "javascript",
  "code": "const [count, setCount] = useState(0);",
  "htmlCode": "<div>HTML</div>",
  "cssCode": "body { margin: 0; }",
  "jsCode": "console.log('Hello');",
  "isPublic": true,
  "tags": ["react", "hooks"]
}
```

#### Get My Snippets
```http
GET /api/code/mine
Authorization: Bearer <token>
```

#### Get Snippet by ID
```http
GET /api/code/snippet/:id
Authorization: Bearer <token>
```

#### Get Public Snippet (No auth)
```http
GET /api/code/share/:token
```

#### Delete Snippet
```http
DELETE /api/code/:id
Authorization: Bearer <token>
```

---

### 7. Forum Routes

#### Create Post
```http
POST /api/forum/post
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to prepare for interviews?",
  "content": "Looking for tips on interview preparation...",
  "tags": ["Interview", "Career", "Placement"]
}
```

#### Get All Posts
```http
GET /api/forum/posts?tag=Placement&search=interview&sort=-upvoteCount&page=1&limit=20
```

#### Get Single Post
```http
GET /api/forum/post/:id
```

#### Add Comment
```http
POST /api/forum/post/:id/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post! Thanks for sharing."
}
```

#### Upvote Post
```http
POST /api/forum/post/:id/upvote
Authorization: Bearer <token>
```

#### Downvote Post
```http
POST /api/forum/post/:id/downvote
Authorization: Bearer <token>
```

#### Bookmark Post
```http
POST /api/forum/post/:id/bookmark
Authorization: Bearer <token>
```

#### Report Post
```http
POST /api/forum/post/:id/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Spam content"
}
```

#### Delete Post (Author/Admin)
```http
DELETE /api/forum/post/:id
Authorization: Bearer <token>
```

---

### 8. Admin Routes

#### Get Platform Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /api/admin/users?role=student&isApproved=true&page=1&limit=20
Authorization: Bearer <admin_token>
```

#### Approve Company
```http
PATCH /api/admin/users/:id/approve
Authorization: Bearer <admin_token>
```

#### Ban/Unban User
```http
PATCH /api/admin/users/:id/ban
Authorization: Bearer <admin_token>
```

#### Get Reported Posts
```http
GET /api/admin/reports
Authorization: Bearer <admin_token>
```

#### Delete Reported Post
```http
DELETE /api/admin/posts/:id
Authorization: Bearer <admin_token>
```

#### Get All Jobs (Moderation)
```http
GET /api/admin/jobs?page=1&limit=20
Authorization: Bearer <admin_token>
```

---

### 9. Notification Routes

#### Get Notifications
```http
GET /api/notifications?isRead=false&page=1&limit=20
Authorization: Bearer <token>
```

#### Mark as Read
```http
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All as Read
```http
PATCH /api/notifications/read-all
Authorization: Bearer <token>
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Not authorized, token failed"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Role student is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "stack": "..." // Only in development
}
```

---

## 📝 Notes

1. **Rate Limiting:** Login/forgot-password endpoints are rate-limited to 5 requests per 15 minutes
2. **File Upload:** Resume upload limited to 2MB PDF files only
3. **Pagination:** Default limit is 10-20 items per page
4. **Date Format:** ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
5. **Token Expiry:**
   - Access Token: 15 minutes
   - Refresh Token: 7 days

---

## 🧪 Testing with cURL

```bash
# Register
curl -X POST https://smart-campus-recruitment.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123","role":"student"}'

# Login
curl -X POST https://smart-campus-recruitment.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get Jobs (with token)
curl -X GET "https://smart-campus-recruitment.onrender.com/jobs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Last Updated:** November 2025
**Version:** 1.0.0
