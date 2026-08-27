# SocialSphere — CodeAlpha Social Media Platform

SocialSphere is a complete full-stack social media application built for **CodeAlpha Full Stack Development Task 2**. It includes real authentication, persistent MongoDB data, user profiles, posts, comments, likes, follows, notifications, saved posts, user discovery, responsive UI, API security, CI, and containerized local deployment.

## Core internship requirements

- User registration and login
- User profiles
- Create posts with text and optional images
- Comments on posts
- Like / unlike system
- Follow / unfollow system
- MongoDB persistence for users, posts, comments and follower relationships
- Full React frontend + Express backend

## Additional completed features

- Personalized home feed
- Explore/community feed with pagination
- User search by name or username
- Suggested people to follow
- Followers and following lists
- Saved/bookmarked posts
- Post detail / conversation page
- Delete own posts
- Delete own comments; post owners can moderate comments on their posts
- In-app notifications for follows, likes and comments
- Mark notifications as read
- Avatar and bio editing
- Password change screen
- JWT session persistence and automatic logout for expired tokens
- Image type and 5 MB size validation
- Images persisted inside MongoDB media records (no temporary local upload dependency)
- Rate limiting, Helmet headers, CORS allow-listing and request size limits
- Health endpoint and graceful server shutdown
- Responsive desktop, tablet and mobile navigation
- GitHub Actions CI configuration
- Dockerfile + Docker Compose local stack
- Demo data seeder

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Upload handling | Multer memory upload + MongoDB media persistence |
| Security | Helmet, CORS, rate limiting, validation |
| DevOps | GitHub Actions, Docker, Docker Compose |

## Project structure

```text
CodeAlpha_SocialMediaPlatform/
├── .github/workflows/ci.yml
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── utils/
│   └── package.json
├── scripts/setup.ps1
├── Dockerfile
├── docker-compose.yml
└── package.json
```

# Run option A — Windows + MongoDB Atlas

### Requirements

- Node.js 22 LTS or newer
- Git
- MongoDB Atlas account and cluster

### 1. Install and configure

From PowerShell in the repository root:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup.ps1 -MongoUri 'PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE'
```

The setup script:

- creates `server/.env` and `client/.env` if missing;
- inserts the MongoDB URI if supplied;
- generates a strong local JWT secret;
- installs root, backend and frontend dependencies.

### 2. Start development mode

```powershell
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

### 3. Optional demo content

```powershell
npm run seed
```

Demo accounts use the password:

```text
Demo@12345
```

Example demo usernames:

- `ayesha.demo`
- `hamza.demo`
- `sara.demo`

# Run option B — one-command Docker stack

If Docker Desktop is installed, MongoDB and the full application can run locally without Atlas credentials:

```powershell
docker compose up --build
```

Then open:

```text
http://localhost:5000
```

MongoDB data is stored in the named Docker volume `socialsphere_mongo`, so it persists between container restarts.

Stop:

```powershell
docker compose down
```

To also erase the local Docker database:

```powershell
docker compose down -v
```

## Environment configuration

### `server/.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=use-a-random-secret-at-least-32-characters-long
CLIENT_URL=http://localhost:5173
SERVE_CLIENT=false
```

`CLIENT_URL` accepts comma-separated allowed origins for split frontend/backend deployment.

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_MEDIA_URL=http://localhost:5000
```

When the frontend is built and served by the same production Express server, the frontend automatically defaults to `/api` and same-origin media URLs.

## Important API routes

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/password`

### Users

- `GET /api/users/search?q=`
- `GET /api/users/suggestions`
- `GET /api/users/:username`
- `GET /api/users/:username/connections/:type`
- `PATCH /api/users/me`
- `POST /api/users/:userId/follow`

### Posts

- `GET /api/posts/feed`
- `GET /api/posts/explore`
- `GET /api/posts/saved`
- `GET /api/posts/:postId`
- `POST /api/posts`
- `POST /api/posts/:postId/like`
- `POST /api/posts/:postId/save`
- `POST /api/posts/:postId/comments`
- `DELETE /api/posts/:postId/comments/:commentId`
- `DELETE /api/posts/:postId`

### Notifications and media

- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:notificationId/read`
- `GET /api/media/:mediaId`

## Verification flow

1. Register Account A.
2. Register Account B in an incognito/private browser window.
3. From A, search for B and follow B.
4. From B, create a text/image post.
5. From A, refresh Home and confirm B's post appears.
6. Like and comment on B's post.
7. From B, open Notifications and confirm the interactions appear.
8. Save a post and confirm it appears under Saved.
9. Open the post detail page and add/delete a comment.
10. Edit profile name, bio and avatar.
11. Change password in Settings and sign back in with the new password.
12. Restart the backend and confirm accounts/posts/images still exist.

## GitHub

Repository:

`https://github.com/FaisalRayyan/CodeAlpha_SocialMediaPlatform`

After local changes:

```powershell
git add .
git commit -m "feat: complete SocialSphere full-stack platform"
git push origin main
```

## Production notes

- Never commit `server/.env` or `client/.env`.
- Use a strong unique `JWT_SECRET` in public deployment.
- Set `CLIENT_URL` to the real frontend/domain origin.
- MongoDB media storage is intentionally suitable for this internship-sized project. For very large production social networks, object storage/CDN would be preferable.
- Docker Compose's JWT secret is for local development only; replace it for public deployment.

## CodeAlpha submission

See `SUBMISSION_CHECKLIST.md` for the final GitHub/video/submission checklist.
