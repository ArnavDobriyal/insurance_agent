# Insurance Agent AI Copilot

A command-first, AI-driven workspace for insurance agents with ultra-modern design, minimal clicks, AI automation, compliance safety, and context-reactive screens.

## ⚠️ Prerequisites

**This project requires:**
- **Node.js 20.0.0 or higher** (for frontend)
- **Python 3.9 or higher** (for backend)

```bash
node --version   # Must show v20.x.x or higher
python3 --version # Must show 3.9.x or higher
```

**Quick check:**
```bash
./check-setup.sh
```

## Features

- **🤖 Autonomous Agentic AI** - Google ADK-powered agents that make decisions
- **🎯 4 Specialized Agents** - Lead Manager, Communicator, Analyst, Compliance Officer
- **🔧 Tool-Based Architecture** - Agents use tools to accomplish any goal
- **💬 Natural Language Interface** - Just describe what you want
- **🗣️ Voice Commands** - Multi-language support (EN, HI, MR, TA)
- **🔒 IRDAI Compliance** - Automatic validation by compliance agent
- **📊 Smart Analytics** - AI-powered insights and recommendations
- **🎨 Modern UI** - Dark mode, professional design
- **📱 Mobile-First** - Responsive, touch-optimized

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- React Query
- React Router

**Backend:**
- Python 3.9+ + FastAPI
- **Google Agentic Development Kit (ADK)**
- 4 autonomous AI agents
- Tool-based architecture
- IRDAI compliance engine
- Auto-generated API docs

## 🚀 Quick Start

### Prerequisites

- **Node.js 20.0.0 or higher** (Required for frontend)
- **Python 3.9 or higher** (Required for backend)
- npm 9.0.0 or higher
- pip (Python package manager)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

**Check your versions:**
```bash
node --version    # Must show v20.x.x or higher
python3 --version # Must show 3.9.x or higher
```

**If you have an older version, upgrade:**
- Node.js: Using nvm: `nvm install 20 && nvm use 20` or download from https://nodejs.org/
- Python: Download from https://www.python.org/downloads/

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd insurance-agent-copilot
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

4. **Set up environment variables:**

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
# Backend Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

**🎯 Single Command Startup (Recommended):**

```bash
python start.py
```

This will automatically start:
- ✅ Backend API (Port 5000)
- ✅ Whisper Server (Port 5001) - For offline voice recognition
- ✅ Frontend (Port 3000)

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/docs

**To stop all services:**
Press `Ctrl+C` in the terminal

---

**Alternative: Manual Startup (3 terminals):**

If you prefer to run services separately:

**Terminal 1 - Backend API:**
```bash
cd backend
uvicorn main:app --reload --port 5000
```

**Terminal 2 - Whisper Server:**
```bash
cd backend
python whisper_server.py
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

## 🎯 Using the Application

### Login
- Open http://localhost:3000
- Enter any email and password (demo mode)
- Click "Sign In"

### Key Features

1. **🎤 Voice Assistant (Offline)**
   - Click the microphone button (bottom-right floating button)
   - Speak commands like:
     - "Show me hot leads"
     - "Summarize today"
     - "Send WhatsApp to Priya"
     - "Show me where Priya lives"
   - Uses Whisper for offline speech recognition

2. **💬 AI Chat Assistant**
   - Navigate to AI page from bottom navigation
   - Type or speak your queries
   - AI will search leads, create tasks, check compliance, etc.
   - Contextual suggestions appear after responses

3. **📊 Quick Actions**
   - Home page has quick action buttons:
     - Record Call
     - New Lead
     - Summarize
     - Hot Leads

4. **🗺️ Smart Actions**
   - Ask about location → Auto-opens Google Maps
   - Request message → AI generates draft, you confirm
   - Schedule meeting → Opens calendar

### API Documentation

Visit http://localhost:5000/docs for interactive API testing

**Key Endpoints:**
- `POST /api/agent` - Main AI agent endpoint
- `POST /api/agent/stream` - Streaming AI responses
- `POST /api/compliance/validate` - IRDAI compliance check
- `GET /api/leads` - Get all leads
- `GET /api/templates` - Get message templates

## 🔧 Troubleshooting

### Port Already in Use

If you see "Port already in use" errors:

```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5001 (Whisper)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Whisper Model Loading

First time running Whisper will download the model (~140MB). This is normal and only happens once.

### Python Dependencies Issues

If you encounter issues installing Python dependencies:

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt
```

### Frontend Not Loading

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues

Make sure your `.env` file has a valid Gemini API key:
- Get one from: https://makersuite.google.com/app/apikey
- Format: `GEMINI_API_KEY=AIza...`

## 📦 Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
insurance-agent-copilot/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── data/mock/          # Mock data JSON files
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── backend/                # Backend (Python + FastAPI)
│   ├── services/           # Backend services
│   │   ├── gemini_service.py      # AI operations
│   │   ├── compliance_service.py  # IRDAI compliance
│   │   ├── autopilot_service.py   # AutoPilot automation
│   │   └── data_service.py        # Data management
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
├── public/                 # Static assets
├── .env                    # Environment variables (single file)
└── ...config files
```

## Design System

### Colors
- Primary: #6A5AE0 (Violet Indigo)
- Primary Glow: #7C6FF4
- Background: #F4F4F7
- Card: #FFFFFF
- Headings: #0F0F0F
- Body Text: #3B3B3B

### Typography
- Font: Inter or SF Pro
- Headings: 600 weight
- Subheads: 500 weight
- Body: 400 weight

### Border Radius
- Cards: 20px
- Buttons: 15px
- Inputs: 11px
- Panels: 23px

### Shadows
- VisionOS style: 0px 8px 20px rgba(0,0,0,0.08)

## License

MIT
