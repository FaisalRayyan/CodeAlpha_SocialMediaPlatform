# GitHub Setup — CodeAlpha_SocialMediaPlatform

## Option A: GitHub website + Git (works everywhere)
1. Sign in to GitHub.
2. Create a new **public** repository named `CodeAlpha_SocialMediaPlatform`.
3. Do NOT add README, .gitignore, or license on GitHub because this project already contains them.
4. In this project folder run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/CodeAlpha_SocialMediaPlatform.git
git branch -M main
git push -u origin main
```

If GitHub asks for credentials over HTTPS, use browser/Git Credential Manager authentication or a Personal Access Token; GitHub account passwords are not accepted for Git operations.

## Option B: GitHub CLI
Install GitHub CLI from https://cli.github.com/, then:

```bash
gh auth login
gh repo create CodeAlpha_SocialMediaPlatform --public --source=. --remote=origin --push
```

## Recommended commit workflow
```bash
git add .
git commit -m "feat: initialize full-stack social media platform"
git push
```
