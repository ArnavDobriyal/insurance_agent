# Brave Browser Microphone Setup Guide

## Why Mic Might Not Work in Brave

Brave has stricter privacy and security settings than Chrome. By default, it may block microphone access or the Speech Recognition API.

## Step-by-Step Fix for Brave Browser

### Step 1: Enable Microphone Access

1. **Open Brave Settings**
   - Click the menu (☰) → Settings
   - Or go to: `brave://settings/`

2. **Navigate to Privacy and Security**
   - Click "Privacy and security" in the left sidebar
   - Click "Site and Shields Settings"

3. **Allow Microphone**
   - Scroll down to "Microphone"
   - Make sure it's set to "Sites can ask to use your microphone"
   - Or directly go to: `brave://settings/content/microphone`

4. **Add Your Site to Allowed List**
   - Click "Add" next to "Allowed to use your microphone"
   - Enter your site URL (e.g., `http://localhost:3000`)
   - Click "Add"

### Step 2: Check Shields Settings

Brave Shields can block Web APIs including Speech Recognition.

1. **Click the Brave Shield icon** (lion icon) in the address bar
2. **Advanced View** → Click "Advanced controls"
3. Make sure these are enabled:
   - ✅ "Allow all cookies" (or at least "Allow cookies from this site")
   - ✅ "Allow all device recognition" 

### Step 3: Enable Web Speech API (If Blocked)

1. Go to `brave://flags/`
2. Search for "Web Speech"
3. Enable any Web Speech related flags
4. Restart Brave

### Step 4: Test Microphone Access

1. Open the app: `http://localhost:3000`
2. Open DevTools (F12)
3. Go to Console tab
4. Click the floating mic button (bottom-right)
5. Look for these console messages:
   - ✅ `✅ Speech Recognition initialized for: en-US`
   - ✅ `🎤 Voice recognition started successfully`
   - ✅ `🎤 Transcript: [your words]`

### Step 5: Grant Permission When Prompted

When you click the mic button for the first time:
1. Brave will show a permission popup
2. Click "Allow"
3. Check "Remember this decision" (optional)

## Common Brave-Specific Issues

### Issue 1: "not-allowed" Error
**Error Message**: "Microphone access denied"

**Solution**:
1. Go to `brave://settings/content/microphone`
2. Remove your site from "Blocked" list if present
3. Add to "Allowed" list
4. Refresh the page

### Issue 2: "Speech recognition not supported"
**Error Message**: "Speech recognition not supported in this browser"

**Solution**:
1. Update Brave to the latest version
2. Brave uses Chromium's Web Speech API
3. Make sure you're on Brave 1.30+ (released 2021+)

### Issue 3: Mic Works But No Transcript
**Symptoms**: Mic button turns red, but no text appears

**Solution**:
1. Check internet connection (Speech Recognition requires internet)
2. Speak clearly and loudly
3. Check system microphone settings
4. Try a different microphone if available

### Issue 4: "Network error"
**Error Message**: "Network error. Speech recognition requires internet connection."

**Solution**:
1. Check internet connection
2. Disable VPN temporarily
3. Check if Brave is blocking network requests
4. Try disabling Brave Shields for this site

## Testing Checklist

Run through this checklist to verify everything works:

- [ ] Brave is updated to latest version
- [ ] Microphone permission granted in Brave settings
- [ ] Site added to allowed microphone list
- [ ] Brave Shields not blocking the site
- [ ] System microphone is working (test in other apps)
- [ ] Internet connection is active
- [ ] Console shows "✅ Speech Recognition initialized"
- [ ] Clicking mic shows permission prompt (first time)
- [ ] Mic button turns red when listening
- [ ] Console shows transcript updates
- [ ] Text appears in input field

## Alternative: Use Chrome or Edge

If Brave continues to have issues, the Speech Recognition API works best in:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Opera
- ❌ Firefox (no Web Speech API support)

## Quick Test Command

Open DevTools Console and run:
```javascript
// Test if Speech Recognition is available
console.log('SpeechRecognition:', 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

// Test microphone permission
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('✅ Microphone access granted'))
  .catch(err => console.error('❌ Microphone access denied:', err));
```

## Features of the Floating Mic Button

Once working, you'll see:

1. **Floating Button** (bottom-right corner)
   - Large, easy to click
   - Gradient blue/purple when idle
   - Red and pulsing when listening
   - Ripple effect animation

2. **Click Behavior**
   - First click: Opens AI chat + starts listening
   - While listening: Click to stop + auto-send
   - Visual feedback with toast notifications

3. **Auto-Send**
   - After you stop speaking, message sends automatically
   - No need to click send button

## Still Not Working?

If you've tried everything:

1. **Check Console Logs**
   - Open DevTools (F12)
   - Look for error messages starting with 🎤 or ❌

2. **Try Incognito Mode**
   - Extensions might interfere
   - Test in Brave Private Window

3. **Reset Brave Settings**
   - Go to `brave://settings/reset`
   - Reset settings to default

4. **Contact Support**
   - Share console error messages
   - Mention Brave version: `brave://version/`

## Brave Version Check

To check your Brave version:
1. Go to `brave://version/`
2. Look for "Brave" version number
3. Should be 1.30 or higher for Web Speech API support
