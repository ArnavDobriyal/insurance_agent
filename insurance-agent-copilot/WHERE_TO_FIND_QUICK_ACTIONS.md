# Where to Find Quick Actions

## Location
The quick action buttons are in the **AI Assistant Chat** page.

## How to Access

1. **Open the app**: http://localhost:3000
2. **Navigate to AI Assistant**: 
   - Click the "AI" icon in the bottom navigation bar
   - OR click the floating purple microphone button (it will take you to AI page)

3. **Look at the bottom of the screen**:
   ```
   ┌─────────────────────────────────────┐
   │                                     │
   │     Chat Messages Area              │
   │                                     │
   ├─────────────────────────────────────┤
   │  [New Lead] [Summarize] [Hot Leads] │  ← QUICK ACTIONS HERE
   │  [Today Tasks]                      │
   ├─────────────────────────────────────┤
   │  [Type your message...] [🎤] [📤]  │  ← Input bar
   ├─────────────────────────────────────┤
   │  [Home] [Leads] [Tasks] [AI] [More] │  ← Bottom nav
   └─────────────────────────────────────┘
   ```

## What You Should See

**4 Buttons in a horizontal row:**

1. **👤 New Lead** - Glass effect button with UserPlus icon
2. **📄 Summarize** - Glass effect button with FileText icon  
3. **📈 Hot Leads** - Glass effect button with TrendingUp icon
4. **📅 Today Tasks** - Glass effect button with Calendar icon

## Button Appearance

- **Background**: Glass effect (semi-transparent with blur)
- **Border**: Subtle border that glows on hover
- **Text**: Gray text that turns white on hover
- **Icons**: 14px icons next to text labels
- **Size**: Compact (px-3 py-2)
- **Scroll**: Horizontal scroll if screen is small

## If You Don't See Them

### Try These Steps:

1. **Hard Refresh the Browser**:
   - Chrome/Edge: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
   - Firefox: `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)

2. **Clear Browser Cache**:
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check Console for Errors**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for any red errors

4. **Verify You're on the AI Page**:
   - URL should be: `http://localhost:3000/ai`
   - Bottom nav should have "AI" highlighted

5. **Check if Frontend Rebuilt**:
   - Vite should auto-reload when files change
   - Look for "page reload" message in browser console

## Testing the Buttons

Once you see them, try clicking:

1. **New Lead** → Should send "Create new lead" to AI
2. **Summarize** → Should send "Summarize today" to AI
3. **Hot Leads** → Should send "Show hot leads" to AI
4. **Today Tasks** → Should send "Show tasks due today" to AI

Each button should:
- Trigger immediately (no typing needed)
- Show the command being sent
- Display AI response

## Mobile View

On mobile/narrow screens:
- Buttons will be in a scrollable row
- Swipe left/right to see all buttons
- Scrollbar is hidden for clean look

## Troubleshooting

### If buttons still don't appear:

1. **Check the file was saved**:
   ```bash
   cat insurance-agent-copilot/src/components/AIAssistantChat.tsx | grep "Quick Action"
   ```
   Should show: `{/* Quick Action Buttons */}`

2. **Restart the frontend**:
   - Stop the server (Ctrl+C)
   - Run: `python start.py`

3. **Check browser compatibility**:
   - Use Chrome, Firefox, Edge, or Safari
   - Make sure JavaScript is enabled

4. **Verify Vite is running**:
   - Should see "Frontend running on http://localhost:3000"
   - Check terminal for any build errors

## Expected Behavior

✅ Buttons appear above input bar
✅ Buttons have icons + text labels
✅ Hover shows border glow effect
✅ Click sends command immediately
✅ Works on mobile and desktop
✅ Scrollable on small screens

If you still don't see them after hard refresh, let me know and I'll help debug!
