# SocialSphere — CodeAlpha Social Media Platform

A complete full-stack social media internship project built for **CodeAlpha Task 2**.

## Features
- User registration and login with JWT authentication
- User profiles with avatar, name and bio editing
- Create text/image posts
- Like/unlike posts
- Add comments
- Follow/unfollow users
- Personalized home feed
- Explore all community posts
- Search users by name or username
- Responsive desktop/mobile UI
- REST API, MongoDB persistence, upload validation, rate limiting and security headers

## Tech Stack
- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- Uploads: Multer (local development)

## Local Setup

### 1. Requirements
- Node.js 20+
- MongoDB Community Server OR MongoDB Atlas
- Git

### 2. Install dependencies
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Environment files
Copy:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
On Windows PowerShell:
```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Change `JWT_SECRET` in `server/.env` to a long random value. If using MongoDB Atlas, replace `MONGODB_URI`.

### 4. Run
```bash
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:5000
- API health: http://localhost:5000/api/health

## GitHub Repository
CodeAlpha asks for repository names in the format `CodeAlpha_ProjectName`. Recommended repository name:

`CodeAlpha_SocialMediaPlatform`

After creating an empty GitHub repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/CodeAlpha_SocialMediaPlatform.git
git branch -M main
git push -u origin main
```

Or with GitHub CLI after installing and logging in:
```bash
gh auth login
gh repo create CodeAlpha_SocialMediaPlatform --public --source=. --remote=origin --push
```

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users/search?q=`
- `GET /api/users/:username`
- `PATCH /api/users/me`
- `POST /api/users/:userId/follow`
- `GET /api/posts/feed`
- `GET /api/posts/explore`
- `POST /api/posts`
- `POST /api/posts/:postId/like`
- `POST /api/posts/:postId/comments`
- `DELETE /api/posts/:postId`

## Deployment note
For production, use a managed MongoDB database (e.g. MongoDB Atlas) and move uploaded images to persistent object storage such as Cloudinary/S3 instead of local disk.
