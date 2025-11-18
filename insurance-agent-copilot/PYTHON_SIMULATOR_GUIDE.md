# Python Message Simulator Guide

## Overview
The `simulate_messages.py` script provides a simple way to test the message detection and AI integration features without needing Postman or external APIs.

## Features Implemented ✅

### 1. **Fixed Product Assignment**
- ✅ **Working dropdown selection** with categories and products
- ✅ **Functional "Add Multiple" toggle** for multi-select mode
- ✅ **Visual product management** with remove buttons
- ✅ **Quick-add AI recommendations** with one-click assignment
- ✅ **Real-time product list updates** in the UI

### 2. **Removed SMS Option**
- ✅ **Only WhatsApp and Email** channels available
- ✅ **Cleaned up templates** and removed SMS references
- ✅ **Simplified channel selection** UI

### 3. **Enhanced AI Drafts**
- ✅ **Auto-generate on template selection** - AI drafts appear when you choose a template
- ✅ **Context-aware content** based on last interaction and product interest
- ✅ **Template-specific messaging** - different drafts for follow-up, quote-ready, etc.
- ✅ **Confidence scores and reasoning** for each AI-generated draft

### 4. **Python Simulator (No Postman needed)**
- ✅ **Interactive menu system** for easy message simulation
- ✅ **Multiple simulation modes** - single messages, conversations, bulk generation
- ✅ **Automatic file updates** - messages appear in timeline immediately
- ✅ **Realistic message templates** for different scenarios

## How to Use

### Step 1: Run the Python Simulator
```bash
cd insurance_agent/insurance-agent-copilot
python simulate_messages.py
```

### Step 2: Choose Simulation Mode
The script offers several options:

#### **Option 1: Single Random Message**
- Generates one random message from a random lead
- Good for quick testing

#### **Option 2: Message to Specific Lead**
- Choose a specific lead (lead-1, lead-2, etc.)
- Sends a random message from that lead

#### **Option 3: Simulate Conversation**
- Creates a realistic conversation flow
- Multiple related messages from the same lead
- Includes scenarios like: interest inquiry, quote follow-up, complaints

#### **Option 4: Custom Message**
- Send your own custom message content
- Choose the lead and write the exact message

#### **Option 5: Bulk Simulate**
- Generates 10 random messages quickly
- Good for testing timeline performance

### Step 3: View Results in App
1. **Open lead profile page** (e.g., `/leads/lead-1`)
2. **Check timeline** - new messages appear with "NEW" badges
3. **Click AI button** - see notification badge with message count
4. **Use Communication Hub** - select templates to see AI drafts

## AI Draft Workflow

### How AI Drafts Work Now:
1. **Select a template** in Communication Hub (Follow-up, Quote Ready, etc.)
2. **AI drafts auto-generate** based on:
   - Selected template type
   - Last interaction summary
   - Lead's product interests
   - Lead's name and context
3. **Review generated drafts** with confidence scores
4. **Click "Use This"** to apply draft to message composer
5. **Edit if needed** and send

### Example AI Draft Generation:
```
Template: "Quote Ready"
Last Interaction: "Discussed term life policy options"
Product Interest: ["Term Assurance Plans"]
Lead: "Priya Sharma"

Generated WhatsApp Draft:
"Hi Priya! Great news - your Term Assurance Plans quote is ready! 
Premium starts from ₹8,500/year for comprehensive coverage. 
Note: Final premium subject to medical underwriting. 
Shall I share the details?"

Confidence: 89%
Reasoning: "Generated based on quote-ready template and last interaction 
context. Maintains friendly tone while addressing Term Assurance Plans interest."
```

## Testing Scenarios

### Scenario 1: Product Assignment
1. Go to lead profile page
2. Scroll to "Possible Likely Production" section
3. Click category dropdown → select "Term Assurance Plans"
4. Click product dropdown → select "LIC's Digi Term"
5. Click "Add Product" → see it appear in assigned products
6. Click "X" on product tag → see it removed
7. Click "+ Add Multiple" → see dropdown change to multi-select

### Scenario 2: Message Detection & AI
1. Run Python simulator: `python simulate_messages.py`
2. Choose option 2 → enter "lead-1"
3. Go to lead-1 profile page
4. See new message in timeline with "NEW" badge
5. See AI button with red notification badge
6. Click "Analyze with AI" → see message context passed to AI

### Scenario 3: AI Draft Generation
1. Go to Communication Hub
2. Select "WhatsApp" channel
3. Choose "Follow-up" template
4. Watch AI drafts auto-generate
5. Review WhatsApp and Email drafts
6. Click "Use This" on preferred draft
7. See content populate in message composer

### Scenario 4: Conversation Simulation
1. Run Python simulator
2. Choose option 3 (Simulate conversation)
3. Enter "lead-1" and "3" messages
4. Go to lead profile → see conversation thread
5. Each message shows as separate timeline entry
6. AI button shows total new message count

## File Structure
```
insurance_agent/insurance-agent-copilot/
├── simulate_messages.py              # Python simulator (NEW)
├── src/
│   ├── components/
│   │   ├── ProductAssignment.tsx     # Fixed product assignment (NEW)
│   │   └── CommunicationHub.tsx      # Enhanced with AI drafts
│   ├── pages/
│   │   └── LeadProfilePage.tsx       # Updated with new components
│   └── data/mock/
│       └── interactions.json         # Updated by Python simulator
└── PYTHON_SIMULATOR_GUIDE.md        # This guide (NEW)
```

## Key Improvements Made

1. **Product Assignment**: Now fully functional with proper state management
2. **AI Integration**: Drafts generate automatically based on context
3. **Simplified Testing**: No need for Postman or external APIs
4. **Better UX**: Removed SMS clutter, focused on WhatsApp/Email
5. **Realistic Simulation**: Python script creates believable message scenarios

## Notes
- Messages are saved to `src/data/mock/interactions.json`
- Timeline updates happen in real-time when file changes
- AI drafts are generated using template + context logic
- All compliance checking remains intact
- No external dependencies required for testing