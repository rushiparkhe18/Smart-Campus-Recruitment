# 🎓 Smart Campus Recruitment Web Platform - Complete Project Prompt

## Project Overview

Build a **production-ready Smart Campus Recruitment Platform** using the MERN stack with modern UI/UX, comprehensive features for students, companies, and administrators. This is a **real-world, deployment-ready application** with professional code quality, security best practices, and attractive modern design.

---

## 🎯 Core Requirements

### Technology Stack

**Backend:**
- Node.js 18+ with Express.js 4.18+
- MongoDB Atlas with Mongoose 7+ ODM
- JWT authentication (access + refresh tokens)
- **NO AWS S3** - Use GridFS for file storage
- Nodemailer for email notifications
- Security: Helmet, express-rate-limit, bcryptjs, express-mongo-sanitize

**Frontend:**
- HTML5, CSS3, Tailwind CSS 3.4+ (modern utility-first)
- Vanilla JavaScript ES6+ (modular, clean code)
- **UI Inspiration: shadcn/ui components** (modern, gradient designs)
- Responsive design (mobile-first approach)
- Smooth animations and transitions

**Design System:**
- Primary Colors: Indigo (#4F46E5), Purple (#764ba2)
- Gradients: Use purple-to-indigo, soft pastel backgrounds
- Typography: Inter (body), Poppins (headings)
- Components: Cards with shadows, hover effects, floating animations
- Icons: Heroicons or Lucide icons
- Spacing: Consistent 4px grid system

---

## 👥 User Roles & Features

### 1. Students

**Profile Management:**
- Registration with email verification
- Profile: Roll number, department, batch, CGPA, phone
- Skills array with tags
- Education history (degree, institution, year, percentage)
- Projects showcase (title, description, GitHub link, technologies)
- Resume upload (PDF, GridFS storage, 2MB limit)

**Job Features:**
- Browse jobs with advanced filters:
  - Search by title/description
  - Filter: jobType, location, department, batch, CGPA, workMode
  - Sort: latest, salary, deadline
  - Pagination (10 per page)
- Job details: Full description, company info, eligibility criteria
- Save/bookmark jobs
- Apply with one-click (auto-check eligibility)
- Write cover letter (optional)
- View application status timeline

**Aptitude Tests:**
- View assigned tests (when status = "test-scheduled")
- Start test (timer countdown, auto-submit on timeout)
- Answer MCQs (4 options each)
- Auto-scoring system
- View results (score, percentage, pass/fail)

**Coding Playground:**
- Monaco editor for HTML/CSS/JavaScript
- Live preview pane (iframe)
- Save snippets with title and tags
- Share snippets via public link
- View saved snippets library

**Community Forum:**
- Create posts (title, content, tags)
- Upvote/downvote posts
- Comment on posts
- Bookmark posts
- Report inappropriate content
- Filter by tags (Interview, Career, Placement, DSA, Resume)
- Search posts

**Dashboard:**
- Profile completion percentage
- Application statistics (applied, shortlisted, selected, rejected)
- Upcoming tests (date, time, duration)
- Saved jobs count
- Recent notifications
- Quick actions (apply to jobs, take test, update profile)

### 2. Companies (Recruiters)

**Profile Management:**
- Company registration (requires admin approval)
- Profile: Company name, industry, website, logo, about, location, size, founded year
- Verification badge after approval

**Job Management:**
- Create job postings:
  - Title, description, skills required
  - Job type (Full-Time, Internship, Part-Time)
  - Location, work mode (On-site, Remote, Hybrid)
  - Salary range (min-max)
  - Eligibility criteria (minCGPA, departments[], batches[])
  - Application deadline
- Edit/delete own jobs
- Mark jobs as active/inactive
- View job analytics (views, applications count)

**Applicant Management:**
- View all applicants for each job
- Filter applicants by status
- Bulk actions (shortlist, reject multiple)
- Update application status:
  - Applied → Shortlisted → Test Scheduled → Interview Scheduled → Selected/Rejected
- Add notes to applications
- Schedule interviews (date, mode, link/location)
- Download resumes (from GridFS)
- Export applicants to CSV

**Aptitude Test Creation:**
- Create custom tests for jobs
- Add questions:
  - Question text
  - 4 options (A, B, C, D)
  - Correct answer (index 0-3)
  - Marks per question
  - Category (Aptitude, Technical, Logical)
- Set duration (minutes)
- Set passing score (percentage)
- Shuffle questions/options option

**Dashboard:**
- Active jobs count
- Total applications received
- Applications chart (by status)
- Pending reviews count
- Recent applications table
- Job performance metrics

### 3. Admin

**User Management:**
- View all users (students, companies, admins)
- Approve/reject company registrations
- Ban/unban users
- View user profiles
- Search and filter users

**Content Moderation:**
- View reported forum posts
- Delete inappropriate posts/comments
- Ban users for violations
- View all jobs (approve/reject if needed)

**Platform Analytics:**
- Total users by role
- Total jobs posted
- Total applications
- Applications by status (pie chart)
- Forum posts count
- Tests created count
- Monthly growth charts

**Dashboard:**
- Platform statistics overview
- Pending company approvals queue
- Reported content queue
- System health status
- Recent activities log

---

## 🏗️ Technical Architecture

### Database Models (Mongoose Schemas)

#### 1. User Model
```javascript
{
  name: String (required, trimmed)
  email: String (unique, lowercase, validated)
  password: String (hashed with bcrypt, 12 rounds)
  role: Enum ['student', 'company', 'admin']
  isApproved: Boolean (false for companies by default)
  isBanned: Boolean
  
  // Student-specific
  studentProfile: {
    rollNumber: String (unique)
    department: Enum [CSE, IT, ECE, EEE, MECH, CIVIL, OTHER]
    batch: Number (year)
    cgpa: Number (0-10, 2 decimals)
    phone: String
    skills: [String]
    education: [{
      degree: String
      institution: String
      year: Number
      percentage: Number
    }]
    projects: [{
      title: String
      description: String
      link: String (URL)
      technologies: [String]
    }]
    resumeUrl: String (GridFS file ID)
    savedJobs: [ObjectId ref Job]
  }
  
  // Company-specific
  companyProfile: {
    companyName: String
    industry: String
    website: String (URL)
    logo: String (URL)
    about: String
    location: String
    size: String
    founded: Number
  }
  
  refreshToken: String
  resetPasswordOTP: String
  resetPasswordExpires: Date
  
  timestamps: true
}

// Indexes: email, role, isApproved
// Methods: comparePassword(password)
// Hooks: pre-save password hashing
```

#### 2. Job Model
```javascript
{
  company: ObjectId (ref User, required)
  title: String (required, indexed for text search)
  description: String (required, indexed)
  skills: [String]
  jobType: Enum ['Full-Time', 'Internship', 'Part-Time']
  location: String
  workMode: Enum ['On-site', 'Remote', 'Hybrid']
  salary: {
    min: Number
    max: Number
  }
  eligibility: {
    minCGPA: Number (default 0)
    departments: [String]
    batches: [Number]
  }
  deadline: Date
  isActive: Boolean (default true)
  applicationsCount: Number (default 0)
  views: Number (default 0)
  
  timestamps: true
}

// Indexes: company, isActive, deadline, text(title, description)
```

#### 3. Application Model
```javascript
{
  job: ObjectId (ref Job, required)
  student: ObjectId (ref User, required)
  resumeUrl: String (GridFS file ID)
  coverLetter: String
  status: Enum ['applied', 'shortlisted', 'test-scheduled', 'interview-scheduled', 'selected', 'rejected']
  testScore: Number
  timeline: [{
    status: String
    note: String
    updatedAt: Date
  }]
  interviewDetails: {
    date: Date
    mode: String
    link: String
    location: String
  }
  rejectionReason: String
  
  timestamps: true
}

// Indexes: job, student, status
// Unique compound: [job, student]
```

#### 4. AptitudeTest Model
```javascript
{
  job: ObjectId (ref Job, required)
  title: String (required)
  description: String
  duration: Number (minutes, required)
  passingScore: Number (percentage)
  questions: [{
    question: String (required)
    options: [String] (4 options, required)
    correctAnswer: Number (0-3, required)
    marks: Number (default 1)
    category: String
  }]
  shuffleQuestions: Boolean (default false)
  shuffleOptions: Boolean (default false)
  createdBy: ObjectId (ref User)
  
  timestamps: true
}

// Indexes: job
```

#### 5. TestResult Model
```javascript
{
  test: ObjectId (ref AptitudeTest, required)
  student: ObjectId (ref User, required)
  application: ObjectId (ref Application, required)
  answers: [{
    questionIndex: Number
    selectedOption: Number
  }]
  score: Number
  percentage: Number
  passed: Boolean
  startTime: Date
  submitTime: Date
  timeTaken: Number (seconds)
  
  timestamps: true
}

// Indexes: test, student, application
```

#### 6. CodeSnippet Model
```javascript
{
  user: ObjectId (ref User, required)
  title: String (required)
  description: String
  language: Enum ['html', 'css', 'javascript', 'python', 'java', 'cpp', 'other']
  code: String
  htmlCode: String
  cssCode: String
  jsCode: String
  tags: [String]
  isPublic: Boolean (default false)
  shareToken: String (unique, for public sharing)
  likes: [ObjectId ref User]
  views: Number (default 0)
  
  timestamps: true
}

// Indexes: user, shareToken, isPublic
```

#### 7. ForumPost Model
```javascript
{
  author: ObjectId (ref User, required)
  title: String (required, indexed)
  content: String (required, indexed)
  tags: [String]
  upvotes: [ObjectId ref User]
  downvotes: [ObjectId ref User]
  upvoteCount: Number (default 0)
  comments: [{
    author: ObjectId (ref User)
    content: String
    createdAt: Date
  }]
  bookmarkedBy: [ObjectId ref User]
  views: Number (default 0)
  reports: [{
    reportedBy: ObjectId (ref User)
    reason: String
    createdAt: Date
  }]
  isReported: Boolean (default false)
  isDeleted: Boolean (default false)
  
  timestamps: true
}

// Indexes: author, tags, isDeleted, text(title, content)
```

#### 8. Notification Model
```javascript
{
  user: ObjectId (ref User, required)
  type: Enum ['application', 'test', 'interview', 'job', 'admin', 'forum']
  title: String (required)
  message: String (required)
  link: String
  isRead: Boolean (default false)
  priority: Enum ['low', 'medium', 'high']
  
  timestamps: true
}

// Indexes: user, isRead, createdAt
```

---

### API Endpoints Structure

```
/api/auth
  POST   /register          - Register new user
  POST   /login             - Login user
  POST   /refresh-token     - Refresh access token
  POST   /logout            - Logout user
  POST   /forgot-password   - Send OTP to email
  POST   /reset-password    - Reset password with OTP

/api/users
  GET    /profile           - Get current user profile
  PUT    /profile           - Update profile
  POST   /upload-resume     - Upload resume (Multer + GridFS)
  GET    /saved-jobs        - Get saved jobs (students)
  POST   /save-job/:jobId   - Toggle save job

/api/jobs
  GET    /                  - Get all jobs (with filters)
  GET    /:id               - Get single job
  POST   /                  - Create job (company)
  PATCH  /:id               - Update job (company)
  DELETE /:id               - Delete job (company/admin)
  GET    /company/my-jobs   - Get company's jobs

/api/applications
  POST   /apply/:jobId      - Apply for job (student)
  GET    /my-applications   - Get my applications (student)
  GET    /job/:jobId        - Get job applicants (company)
  PATCH  /:id/status        - Update status (company)
  POST   /bulk-update       - Bulk update statuses (company)

/api/aptitude
  POST   /create            - Create test (company)
  GET    /available         - Get available tests (student)
  GET    /:id/start         - Start test (student)
  POST   /:id/submit        - Submit test (student)
  GET    /results           - Get my results (student)
  GET    /:id/results       - Get test results (company)

/api/code
  POST   /save              - Save code snippet
  GET    /mine              - Get my snippets
  GET    /snippet/:id       - Get snippet by ID
  GET    /share/:token      - Get public snippet
  DELETE /:id               - Delete snippet

/api/forum
  POST   /post              - Create post
  GET    /posts             - Get all posts (with filters)
  GET    /post/:id          - Get single post
  POST   /post/:id/comment  - Add comment
  POST   /post/:id/upvote   - Upvote post
  POST   /post/:id/downvote - Downvote post
  POST   /post/:id/bookmark - Bookmark post
  POST   /post/:id/report   - Report post
  DELETE /post/:id          - Delete post (author/admin)

/api/admin
  GET    /stats             - Get platform statistics
  GET    /users             - Get all users
  PATCH  /users/:id/approve - Approve company
  PATCH  /users/:id/ban     - Ban/unban user
  GET    /reports           - Get reported posts
  DELETE /posts/:id         - Delete reported post
  GET    /jobs              - Get all jobs (moderation)

/api/notifications
  GET    /                  - Get notifications
  PATCH  /:id/read          - Mark as read
  PATCH  /read-all          - Mark all as read
```

---

## 🎨 Frontend Pages & UI Design

### Design Principles
- **Modern & Clean:** Minimalist design with lots of white space
- **Gradient Accents:** Use purple-to-indigo gradients for CTAs and headers
- **Card-Based Layout:** Everything in cards with subtle shadows
- **Micro-interactions:** Hover effects, smooth transitions (200ms ease)
- **Responsive:** Mobile-first approach, works on all devices
- **Accessibility:** Proper ARIA labels, keyboard navigation, color contrast

### Color Palette
```css
/* Primary */
--indigo-600: #4F46E5;
--indigo-500: #6366F1;
--indigo-50: #EEF2FF;

/* Secondary */
--purple-600: #764ba2;
--purple-500: #9333EA;
--purple-50: #FAF5FF;

/* Neutral */
--gray-900: #111827;
--gray-700: #374151;
--gray-500: #6B7280;
--gray-100: #F3F4F6;
--gray-50: #F9FAFB;

/* Semantic */
--green-500: #10B981;
--red-500: #EF4444;
--yellow-500: #F59E0B;
```

### Required Frontend Pages

#### 1. Landing Page (`index.html`)
**Sections:**
- **Navbar:**
  - Logo (gradient icon + "CampusHire" text)
  - Links: Home, Features, How It Works, Contact
  - CTAs: Login (outline), Sign Up (gradient bg)
  - Sticky on scroll with blur backdrop

- **Hero Section:**
  - Left: Headline with gradient text ("Find Your Dream Job on Campus")
  - Subheadline: Description (20-30 words)
  - Two CTAs: "I'm a Student" (primary), "I'm a Recruiter" (secondary)
  - Right: Illustration or mockup with floating stat cards

- **Features Grid:** (6 cards in 3x2 grid)
  - Smart Job Matching (icon: briefcase, gradient: indigo)
  - Aptitude Tests (icon: document, gradient: cyan)
  - Coding Playground (icon: code, gradient: green)
  - Community Forum (icon: chat, gradient: purple)
  - Application Tracking (icon: chart, gradient: orange)
  - Recruiter Dashboard (icon: users, gradient: yellow)
  
  Each card: Icon, title, description, hover lift effect

- **How It Works:** (4 steps with numbers)
  - Step 1: Create Profile
  - Step 2: Browse Jobs
  - Step 3: Take Tests
  - Step 4: Get Hired
  
  Timeline design with connecting lines

- **Testimonials:** (3 cards)
  - Avatar, name, role, company
  - Quote (2-3 lines)
  - 5-star rating

- **CTA Section:**
  - Gradient background (purple to indigo)
  - Headline: "Ready to Start Your Journey?"
  - Button: "Get Started Free" (white with shadow)

- **Footer:**
  - 4 columns: Brand (logo + tagline), Platform (links), Company (About, Contact), Legal (Privacy, Terms)
  - Social icons
  - Copyright notice

**Animations:**
- Fade-in on scroll (Intersection Observer)
- Floating animation for hero image
- Hover scale for cards (1.05 transform)

#### 2. Login Page (`login.html`)
**Layout:** Split-screen design

- **Left Panel (40%):**
  - Logo at top
  - "Welcome Back!" heading
  - Login form:
    - Email input (with icon)
    - Password input (with toggle show/hide)
    - "Remember me" checkbox
    - "Forgot password?" link
  - Submit button (gradient bg, shadow)
  - Divider: "or continue with"
  - Social login buttons (Google, Facebook icons)
  - Bottom: "Don't have an account? Sign up"

- **Right Panel (60%):**
  - Gradient background (purple to indigo)
  - White text overlay
  - Feature list with checkmarks:
    - "Access to 500+ companies"
    - "Practice aptitude tests"
    - "Track applications in real-time"
    - "Join student community"

**Form Handling:**
- Client-side validation (email format, password required)
- API call to /api/auth/login
- Store tokens in localStorage
- Redirect based on role:
  - Student → /student/dashboard.html
  - Company → /company/dashboard.html
  - Admin → /admin/dashboard.html
- Toast notifications for errors

#### 3. Register Page (`register.html`)
**Layout:** Multi-step form

- **Step 1: Choose Role**
  - Three large cards: Student, Company, Admin (hidden)
  - Each with icon, title, description
  - Select one to proceed

- **Step 2: Basic Info**
  - Name, Email, Password, Confirm Password
  - Password strength indicator
  - If company: Company name field

- **Step 3: Profile Details**
  - For Student: Roll number, Department, Batch, CGPA
  - For Company: Industry, Website, Location
  
- **Step 4: Verification**
  - Review entered details
  - Terms & conditions checkbox
  - Submit button

**Progress Indicator:** 4 dots at top showing current step

**API:** POST /api/auth/register

#### 4. Student Dashboard (`student/dashboard.html`)
**Layout:** Grid layout (sidebar + main content)

- **Sidebar (20%):**
  - Profile photo (circular)
  - Name, Batch, Department
  - Navigation links:
    - Dashboard (active)
    - Browse Jobs
    - My Applications
    - Tests
    - Saved Jobs
    - Code Playground
    - Forum
    - Profile
  - Logout button at bottom

- **Main Content (80%):**
  - **Top Bar:**
    - Welcome message: "Good morning, [Name]!"
    - Search bar
    - Notification bell (with badge)
    - Profile dropdown

  - **Stats Cards (4 across):**
    - Applications Sent (number + icon)
    - Tests Pending (number + icon)
    - Saved Jobs (number + icon)
    - Profile Strength (percentage + progress bar)
    
    Each card: White bg, shadow, colored icon, hover lift

  - **Application Status Chart:**
    - Title: "Application Overview"
    - Donut chart or bar chart
    - Categories: Applied, Shortlisted, Interview, Selected, Rejected
    - Different colors for each

  - **Upcoming Tests (Table/Cards):**
    - Columns: Job Title, Company, Date, Duration
    - "Start Test" button (green)
    - Empty state if no tests

  - **Recent Jobs (Cards Grid):**
    - 3 job cards
    - Each: Company logo, title, location, salary, deadline
    - "Apply Now" button
    - "View More" link at bottom

  - **Quick Actions (Floating buttons or cards):**
    - Update Resume
    - Complete Profile
    - Practice Coding
    - Browse Companies

**Responsive:** Stack cards vertically on mobile, collapse sidebar to hamburger menu

#### 5. Browse Jobs Page (`student/jobs.html`)
**Layout:** Sidebar filters + job grid

- **Filter Sidebar (25%):**
  - Search bar (sticky at top)
  - Filters (collapsible sections):
    - Job Type (checkboxes: Full-Time, Internship, Part-Time)
    - Location (multi-select dropdown)
    - Department (checkboxes: CSE, IT, ECE, etc.)
    - Batch (checkboxes: 2024, 2025, 2026)
    - CGPA Range (slider: 0-10)
    - Work Mode (radio: On-site, Remote, Hybrid, Any)
    - Salary Range (slider)
  - "Apply Filters" button
  - "Clear All" link

- **Job Grid (75%):**
  - **Top Bar:**
    - "X jobs found" count
    - Sort dropdown (Latest, Deadline, Salary)
    - View toggle (grid/list icons)

  - **Job Cards (Grid or List):**
    - Company logo (top-left)
    - Bookmark icon (top-right, clickable)
    - Job title (bold, large)
    - Company name + location
    - Salary range (highlighted in green)
    - Skills tags (max 3, rest as "+2 more")
    - Eligibility badge (CGPA, departments)
    - Deadline (with urgency color: red if <7 days)
    - "View Details" button
    - Hover effect: shadow increase, slight lift

  - **Pagination:**
    - Previous, 1, 2, 3, ..., Next
    - "Show 10/20/50 per page" dropdown

**Empty State:** Illustration + "No jobs match your criteria" + "Clear filters" button

**API:** GET /api/jobs with query params

#### 6. Job Details Page (`student/job-details.html?id=xxx`)
**Layout:** Single column, centered (max-width: 800px)

- **Header Card:**
  - Company logo (large, left)
  - Job title (heading 1)
  - Company name (link to company profile)
  - Location, Work mode, Job type (badges)
  - Salary range (large, green)
  - Deadline countdown ("X days left" with icon)
  - Two buttons: "Apply Now" (primary), "Save Job" (outline with heart icon)

- **Job Description:**
  - "About the Role" section
  - Description (formatted with line breaks)
  - "Responsibilities" (bullet list)
  - "Requirements" (bullet list)

- **Skills Required:**
  - Colored tags (pill-shaped)
  - Hover effect on each tag

- **Eligibility Criteria (Card):**
  - Icon + "Minimum CGPA: X.X"
  - Icon + "Departments: CSE, IT"
  - Icon + "Batches: 2024, 2025"
  - Check if user meets criteria → show "You're eligible!" (green) or "Not eligible" (red)

- **Company Info (Card):**
  - Company logo
  - Name, Industry, Location
  - Website link (external)
  - "View all jobs from [Company]" link

- **Application Stats (Small card):**
  - "X applications received"
  - "Posted X days ago"
  - "X views"

- **Apply Modal (on button click):**
  - Resume preview (if uploaded)
  - "Upload new resume" button
  - Cover letter textarea (optional)
  - "I meet the eligibility criteria" checkbox
  - Submit button

**API:**
- GET /api/jobs/:id
- POST /api/applications/apply/:jobId

#### 7. My Applications Page (`student/applications.html`)
**Layout:** Tabs + table/cards

- **Tabs (Horizontal):**
  - All (badge with count)
  - Applied
  - Shortlisted
  - Test Scheduled
  - Interview Scheduled
  - Selected
  - Rejected

- **Application Cards (List):**
  - Company logo + Job title
  - Applied date
  - Current status (badge with color)
  - Timeline (horizontal dots: applied → shortlisted → test → interview → selected)
  - Test score (if applicable)
  - Interview details (if scheduled)
  - Action buttons:
    - "View Job" (secondary)
    - "Take Test" (if test-scheduled, primary)
    - "Download Resume" (outline)
  - Rejection reason (if rejected, red text)

- **Empty State (per tab):**
  - Icon + message
  - "No applications in this status"
  - "Browse jobs" CTA

**API:** GET /api/applications

#### 8. Take Test Page (`student/test.html?id=xxx`)
**Layout:** Full-screen quiz interface

- **Top Bar (Fixed):**
  - Test title + company name
  - Timer (countdown, red when <5 min)
  - "Submit Test" button (outline, red)

- **Question Navigator (Left sidebar, 20%):**
  - Question numbers in grid (1, 2, 3, ...)
  - Color codes:
    - Green: Answered
    - Orange: Marked for review
    - Gray: Not visited
    - White: Current
  - "Mark for Review" checkbox
  - "Clear Response" button

- **Question Panel (Right, 80%):**
  - Question number + marks
  - Question text (large, readable)
  - 4 options (radio buttons)
  - Large clickable cards for each option
  - Hover effect on options
  - "Previous" and "Next" buttons at bottom

- **Submit Confirmation Modal:**
  - "Are you sure you want to submit?"
  - Summary: "X answered, Y unanswered, Z marked"
  - "Go Back" and "Submit" buttons

- **Result Page (after submit):**
  - Confetti animation (if passed)
  - Score (large number)
  - Percentage (with progress circle)
  - Pass/Fail badge
  - Time taken
  - "View detailed results" button
  - "Back to dashboard" button

**Features:**
- Auto-submit on timer end
- Warn before closing tab
- Save answers in localStorage (in case of refresh)

**API:**
- GET /api/aptitude/:id/start
- POST /api/aptitude/:id/submit

#### 9. Code Playground Page (`student/code.html`)
**Layout:** Split-pane editor

- **Top Bar:**
  - "Code Playground" title
  - Snippet title input (if new)
  - Language dropdown (HTML/CSS/JS, Python, Java, C++)
  - "Save" button
  - "Share" button (generates public link)
  - "New" button

- **Editor Pane (Left, 50%):**
  - **For HTML/CSS/JS mode:**
    - 3 tabs: HTML, CSS, JavaScript
    - Monaco editor (VS Code-like)
    - Syntax highlighting
    - Auto-complete
  - **For other languages:**
    - Single editor with syntax highlighting

- **Preview Pane (Right, 50%):**
  - **For HTML/CSS/JS:**
    - Iframe with live preview
    - Auto-refresh on code change (debounced 500ms)
    - "Refresh" button
  - **For other languages:**
    - Console output area
    - "Run Code" button (if backend execution is implemented)

- **Bottom Bar:**
  - "My Snippets" button → opens sidebar with saved snippets
  - Likes count (if public)
  - Views count

- **Saved Snippets Sidebar (Slide-in):**
  - List of saved snippets
  - Each: Title, language, date, "Load" button
  - "Delete" icon (red)

**Features:**
- Resize panes (draggable divider)
- Fullscreen mode (editor or preview)
- Dark/light theme toggle
- Keyboard shortcuts (Ctrl+S to save)

**API:**
- POST /api/code/save
- GET /api/code/mine
- GET /api/code/snippet/:id

#### 10. Forum Page (`student/forum.html`)
**Layout:** Feed with sidebar

- **Top Bar:**
  - "Community Forum" title
  - Search bar
  - "Create Post" button (primary, large)

- **Filters (Horizontal tags):**
  - All (active)
  - Interview
  - Career
  - Placement
  - DSA
  - Resume
  - Other
  - + icon to add custom tag

- **Sort Dropdown:**
  - Latest
  - Most Upvoted
  - Most Commented

- **Post Feed:**
  - Post cards (vertical list)
  - Each card:
    - Author avatar + name + time ago
    - Title (bold, clickable)
    - Content preview (2-3 lines, truncated)
    - Tags (colored pills)
    - Stats: Upvotes count, comments count, views
    - Actions:
      - Upvote button (arrow up, filled if upvoted)
      - Downvote button (arrow down)
      - Comment button
      - Bookmark button (outline star)
      - Share button (link icon)
    - "Read more" link

- **Sidebar (Right, 30%):**
  - **Trending Tags (Card):**
    - Top 10 tags with post counts
    - Clickable to filter
  
  - **Top Contributors (Card):**
    - Top 5 users by upvotes
    - Avatar, name, upvotes count

  - **My Stats (Card):**
    - Posts created
    - Total upvotes received
    - Comments made

**Create Post Modal:**
- Title input
- Content textarea (with formatting toolbar: bold, italic, link, code)
- Tags input (multi-select)
- "Preview" tab
- "Post" button

**API:**
- GET /api/forum/posts
- POST /api/forum/post

#### 11. Forum Post Detail Page (`student/post.html?id=xxx`)
**Layout:** Single column, centered

- **Post Card:**
  - Author info (avatar, name, role, date)
  - Title (heading 1)
  - Content (formatted with line breaks, code blocks)
  - Tags
  - Actions:
    - Upvote (with count, filled if upvoted)
    - Downvote (with count)
    - Bookmark (filled if bookmarked)
    - Share (copy link)
    - Report (flag icon, red)

- **Comments Section:**
  - "X Comments" heading
  - Add comment textarea + "Post Comment" button
  - Comment list (nested if replies exist):
    - Avatar, name, time ago
    - Comment content
    - Nested reply button
    - Delete button (if own comment, red)

**API:**
- GET /api/forum/post/:id
- POST /api/forum/post/:id/comment
- POST /api/forum/post/:id/upvote

#### 12. Company Dashboard (`company/dashboard.html`)
**Layout:** Similar to student dashboard

- **Stats Cards:**
  - Active Jobs
  - Total Applications
  - Pending Reviews
  - Selected Candidates

- **Applications Chart:**
  - Line chart or bar chart
  - X-axis: Time (weeks/months)
  - Y-axis: Application count
  - Multiple lines: Applied, Shortlisted, Selected

- **Recent Applications (Table):**
  - Columns: Candidate name, Job title, Applied date, Status, Actions
  - Actions: "View Profile", "Update Status"
  - Click row to expand details

- **Active Jobs (Cards):**
  - Job title, applications count, deadline
  - "View Applicants" button
  - "Edit Job" button

- **Quick Actions:**
  - Post New Job
  - Create Aptitude Test
  - Download Reports

#### 13. Post Job Page (`company/post-job.html`)
**Layout:** Form with sections

- **Basic Info:**
  - Job title (input)
  - Job description (rich text editor or textarea)
  - Job type (dropdown)
  - Location (input with autocomplete)
  - Work mode (radio buttons)

- **Salary:**
  - Min salary (number input)
  - Max salary (number input)
  - Currency (dropdown, default INR)

- **Skills Required:**
  - Tag input (type and press enter)
  - Suggested skills (based on job title)

- **Eligibility:**
  - Min CGPA (slider 0-10)
  - Departments (checkboxes)
  - Batches (checkboxes)

- **Application Deadline:**
  - Date picker (min: today)

- **Preview Card:**
  - Show how job will appear to students
  - Live update as form is filled

- **Buttons:**
  - "Save as Draft" (secondary)
  - "Post Job" (primary, gradient)

**Validation:**
- All required fields filled
- Deadline is future date
- Min salary < Max salary

**API:** POST /api/jobs

#### 14. Applicants Page (`company/applicants.html?jobId=xxx`)
**Layout:** Table with filters

- **Top Bar:**
  - Job title
  - Total applicants count
  - "Export to CSV" button
  - "Bulk Actions" dropdown (Shortlist selected, Reject selected)

- **Filters (Sidebar or top row):**
  - Status (dropdown: All, Applied, Shortlisted, etc.)
  - CGPA range (slider)
  - Department (checkboxes)
  - Date applied (date range)
  - "Apply Filters" button

- **Applicants Table:**
  - Checkbox (for bulk selection)
  - Candidate name (clickable to profile)
  - Department + Batch
  - CGPA (badge with color: green >8, yellow 7-8, gray <7)
  - Skills (tags, max 3)
  - Applied date
  - Current status (badge)
  - Actions dropdown:
    - View Resume
    - Update Status
    - Schedule Interview
    - Add Note

- **Update Status Modal:**
  - Current status (disabled)
  - New status (dropdown)
  - Note/Reason (textarea)
  - Interview details (if status = interview-scheduled):
    - Date/time picker
    - Mode (dropdown: Online, Offline)
    - Link/Location (input)
  - "Update" button

- **Candidate Profile Modal:**
  - Photo, name, email, phone
  - Education (timeline)
  - Projects (cards)
  - Skills (tags)
  - Resume preview (PDF iframe or download button)
  - Application timeline
  - "Download Resume" button
  - "Send Email" button (mailto link)

**API:**
- GET /api/applications/job/:jobId
- PATCH /api/applications/:id/status

#### 15. Create Test Page (`company/create-test.html`)
**Layout:** Multi-step form

- **Step 1: Test Details**
  - Test title
  - Description
  - Associated job (dropdown)
  - Duration (minutes)
  - Passing score (percentage)

- **Step 2: Add Questions**
  - Question number (auto)
  - Question text (textarea)
  - Option A, B, C, D (inputs)
  - Correct answer (radio buttons)
  - Marks (number)
  - Category (dropdown: Aptitude, Technical, Logical)
  - "Add Question" button
  - "Remove" button for each question

- **Question List (Sidebar):**
  - Show added questions
  - Click to edit
  - Drag to reorder

- **Step 3: Settings**
  - Shuffle questions (checkbox)
  - Shuffle options (checkbox)
  - Allow review (checkbox)
  - Auto-submit on timeout (checkbox)

- **Step 4: Preview**
  - Show test as students will see
  - All questions with options
  - "Edit" buttons

- **Buttons:**
  - "Previous" (secondary)
  - "Next" / "Create Test" (primary)

**Validation:**
- At least 5 questions
- All questions have 4 options
- Correct answer selected for each

**API:** POST /api/aptitude/create

#### 16. Admin Dashboard (`admin/dashboard.html`)
**Layout:** Analytics-focused

- **Stats Cards (Grid):**
  - Total Users (with breakdown: students, companies)
  - Total Jobs
  - Total Applications
  - Forum Posts
  - Tests Created
  - Growth rate (percentage change from last month)

- **Charts:**
  - **User Growth (Line chart):**
    - X-axis: Months
    - Y-axis: User count
    - 3 lines: Students, Companies, Total
  
  - **Applications by Status (Pie chart):**
    - Segments: Applied, Shortlisted, Selected, Rejected
    - Different colors
  
  - **Jobs by Category (Bar chart):**
    - X-axis: Full-Time, Internship, Part-Time
    - Y-axis: Count

- **Pending Actions:**
  - **Company Approvals (Table):**
    - Company name, industry, registered date
    - "Approve" (green) / "Reject" (red) buttons
  
  - **Reported Posts (Table):**
    - Post title, author, reports count, reason
    - "View Post" / "Delete Post" buttons

- **Recent Activities (Feed):**
  - User registered
  - Job posted
  - Application submitted
  - Post reported
  - Timestamp for each

#### 17. Users Management Page (`admin/users.html`)
**Layout:** Table with search and filters

- **Top Bar:**
  - Search bar (name, email)
  - Role filter (dropdown: All, Student, Company, Admin)
  - Status filter (Active, Banned, Pending Approval)
  - "Export to CSV" button

- **Users Table:**
  - Avatar
  - Name
  - Email
  - Role (badge)
  - Registered date
  - Status (badge: Active, Banned, Pending)
  - Actions dropdown:
    - View Profile
    - Approve (if company + pending)
    - Ban / Unban
    - Send Email

- **Pagination:**
  - Previous, 1, 2, 3, ..., Next

**API:**
- GET /api/admin/users
- PATCH /api/admin/users/:id/approve
- PATCH /api/admin/users/:id/ban

---

## 🔧 Implementation Guidelines

### Backend Best Practices

1. **Error Handling:**
   ```javascript
   // Use try-catch in all async functions
   try {
     // code
   } catch (error) {
     return res.status(500).json({
       status: 'error',
       message: error.message
     });
   }
   ```

2. **Input Validation:**
   ```javascript
   // Use Joi for all inputs
   const { error, value } = schema.validate(req.body);
   if (error) {
     return res.status(400).json({
       status: 'error',
       message: error.details[0].message
     });
   }
   ```

3. **Authentication Middleware:**
   ```javascript
   // Verify JWT token
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
     return res.status(401).json({
       status: 'error',
       message: 'Not authorized'
     });
   }
   const decoded = verifyAccessToken(token);
   req.user = await User.findById(decoded.id);
   ```

4. **Password Security:**
   ```javascript
   // Hash password before saving
   userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 12);
     next();
   });
   ```

5. **Rate Limiting:**
   ```javascript
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5,
     message: 'Too many login attempts'
   });
   router.post('/login', loginLimiter, authController.login);
   ```

### Frontend Best Practices

1. **API Calls (Utility Function):**
   ```javascript
   async function apiRequest(endpoint, options = {}) {
     const token = localStorage.getItem('accessToken');
     
     const config = {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         ...(token && { 'Authorization': `Bearer ${token}` }),
         ...options.headers
       }
     };
     
     try {
       const response = await fetch(`${API_URL}${endpoint}`, config);
       const data = await response.json();
       
       if (!response.ok) {
         if (response.status === 401) {
           // Try refresh token
           await refreshAccessToken();
           // Retry request
           return apiRequest(endpoint, options);
         }
         throw new Error(data.message);
       }
       
       return data;
     } catch (error) {
       showToast(error.message, 'error');
       throw error;
     }
   }
   ```

2. **Toast Notifications:**
   ```javascript
   function showToast(message, type = 'info') {
     const toast = document.createElement('div');
     toast.className = `toast toast-${type}`;
     toast.textContent = message;
     document.body.appendChild(toast);
     
     setTimeout(() => {
       toast.classList.add('show');
     }, 100);
     
     setTimeout(() => {
       toast.classList.remove('show');
       setTimeout(() => toast.remove(), 300);
     }, 3000);
   }
   ```

3. **Form Validation:**
   ```javascript
   function validateEmail(email) {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }
   
   function validatePassword(password) {
     // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
   }
   
   form.addEventListener('submit', (e) => {
     e.preventDefault();
     
     const email = emailInput.value;
     const password = passwordInput.value;
     
     if (!validateEmail(email)) {
       showToast('Invalid email format', 'error');
       return;
     }
     
     if (!validatePassword(password)) {
       showToast('Password must be at least 8 characters with uppercase, lowercase, number, and special character', 'error');
       return;
     }
     
     // Submit form
   });
   ```

4. **Loading States:**
   ```javascript
   async function handleLogin(e) {
     e.preventDefault();
     
     const button = e.target.querySelector('button[type="submit"]');
     const originalText = button.textContent;
     
     // Show loading
     button.disabled = true;
     button.innerHTML = '<span class="spinner"></span> Logging in...';
     
     try {
       const data = await apiRequest('/auth/login', {
         method: 'POST',
         body: JSON.stringify({
           email: emailInput.value,
           password: passwordInput.value
         })
       });
       
       // Store tokens
       localStorage.setItem('accessToken', data.data.accessToken);
       localStorage.setItem('refreshToken', data.data.refreshToken);
       
       // Redirect
       window.location.href = getRoleRedirect(data.data.user.role);
     } catch (error) {
       showToast(error.message, 'error');
     } finally {
       button.disabled = false;
       button.textContent = originalText;
     }
   }
   ```

5. **Responsive Images:**
   ```html
   <img src="placeholder.svg" 
        data-src="actual-image.jpg" 
        alt="Description"
        class="lazy"
        loading="lazy">
   
   <script>
     // Lazy load images
     const images = document.querySelectorAll('img.lazy');
     const imageObserver = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           const img = entry.target;
           img.src = img.dataset.src;
           img.classList.remove('lazy');
           imageObserver.unobserve(img);
         }
       });
     });
     
     images.forEach(img => imageObserver.observe(img));
   </script>
   ```

---

## 📁 Project Structure

```
campushire-platform/
├── server/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── upload.js              # GridFS configuration
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   ├── userController.js      # User profile
│   │   ├── jobController.js       # Job CRUD
│   │   ├── applicationController.js
│   │   ├── aptitudeController.js
│   │   ├── codeController.js
│   │   ├── forumController.js
│   │   ├── adminController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── errorMiddleware.js     # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── AptitudeTest.js
│   │   ├── TestResult.js
│   │   ├── CodeSnippet.js
│   │   ├── ForumPost.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── aptitudeRoutes.js
│   │   ├── codeRoutes.js
│   │   ├── forumRoutes.js
│   │   ├── adminRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/
│   │   ├── jwt.js                 # Token generation
│   │   ├── email.js               # Email sending
│   │   └── validation.js          # Joi schemas
│   ├── seed/
│   │   └── seedData.js            # Database seeding
│   ├── server.js                  # Express app
│   └── package.json
├── client/
│   ├── index.html                 # Landing page
│   ├── login.html                 # Login page
│   ├── register.html              # Register page
│   ├── student/
│   │   ├── dashboard.html
│   │   ├── jobs.html
│   │   ├── job-details.html
│   │   ├── applications.html
│   │   ├── test.html
│   │   ├── code.html
│   │   ├── forum.html
│   │   ├── post.html
│   │   └── profile.html
│   ├── company/
│   │   ├── dashboard.html
│   │   ├── post-job.html
│   │   ├── my-jobs.html
│   │   ├── applicants.html
│   │   ├── create-test.html
│   │   └── profile.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── users.html
│   │   ├── jobs.html
│   │   └── reports.html
│   ├── css/
│   │   └── styles.css             # Custom styles
│   ├── js/
│   │   ├── app.js                 # Utility functions
│   │   ├── auth.js                # Auth logic
│   │   ├── dashboard.js           # Dashboard logic
│   │   └── charts.js              # Chart initialization
│   └── assets/
│       ├── images/
│       └── icons/
├── .env.example                   # Environment variables template
├── .gitignore
├── README.md                      # Project documentation
├── API_DOCUMENTATION.md           # API reference
└── package.json                   # Root package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for email)

### Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/campushire-platform.git
   cd campushire-platform
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Seed database:**
   ```bash
   node server/seed/seedData.js
   ```

5. **Start backend:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

6. **Open frontend:**
   ```bash
   # Use Live Server extension in VS Code
   # or any static file server
   cd client
   python -m http.server 3000
   ```

7. **Access application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Demo Accounts (from seed data)

**Admin:**
- Email: admin@campushire.com
- Password: Admin@123

**Company (Google):**
- Email: hr@google.com
- Password: Google@123

**Company (Microsoft):**
- Email: hr@microsoft.com
- Password: Microsoft@123

**Student (Rahul):**
- Email: rahul@student.com
- Password: Student@123

---

## ✅ Success Criteria

A successful implementation includes:

1. ✅ All 8 database models with proper indexes
2. ✅ 54+ API endpoints with authentication
3. ✅ JWT with refresh token implementation
4. ✅ GridFS file upload (no AWS)
5. ✅ Role-based authorization (student/company/admin)
6. ✅ Input validation with Joi
7. ✅ Error handling middleware
8. ✅ Security: bcrypt, helmet, rate limiting, sanitization
9. ✅ Email integration (OTP, notifications)
10. ✅ 17+ frontend pages with modern UI
11. ✅ Responsive design (mobile-friendly)
12. ✅ shadcn-inspired components (gradients, shadows, animations)
13. ✅ Client-side form validation
14. ✅ Loading states and error handling
15. ✅ Toast notifications
16. ✅ Seed data script
17. ✅ Comprehensive README
18. ✅ API documentation
19. ✅ Deployment guide
20. ✅ Production-ready code

---

## 📝 Additional Notes

### Code Quality Standards

- Use ES6+ features (async/await, arrow functions, destructuring)
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Add comments for complex logic
- Keep functions small and single-purpose
- Use meaningful variable names
- Handle all error cases
- Validate all inputs
- Use environment variables for config
- Never commit sensitive data (.env in .gitignore)

### Performance Optimization

- Use database indexes for frequent queries
- Implement pagination for large datasets
- Lazy load images
- Debounce search inputs
- Cache static assets
- Minify CSS/JS for production
- Use CDN for external libraries
- Optimize images (WebP format)
- Enable gzip compression

### Security Considerations

- Never expose JWT secret
- Use HTTPS in production
- Implement rate limiting on all routes
- Sanitize all inputs (prevent NoSQL injection)
- Validate file uploads (type, size)
- Set secure cookie flags
- Implement CORS properly
- Use helmet for security headers
- Hash passwords with bcrypt (12+ rounds)
- Implement CSRF protection (if using cookies)

---

## 🎨 Design Reference

Think of these modern platforms for UI inspiration:
- **Linear.app** - Clean, gradient accents, smooth animations
- **Vercel** - Dark mode, card-based, modern typography
- **Railway.app** - Colorful gradients, glassmorphism
- **Stripe** - Professional, accessible, clear hierarchy
- **shadcn/ui** - Component design, Tailwind-based

Key design elements to incorporate:
- Soft shadows (shadow-lg, shadow-xl)
- Gradient text and backgrounds
- Rounded corners (rounded-lg, rounded-xl)
- Spacious layouts (lots of padding)
- Clear typography hierarchy (text-3xl, text-lg, text-sm)
- Consistent color palette
- Smooth hover effects (transition-all duration-200)
- Focus states for accessibility
- Loading skeletons
- Empty states with illustrations

---

## 📦 Deployment

### Backend (Render/Railway)
- Set all environment variables
- Configure MongoDB Atlas whitelist
- Set build command: `npm install`
- Set start command: `node server.js`

### Frontend (Vercel/Netlify)
- Point to `client` directory
- No build command needed (static site)
- Update API_URL to production backend

### Database (MongoDB Atlas)
- Use M0 free tier (512MB)
- Create database user with read/write permissions
- Whitelist IP: 0.0.0.0/0 (allow all) or specific IPs
- Enable automated backups

---

This is a **complete, production-ready project** suitable for:
- Portfolio showcase
- College final year project
- Startup MVP
- Learning full-stack development
- Interview preparation

The code should be clean, well-documented, and deploy-ready. Focus on delivering a **professional, modern web application** that actually works and looks great.

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**License:** MIT
