# 📁 Files Overview - What's What?

Quick reference guide to all the important files in the project.

## 🚀 Getting Started Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `START_HERE_PYTHON.md` | **Start here!** Quick overview | First time setup |
| `QUICKSTART_PYTHON.md` | Detailed 5-minute setup guide | Step-by-step installation |
| `check-setup.sh` | Automated setup verification | Check if everything is installed |
| `test-backend.sh` | Backend API testing script | Verify backend is working |

## 📚 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `README.md` | Main project documentation | Overview of features & architecture |
| `backend/README.md` | Backend-specific documentation | Backend development & API details |
| `MIGRATION_TO_PYTHON.md` | Migration details & benefits | Understanding the Python conversion |
| `BACKEND_CONVERSION_COMPLETE.md` | Completion report | See what was implemented |
| `FILES_OVERVIEW.md` | This file! | Finding your way around |

## ⚙️ Configuration Files

| File | Purpose | Action Required |
|------|---------|-----------------|
| `.env` | **Environment variables** | ✅ Create from `.env.example` and add your `GEMINI_API_KEY` |
| `.env.example` | Template for .env | Copy to `.env` and edit |
| `package.json` | Frontend dependencies & scripts | Auto-used by npm |
| `backend/requirements.txt` | Python dependencies | Run `pip install -r requirements.txt` |

## 🔧 Backend Files (Python)

| File | Purpose | Description |
|------|---------|-------------|
| `backend/main.py` | FastAPI application | Main entry point, all endpoints |
| `backend/services/gemini_service.py` | AI operations | Gemini API integration |
| `backend/services/compliance_service.py` | IRDAI compliance | Validation rules |
| `backend/services/autopilot_service.py` | AutoPilot automation | Workflow execution |
| `backend/services/data_service.py` | Data management | Mock data handling |

## 🎨 Frontend Files (React)

| Directory | Purpose | Description |
|-----------|---------|-------------|
| `src/components/` | UI components | Reusable React components |
| `src/pages/` | Page components | Main app pages |
| `src/services/` | API services | Backend communication |
| `src/hooks/` | Custom hooks | React hooks |
| `src/types/` | TypeScript types | Type definitions |
| `src/data/mock/` | Mock data | JSON data files |

## 🗂️ Old Files (Can Be Deleted)

| File/Directory | Status | Action |
|----------------|--------|--------|
| `server/` | ⚠️ Old Node.js backend | Can be deleted (replaced by `backend/`) |
| `server/.env` | ⚠️ Old config | No longer used |
| `server/.env.example` | ⚠️ Old template | No longer used |

**To remove old files:**
```bash
rm -rf server/
```

## 📝 Helper Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `check-setup.sh` | Verify installation | `./check-setup.sh` |
| `test-backend.sh` | Test API endpoints | `./test-backend.sh` |

## 🔑 Key Files You Need to Edit

### 1. `.env` (Required)

**Location:** Project root
**Action:** Copy from `.env.example` and add your Gemini API key

```bash
cp .env.example .env
# Then edit .env
```

**Must have:**
```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 2. No Other Files Need Editing!

Everything else works out of the box.

## 📦 Dependencies

### Frontend (Node.js)

**File:** `package.json`
**Install:** `npm install`
**Includes:**
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- React Query

### Backend (Python)

**File:** `backend/requirements.txt`
**Install:** `cd backend && pip install -r requirements.txt`
**Includes:**
- FastAPI
- Uvicorn
- Google Generative AI
- Pydantic
- Python-dotenv

## 🌐 URLs When Running

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:5000 | API endpoints |
| Swagger UI | http://localhost:5000/docs | Interactive API docs |
| ReDoc | http://localhost:5000/redoc | Alternative API docs |
| Health Check | http://localhost:5000/health | Backend status |

## 📊 File Size Reference

| Component | Files | Lines of Code |
|-----------|-------|---------------|
| Backend | 5 files | ~1,500 lines |
| Frontend | 30+ files | ~3,000 lines |
| Documentation | 10 files | ~2,000 lines |
| **Total** | **45+ files** | **~6,500 lines** |

## 🎯 Quick Navigation

### I want to...

**Start the application:**
→ Read `START_HERE_PYTHON.md`

**Understand the backend:**
→ Read `backend/README.md`

**Test the API:**
→ Run `./test-backend.sh` or visit http://localhost:5000/docs

**Check my setup:**
→ Run `./check-setup.sh`

**See what changed:**
→ Read `MIGRATION_TO_PYTHON.md`

**Get detailed setup steps:**
→ Read `QUICKSTART_PYTHON.md`

**Understand the architecture:**
→ Read `README.md`

**Find this file:**
→ You're reading it! 😊

## 🔍 File Search Tips

### Find a specific feature:

```bash
# Search in backend
grep -r "function_name" backend/

# Search in frontend
grep -r "ComponentName" src/

# Search in docs
grep -r "keyword" *.md
```

### List all Python files:

```bash
find backend -name "*.py"
```

### List all React components:

```bash
find src/components -name "*.tsx"
```

## 📋 Checklist for New Developers

- [ ] Read `START_HERE_PYTHON.md`
- [ ] Run `./check-setup.sh`
- [ ] Create `.env` from `.env.example`
- [ ] Add `GEMINI_API_KEY` to `.env`
- [ ] Install dependencies (`npm install` and `pip install`)
- [ ] Start backend (`npm run server`)
- [ ] Start frontend (`npm run dev`)
- [ ] Run `./test-backend.sh`
- [ ] Open http://localhost:3000
- [ ] Explore http://localhost:5000/docs
- [ ] Read `backend/README.md` for API details

## 🎓 Learning Path

1. **Day 1:** Setup & Overview
   - `START_HERE_PYTHON.md`
   - `QUICKSTART_PYTHON.md`
   - Run the application

2. **Day 2:** Backend Understanding
   - `backend/README.md`
   - Explore http://localhost:5000/docs
   - Read `backend/main.py`

3. **Day 3:** Frontend Understanding
   - `README.md` (Features section)
   - Explore `src/components/`
   - Test the UI

4. **Day 4:** Deep Dive
   - Read service files in `backend/services/`
   - Understand data flow
   - Test API endpoints

5. **Day 5:** Development
   - Make changes
   - Test features
   - Deploy

## 🆘 Need Help?

**Setup issues:**
→ Run `./check-setup.sh`

**Backend issues:**
→ Run `./test-backend.sh`

**API questions:**
→ Visit http://localhost:5000/docs

**General questions:**
→ Read `README.md` or `backend/README.md`

---

**Remember:** The most important file is `.env` - make sure it has your `GEMINI_API_KEY`!
