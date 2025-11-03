# Deployment Guide: Netlify (Frontend) + Railway (Backend)

This guide will walk you through deploying your Smart Campus Recruitment Platform with the frontend on **Netlify** and backend on **Railway**.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment on Railway](#backend-deployment-on-railway)
3. [Frontend Deployment on Netlify](#frontend-deployment-on-netlify)
4. [Update CORS Configuration](#update-cors-configuration)
5. [Testing Your Deployment](#testing-your-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [x] GitHub account (for connecting repositories)
- [x] Railway account (sign up at https://railway.app)
- [x] Netlify account (sign up at https://netlify.com)
- [x] MongoDB Atlas connection string
- [x] Your project code ready

---

## Backend Deployment on Railway

### Step 1: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository** and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Click "New Project"** → **"Deploy from GitHub repo"**
3. **Connect your GitHub account** and select your repository
4. **Railway will auto-detect** your Node.js project

### Step 3: Configure Environment Variables

1. In your Railway project dashboard, click on your service
2. Go to **"Variables"** tab
3. Add the following environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://rushikeshparkhe018_db_user:i8QmUWMmCALxoqgW@prodigy-hire.fyiu2ej.mongodb.net/prodigy-hire
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_12345
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

⚠️ **Important**: Generate a strong JWT_SECRET using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Get Your Railway URL

1. After deployment, Railway will provide a URL like:
   ```
   https://your-app-name.up.railway.app
   ```
2. **Copy this URL** - you'll need it for the frontend configuration
3. Test your backend by visiting: `https://your-app-name.up.railway.app/api/health`

### Step 5: Enable Public Networking

1. In Railway dashboard, go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a public URL
3. Your API will be available at this domain

---

## Frontend Deployment on Netlify

### Step 1: Prepare Your Frontend

1. **Update API URL** in all frontend files. Open each HTML file in `client/` folder and update:

   Find:
   ```javascript
   const API_URL = 'https://smart-campus-recruitment.onrender.com';
   ```

   Replace with:
   ```javascript
   const API_URL = 'https://your-app-name.up.railway.app/api';
   ```

   Files to update:
   - `client/login.html`
   - `client/register.html`
   - `client/student/dashboard.html`
   - `client/student/profile.html`
   - `client/student/jobs.html`
   - `client/student/applications.html`
   - `client/student/tests.html`
   - `client/student/code-playground.html`
   - `client/company/dashboard.html`
   - `client/company/profile.html`
   - `client/company/post-job.html`
   - `client/company/my-jobs.html`
   - `client/company/applicants.html`
   - `client/company/create-test.html`

2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Deploy on Netlify

#### Option A: Deploy via GitHub (Recommended)

1. **Go to Netlify**: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. **Connect to GitHub** and select your repository
4. **Configure build settings**:
   - **Base directory**: `client`
   - **Build command**: (leave empty)
   - **Publish directory**: `client` or `.` (if base is client)
5. Click **"Deploy site"**

#### Option B: Deploy via Drag & Drop

1. **Go to Netlify**: https://app.netlify.com
2. **Drag and drop** your `client` folder directly to Netlify dashboard
3. Netlify will automatically deploy it

### Step 3: Configure Netlify Settings

1. **Site Name**: 
   - Go to **Site settings** → **Site details**
   - Click **"Change site name"** and choose a custom name
   - Your site will be: `https://your-site-name.netlify.app`

2. **Redirects** (for SPA routing):
   - Create a file `client/_redirects` with:
     ```
     /*    /index.html   200
     ```
   - Commit and push

### Step 4: Custom Domain (Optional)

1. Go to **Domain settings** → **Custom domains**
2. Click **"Add custom domain"**
3. Follow instructions to add your domain

---

## Update CORS Configuration

After deploying, you need to update your backend CORS settings to allow requests from your Netlify URL.

### Update `server/server.js`:

Find the CORS configuration:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5500'
];
```

Add your Netlify URL:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5500',
    'https://your-site-name.netlify.app'  // Add your Netlify URL
];
```

**Commit and push** these changes:
```bash
git add server/server.js
git commit -m "Update CORS for Netlify deployment"
git push
```

Railway will automatically redeploy with the new CORS settings.

---

## Testing Your Deployment

### 1. Test Backend API

Visit your Railway URL with `/api/health`:
```
https://your-app-name.up.railway.app/api/health
```

You should see a response like:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

### 2. Test Frontend

1. **Visit your Netlify URL**: `https://your-site-name.netlify.app`
2. **Test Registration**:
   - Register as both student and company
   - Check if accounts are created
3. **Test Login**:
   - Login with created accounts
   - Verify role-based redirects work
4. **Test Features**:
   - **Company**: Post jobs, create tests, view applicants
   - **Student**: Browse jobs, apply, take tests

### 3. Check Browser Console

- Open **Developer Tools** (F12)
- Check **Console** tab for any errors
- Verify API calls are going to Railway URL (not localhost)

---

## Troubleshooting

### Issue 1: "Failed to fetch" or CORS errors

**Solution**: 
1. Verify your Netlify URL is in the CORS `allowedOrigins` array
2. Make sure Railway backend is running (check Railway logs)
3. Check if Railway URL is correct in frontend files

### Issue 2: Backend not responding

**Solution**:
1. Check Railway logs: Dashboard → Select service → **"Logs"**
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is correct
4. Check if Railway assigned a port (it should use `process.env.PORT`)

### Issue 3: Frontend shows "localhost" errors

**Solution**:
1. Search all HTML files for `http://localhost:5000`
2. Replace with your Railway URL
3. Clear browser cache (Ctrl + Shift + Delete)
4. Hard refresh (Ctrl + F5)

### Issue 4: JWT or Authentication errors

**Solution**:
1. Check if `JWT_SECRET` is set in Railway environment variables
2. Ensure it's the same across all deployments
3. Clear localStorage in browser and try logging in again

### Issue 5: Database connection failed

**Solution**:
1. Verify MongoDB Atlas allows connections from anywhere (IP: 0.0.0.0/0)
2. Check MongoDB connection string in Railway environment variables
3. Ensure database user credentials are correct

### Issue 6: Build fails on Railway

**Solution**:
1. Check Railway build logs
2. Ensure `package.json` has correct `start` script:
   ```json
   "scripts": {
     "start": "node server/server.js"
   }
   ```
3. Verify all dependencies are in `package.json`

### Issue 7: 404 errors on Netlify

**Solution**:
1. Create `client/_redirects` file with:
   ```
   /*    /index.html   200
   ```
2. Redeploy on Netlify

---

## Environment Variables Reference

### Railway (Backend)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port (Railway auto-assigns) |
| `MONGODB_URI` | Your MongoDB Atlas URL | Database connection |
| `JWT_SECRET` | Random secret key | JWT encryption key |
| `JWT_EXPIRE` | `7d` | Token expiration |
| `JWT_COOKIE_EXPIRE` | `7` | Cookie expiration in days |

### Netlify (Frontend)

Netlify doesn't need environment variables if you hardcode the Railway API URL in your JavaScript files. However, if you want to use environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add:
   - Key: `VITE_API_URL`
   - Value: `https://your-app-name.up.railway.app/api`

---

## Post-Deployment Checklist

- [ ] Backend is accessible at Railway URL
- [ ] Frontend is accessible at Netlify URL
- [ ] CORS is configured correctly
- [ ] All API calls use Railway URL (not localhost)
- [ ] User registration works
- [ ] User login works (both roles)
- [ ] Company can post jobs
- [ ] Students can view and apply to jobs
- [ ] Tests can be created and taken
- [ ] File uploads work (profile pictures, resumes)
- [ ] Email notifications work (if configured)
- [ ] Database operations work correctly

---

## Useful Commands

### Check Railway logs:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs
```

### Update deployment:
```bash
# Frontend (if using GitHub)
git add .
git commit -m "Update frontend"
git push  # Netlify auto-deploys

# Backend
git push  # Railway auto-deploys
```

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## Quick Deployment Summary

1. **Backend (Railway)**:
   - Push code to GitHub → Connect to Railway → Set env variables → Get URL

2. **Frontend (Netlify)**:
   - Update API URLs → Push to GitHub → Deploy via Netlify → Get URL

3. **Final Step**:
   - Add Netlify URL to backend CORS → Push → Done! ✅

---

**Congratulations! Your Smart Campus Recruitment Platform is now live!** 🚀

Access your platform at: `https://your-site-name.netlify.app`
