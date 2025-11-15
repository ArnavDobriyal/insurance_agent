# 🚀 Start Here - Python Backend Edition

Welcome to the Insurance Agent AI Copilot with the new Python backend!

## What's New?

The backend has been **completely rewritten in Python** with FastAPI, providing:

✅ **Better AI Integration** - Native Google Gemini SDK
✅ **Type Safety** - Pydantic models for all data
✅ **Auto-Generated Docs** - Swagger UI at `/docs`
✅ **Enhanced Features** - All original features + more
✅ **Single .env File** - Simplified configuration
✅ **Better Performance** - FastAPI is blazing fast

## Quick Start (5 Minutes)

### 1. Check Prerequisites

```bash
# Run the setup checker
./check-setup.sh
```

This will verify you have:
- Node.js 20+
- Python 3.9+
- npm and pip

### 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment

```bash
# Copy example
cp .env.example .env

# Edit .env and add your Gemini API key
# Get key from: https://aistudio.google.com/app/apikey
```

Your `.env` should have:
```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
npm run server
```

Wait for: `🚀 Insurance Agent Copilot API starting...`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for: `Local: http://localhost:3000`

### 5. Verify It Works

```bash
# Test the backend
./test-backend.sh
```

Then open: http://localhost:3000

## Key URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs (Swagger)**: http://localhost:5000/docs
- **API Docs (ReDoc)**: http://localhost:5000/redoc
- **Health Check**: http://localhost:5000/health

## Project Structure

```
insurance-agent-copilot/
├── backend/                    # 🆕 Python FastAPI backend
│   ├── main.py                 # Main application
│   ├── services/               # AI, Compliance, AutoPilot, Data
│   └── requirements.txt        # Python dependencies
├── src/                        # React frontend (unchanged)
├── .env                        # 🆕 Single config file
├── check-setup.sh              # 🆕 Setup verification
├── test-backend.sh             # 🆕 Backend testing
└── QUICKSTART_PYTHON.md        # 🆕 Detailed guide
```

## Features

### AI-Powered
- Voice commands (multi-language)
- Intent extraction
- Interaction summarization
- Next best action suggestions
- Objection prediction
- Template auto-filling

### Compliance
- IRDAI rules validation
- Risky phrase detection
- Safe alternative suggestions
- Automatic content sanitization

### AutoPilot
- Automated workflow execution
- Prioritized action queues
- Confidence-based approvals
- Audit trail logging

### Data Management
- Lead CRM
- Template library
- Interaction tracking
- Filtering & search

## Documentation

- **Quick Start**: [QUICKSTART_PYTHON.md](QUICKSTART_PYTHON.md)
- **Backend Details**: [backend/README.md](backend/README.md)
- **Migration Info**: [MIGRATION_TO_PYTHON.md](MIGRATION_TO_PYTHON.md)
- **Completion Report**: [BACKEND_CONVERSION_COMPLETE.md](BACKEND_CONVERSION_COMPLETE.md)
- **Main README**: [README.md](README.md)

## Testing

### Test Backend API

```bash
# Run automated tests
./test-backend.sh

# Or test manually
curl http://localhost:5000/health
curl http://localhost:5000/api/leads
```

### Test AI Features

1. Open http://localhost:5000/docs
2. Try the `/api/ai/intent` endpoint
3. Input: `{"text": "Show me hot leads"}`
4. Click "Execute"

### Test Frontend

1. Open http://localhost:3000
2. Click microphone icon (bottom-right)
3. Say "Show me hot leads"
4. Press `Cmd/Ctrl + K` for command bar

## Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python3 --version  # Need 3.9+

# Reinstall dependencies
cd backend
pip install -r requirements.txt --upgrade
```

### "Gemini API not configured"

```bash
# Check .env file
cat .env | grep GEMINI_API_KEY

# Make sure it's not the placeholder
# Should be: GEMINI_API_KEY=AIzaSy...
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Frontend Can't Connect

```bash
# Check VITE_API_URL in .env
cat .env | grep VITE_API_URL

# Should be: VITE_API_URL=http://localhost:5000/api
```

## Development Tips

### Backend Development

```bash
# Start with auto-reload
cd backend
uvicorn main:app --reload --port 5000

# View logs in terminal
# Changes auto-reload
```

### Frontend Development

```bash
# Start Vite dev server
npm run dev

# Hot module replacement (HMR) enabled
# Changes reflect instantly
```

### API Testing

Use Swagger UI for interactive testing:
1. Go to http://localhost:5000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

### Debugging

```bash
# Backend logs
# Check Terminal 1 where backend is running

# Frontend logs
# Check Terminal 2 and browser console (F12)

# API requests
# Check Network tab in browser DevTools
```

## Next Steps

1. ✅ Backend running
2. ✅ Frontend running
3. ⏭️ Explore the UI
4. ⏭️ Test AI features
5. ⏭️ Try AutoPilot mode
6. ⏭️ Check compliance validation
7. ⏭️ Review API docs

## Getting Help

### Check Documentation
- Run `./check-setup.sh` for setup issues
- Run `./test-backend.sh` for API issues
- Check `backend/README.md` for backend details
- Check `QUICKSTART_PYTHON.md` for step-by-step guide

### Verify Services
```bash
# Backend health
curl http://localhost:5000/health

# Should return:
# {"status": "healthy", "gemini_configured": true}
```

### Common Commands

```bash
# Start backend
npm run server

# Start frontend
npm run dev

# Check setup
./check-setup.sh

# Test backend
./test-backend.sh

# Install backend deps
cd backend && pip install -r requirements.txt

# Install frontend deps
npm install
```

## What's Different from Node.js Version?

### Same
- ✅ All API endpoints (same URLs)
- ✅ All features
- ✅ Frontend code (no changes)
- ✅ Data formats
- ✅ Response structures

### Better
- ✅ Type safety with Pydantic
- ✅ Auto-generated API docs
- ✅ Better error handling
- ✅ Cleaner code structure
- ✅ Single .env file
- ✅ Faster performance

### New
- ✅ Swagger UI at `/docs`
- ✅ ReDoc at `/redoc`
- ✅ Setup checker script
- ✅ Backend test script
- ✅ Comprehensive documentation

## Success Checklist

- [ ] Prerequisites installed (Node.js 20+, Python 3.9+)
- [ ] Dependencies installed (npm install, pip install)
- [ ] .env file configured with GEMINI_API_KEY
- [ ] Backend starts successfully (npm run server)
- [ ] Frontend starts successfully (npm run dev)
- [ ] Health check passes (http://localhost:5000/health)
- [ ] Frontend loads (http://localhost:3000)
- [ ] API docs accessible (http://localhost:5000/docs)
- [ ] Test script passes (./test-backend.sh)

## Ready to Go!

Once all checks pass, you're ready to:

1. **Explore the UI** - Modern, minimal design
2. **Test Voice Commands** - Multi-language support
3. **Try AutoPilot** - Automated workflows
4. **Check Compliance** - IRDAI validation
5. **Review API Docs** - Interactive Swagger UI

**Have fun building with the Insurance Agent AI Copilot!** 🎉

---

*For detailed information, see [QUICKSTART_PYTHON.md](QUICKSTART_PYTHON.md)*
