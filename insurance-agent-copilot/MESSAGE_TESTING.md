# Message Testing Guide

## Overview
This guide explains how to test the new message detection and AI integration features.

## Features Implemented

### 1. Key Attributes Removal ✅
- Removed Income, Dependents, Age, Source, Prior Policies, Last Touch Point from lead profile
- Cleaned up the Financial Profile section

### 2. Enhanced Product Assignment ✅
- Removed "Details" and "AI Match" buttons
- Fixed "+ Add Multiple" functionality to toggle multi-select mode
- Single "Assign Product(s)" button

### 3. New Message Detection ✅
- Real-time message detection in timeline
- Visual indicators for new messages
- AI button shows notification badge when new messages arrive

### 4. AI Draft Generation ✅
- Separate AI function for communication drafts
- WhatsApp and Email draft suggestions
- Compliance-friendly templates with confidence scores

## Testing Methods

### Method 1: Browser Console (Easiest)
1. Open the lead profile page (e.g., `/leads/lead-1`)
2. Open browser developer tools (F12)
3. In the console, run:
```javascript
// Simulate a new WhatsApp message
simulateMessage('lead-1', 'Hi, I am interested in term insurance. Can you help me?', 'whatsapp');

// Simulate an email
simulateMessage('lead-1', 'Please send me details about your life insurance policies.', 'email');

// Simulate SMS
simulateMessage('lead-1', 'Call me back regarding insurance quote', 'sms');
```

### Method 2: Backend API (For Postman)
1. Start the message API server:
```bash
cd backend
python message_api.py
```

2. Use Postman to send POST request to `http://localhost:5001/api/messages/receive`:
```json
{
  "leadId": "lead-1",
  "content": "Hi, I'm interested in term insurance. Can you help me?",
  "type": "whatsapp"
}
```

### Method 3: Frontend API Integration
The frontend can also call the backend API:
```javascript
fetch('http://localhost:5001/api/messages/receive', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leadId: 'lead-1',
    content: 'Hello, I need insurance advice',
    type: 'whatsapp'
  })
});
```

## Expected Behavior

### When a New Message Arrives:
1. **Timeline Updates**: New message appears at the top with "NEW" badge
2. **Visual Indicators**: Green highlight and animation
3. **AI Button**: Shows red notification badge with message count
4. **Alert Box**: Green alert box appears with message preview
5. **AI Integration**: "Analyze with AI" button redirects to AI page with message context

### Communication Hub AI Drafts:
1. Click "Generate Drafts" button
2. AI creates WhatsApp and Email drafts
3. Each draft shows confidence score and reasoning
4. Click "Use This" to apply draft to message composer
5. Compliance checking prevents non-IRDAI compliant language

### AI Page Integration:
When clicking AI button or "Analyze with AI":
- AI receives full lead context
- New message information is included
- AI can provide contextual responses based on the new message

## Testing Scenarios

### Scenario 1: Basic Message Flow
1. Send message via console: `simulateMessage('lead-1', 'I want life insurance', 'whatsapp')`
2. Verify timeline shows new message
3. Click AI button to see message context passed to AI
4. Use Communication Hub to generate AI drafts

### Scenario 2: Multiple Messages
1. Send multiple messages rapidly
2. Verify all messages appear in timeline
3. Check AI button badge shows correct count
4. Verify AI receives all message context

### Scenario 3: Cross-Channel Messages
1. Send WhatsApp message
2. Send Email message  
3. Send SMS message
4. Verify all appear with correct icons and formatting

## File Structure
```
src/
├── services/
│   └── messageService.ts          # Message handling logic
├── api/
│   └── messageApi.ts             # Frontend API integration
├── components/
│   └── CommunicationHub.tsx      # Enhanced with AI drafts
└── pages/
    └── LeadProfilePage.tsx       # Timeline and message detection

backend/
└── message_api.py                # Backend API for Postman testing
```

## Notes
- Messages are stored in memory (not persistent)
- AI drafts are generated using mock logic (can be replaced with real AI)
- All compliance checking is built-in
- Timeline updates happen in real-time
- AI integration passes full context including new messages