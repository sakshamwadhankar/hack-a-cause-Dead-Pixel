# JalRakshak Landing Page Integration Test

## ✅ Git Problem FIXED!
- Twilio credentials removed from history
- Successfully pushed to GitHub
- `.gitignore` updated

## 🧪 Testing Steps

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
py -m uvicorn main:app --host 0.0.0.0 --reload --port 8000
```
**Expected:** Backend running on http://localhost:8000

### Step 2: Start JalRakshak Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
**Expected:** Frontend running on http://localhost:5173

### Step 3: Start Driver App (Terminal 3)
```bash
cd frontend-driver
npm run dev
```
**Expected:** Driver app running on http://localhost:5174

### Step 4: Start Landing Page (Terminal 4)
```bash
cd frontend2/jalrakshak-landing
npm install  # First time only
npm run dev
```
**Expected:** Landing page running on http://localhost:3000

## 🎯 Integration Checklist

Open browser: **http://localhost:3000**

### Visual Checks:
- [ ] Landing page loads with hero section
- [ ] "AQUASYNERGY" title visible
- [ ] Animated text cycling through words
- [ ] 4 navigation buttons visible below hero text:
  - 🗺️ Collector Dashboard
  - 🚛 Driver Portal
  - 🏘️ Village Portal
  - 📊 Analytics

### Button Functionality:
- [ ] Click "Collector Dashboard" → Smooth scroll to iframe
- [ ] Iframe loads http://localhost:5173/dashboard
- [ ] Button shows active state (red glow)
- [ ] Dashboard map and villages visible in iframe

- [ ] Click "Driver Portal" → Smooth scroll to iframe
- [ ] Iframe loads http://localhost:5174
- [ ] Driver login page visible in iframe

- [ ] Click "Village Portal" → Smooth scroll to iframe
- [ ] Iframe loads http://localhost:5173/sarpanch
- [ ] Sarpanch view visible in iframe

- [ ] Click "Analytics" → Smooth scroll to iframe
- [ ] Iframe loads http://localhost:5173/analytics
- [ ] Analytics charts visible in iframe

### Design Checks:
- [ ] Buttons have hover effect (scale + glow)
- [ ] Active button has red gradient background
- [ ] Loading spinner shows when iframe loads
- [ ] Iframe has rounded corners and shadow
- [ ] Responsive on mobile (buttons stack vertically)

## 🐛 Common Issues

### Issue 1: "Cannot GET /" on landing page
**Solution:** Make sure you're in `frontend2/jalrakshak-landing` folder
```bash
cd frontend2/jalrakshak-landing
npm install
npm run dev
```

### Issue 2: Iframe shows blank/error
**Solution:** Check if backend and frontend are running
- Backend: http://localhost:8000/docs should work
- Frontend: http://localhost:5173 should work

### Issue 3: Buttons not working
**Solution:** Check browser console for errors
- Press F12 → Console tab
- Look for CORS or network errors

### Issue 4: Port already in use
**Solution:** Kill the process or use different port
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in vite.config.js
```

## 📸 Expected Result

1. **Landing Page Hero:**
   - Beautiful animated title
   - 4 colorful buttons with icons
   - Smooth animations

2. **Iframe Section:**
   - Full-screen embedded app
   - Smooth scroll transition
   - Loading spinner during load
   - Active button highlighted

3. **Navigation Flow:**
   - Click button → Scroll to iframe → Load app
   - Each button loads different route
   - Seamless integration

## ✨ Success Criteria

All checkboxes above should be ✅

If everything works:
- Landing page is live on port 3000
- All 4 apps load correctly in iframe
- Buttons work and show active state
- Design matches original landing page style

## 🎉 Next Steps

If all tests pass:
1. Take screenshots for documentation
2. Test on mobile device
3. Deploy to production
4. Share demo link

If issues found:
1. Note which checkbox failed
2. Check browser console
3. Verify all 4 terminals are running
4. Report specific error messages
