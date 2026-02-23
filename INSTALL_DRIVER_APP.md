# 📱 Install JalRakshak Driver App on Android

## What is a PWA (Progressive Web App)?

A PWA is a web app that can be installed on your phone like a native app - **no Play Store needed!** It works offline, sends notifications, and feels just like a real Android app.

---

## Method 1: Install on Android Phone (Same WiFi Network)

### Step 1: Find Your Computer's IP Address

**On Windows:**
```bash
ipconfig
```
Look for: `IPv4 Address` (e.g., `192.168.1.5`)

**On Mac/Linux:**
```bash
ifconfig
```
Look for: `inet` address

### Step 2: Start the Driver App

On your computer, run:
```bash
cd frontend-driver
npm install
npm run dev -- --host --port 5174
```

The app will be accessible at: `http://192.168.1.5:5174` (replace with your IP)

### Step 3: Install on Android

1. **Open Chrome browser** on your Android phone
2. Make sure phone is on **same WiFi** as computer
3. Go to: `http://192.168.1.5:5174` (your computer's IP)
4. Tap the **menu (3 dots)** in Chrome
5. Select **"Add to Home Screen"** or **"Install App"**
6. Tap **"Install"**
7. App icon appears on your home screen! 🎉

### Step 4: Use the App

- Tap the JalRakshak icon on your home screen
- Opens fullscreen like a native app
- Works even when browser is closed
- Get notifications for new assignments

---

## Method 2: Demo on Computer (Mobile View)

Perfect for testing without a phone:

1. Open `http://localhost:5174` in Chrome
2. Press **F12** to open DevTools
3. Click **Toggle Device Toolbar** (Ctrl+Shift+M)
4. Select **"Pixel 7"** or any Android device
5. Shows exactly how app looks on phone

---

## Method 3: Deploy to Production (Real World)

For actual deployment:

1. **Build the app:**
   ```bash
   cd frontend-driver
   npm run build
   ```

2. **Deploy to hosting:**
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - Firebase: `firebase deploy`

3. **Get HTTPS URL:**
   - Example: `https://jalrakshak-driver.vercel.app`

4. **Install on any Android phone:**
   - Open URL in Chrome
   - Add to Home Screen
   - Works worldwide! 🌍

---

## Demo Credentials

Use these phone numbers to test the app:

| Phone Number | Driver Name | Vehicle | District |
|--------------|-------------|---------|----------|
| 9876543210 | Ramesh Patil | TN-LAT-001 | Latur |
| 9765432109 | Suresh Jadhav | TN-LAT-002 | Latur |
| 9654321098 | Vijay Shinde | TN-OSM-001 | Osmanabad |
| 9321098765 | Ravi Thakur | TN-NGP-001 | Nagpur |
| 9210987654 | Sunil Wankhede | TN-NGP-002 | Nagpur |

**OTP will be displayed on screen** (demo mode)

---

## Features

✅ **OTP-based login** - Secure authentication  
✅ **Real-time assignments** - Auto-refresh every 30 seconds  
✅ **Google Maps integration** - One-tap navigation  
✅ **Delivery confirmation** - Mark deliveries complete  
✅ **Progress tracking** - See daily completion rate  
✅ **Offline support** - Works without internet (coming soon)  
✅ **Push notifications** - Get alerted for new assignments (coming soon)

---

## Troubleshooting

### Can't connect from phone?

- Make sure both devices are on **same WiFi**
- Check firewall isn't blocking port 5174
- Try disabling VPN on computer
- Use `--host` flag when running `npm run dev`

### App not installing?

- Make sure you're using **Chrome browser** (not Firefox/Safari)
- Check that site is served over **HTTPS** (for production)
- Clear browser cache and try again

### OTP not working?

- Check backend server is running on port 8000
- Look at backend console for OTP code
- Make sure phone number is registered in database

---

## Reset Database

If you need to reset and reseed the database:

```bash
cd backend
Remove-Item jalrakshak.db -Force
python seed_data.py
```

This will create fresh driver accounts with the demo phone numbers.

---

## Production Checklist

Before deploying to real users:

- [ ] Remove OTP from API response (security)
- [ ] Integrate real SMS gateway (Twilio, MSG91)
- [ ] Add photo upload for delivery proof
- [ ] Enable push notifications
- [ ] Add offline mode with service workers
- [ ] Set up HTTPS certificate
- [ ] Add rate limiting on OTP endpoint
- [ ] Implement session timeout warnings

---

## Support

For issues or questions:
- Check backend logs: `backend/` terminal
- Check frontend logs: Browser DevTools Console
- Verify API is running: `http://localhost:8000/docs`

---

**Built with ❤️ for JalRakshak | Hack A Cause 2025**
