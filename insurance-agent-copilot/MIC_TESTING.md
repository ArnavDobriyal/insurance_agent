# Microphone Feature Testing Guide

## Features Implemented

### 1. Voice Input in Collapsed State
- Click the microphone icon in the search bar
- Chat will expand and start listening automatically
- Visual feedback with toast notifications

### 2. Voice Input in Expanded State
- Click the microphone button (left of input field)
- Button turns red and pulses when listening
- "Listening..." indicator appears above input
- Click again to stop recording
- Auto-sends message after stopping

### 3. Visual Feedback
- **Listening indicator**: Red pulsing dot with "Listening..." text
- **Toast notifications**: 
  - "Listening... Speak now" (blue)
  - "Voice recording stopped" (blue)
  - "Microphone access granted" (green)
  - Error messages (red)

### 4. Auto-Send Feature
- When you stop recording, if there's text, it automatically sends after 0.5 seconds
- No need to click send button

## How to Test

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd insurance-agent-copilot
python backend/main.py

# Terminal 2 - Frontend
cd insurance-agent-copilot
npm run dev
```

### Step 2: Test Microphone Permission
1. Open the app in your browser
2. Click the microphone icon
3. Browser will ask for microphone permission
4. Click "Allow"
5. You should see a green toast: "Microphone access granted!"

### Step 3: Test Voice Input (Collapsed State)
1. On the home page, click the mic icon in the search bar
2. Chat should expand
3. Start speaking immediately
4. You should see:
   - Red pulsing mic button
   - "Listening..." indicator
   - Your words appearing in the input field
5. Click mic again to stop
6. Message should auto-send

### Step 4: Test Voice Input (Expanded State)
1. Click anywhere in the search bar to expand chat
2. Click the mic button (left side)
3. Speak your query (e.g., "Show me hot leads")
4. Watch the transcript appear in real-time
5. Click mic to stop
6. Message auto-sends

### Step 5: Test Multi-Language (Optional)
The voice recognition supports:
- English (en-US) - default
- Hindi (hi-IN)
- Marathi (mr-IN)
- Tamil (ta-IN)

Currently set to English. To change, modify the `useVoiceRecognition` hook call.

## Troubleshooting

### Mic Not Working?
1. **Check browser support**: Chrome, Edge, Safari support Web Speech API
2. **Check permissions**: Go to browser settings → Site settings → Microphone
3. **Check console**: Open DevTools (F12) and look for errors
4. **Try HTTPS**: Some browsers require HTTPS for microphone access

### No Transcript Appearing?
1. Check console for "🎤 Transcript:" logs
2. Speak clearly and loudly
3. Check if mic is muted in system settings
4. Try refreshing the page

### Permission Denied?
1. Click the lock icon in address bar
2. Reset microphone permission
3. Refresh page and try again

## Browser Compatibility

✅ **Supported**:
- Chrome 25+
- Edge 79+
- Safari 14.1+
- Opera 27+

❌ **Not Supported**:
- Firefox (no Web Speech API support)
- Internet Explorer

## Console Logs to Watch

When testing, open DevTools console and look for:
- `🎤 Voice recognition started` - Recording started
- `🎤 Transcript: [your text]` - Text recognized
- Any error messages

## Expected Behavior

1. **First click**: Request permission → Show success toast
2. **Second click**: Start listening → Show "Listening..." toast
3. **While listening**: 
   - Mic button is red and pulsing
   - "Listening..." indicator visible
   - Transcript updates in real-time
4. **Stop listening**: 
   - Show "Voice recording stopped" toast
   - Auto-send after 0.5s if text exists

## Demo Queries to Try

Once mic is working, try these voice commands:
- "Summarize today"
- "Show me hot leads"
- "Find Priya Sharma"
- "Show renewals due"
- "Create new lead"
- "What's my day like?"
