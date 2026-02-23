# 📱 JalRakshak Driver - Android App Setup

Complete guide to convert the PWA to a native Android app using Capacitor.

---

## 🎯 What You'll Get

- **Native Android APK** that can be installed on any Android phone
- **Works offline** (with service workers)
- **Access to native features** (camera, GPS, notifications)
- **Professional app experience** with splash screen
- **No Play Store needed** for testing

---

## 📋 Prerequisites

### 1. Install Android Studio

Download from: https://developer.android.com/studio

**During installation, make sure to install:**
- Android SDK
- Android SDK Platform
- Android Virtual Device (for emulator)

### 2. Install Java JDK

Capacitor requires Java 17 or higher.

Download from: https://www.oracle.com/java/technologies/downloads/

**Verify installation:**
```bash
java -version
```

### 3. Set Environment Variables

Add to your system PATH:
- `ANDROID_HOME` = `C:\Users\YourName\AppData\Local\Android\Sdk`
- `JAVA_HOME` = `C:\Program Files\Java\jdk-17`

---

## 🚀 Step-by-Step Setup

### Step 1: Find Your Computer's IP Address

```bash
cd backend
py find_ip.py
```

**Example output:**
```
Your Computer IP Address: 192.168.1.5
```

**Copy this IP address!** You'll need it in Step 2.

---

### Step 2: Update API URL for Android

Open `frontend-driver/src/utils/api.js`

Find this line:
```javascript
return "http://192.168.1.5:8000"  // ⚠️ UPDATE THIS WITH YOUR IP
```

Replace `192.168.1.5` with YOUR computer's IP from Step 1.

**Example:**
```javascript
return "http://192.168.29.100:8000"  // Your actual IP
```

---

### Step 3: Install Capacitor Dependencies

```bash
cd frontend-driver
npm install
```

This installs:
- `@capacitor/core`
- `@capacitor/cli`
- `@capacitor/android`

---

### Step 4: Build the Web App

```bash
npm run build
```

This creates the `dist/` folder with optimized production files.

---

### Step 5: Add Android Platform

```bash
npx cap add android
```

This creates the `android/` folder with a complete Android Studio project!

**What happens:**
- Creates `android/` folder
- Copies web assets to Android project
- Configures AndroidManifest.xml
- Sets up Gradle build files

---

### Step 6: Sync Web Assets to Android

```bash
npx cap sync android
```

Run this command **every time** you make changes to the web app.

---

### Step 7: Open in Android Studio

```bash
npx cap open android
```

Android Studio will launch automatically with the project loaded.

**First time setup in Android Studio:**
1. Wait for Gradle sync to complete (bottom right corner)
2. Click "Trust Project" if prompted
3. Let it download any missing SDK components

---

### Step 8: Configure Android Permissions

The project is already configured with necessary permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

And cleartext traffic is enabled for local development:
```xml
android:usesCleartextTraffic="true"
```

---

### Step 9: Run on Android Device

#### Option A: Physical Android Phone

1. **Enable Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Developer Options will appear in Settings

2. **Enable USB Debugging**:
   - Settings → Developer Options
   - Turn on "USB Debugging"

3. **Connect phone to computer** via USB

4. **In Android Studio:**
   - Click the green "Run" button (▶️)
   - Select your phone from the device list
   - App will install and launch!

#### Option B: Android Emulator

1. **In Android Studio:**
   - Click "Device Manager" (phone icon in toolbar)
   - Click "Create Device"
   - Select "Pixel 7" or any device
   - Select system image (Android 13 recommended)
   - Click "Finish"

2. **Run the app:**
   - Click the green "Run" button (▶️)
   - Select the emulator
   - Wait for emulator to boot
   - App will install and launch!

---

## 🔧 Important Configuration Files

### 1. capacitor.config.json

```json
{
  "appId": "com.deadpixel.jalrakshak.driver",
  "appName": "JalRakshak Driver",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "cleartext": true,
    "allowNavigation": ["*"]
  }
}
```

### 2. AndroidManifest.xml

Located at: `frontend-driver/android/app/src/main/AndroidManifest.xml`

Key settings:
- App name: JalRakshak Driver
- Package: com.deadpixel.jalrakshak.driver
- Permissions: Internet, Camera, Storage
- Cleartext traffic: Enabled (for local dev)

### 3. colors.xml

Located at: `frontend-driver/android/app/src/main/res/values/colors.xml`

