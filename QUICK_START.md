# 🚀 JalRakshak - Quick Start Guide

## ✅ Everything is Ready!

All dependencies are installed and the Android project is set up. Here's how to run everything:

---

## 🎯 Option 1: Run Everything (Recommended)

### Just double-click this file:
```
start.bat
```

This starts:
- ✅ Backend API (port 8000)
- ✅ Collector Dashboard (port 5173)
- ✅ Driver Web App (port 5174)

---

## 📱 Option 2: Test Driver App on Phone (PWA)

### Step 1: Find Your IP
The `start.bat` will show your IP address automatically.

Or run manually:
```bash
cd backend
py find_ip.py
```

### Step 2: Open on Phone
1. Make sure phone is on **same WiFi** as computer
2. Open **Chrome** on Android phone
3. Go to: `http://[YOUR-IP]:5174`
4. Tap menu (3 dots) → **"Add to Home Screen"**
5. App installs like a native app!

### Step 3: Login
- Phone: `9876543210` (Ramesh Patil - Latur)
- Phone: `9321098765` (Ravi Thakur - Nagpur)
- OTP: Shown on screen (demo mode)

---

## 🤖 Option 3: Build Android APK

### Method A: Use Setup Script (Easiest)

```bash
cd frontend-driver
setup-android.bat
```

This will:
1. Install dependencies
2. Build the app
3. Sync to Android
4. Open Android Studio

### Method B: Manual Steps

```bash
cd frontend-driver

# Already done, but if needed:
npm install --legacy-peer-deps
npm run build
npx cap sync android
npx cap open android
```

### In Android Studio:
1. Wait for Gradle sync (bottom right)
2. Click green **Run** button (▶️)
3. Select your phone or emulator
4. App installs and launches!

---

## 🔧 Update API URL for Android

Before building APK, update the IP address:

**Edit:** `frontend-driver/src/utils/api.js`

**Find this line:**
```javascript
return "http://192.168.1.5:8000"  // ⚠️ UPDATE THIS
```

**Replace with YOUR computer's IP:**
```javascript
return "http://192.168.29.100:8000"  // Your actual IP
```

**Then rebuild:**
```bash
npm run build
npx cap sync android
```

---

## 🎬 Demo Flow (2 Minutes)

### For Judges:

1. **Start Everything** (10 sec)
   ```bash
   start.bat
   ```

2. **Select District** (10 sec)
   - Open collector app: `http://localhost:5173`
   - Click "🎯 Try Nagpur"

3. **Auto-Allocate Tankers** (15 sec)
   - Click "🚛 Auto-Allocate Tankers"
   - Watch algorithm dispatch tankers

4. **Driver App Login** (20 sec)
   - Open driver app: `http://localhost:5174`
   - Phone: `9321098765`
   - OTP: Shown on screen
   - Login!

5. **View Assignment** (20 sec)
   - See critical village
   - Click "🗺️ Open Maps"

6. **Mark Delivered** (20 sec)
   - Click "✅ Mark Delivered"
   - Enter liters: 11000
   - Confirm

7. **Show Android** (20 sec)
   - Open Android Studio
   - Show native app project
   - Run on emulator

8. **Analytics** (15 sec)
   - Switch to Analytics
   - Click "📄 Export Report"

**Total: 2 minutes**

---

## 📊 What's Working

### Backend ✅
- FastAPI server on port 8000
- Twilio OTP integration (demo mode)
- Real government data (IMD, CGWB)
- Smart tanker allocation algorithm
- SQLite database with 30 villages

### Collector Dashboard ✅
- District selection with quick buttons
- Live map with village markers
- Auto-allocate tankers
- Analytics with charts
- Export reports
- Refresh live data

### Driver App ✅
- OTP-based login
- View assignments
- Google Maps integration
- Mark deliveries
- Progress tracking
- Works as PWA
- Works as Android APK

---

## 🔑 Demo Credentials

| Phone | Driver | Vehicle | District |
|-------|--------|---------|----------|
| 9876543210 | Ramesh Patil | TN-LAT-001 | Latur |
| 9765432109 | Suresh Jadhav | TN-LAT-002 | Latur |
| 9654321098 | Vijay Shinde | TN-OSM-001 | Osmanabad |
| 9321098765 | Ravi Thakur | TN-NGP-001 | Nagpur |
| 9210987654 | Sunil Wankhede | TN-NGP-002 | Nagpur |

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
cd backend
pip install -r requirements.txt
py -m uvicorn main:app --reload --port 8000
```

### Frontend won't start?
```bash
cd frontend
npm install
npm run dev
```

### Driver app won't build?
```bash
cd frontend-driver
npm install --legacy-peer-deps
npm run build
```

### Android Studio errors?
1. File → Invalidate Caches → Restart
2. Wait for Gradle sync
3. Try again

### Can't connect from phone?
1. Check same WiFi network
2. Update IP in `api.js`
3. Restart backend with `--host 0.0.0.0`

---

## 📁 Project Structure

```
JalRakshak/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API server
│   ├── otp_service.py      # Twilio SMS
│   ├── routes/             # API endpoints
│   └── models.py           # Database models
│
├── frontend/               # Collector Dashboard
│   └── src/
│       ├── pages/          # Dashboard, Analytics
│       └── components/     # Map, Charts
│
├── frontend-driver/        # Driver Mobile App
│   ├── src/
│   │   ├── pages/          # Login, Assignments
│   │   └── components/     # Delivery Modal
│   └── android/            # Native Android project
│
└── start.bat              # Start everything
```

---

## 📚 Documentation

- `README.md` - Main project overview
- `ANDROID_SETUP.md` - Complete Android guide
- `TWILIO_AND_ANDROID_COMPLETE.md` - Twilio + Android details
- `DRIVER_APP_COMPLETE.md` - Driver app features
- `INSTALL_DRIVER_APP.md` - PWA installation
- `QUICK_START.md` - This file

---

## 🎯 Next Steps

### Immediate:
- [x] Backend running
- [x] Frontend running
- [x] Driver app running
- [x] Android project created
- [ ] Test on Android phone
- [ ] Test OTP flow
- [ ] Test delivery flow

### For Production:
- [ ] Set `DEMO_MODE=false` for real SMS
- [ ] Deploy backend to cloud
- [ ] Update API URLs
- [ ] Generate signed APK
- [ ] Submit to Play Store

---

## 💡 Tips

1. **Always run backend with `--host 0.0.0.0`** for Android access
2. **Update IP in api.js** before building Android APK
3. **Use `--legacy-peer-deps`** when installing driver app
4. **Wait for Gradle sync** in Android Studio
5. **Test PWA first** before building APK

---

## 📞 Need Help?

Check the logs:
- Backend: Terminal where uvicorn is running
- Frontend: Browser console (F12)
- Android: Android Studio Logcat

Common commands:
```bash
# Find IP
py backend/find_ip.py

# Rebuild driver app
cd frontend-driver
npm run build
npx cap sync android

# Check Capacitor
npx cap doctor

# Open Android Studio
npx cap open android
```

---

**Built with ❤️ for JalRakshak | Hack A Cause 2025**

**Team: Dead Pixel**

Everything is ready to demo! 🚀
