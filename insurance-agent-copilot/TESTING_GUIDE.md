# 🧪 Complete Testing Guide - All Agent Functionality

## 📋 Table of Contents
1. [Lead Management](#lead-management)
2. [Task Management](#task-management)
3. [Daily Summary](#daily-summary)
4. [Templates](#templates)
5. [Compliance](#compliance)
6. [Analytics](#analytics)
7. [Actions](#actions)
8. [Voice Input](#voice-input)

---

## 🎯 Lead Management (12 Tools)

### 1. Search All Leads
**Command**: `"Show me all leads"` or `"Get all leads"`
**Expected**: List of all 5 leads with names, status, phone, premium

### 2. Search Hot Leads
**Command**: `"Show me hot leads"` or `"Find hot leads"`
**Expected**: 2 hot leads (Priya Sharma, Rahul Mehta)

### 3. Search Warm Leads
**Command**: `"Show warm leads"`
**Expected**: 1 warm lead (Sneha Reddy)

### 4. Search Cold Leads
**Command**: `"Show cold leads"`
**Expected**: 2 cold leads (Amit Patel, Vikram Singh)

### 5. Find Specific Lead
**Command**: `"Find Priya Sharma"` or `"Search for Priya"`
**Expected**: Details of Priya Sharma with phone, email, location

### 6. Get Lead by ID
**Command**: `"Get lead lead-1"` or `"Show lead details for lead-1"`
**Expected**: Full details of the lead

### 7. Filter by Tag - Renewals
**Command**: `"Show renewals due"` or `"Get renewal leads"`
**Expected**: Leads with renewal-due tag (Amit Patel)

### 8. Filter by Tag - Follow-up
**Command**: `"Show follow-up leads"` or `"Get follow-ups"`
**Expected**: Leads needing follow-up (Priya Sharma)

### 9. Filter by Tag - High Value
**Command**: `"Show high value leads"` or `"Get high-value leads"`
**Expected**: Leads with high-value tag (Rahul Mehta)

### 10. Filter by Location
**Command**: `"Show leads in Mumbai"` or `"Get Mumbai leads"`
**Expected**: Leads from Mumbai (Priya Sharma, Amit Patel)

### 11. Create New Lead
**Command**: `"Create a new lead"` or `"Add new lead"`
**Expected**: Form prompt or asks for details (name, phone, etc.)

### 12. Update Lead
**Command**: `"Update lead lead-1 temperature to hot"`
**Expected**: Confirmation of update

---

## ✅ Task Management (7 Tools)

### 1. Show All Tasks
**Command**: `"Show all tasks"` or `"Get my tasks"`
**Expected**: List of 3 tasks with titles, leads, priorities

### 2. Tasks Due Today
**Command**: `"What's due today?"` or `"Show tasks due today"`
**Expected**: Tasks with today's date

### 3. Overdue Tasks
**Command**: `"Show overdue tasks"` or `"What's overdue?"`
**Expected**: Tasks past due date

### 4. Urgent Tasks
**Command**: `"Show urgent tasks"` or `"What's urgent?"`
**Expected**: Tasks with urgent priority (Collect documents from Rahul)

### 5. Tasks by Lead
**Command**: `"Show tasks for Priya Sharma"` or `"Get tasks for lead-1"`
**Expected**: Tasks associated with that lead

### 6. Search Tasks
**Command**: `"Search tasks for follow-up"` or `"Find call tasks"`
**Expected**: Tasks matching search term

### 7. Create Task
**Command**: `"Create a task for Priya"` or `"Add new task"`
**Expected**: Task creation confirmation

---

## 📊 Daily Summary (3 Tools)

### 1. Daily Summary
**Command**: `"Summarize today"` or `"What's my day like?"`
**Expected**: 
- Lead statistics (hot/warm/cold)
- Task counts (total/due/urgent)
- Revenue potential
- Action items
- **Auto-creates tasks from action items!**

### 2. Daily Briefing
**Command**: `"Give me today's briefing"` or `"Daily overview"`
**Expected**: Formatted text briefing with all stats

### 3. Create Tasks from Summary
**Command**: After summary: `"Create tasks"` or `"Make these tasks"`
**Expected**: Tasks created from action items

---

## 📝 Templates (3 Tools)

### 1. Show All Templates
**Command**: `"Show all templates"` or `"Get templates"`
**Expected**: List of message templates

### 2. Search Templates
**Command**: `"Find follow-up templates"` or `"Search renewal templates"`
**Expected**: Templates matching category/keyword

### 3. Get Specific Template
**Command**: `"Get template template-1"`
**Expected**: Template details with content

---

## ✅ Compliance (3 Tools)

### 1. Check Compliance
**Command**: `"Check if this is compliant: Guaranteed returns of 20%"`
**Expected**: Compliance violation warning

### 2. Get Safe Alternative
**Command**: `"What's a safe alternative for guaranteed returns?"`
**Expected**: IRDAI-compliant alternative phrase

### 3. Validate Message
**Command**: `"Validate this message: Best policy ever"`
**Expected**: Compliance check result

---

## 📈 Analytics (5 Tools)

### 1. Conversion Stats
**Command**: `"Show conversion stats"` or `"Get conversion rates"`
**Expected**: Conversion probability by lead

### 2. Revenue Forecast
**Command**: `"Show revenue forecast"` or `"What's my potential revenue?"`
**Expected**: Expected revenue based on conversion probability

### 3. Lead Distribution
**Command**: `"Show lead distribution"` or `"Analyze my leads"`
**Expected**: Breakdown by location and product interest

### 4. Top Leads
**Command**: `"Show top leads"` or `"Who are my best leads?"`
**Expected**: Top 5 leads by conversion probability

### 5. Performance Metrics
**Command**: `"Show performance metrics"` or `"How am I doing?"`
**Expected**: Overall performance statistics

---

## 🎬 Actions (10 Tools)

### 1. Open Lead Profile
**Command**: `"Open Priya's profile"` or `"Show lead profile for lead-1"`
**Expected**: Navigation action to lead profile

### 2. Open Maps
**Command**: `"Show Priya on map"` or `"Navigate to lead location"`
**Expected**: Opens Google Maps with location

### 3. Call Lead
**Command**: `"Call Priya"` or `"Phone Priya Sharma"`
**Expected**: Initiates phone call

### 4. Send WhatsApp
**Command**: `"Send WhatsApp to Priya"` or `"Message Priya on WhatsApp"`
**Expected**: Opens WhatsApp

### 5. Send SMS
**Command**: `"Send SMS to Priya"`
**Expected**: Opens SMS app

### 6. Schedule Meeting
**Command**: `"Schedule meeting with Priya"`
**Expected**: Meeting scheduling action

### 7. Create Task for Lead
**Command**: `"Create task for Priya"`
**Expected**: Task creation form

### 8. Send Template
**Command**: `"Send template to Priya"`
**Expected**: Template selection

### 9. Show Create Lead Form
**Command**: `"Create new lead"` or `"Add lead"`
**Expected**: Lead creation form

### 10. Show Edit Lead Form
**Command**: `"Edit lead lead-1"`
**Expected**: Lead editing form

---

## 🎤 Voice Input

### 1. Click Floating Mic Button
**Location**: Bottom-right corner (on all pages except /ai)
**Action**: Click → Opens AI page → Starts recording
**Expected**: Red pulsing mic, "Recording..." indicator

### 2. Click Input Bar Mic
**Location**: AI Assistant page, right side of input
**Action**: Click → Starts recording
**Expected**: Red pulsing mic, "Recording..." indicator

### 3. Speak and Stop
**Action**: Speak → Click mic again → Wait 1-2s
**Expected**: 
- "Processing..." toast
- Text appears in input
- Auto-sends after 0.5s
- Response streams in

### 4. Voice Commands to Try
- "Show me hot leads"
- "Summarize today"
- "Call Priya"
- "What's due today?"
- "Show renewals"

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Search leads (all, hot, warm, cold)
- [ ] Find specific lead by name
- [ ] Show all tasks
- [ ] Show urgent tasks
- [ ] Daily summary
- [ ] Show templates
- [ ] Check compliance

### Voice Input
- [ ] Floating mic button works
- [ ] Input bar mic works
- [ ] Recording indicator shows
- [ ] Transcription appears
- [ ] Auto-send works
- [ ] Response streams

### UI/UX
- [ ] Typing indicator (wave animation)
- [ ] Suggestions appear
- [ ] Suggestions send directly
- [ ] Tables show in messages
- [ ] Navigation at bottom
- [ ] Theme toggle on home only

### Advanced
- [ ] Create tasks from daily summary
- [ ] Call lead action
- [ ] Send WhatsApp action
- [ ] Compliance checking
- [ ] Analytics and forecasts
- [ ] Template search

---

## 💡 Pro Tips

### Natural Language
The agent understands natural language, so you can say:
- "What should I do today?" → Daily summary
- "Who needs a call?" → Hot leads
- "What's urgent?" → Urgent tasks
- "Show me Mumbai people" → Mumbai leads

### Contextual Suggestions
After each response, click the suggested actions for quick navigation:
- After "Show hot leads" → [Show warm leads] [Show renewals] [Call first lead]
- After "Summarize today" → [Show hot leads] [Show tasks] [Show renewals]

### Voice Shortcuts
Use voice for quick queries:
- 🎤 "Hot leads" → Instant results
- 🎤 "Today's summary" → Daily briefing
- 🎤 "Call Priya" → Initiates call

---

## 🎯 Quick Test Scenarios

### Scenario 1: Morning Routine
1. Say: "Summarize today"
2. Review action items
3. Tasks auto-created
4. Click: "Show hot leads"
5. Click: "Call Priya"

### Scenario 2: Lead Management
1. Say: "Show hot leads"
2. Click: "Show warm leads"
3. Say: "Find Priya Sharma"
4. Click: "Call this lead"

### Scenario 3: Task Management
1. Say: "What's urgent?"
2. Click: "Show overdue tasks"
3. Say: "Create task for Priya"

### Scenario 4: Compliance Check
1. Say: "Check if this is compliant: Guaranteed 20% returns"
2. Review violation
3. Say: "What's a safe alternative?"

### Scenario 5: Analytics
1. Say: "Show revenue forecast"
2. Click: "Show top leads"
3. Say: "Show performance metrics"

---

## 📊 Expected Results Summary

**Total Tools**: 52
- Lead Management: 12
- Task Management: 7
- Daily Summary: 3
- Templates: 3
- Compliance: 3
- Analytics: 5
- Actions: 10
- Notifications: 4
- Audit: 2
- Utility: 3

**Voice Recognition**: Whisper (offline)
**Streaming**: Real-time responses
**Auto-send**: After voice transcription
**Suggestions**: Context-aware

---

## 🐛 If Something Doesn't Work

1. **Check servers are running**:
   ```bash
   lsof -i :5000  # Backend
   lsof -i :5001  # Whisper
   lsof -i :3000  # Frontend
   ```

2. **Check logs**:
   ```bash
   cat backend.log
   cat whisper.log
   cat frontend.log
   ```

3. **Restart everything**:
   ```bash
   python start.py
   ```

4. **Check browser console** (F12) for errors

---

## ✅ Success Criteria

- ✅ All 52 tools respond correctly
- ✅ Voice input works offline
- ✅ Responses stream smoothly
- ✅ Typing indicator shows (wave pattern)
- ✅ Suggestions are contextual
- ✅ Tables display in messages
- ✅ Actions trigger correctly
- ✅ Auto-send works after voice

**Happy Testing!** 🚀