```xml
<resources>
    <color name="colorPrimary">#f97316</color>
    <color name="colorPrimaryDark">#ea6c0a</color>
    <color name="colorAccent">#3b82f6</color>
</resources>
```

---

## 🎨 Customizing the App

### Change App Name

Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">JalRakshak Driver</string>
```

### Change App Icon

Replace these files in `android/app/src/main/res/`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Use a tool like: https://romannurik.github.io/AndroidAssetStudio/

### Change Splash Screen

Edit `capacitor.config.json`:
```json
"plugins": {
  "SplashScreen": {
    "launchShowDuration": 2000,
    "backgroundColor": "#f97316"
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Make sure backend is running with `--host 0.0.0.0`
2. Check your IP address hasn't changed
3. Ensure phone and computer are on same WiFi
4. Update IP in `api.js` and rebuild:
   ```bash
   npm run build
   npx cap sync android
   ```

### Issue: "Gradle sync failed"

**Solution:**
1. In Android Studio: File → Invalidate Caches → Restart
2. Delete `android/.gradle` folder
3. Sync again

### Issue: "SDK not found"

**Solution:**
1. Open Android Studio → Settings → Android SDK
2. Install Android 13 (API 33) or higher
3. Install Android SDK Build-Tools
4. Restart Android Studio

### Issue: "App crashes on startup"

**Solution:**
1. Check Android Studio Logcat for errors
2. Verify `dist/` folder exists and has files
3. Run `npx cap sync android` again
4. Clean and rebuild in Android Studio

### Issue: "OTP not working in Android app"

**Solution:**
1. Check backend console for OTP (DEMO_MODE)
2. Verify API URL in `api.js` is correct
3. Check network connectivity
4. Look at Chrome DevTools (chrome://inspect)

---

## 📦 Building Release APK

### Step 1: Generate Signing Key

```bash
cd android/app
keytool -genkey -v -keystore jalrakshak-driver.keystore -alias jalrakshak -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Signing

Create `android/key.properties`:
```properties
storePassword=your_password
keyPassword=your_password
keyAlias=jalrakshak
storeFile=jalrakshak-driver.keystore
```

### Step 3: Build Release APK

In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Select APK
3. Choose your keystore
4. Select "release" build variant
5. Click "Finish"

APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🚀 Development Workflow

### Making Changes to the App

1. **Edit React code** in `frontend-driver/src/`

2. **Test in browser** first:
   ```bash
   npm run dev
   ```

3. **Build for Android**:
   ```bash
   npm run build
   npx cap sync android
   ```

4. **Run in Android Studio**:
   - Click Run button
   - Or use: `npx cap run android`

### Quick Sync Command

```bash
npm run build && npx cap sync android && npx cap open android
```

---

## 📊 App Size

- **Debug APK**: ~8-10 MB
- **Release APK**: ~5-7 MB (with ProGuard)
- **First install**: ~15 MB (includes runtime)

---

## 🔒 Security Notes

### For Production:

1. **Disable cleartext traffic** in AndroidManifest.xml
2. **Use HTTPS** for API endpoints
3. **Remove demo OTP** from responses
4. **Enable ProGuard** for code obfuscation
5. **Add certificate pinning** for API calls

### Update AndroidManifest.xml for production:

```xml
android:usesCleartextTraffic="false"
```

And use HTTPS API URL:
```javascript
return "https://api.jalrakshak.com"
```

---

## 📱 Testing Checklist

- [ ] App installs successfully
- [ ] Splash screen shows
- [ ] Login with OTP works
- [ ] Assignments load
- [ ] Google Maps opens
- [ ] Delivery confirmation works
- [ ] App works offline (cached data)
- [ ] Back button navigation works
- [ ] App doesn't crash on rotation
- [ ] Notifications work (if implemented)

---

## 🎯 Next Steps

After basic setup:

1. **Add app icon** (use Android Asset Studio)
2. **Customize splash screen**
3. **Test on multiple devices**
4. **Add push notifications** (Firebase)
5. **Implement offline mode** (Service Workers)
6. **Add camera for delivery photos**
7. **Enable GPS tracking**
8. **Build release APK**
9. **Test on different Android versions**
10. **Prepare for Play Store** (optional)

---

## 📞 Support

**Common Commands:**

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Run on device
npx cap run android

# Check Capacitor config
npx cap doctor

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/android@latest
```

**Useful Links:**
- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Capacitor Android: https://capacitorjs.com/docs/android

---

**Built with ❤️ for JalRakshak | Hack A Cause 2025**
