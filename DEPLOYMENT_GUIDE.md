# 🚀 Deployment Guide - CampusHire Platform

Complete guide to deploy your Smart Campus Recruitment Platform to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment-vercelnetlify)
5. [Environment Variables](#environment-variables)
6. [Email Service Configuration](#email-service-configuration)
7. [Production Checklist](#production-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Accounts
- [ ] GitHub account
- [ ] MongoDB Atlas account (free tier available)
- [ ] Render account (for backend) OR Railway/Heroku
- [ ] Vercel account (for frontend) OR Netlify
- [ ] Gmail account for email service OR SendGrid

### Local Requirements
- Node.js 18+ installed
- Git installed
- Code tested locally

---

## 2. MongoDB Atlas Setup

### Step 1: Create Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create New Project: "CampusHire"
4. Build a Database → Free Tier (M0)
5. Choose Cloud Provider: AWS
6. Region: Choose closest to your users
7. Cluster Name: "campushire-cluster"
8. Click "Create"

### Step 2: Configure Database Access

1. **Database Access** (left sidebar):
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `campushire-admin`
   - Password: Generate secure password (SAVE THIS!)
   - Database User Privileges: Read and write to any database
   - Click "Add User"

2. **Network Access** (left sidebar):
   - Click "Add IP Address"
   - Option 1: Allow Access from Anywhere (0.0.0.0/0) - **Easier for development**
   - Option 2: Add specific IPs (Render/Vercel IPs) - **More secure**
   - Click "Confirm"

### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
   ```
   mongodb+srv://campushire-admin:<password>@campushire-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Replace database name: Add `/campushire` before the `?`:
   ```
   mongodb+srv://campushire-admin:YOUR_PASSWORD@campushire-cluster.xxxxx.mongodb.net/campushire?retryWrites=true&w=majority
   ```

### Step 4: Initialize Database with Seed Data

```bash
# Set MONGODB_URI in your .env
MONGODB_URI=mongodb+srv://...

# Run seed script
node server/seed/seedData.js
```

---

## 3. Backend Deployment (Render)

### Step 1: Prepare Repository

1. Initialize Git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create GitHub repository:
   - Go to GitHub → New Repository
   - Name: `campushire-platform`
   - Push code:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/campushire-platform.git
     git branch -M main
     git push -u origin main
     ```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub account → Select `campushire-platform` repo
4. Configure Service:
   - **Name:** `campushire-backend`
   - **Region:** Choose closest to users
   - **Branch:** `main`
   - **Root Directory:** Leave blank (or `server` if separated)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or `npm start`)
   - **Plan:** Free (or paid for better performance)

### Step 3: Add Environment Variables in Render

Click "Advanced" → "Add Environment Variable":

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://campushire-admin:YOUR_PASSWORD@campushire-cluster.xxxxx.mongodb.net/campushire?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-random-string
JWT_REFRESH_SECRET=your-super-secret-refresh-key-different-from-jwt-secret
CLIENT_URL=https://your-frontend-url.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=CampusHire <noreply@campushire.com>
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Check logs for errors
4. Copy your backend URL: `https://campushire-backend.onrender.com`

### Step 5: Test Backend

```bash
# Health check
curl https://campushire-backend.onrender.com/health

# Expected response:
{"status":"success","message":"Server is running!"}
```

---

## 4. Frontend Deployment (Vercel/Netlify)

### Option A: Vercel (Recommended)

#### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

#### Step 2: Deploy via Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Other (Static Site)
   - **Root Directory:** `client`
   - **Build Command:** Leave empty (static HTML)
   - **Output Directory:** `.` (or leave empty)

#### Step 3: Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://campushire-backend.onrender.com
```

#### Step 4: Update Frontend API URL

In `client/js/app.js`:

```javascript
// Replace
const API_URL = 'http://localhost:5000/api';

// With
const API_URL = 'https://campushire-backend.onrender.com/api';
```

Commit and push:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for build (1-2 minutes)
3. Get URL: `https://campushire.vercel.app`

### Option B: Netlify

#### Step 1: Deploy via Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select repository
4. Configure:
   - **Base directory:** `client`
   - **Build command:** Leave empty
   - **Publish directory:** `client`

#### Step 2: Environment Variables

Site settings → Build & deploy → Environment:

```
VITE_API_URL=https://campushire-backend.onrender.com
```

#### Step 3: Deploy

1. Click "Deploy site"
2. Get URL: `https://campushire.netlify.app`

---

## 5. Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secrets (Generate using: openssl rand -base64 64)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-random-string
JWT_REFRESH_SECRET=your-super-secret-refresh-key-different-from-jwt-secret

# Client URL (for CORS)
CLIENT_URL=https://your-frontend-url.vercel.app

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=CampusHire <noreply@campushire.com>

# Email Configuration (SendGrid - Alternative)
# EMAIL_HOST=smtp.sendgrid.net
# EMAIL_PORT=587
# EMAIL_USER=apikey
# EMAIL_PASSWORD=your-sendgrid-api-key
```

### Frontend

Update `client/js/app.js`:

```javascript
const API_URL = 'https://campushire-backend.onrender.com/api';
```

---

## 6. Email Service Configuration

### Option A: Gmail (Easy Setup)

1. **Enable 2-Factor Authentication:**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Select app: Mail, Device: Other (Custom name)
   - Name: "CampusHire"
   - Copy 16-character password
   - Use this in `EMAIL_PASSWORD` environment variable

3. **Environment Variables:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=CampusHire <noreply@campushire.com>
   ```

### Option B: SendGrid (Production Recommended)

1. **Sign up:** [SendGrid](https://sendgrid.com/)
2. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Name: "CampusHire Production"
   - Permissions: Full Access (or Mail Send only)
   - Copy API Key

3. **Verify Sender:**
   - Settings → Sender Authentication
   - Verify Single Sender
   - Enter email and verify

4. **Environment Variables:**
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

---

## 7. Production Checklist

### Before Deployment

- [ ] All console.log() removed or replaced with proper logging
- [ ] Error handling implemented for all routes
- [ ] Input validation with Joi schemas
- [ ] Rate limiting configured
- [ ] CORS configured with proper CLIENT_URL
- [ ] Environment variables set (no hardcoded values)
- [ ] MongoDB indexes created (run seed script once)
- [ ] Security headers (helmet) enabled
- [ ] File upload size limits set

### After Deployment

- [ ] Test user registration flow
- [ ] Test login with all roles (student, company, admin)
- [ ] Test email delivery (forgot password)
- [ ] Test file upload (resume)
- [ ] Test job creation and application
- [ ] Test aptitude test flow
- [ ] Monitor error logs for 24 hours
- [ ] Set up monitoring (optional: Sentry, LogRocket)

### Security

- [ ] Strong JWT secrets (min 32 characters)
- [ ] MongoDB user has limited permissions
- [ ] Network access configured (not 0.0.0.0/0 in production)
- [ ] Rate limiting active
- [ ] Sanitization middleware enabled
- [ ] HTTPS enforced (automatic with Render/Vercel)

---

## 8. Troubleshooting

### Backend Issues

#### 1. Database Connection Failed

**Error:** `MongoServerError: bad auth`

**Solution:**
- Check MongoDB username/password in connection string
- Ensure database user exists in MongoDB Atlas
- Verify network access allows connections

#### 2. CORS Errors

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
- Update `CLIENT_URL` in backend .env
- Restart backend service
- Clear browser cache

#### 3. Email Not Sending

**Error:** `Invalid login: 535 Authentication Failed`

**Solution:**
- For Gmail: Use app-specific password (not account password)
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Verify EMAIL_HOST and EMAIL_PORT

#### 4. 502 Bad Gateway

**Solution:**
- Check backend logs in Render dashboard
- Ensure `PORT` environment variable is set
- Verify `package.json` has correct start script

### Frontend Issues

#### 1. API Requests Failing

**Error:** `Failed to fetch`

**Solution:**
- Verify API_URL in `client/js/app.js`
- Check backend is running (visit backend health endpoint)
- Check browser console for CORS errors

#### 2. Login Redirects Not Working

**Solution:**
- Ensure frontend routes exist (dashboard pages)
- Check localStorage is enabled in browser
- Verify token is being saved

---

## 9. Custom Domain (Optional)

### For Backend (Render)

1. Render Dashboard → Your Service → Settings
2. "Custom Domains" → Add custom domain
3. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: api
   Value: campushire-backend.onrender.com
   ```
4. Access at: `https://api.yourdomain.com`

### For Frontend (Vercel)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `campushire.com`
3. Add DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 10. Monitoring & Maintenance

### Free Monitoring Tools

1. **Uptime Monitoring:**
   - [UptimeRobot](https://uptimerobot.com/) - Free 50 monitors
   - Ping backend health endpoint every 5 minutes

2. **Error Tracking:**
   - [Sentry](https://sentry.io/) - Free tier available
   - Add to backend for error reporting

3. **Performance:**
   - Vercel Analytics (built-in)
   - Google Analytics for frontend

### Regular Maintenance

- [ ] Review error logs weekly
- [ ] Update dependencies monthly (`npm audit`)
- [ ] Backup database weekly (MongoDB Atlas automated backups)
- [ ] Monitor disk usage
- [ ] Review and remove old test data

---

## 11. Scaling Considerations

### When You Outgrow Free Tier

1. **Database:**
   - Upgrade MongoDB Atlas to M10+ for better performance
   - Enable connection pooling
   - Add read replicas

2. **Backend:**
   - Upgrade Render plan for faster instances
   - Enable auto-scaling
   - Add CDN for static assets

3. **Frontend:**
   - Use Vercel Pro for better performance
   - Enable Edge Functions for dynamic content
   - Add Redis for caching (Upstash)

---

## 📞 Support

If you encounter issues:

1. Check backend logs in Render dashboard
2. Check browser console for frontend errors
3. Review MongoDB Atlas metrics
4. Test API endpoints with Postman/cURL
5. Verify all environment variables are set

---

**Last Updated:** November 2025  
**Platform Version:** 1.0.0

Good luck with your deployment! 🚀
