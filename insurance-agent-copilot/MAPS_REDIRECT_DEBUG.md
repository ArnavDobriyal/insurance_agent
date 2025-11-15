# Maps Redirect Debugging Guide

## Issue
When asking "Show me where Priya lives", the AI should automatically open Google Maps with the location, but it's not redirecting.

## What Should Happen

### User Query: "Show me where Priya lives"

**Expected Flow**:
1. AI searches for lead: `tool_search_leads(search_term="Priya")`
2. Gets lead data with location: `Mumbai, Maharashtra`
3. AI calls: `tool_open_maps(lead_id, lead_name, location)`
4. Backend returns action: `{"action": "open_maps", "location": "Mumbai, Maharashtra", ...}`
5. Frontend receives action via SSE
6. Frontend opens: `https://www.google.com/maps/search/?api=1&query=Mumbai%2C+Maharashtra`

## Debug Steps

### 1. Check Backend Logs
After asking "Show me where Priya lives", check the terminal for:

```
🔧 Tool output: {'action': 'open_maps', 'leadId': '...', 'leadName': 'Priya Sharma', 'location': 'Mumbai, Maharashtra', ...}
✅ Action detected: open_maps
```

If you see this, the backend is working correctly.

### 2. Check Browser Console
Open DevTools (F12) and look for:

```
🎬 Action received: {action: 'open_maps', location: 'Mumbai, Maharashtra', ...}
🚀 Executing actions: [{action: 'open_maps', ...}]
🎯 Handling action: open_maps {action: 'open_maps', ...}
🗺️ Opening maps for: Mumbai, Maharashtra
```

If you see these logs, the frontend is receiving and processing the action.

### 3. Test Queries

Try these exact queries:

**Query 1**: "Find Priya Sharma"
- Should show lead details
- No map should open

**Query 2**: "Show me where Priya lives"
- Should search for Priya
- Should automatically open Google Maps
- Should show toast: "Opening maps for Priya Sharma"

**Query 3**: "Priya location"
- Should open maps immediately

**Query 4**: "Where does Priya Sharma live"
- Should open maps immediately

## Common Issues

### Issue 1: AI doesn't call tool_open_maps
**Symptom**: No backend logs showing "Tool output"
**Solution**: The AI might not understand the query. Try more explicit queries like:
- "Open maps for Priya"
- "Show Priya's location on map"
- "Navigate to Priya's location"

### Issue 2: Action not sent via SSE
**Symptom**: Backend logs show action, but no frontend logs
**Solution**: Check if the action has the correct structure:
```python
{
    "action": "open_maps",  # Must be exactly this
    "type": "navigation",
    "leadId": "...",
    "leadName": "...",
    "location": "..."  # Must have location
}
```

### Issue 3: Frontend doesn't handle action
**Symptom**: Frontend logs show action received, but no map opens
**Solution**: Check browser console for errors. Verify popup blocker isn't blocking the window.open() call.

### Issue 4: Popup Blocker
**Symptom**: Everything works but no new tab opens
**Solution**: 
- Check browser popup blocker settings
- Allow popups for localhost:3000
- Try clicking the action instead of automatic trigger

## Manual Test

To test if the frontend action handler works, open browser console and run:

```javascript
// Simulate action
const testAction = {
  action: 'open_maps',
  leadId: 'lead-1',
  leadName: 'Test Lead',
  location: 'Mumbai, Maharashtra'
};

// This should open Google Maps
window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(testAction.location)}`, '_blank');
```

If this opens Google Maps, the frontend code is working.

## Expected Behavior

### Successful Flow:
1. User asks about location
2. Backend logs show tool execution
3. Frontend logs show action received
4. New tab opens with Google Maps
5. Toast notification appears
6. Maps shows the location

### What You Should See:
- **Terminal**: Tool output and action detection logs
- **Browser Console**: Action received and execution logs
- **Browser**: New tab with Google Maps
- **UI**: Toast notification "Opening maps for [Lead Name]"

## Testing Now

1. **Start the servers** (already running)
2. **Open browser** to http://localhost:3000
3. **Login** with any credentials
4. **Go to AI page** (click AI in bottom nav)
5. **Type**: "Show me where Priya lives"
6. **Watch**:
   - Terminal for backend logs
   - Browser console for frontend logs
   - New tab should open with Google Maps

If you see the logs but no map opens, it's likely a popup blocker issue. Check your browser settings to allow popups from localhost:3000.
