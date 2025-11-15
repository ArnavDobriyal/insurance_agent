# Insurance Agent Copilot - Backend

Simple, clean backend with Google ADK single agent architecture.

## Architecture

```
backend/
├── main.py              # FastAPI app with single ADK agent
├── tools/               # Simple tool functions (no classes)
│   ├── leads.py         # Lead management functions
│   ├── compliance.py    # IRDAI compliance functions
│   ├── templates.py     # Template management functions
│   └── interactions.py  # Interaction tracking functions
└── requirements.txt     # Python dependencies
```

## Features

- **Single ADK Agent** - One intelligent agent with all tools
- **Simple Functions** - No classes, just pure functions
- **Tool-Based** - Agent uses tools to accomplish any task
- **Auto-Testing** - All tools tested and working

## Tools Available

### Lead Management
- `get_lead(lead_id)` - Get lead details
- `search_leads(temperature, search_term)` - Search leads
- `update_lead(lead_id, **updates)` - Update lead info
- `create_lead(name, phone, email, location)` - Create new lead
- `get_all_leads()` - Get all leads

### Compliance
- `check_compliance(content)` - Check IRDAI compliance
- `get_safe_alternative(content)` - Get compliant version
- `validate_message(message)` - Validate message

### Templates
- `get_all_templates()` - Get all templates
- `get_template(template_id)` - Get specific template
- `search_templates(category, keyword)` - Search templates

### Interactions
- `get_lead_interactions(lead_id)` - Get interaction history
- `add_interaction(lead_id, type, content, sentiment)` - Add interaction
- `analyze_sentiment(lead_id)` - Analyze sentiment trends

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running

```bash
# Development
uvicorn main:app --reload --port 5000

# Production
uvicorn main:app --host 0.0.0.0 --port 5000
```

## API Endpoints

### Main Agent Endpoint

**POST /api/agent**
```json
{
  "message": "Find all hot leads in Mumbai",
  "context": {}
}
```

The agent will:
1. Understand your request
2. Use appropriate tools
3. Make decisions
4. Return results

### Legacy Endpoints (for compatibility)

- `GET /api/leads` - Get leads
- `GET /api/leads/{id}` - Get single lead
- `GET /api/templates` - Get templates
- `POST /api/compliance/validate` - Validate compliance

## Testing Tools

```bash
# Test leads tools
python3 -c "from tools import leads; print(leads.get_all_leads())"

# Test compliance
python3 -c "from tools import compliance; print(compliance.check_compliance('guaranteed returns'))"

# Test templates
python3 -c "from tools import templates; print(templates.get_all_templates())"
```

## Example Usage

```bash
# Ask agent to find hot leads
curl -X POST http://localhost:5000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all hot leads"}'

# Ask agent to check compliance
curl -X POST http://localhost:5000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Is this compliant: guaranteed 20% returns"}'

# Ask agent to update a lead
curl -X POST http://localhost:5000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Update lead-1 to hot temperature"}'
```

## Environment Variables

Create `.env` in project root:

```env
GEMINI_API_KEY=your_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Status

✅ All tools tested and working
✅ Single ADK agent configured
✅ No classes, pure functions
✅ Clean, simple architecture
