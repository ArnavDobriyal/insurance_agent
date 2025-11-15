# Git Setup Guide

## Initial Git Setup

### 1. Initialize Git Repository

```bash
cd insurance-agent-copilot
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: Insurance Agent Copilot with AI, voice recognition, and professional UI"
```

## Connect to GitHub

### Option 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Create a new repository (e.g., `insurance-agent-copilot`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL

### Option 2: Use Existing Repository

If you already have a repository, get its URL from GitHub.

### Connect and Push

```bash
# Add remote origin
git remote add origin https://github.com/your-username/insurance-agent-copilot.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## What's Included

### Files Ready for Git

✅ `.gitignore` - Excludes sensitive and unnecessary files
✅ `.env.example` - Template for environment variables (no secrets)
✅ `README.md` - Complete documentation
✅ `LICENSE` - MIT License
✅ `CONTRIBUTING.md` - Contribution guidelines
✅ `requirements.txt` - Python dependencies
✅ `package.json` - Node.js dependencies

### Files Excluded (in .gitignore)

❌ `.env` - Contains your API keys (NEVER commit this!)
❌ `node_modules/` - Frontend dependencies (too large)
❌ `__pycache__/` - Python cache files
❌ `venv/` - Python virtual environment
❌ `dist/` - Build outputs
❌ `.vscode/`, `.idea/` - IDE settings

## Important: Protect Your API Keys

### Before Committing

**Always check that .env is NOT being committed:**

```bash
# Check what will be committed
git status

# If you see .env in the list, DO NOT COMMIT!
# Make sure .gitignore includes .env
```

### If You Accidentally Committed .env

```bash
# Remove from Git but keep local file
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from Git"

# Push
git push
```

**Then:**
1. Go to https://aistudio.google.com/app/apikey
2. Delete the exposed API key
3. Generate a new API key
4. Update your local `.env` file

## Branch Strategy

### Main Branch
- Production-ready code
- Always stable
- Protected (require PR reviews)

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push feature branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# After review and merge, delete feature branch
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

## Common Git Commands

```bash
# Check status
git status

# View changes
git diff

# Add specific files
git add file1.txt file2.txt

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to remote
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# Merge branch
git merge branch-name

# Delete branch
git branch -d branch-name
```

## GitHub Repository Setup

### Recommended Settings

1. **Branch Protection** (Settings → Branches)
   - Protect `main` branch
   - Require pull request reviews
   - Require status checks to pass

2. **Secrets** (Settings → Secrets and variables → Actions)
   - Add `GEMINI_API_KEY` for CI/CD
   - Never commit secrets to code

3. **Topics** (About section)
   - Add relevant topics: `insurance`, `ai`, `react`, `python`, `fastapi`, `langchain`

4. **Description**
   - "AI-powered insurance agent copilot with voice recognition, smart actions, and professional UI"

5. **Website**
   - Add demo URL if deployed

## Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway/Render (Backend)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

## Collaboration

### For Contributors

1. Fork the repository
2. Clone your fork
3. Create feature branch
4. Make changes
5. Push to your fork
6. Create Pull Request

### For Maintainers

1. Review Pull Requests
2. Test changes locally
3. Merge if approved
4. Delete feature branch

## Troubleshooting

### Large Files

If you accidentally committed large files:

```bash
# Use BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove files larger than 100MB
bfg --strip-blobs-bigger-than 100M

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Merge Conflicts

```bash
# Pull latest changes
git pull origin main

# Resolve conflicts in your editor
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "Resolve merge conflicts"
git push
```

## Best Practices

✅ Commit often with clear messages
✅ Pull before pushing
✅ Use feature branches
✅ Never commit secrets
✅ Keep commits focused
✅ Write descriptive PR descriptions
✅ Test before committing
✅ Review your changes before committing

❌ Don't commit directly to main
❌ Don't commit large files
❌ Don't commit sensitive data
❌ Don't force push to shared branches
❌ Don't commit commented-out code
❌ Don't commit debug logs

## Ready to Push!

Your repository is now Git-ready with:
- ✅ Proper .gitignore
- ✅ Clean .env.example (no secrets)
- ✅ Complete documentation
- ✅ License and contributing guidelines
- ✅ Professional README

Just run:
```bash
git init
git add .
git commit -m "Initial commit: Insurance Agent Copilot"
git remote add origin <your-repo-url>
git push -u origin main
```

Happy coding! 🚀
