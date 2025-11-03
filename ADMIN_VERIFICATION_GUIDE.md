# Admin Verification Guide for Recruiters

## How Company/Recruiter Verification Works

### Registration Flow:
1. **Company registers** through the registration page
2. Account is created with `isApproved: false` by default
3. Company **cannot login** until approved by admin
4. Admin must approve the account before company can access the platform

### Login Behavior:
- **Before Approval**: Company gets error "Your account is pending admin approval"
- **After Approval**: Company can login and access dashboard normally

---

## Option 1: Using MongoDB Compass (Recommended for Quick Testing)

### Steps:
1. Open **MongoDB Compass**
2. Connect to: `mongodb+srv://rushikeshparkhe018_db_user:i8QmUWMmCALxoqgW@prodigy-hire.fyiu2ej.mongodb.net/prodigy-hire`
3. Go to **Database: prodigy-hire** → **Collection: users**
4. Find the company user (filter: `{ "role": "company" }`)
5. Click on the document to edit
6. Change `isApproved: false` to `isApproved: true`
7. Click **Update**
8. Now the company can login!

---

## Option 2: Using Backend API (Professional Way)

### 1. First, create an admin account:

**Via MongoDB Compass:**
- Go to `users` collection
- Create new document:
```json
{
  "name": "Admin User",
  "email": "admin@prodigyhire.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "isApproved": true,
  "isActive": true,
  "createdAt": "2025-11-03T00:00:00.000Z",
  "updatedAt": "2025-11-03T00:00:00.000Z"
}
```

**Or use registration and manually change role to "admin" in database**

### 2. Login as admin and use these API endpoints:

**Get all pending companies:**
```bash
GET http://localhost:5000/api/admin/users?role=company&isApproved=false
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

**Approve a company:**
```bash
PATCH http://localhost:5000/api/admin/users/{userId}/approve
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

---

## Option 3: Quick Script to Approve All Companies (Development Only)

Create a file `approve-companies.js` in the server folder:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function approveAllCompanies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const result = await User.updateMany(
      { role: 'company', isApproved: false },
      { $set: { isApproved: true } }
    );
    
    console.log(`✅ Approved ${result.modifiedCount} companies`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

approveAllCompanies();
```

Run with: `node server/approve-companies.js`

---

## Option 4: Temporarily Auto-Approve (Development Only)

**⚠️ NOT RECOMMENDED FOR PRODUCTION**

In `server/models/User.js`, change:
```javascript
isApproved: {
  type: Boolean,
  default: function() {
    return this.role !== 'company';  // Companies need approval
  }
}
```

To:
```javascript
isApproved: {
  type: Boolean,
  default: true  // Auto-approve everyone (DEVELOPMENT ONLY)
}
```

---

## Testing the Verification Flow:

### 1. Register a new company:
- Go to registration page
- Select "Company/Recruiter" role
- Fill in company details
- Submit registration
- Try to login → Should get "pending approval" message

### 2. Approve the company:
- Use MongoDB Compass to set `isApproved: true`
- OR use admin API endpoint
- OR run the approval script

### 3. Login as company:
- Now login should work
- Redirects to company dashboard

---

## Rate Limit Fixed:
- **Old limit**: 5 login attempts per 15 minutes (too strict!)
- **New limit**: 100 login attempts per 15 minutes (better for development)
- If you hit rate limit, wait 15 minutes or restart server

---

## Quick Fix Applied:

✅ **Rate limiting** increased from 5 to 100 attempts
✅ **JSON response** for rate limit errors (fixes parsing error)
✅ **Clear messages** for pending approval in login
✅ **Backend check** prevents unapproved companies from logging in

---

## Current Admin Endpoints Available:

```
GET    /api/admin/stats              - Get platform statistics
GET    /api/admin/users              - Get all users (with filters)
GET    /api/admin/users/:id          - Get specific user
PATCH  /api/admin/users/:id/approve  - Approve company
PATCH  /api/admin/users/:id/ban      - Ban/unban user
DELETE /api/admin/users/:id          - Delete user
```

All require `Authorization: Bearer {admin_access_token}`
