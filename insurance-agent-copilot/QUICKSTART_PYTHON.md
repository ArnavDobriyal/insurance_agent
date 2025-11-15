# Quick Start Guide - Python Backend

Get the Insurance Agent Copilot running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 20+)
node --version

# Check Python (need 3.9+)
python --version
# or
python3 --version

# Check pip
pip --version
```

## Installation Steps

### 1. Clone and Navigate

```bash
cd insurance-agent-copilot
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

Or using uv (faster):

```bash
cd backend
uv pip install -r requirements.txt
cd ..
```

### 4. Configure Environment

```bash
# Copy example
cp .env.example .env

# Edit .env and add your Gemini API key
# Get key from: https://aistudio.google.com/app/apikey
```

Your `.env` should look like:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=AIzaSy...your_actual_key_here
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the Application

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

### 6. Open the App

Visit: http://localhost:3000

## Verify It's Working

1. **Check Backend**: http://localhost:5000/health
   - Should show: `{"status": "healthy", "gemini_configured": true}`

2. **Check API Docs**: http://localhost:5000/docs
   - Interactive Swagger UI

3. **Test Voice Assistant**: Click the microphone icon (bottom-right)

4. **Test Command Bar**: Press `Cmd/Ctrl + K` and type "Show hot leads"

## Common Issues

### "Gemini API not configured"

- Check `.env` file exists in project root (not in backend folder)
- Verify `GEMINI_API_KEY` is set correctly
- Restart the backend server

### "Module not found" errors

```bash
cd backend
pip install -r requirements.txt --upgrade
```

### Port 5000 already in use

```bash
# Kill the process
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

### Python version too old

```bash
# Install Python 3.9+ from python.org
# Or use pyenv:
pyenv install 3.11
pyenv local 3.11
```

## Next Steps

- Read [backend/README.md](backend/README.md) for detailed API documentation
- Explore the Swagger UI at http://localhost:5000/docs
- Check out the main [README.md](README.md) for features and architecture

## Quick Test Commands

```bash
# Test intent extraction
curl -X POST http://localhost:5000/api/ai/intent \
  -H "Content-Type: application/json" \
  -d '{"text": "Show me hot leads"}'

# Test compliance validation
curl -X POST http://localhost:5000/api/compliance/validate \
  -H "Content-Type: application/json" \
  -d '{"content": "This policy has guaranteed returns"}'

# Get all leads
curl http://localhost:5000/api/leads
```

## Development Tips

- Backend auto-reloads on file changes (uvicorn --reload)
- Frontend auto-reloads on file changes (Vite HMR)
- Check backend logs in Terminal 1
- Check frontend logs in Terminal 2 and browser console
- Use Swagger UI for API testing: http://localhost:5000/docs

## Need Help?

- Check the logs in both terminals
- Visit http://localhost:5000/health to verify backend status
- Make sure both servers are running
- Verify `.env` file is in the project root

Happy coding! 🚀
