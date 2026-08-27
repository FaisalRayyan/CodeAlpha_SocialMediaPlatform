# Final Run Guide — SocialSphere

## Fastest Windows route

1. Extract/copy the final project over your existing repository.
2. Open PowerShell in the repository root.
3. Run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup.ps1 -MongoUri 'YOUR_MONGODB_ATLAS_URI'
npm run dev
```

4. Open `http://localhost:5173`.
5. Verify `http://localhost:5000/api/health` returns `database: connected`.
6. Optional demo users:

```powershell
npm run seed
```

## Docker route (no Atlas account required)

Install Docker Desktop, then:

```powershell
docker compose up --build
```

Open `http://localhost:5000`.

## Final GitHub update

```powershell
git status
git add .
git commit -m "feat: complete SocialSphere full-stack platform"
git push origin main
```

Do not add `.env` files to Git. `.gitignore` already excludes them.
