# 🎯 Single Command Startup - Complete Guide

## ✨ The Easy Way

Instead of opening 3 terminals and running 3 commands, now you just run:

```bash
python start.py
```

**That's it!** Everything starts automatically.

## 📋 What Happens

When you run `python start.py`, the script:

1. ✅ Checks if ports 5000, 5001, 3000 are available
2. ✅ Kills any conflicting processes
3. ✅ Starts Backend API (port 5000)
4. ✅ Starts Whisper Server (port 5001)
5. ✅ Installs npm dependencies (if needed)
6. ✅ Starts Frontend (port 3000)
7. ✅ Monitors all services
8. ✅ Shows colored status output

## 🎨 What You'll See

```
============================================================
          Insurance Agent Copilot Startup
============================================================

ℹ Project directory: /path/to/insurance-agent-copilot
ℹ Checking ports...
✓ All ports available

============================================================
          Starting Backend API (Port 5000)
============================================================

✓ Backend API starting...
✓ Backend API running on http://localhost:5000

============================================================
          Starting Whisper Server (Port 5001)
============================================================

✓ Whisper Server starting...
ℹ Loading Whisper model (this may take a moment)...
✓ Whisper Server running on http://localhost:5001

============================================================
          Starting Frontend (Port 3000)
============================================================

✓ Frontend starting...
✓ Frontend running on http://localhost:3000

============================================================
              All Services Running!
============================================================

✓ Backend API:     http://localhost:5000
✓ Whisper Server:  http://localhost:5001
✓ Frontend:        http://localhost:3000

ℹ Press Ctrl+C to stop all services
```

## 🛑 How to Stop

Just press `Ctrl+C` in the terminal.

The script will:
1. Stop Frontend
2. Stop Whisper Server
3. Stop Backend API
4. Clean up all processes
5. Exit gracefully

## 📁 Files Created

### Startup Scripts
- `start.py` - Python version (recommended)
- `start.sh` - Bash version (alternative)
- `START_HERE.md` - Quick reference
- `README_STARTUP.md` - This file

### Log Files (created when running)
- `backend.log` - Backend API output
- `whisper.log` - Whisper server output
- `frontend.log` - Frontend dev server output

## 🔧 Advanced Usage

### View Logs While Running

Open new terminals and run:
```bash
# Watch backend logs
tail -f backend.log

# Watch whisper logs
tail -f whisper.log

# Watch frontend logs
tail -f frontend.log
```

### Clean Up Logs
```bash
rm *.log
```

### Check Running Processes
```bash
# Check all ports
lsof -i :5000,5001,3000

# Check specific port
lsof -i :5000
```

### Kill Specific Service
```bash
# Kill backend
lsof -ti:5000 | xargs kill -9

# Kill whisper
lsof -ti:5001 | xargs kill -9

# Kill frontend
lsof -ti:3000 | xargs kill -9
```

## 🐛 Troubleshooting

### Script Won't Start

**Problem**: Permission denied
```bash
chmod +x start.py
chmod +x start.sh
```

**Problem**: Python not found
```bash
python3 start.py
```

### Port Already in Use

The script automatically handles this, but if it fails:
```bash
# Manually kill processes
lsof -ti:5000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Then run again
python start.py
```

### Service Failed to Start

Check the log files:
```bash
cat backend.log
cat whisper.log
cat frontend.log
```

### Whisper Model Download

First time running downloads ~139MB model:
- Be patient (takes 1-2 minutes)
- Requires internet connection (one time only)
- Model cached for future use

### npm Dependencies

If `npm install` fails:
```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try again
python start.py
```

## 🎯 Comparison

### Before (Old Way)
```bash
# Terminal 1
cd insurance-agent-copilot
python backend/main.py

# Terminal 2
cd insurance-agent-copilot
python backend/whisper_server.py

# Terminal 3
cd insurance-agent-copilot
npm run dev

# To stop: Ctrl+C in each terminal
```

### After (New Way)
```bash
# Terminal 1
cd insurance-agent-copilot
python start.py

# To stop: Ctrl+C once
```

**Saved**: 2 terminals, 2 commands, manual coordination

## 🚀 Quick Commands Reference

```bash
# Start everything
python start.py

# Alternative (bash)
./start.sh

# Stop everything
Ctrl+C

# View logs
cat backend.log
cat whisper.log
cat frontend.log

# Clean logs
rm *.log

# Check status
lsof -i :5000,5001,3000

# Manual cleanup
lsof -ti:5000,5001,3000 | xargs kill -9
```

## 📊 System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: 7 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 500MB for Whisper model
- **OS**: Linux, macOS, Windows (WSL)

## 🎉 Benefits

✅ **One command** - Start everything at once
✅ **Auto cleanup** - Ctrl+C stops all services
✅ **Port management** - Automatically handles conflicts
✅ **Dependency check** - Installs npm packages if needed
✅ **Error handling** - Shows which service failed
✅ **Colored output** - Easy to read status
✅ **Log files** - Debug issues easily
✅ **Process monitoring** - Restarts if service crashes

## 📝 Notes

- First run takes longer (downloads Whisper model)
- Subsequent runs are fast (~10 seconds)
- Logs are overwritten each run
- Services start in order (Backend → Whisper → Frontend)
- Frontend takes longest to start (Vite dev server)

## 🎓 For Developers

### Modify Startup Order

Edit `start.py` and change the order in the `main()` function.

### Add New Service

Add a new section in `start.py`:
```python
# Start New Service
print_header("Starting New Service (Port XXXX)")
new_process = subprocess.Popen(...)
processes.append(("New Service", new_process))
```

### Change Ports

Edit the `ports` dictionary in `start.py`:
```python
ports = {
    5000: "Backend API",
    5001: "Whisper Server",
    3000: "Frontend",
    8000: "New Service"  # Add new port
}
```

## 🎯 Summary

**Old Way**: 3 terminals, 3 commands, manual management
**New Way**: 1 terminal, 1 command, automatic management

**Time Saved**: ~2 minutes per startup
**Complexity Reduced**: 66%
**Error Prone**: Much less

Just run `python start.py` and you're done! 🚀
