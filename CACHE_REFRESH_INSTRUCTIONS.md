# 🔧 Browser Cache Issue - How to Fix

## The Problem
Your browser has **cached the old CSS** styles, so even though we've updated the code correctly, you're still seeing the old glassmorphism backgrounds on the Organization form fields.

## The Solution - Hard Refresh

### Option 1: Hard Refresh (Recommended)
1. Open your browser with the app running
2. Press one of these key combinations:
   - **Windows Chrome/Edge**: `Ctrl + Shift + R` or `Ctrl + F5`
   - **Windows Firefox**: `Ctrl + Shift + R`
   - **Mac Chrome/Edge**: `Cmd + Shift + R`
   - **Mac Firefox**: `Cmd + Shift + R`

### Option 2: Clear Browser Cache
1. Open Developer Tools (`F12`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Restart Dev Server
```powershell
# Stop the current dev server (Ctrl+C in the terminal)
# Then restart:
npm run dev
```

## What Should Happen After Refresh

### ✅ All form fields should now have:
- **Background**: Pure `#171719` (dark gray) - NO CHANGES on hover/focus/click
- **Border**: `#333333` (medium gray) in normal state
- **Focus Border**: `#D417C8` (magenta) when focused
- **NO**: Glassmorphism, blur effects, or background color changes

### 📝 Affected Fields in Organization Form:
- Company Name input
- Website input  
- Description textarea
- All dropdown selects (Country, Industry, Company Size, Organization Type)

## Verification
After hard refresh, click on any input field in the Organization form. You should see:
1. Border turns magenta (`#D417C8`)
2. Background stays **exactly the same** dark color (`#171719`)
3. No blur, no transparency, no background lightening

## If It Still Doesn't Work
If the hard refresh doesn't work, try:
```powershell
# Clear Vite cache and restart
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

Then do a hard refresh in your browser.
