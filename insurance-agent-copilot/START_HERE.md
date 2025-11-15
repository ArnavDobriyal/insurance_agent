# 🚀 Quick Start Guide

## One-Command Startup

Run **ONE** of these commands to start everything:

### Option 1: Python Script (Recommended)
```bash
python start.py
```

### Option 2: Bash Script
```bash
./start.sh
```

### Option 3: Direct Python
```bash
python3 start.py
```

## What Gets Started

The startup script automatically starts all 3 servers:

1. **Backend API** (Port 5000)
   - Main application server
   - LangChain + Gemini AI
   - 52 tools for insurance operations

2. **Whisper Server** (Port 5001)
   - Local speech-to-text
   - Works offline
   - No internet required

3. **Frontend** (Port 3000)
   - React + Vite
   - AI Assistant interface
   - Voice input enabled

## Access Your App

Once started, open your browser:
```
http://localhost:3000
```

## Stop All Services

Press `Ctrl+C` in the terminal where you ran the start script.

All services will stop automatically.

## Features

✅ **One command** starts everything
✅ **Auto port checking** - kills conflicting processes
✅ **Auto dependency install** - runs npm install if needed
✅ **Colored output** - easy to read status
✅ **Graceful shutdown** - Ctrl+C stops all services
✅ **Error handling** - shows which service failed
✅ **Log files** - backend.log, whisper.log, frontend.log

## Troubleshooting

### "Port already in use"
The script automatically kills processes on required ports.

### "npm install failed"
Run manually:
```bash
npm install
```

### "Whisper model download"
First run downloads ~139MB model. Be patient!

### "Backend failed to start"
Check `backend.log` for errors:
```bash
cat backend.log
```

### "Frontend failed to start"
Check `frontend.log` for errors:
```bash
cat frontend.log
```

## Manual Startup (Old Way)

If you prefer to start services separately:

```bash
# Terminal 1: Backend
python backend/main.py

# Terminal 2: Whisper
python backend/whisper_server.py

# Terminal 3: Frontend
npm run dev
```

## Requirements

- Python 3.8+
- Node.js 16+
- npm or yarn
- ~500MB disk space (for Whisper model)

## First Time Setup

The script handles everything automatically:
1. Checks ports
2. Installs npm dependencies (if needed)
3. Downloads Whisper model (if needed)
4. Starts all services
5. Shows status

## Logs

All output is logged to files:
- `backend.log` - Backend API logs
- `whisper.log` - Whisper server logs
- `frontend.log` - Frontend dev server logs

View logs in real-time:
```bash
tail -f backend.log
tail -f whisper.log
tail -f frontend.log
```

## Status Check

After starting, you should see:
```
============================================================
              All Services Running!
============================================================

✓ Backend API:     http://localhost:5000
✓ Whisper Server:  http://localhost:5001
✓ Frontend:        http://localhost:3000

ℹ Press Ctrl+C to stop all services
```

## Quick Commands

```bash
# Start everything
python start.py

# Stop everything
Ctrl+C

# View backend logs
cat backend.log

# View whisper logs
cat whisper.log

# View frontend logs
cat frontend.log

# Clean logs
rm *.log

# Check what's running
lsof -i :5000  # Backend
lsof -i :5001  # Whisper
lsof -i :3000  # Frontend
```

## Production Deployment

For production, use a process manager like:
- **PM2** (Node.js)
- **Supervisor** (Python)
- **systemd** (Linux)
- **Docker** (Containerized)

Example with PM2:
```bash
pm2 start start.py --name insurance-copilot
pm2 logs insurance-copilot
pm2 stop insurance-copilot
```

## Summary

**Before**: Open 3 terminals, run 3 commands
**After**: Open 1 terminal, run 1 command

That's it! 🎉
