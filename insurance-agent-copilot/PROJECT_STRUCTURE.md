# Project Structure

Clean overview of the Insurance Agent Copilot codebase.

## Directory Layout

```
insurance-agent-copilot/
│
├── backend/                    # Python FastAPI Backend
│   ├── services/               # Business logic services
│   │   ├── gemini_service.py   # AI operations
│   │   ├── compliance_service.py # IRDAI validation
│   │   ├── autopilot_service.py  # Automation
│   │   └── data_service.py     # Data management
│   ├── main.py                 # FastAPI app
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # Backend docs
│
├── src/                        # React Frontend
│   ├── components/             # UI components
│   ├── pages/                  # Page components
│   ├── services/               # API client
│   ├── hooks/                  # Custom hooks
│   ├── types/                  # TypeScript types
│   ├── contexts/               # React contexts
│   ├── data/mock/              # Mock JSON data
│   ├── App.tsx                 # Main app
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── public/                     # Static assets
│
├── .env                        # Environment config (single file)
├── .env.example                # Config template
│
├── package.json                # Frontend dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── tailwind.config.js          # Tailwind config
│
├── check-setup.sh              # Setup verification
├── test-backend.sh             # API testing
│
├── README.md                   # Main documentation
├── START_HERE_PYTHON.md        # Quick start
├── QUICKSTART_PYTHON.md        # Detailed setup
├── MIGRATION_TO_PYTHON.md      # Migration info
├── FILES_OVERVIEW.md           # File guide
└── BACKEND_CONVERSION_COMPLETE.md # Completion report
```

## Key Files

### Configuration
- `.env` - All environment variables (backend + frontend)
- `package.json` - Frontend dependencies and scripts
- `backend/requirements.txt` - Python dependencies

### Backend Entry Points
- `backend/main.py` - FastAPI application with all endpoints

### Frontend Entry Points
- `src/main.tsx` - React app entry point
- `src/App.tsx` - Main app component with routing

### Documentation
- `README.md` - Start here for overview
- `START_HERE_PYTHON.md` - Quick start guide
- `backend/README.md` - Backend API documentation

### Scripts
- `check-setup.sh` - Verify installation
- `test-backend.sh` - Test API endpoints

## Component Organization

### Backend Services
```
services/
├── gemini_service.py      # AI operations
│   ├── extract_intent()
│   ├── summarize_interaction()
│   ├── generate_next_action()
│   ├── predict_objections()
│   └── fill_template()
│
├── compliance_service.py  # IRDAI compliance
│   └── validate_content()
│
├── autopilot_service.py   # Automation
│   ├── start_session()
│   ├── generate_queue()
│   ├── apply_action()
│   └── get_audit_log()
│
└── data_service.py        # Data management
    ├── get_leads()
    ├── get_lead()
    ├── update_lead()
    └── create_lead()
```

### Frontend Components
```
components/
├── AIAssistant.tsx           # AI chat interface
├── CommandBar.tsx            # Command palette
├── VoiceAssistant.tsx        # Voice input
├── AutoPilotMiniPanel.tsx    # AutoPilot status
├── ActivityFeedPanel.tsx     # Action feed
├── LeadCard.tsx              # Lead display
├── NextBestActionCard.tsx    # AI suggestions
├── ObjectionPredictorPanel.tsx # Objections
├── TemplatesPanel.tsx        # Templates
├── ComplianceFlagBadge.tsx   # Compliance alerts
└── ... (20+ more components)
```

### Frontend Pages
```
pages/
├── HomePage.tsx              # Dashboard
├── LeadListPage.tsx          # Lead list
├── LeadProfilePage.tsx       # Lead details
├── TasksPage.tsx             # Tasks
├── NotificationsPage.tsx     # Notifications
├── MapsPage.tsx              # Map view
└── AuditPage.tsx             # Audit log
```

## Data Flow

### AI Request Flow
```
Frontend Component
    ↓
src/services/api.ts (API client)
    ↓
backend/main.py (FastAPI endpoint)
    ↓
backend/services/gemini_service.py (AI logic)
    ↓
Google Gemini API
    ↓
backend/services/compliance_service.py (validation)
    ↓
Response back to frontend
```

### Data Request Flow
```
Frontend Component
    ↓
src/hooks/useLeads.ts (React Query)
    ↓
src/services/api.ts
    ↓
backend/main.py
    ↓
backend/services/data_service.py
    ↓
src/data/mock/*.json (mock data)
    ↓
Response back to frontend
```

## API Endpoints

### AI Endpoints
- `POST /api/ai/intent` - Extract intent
- `POST /api/ai/summarize` - Summarize
- `POST /api/ai/next-action` - Next action
- `POST /api/ai/predict-objections` - Objections
- `POST /api/ai/fill-template` - Fill template

### Compliance
- `POST /api/compliance/validate` - Validate content

### AutoPilot
- `POST /api/autopilot/start` - Start session
- `POST /api/autopilot/pause` - Pause
- `POST /api/autopilot/resume` - Resume
- `POST /api/autopilot/abort` - Abort
- `GET /api/autopilot/queue` - Get queue
- `POST /api/autopilot/action/{id}/apply` - Apply
- `POST /api/autopilot/action/{id}/skip` - Skip
- `GET /api/autopilot/status` - Status
- `GET /api/autopilot/audit` - Audit log

### Data
- `GET /api/leads` - List leads
- `GET /api/leads/{id}` - Get lead
- `POST /api/leads` - Create lead
- `PATCH /api/leads/{id}` - Update lead
- `GET /api/templates` - List templates
- `GET /api/interactions` - List interactions

## Environment Variables

All in `.env` file:

```env
# Backend
PORT=5000
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_key_here

# Frontend
VITE_API_URL=http://localhost:5000/api

# Optional
LOG_LEVEL=INFO
AUTOPILOT_CONFIDENCE_THRESHOLD=70
AUTOPILOT_TIMEBOX_MINUTES=30
```

## Development Workflow

1. **Start Backend**: `npm run server`
2. **Start Frontend**: `npm run dev`
3. **View API Docs**: http://localhost:5000/docs
4. **View App**: http://localhost:3000

## File Counts

- **Backend**: 5 Python files (~1,500 lines)
- **Frontend**: 30+ TypeScript files (~3,000 lines)
- **Documentation**: 6 Markdown files
- **Total**: ~6,500 lines of code

## Dependencies

### Backend (Python)
- fastapi
- uvicorn
- google-generativeai
- pydantic
- python-dotenv

### Frontend (Node.js)
- react
- typescript
- tailwindcss
- framer-motion
- react-router-dom
- axios
- @tanstack/react-query

## Build Output

### Development
- Backend: Hot reload with uvicorn
- Frontend: Hot reload with Vite HMR

### Production
- Frontend: `npm run build` → `dist/`
- Backend: Run with `uvicorn main:app`

---

For detailed information, see:
- [README.md](README.md) - Main documentation
- [backend/README.md](backend/README.md) - Backend details
- [FILES_OVERVIEW.md](FILES_OVERVIEW.md) - File guide
