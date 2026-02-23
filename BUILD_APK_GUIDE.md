# 📦 Build APK - Step by Step Guide

Android Studio is now opening with your JalRakshak Driver project!

---

## 🎯 Quick Build (Debug APK)

### In Android Studio:

1. **Wait for Gradle Sync** (bottom right corner)
   - First time takes 2-5 minutes
   - Downloads dependencies
   - Configures project

2. **Click the Green Play Button** (▶️)
   - Top toolbar, right side
   - Or press `Shift + F10`

3. **Select Device:**
   - **Physical Phone:** Connect via USB, enable USB debugging
   - **Emulator:** Create one if needed (Device Manager)

4. **App Installs and Runs!**
   - APK is automatically built and installed
   - App launches on device

---

## 📱 Find the Debug APK

After running, the APK is located at:

```
frontend-driver/android/app/build/outputs/apk/debug/app-debug.apk
```

**Size:** ~8-10 MB

**You can:**
- Copy to phone via USB
- Share via email/WhatsApp
- Install on any Android device

---

## 🏗️ Build Release APK (For Distribution)

### Step 1: Build Menu

1. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. Click "locate" in the notification

### Step 2: Find Release APK

Location:
```
frontend-driver/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Note:** This is unsigned. For Play Store, you need to sign it.

---

## 🔐 Build Signed APK (Production)

### Step 1: Generate Keystore

```bash
cd frontend-driver/android/app
keytool -genkey -v -keystore jalrakshak-driver.keystore -alias jalrakshak -keyalg RSA -keysize 2048 -validity 10000
```

**Enter:**
- Password: (remember this!)
- Name: Your name
- Organization: Dead Pixel
- City, State, Country

### Step 2: Configure Signing

Create `frontend-driver/android/key.properties`:

```properties
storePassword=your_password_here
keyPassword=your_password_here
keyAlias=jalrakshak
storeFile=jalrakshak-driver.keystore
```

### Step 3: Update build.gradle

Edit `frontend-driver/android/app/build.gradle`:

Add before `android {`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Add inside `android {`:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### Step 4: Build Signed APK

In Android Studio:
1. **Build → Generate Signed Bundle / APK**
2. Select **APK**
3. Choose your keystore file
4. Enter passwords
5. Select **release** build variant
6. Click **Finish**

**Output:**
```
frontend-driver/android/app/build/outputs/apk/release/app-release.apk
```

**This APK is:**
- ✅ Signed and ready for distribution
- ✅ Can be uploaded to Play Store
- ✅ Can be shared with users
- ✅ Optimized and minified

---

## 🚀 Quick Commands

### Build Debug APK (Command Line)

```bash
cd frontend-driver/android
./gradlew assembleDebug
```

**Output:** `app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK (Command Line)

```bash
cd frontend-driver/android
./gradlew assembleRelease
```

**Output:** `app/build/outputs/apk/release/app-release.apk`

### Install on Connected Device

```bash
cd frontend-driver/android
./gradlew installDebug
```

---

## 📊 APK Sizes

| Type | Size | Use Case |
|------|------|----------|
| Debug | ~10 MB | Testing, development |
| Release (unsigned) | ~8 MB | Internal testing |
| Release (signed) | ~8 MB | Production, Play Store |
| Release (minified) | ~5-6 MB | With ProGuard enabled |

---

## 🎯 What to Do After Building

### Debug APK:
1. Copy `app-debug.apk` to phone
2. Enable "Install from Unknown Sources"
3. Tap APK to install
4. Test the app!

### Release APK:
1. Test thoroughly on multiple devices
2. Check all features work
3. Verify API connectivity
4. Test OTP flow
5. Ready for distribution!

---

## 🐛 Troubleshooting

### Gradle Sync Failed?

**Solution:**
1. File → Invalidate Caches → Restart
2. Wait for Android Studio to restart
3. Let Gradle sync again

### Build Failed?

**Check:**
- Java JDK installed (version 17+)
- Android SDK installed
- Internet connection (downloads dependencies)
- Enough disk space (5+ GB)

**Fix:**
```bash
cd frontend-driver/android
./gradlew clean
./gradlew assembleDebug
```

### App Crashes on Install?

**Check:**
- Android version (minimum API 22 / Android 5.0)
- Permissions granted
- Backend is running
- API URL is correct in `api.js`

### Can't Find APK?

**Location:**
```
frontend-driver/android/app/build/outputs/apk/
├── debug/
│   └── app-debug.apk
└── release/
    └── app-release.apk
```

---

## 📱 Install APK on Phone

### Method 1: USB Transfer

1. Connect phone to computer
2. Copy APK to phone's Downloads folder
3. On phone: Open Files app
4. Tap the APK file
5. Tap "Install"

### Method 2: Share via Email

1. Email the APK to yourself
2. Open email on phone
3. Download APK
4. Tap to install

### Method 3: ADB Install

```bash
adb install frontend-driver/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎨 Customize Before Building

### Change App Name

Edit `frontend-driver/android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">JalRakshak Driver</string>
```

### Change App Icon

Replace icons in:
```
frontend-driver/android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png
├── mipmap-mdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

Use: https://romannurik.github.io/AndroidAssetStudio/

### Change Package Name

Edit `frontend-driver/capacitor.config.json`:
```json
{
  "appId": "com.deadpixel.jalrakshak.driver"
}
```

Then run:
```bash
npx cap sync android
```

---

## 🏆 Production Checklist

Before releasing:

- [ ] Test on multiple Android versions
- [ ] Test on different screen sizes
- [ ] Verify all features work
- [ ] Check OTP flow
- [ ] Test offline behavior
- [ ] Verify API connectivity
- [ ] Check permissions
- [ ] Test on slow network
- [ ] Verify app icon and name
- [ ] Test installation process
- [ ] Check app size
- [ ] Review privacy policy
- [ ] Prepare Play Store listing

---

## 📦 Play Store Submission

### Requirements:

1. **Signed APK** (or AAB bundle)
2. **App Icon** (512x512 PNG)
3. **Screenshots** (at least 2)
4. **Feature Graphic** (1024x500)
5. **Description** (short and full)
6. **Privacy Policy** (URL)
7. **Content Rating**
8. **Target Audience**

### Steps:

1. Create Google Play Console account ($25 one-time)
2. Create new app
3. Upload signed APK/AAB
4. Fill in store listing
5. Set pricing (free/paid)
6. Submit for review
7. Wait 1-3 days for approval

---

## 🎯 Current Status

✅ Android project created  
✅ Dependencies installed  
✅ Build configuration ready  
✅ Permissions configured  
✅ App icons included  
✅ Splash screens added  
✅ Ready to build!  

**Next Step:** Click the green Play button in Android Studio!

---

## 📞 Need Help?

**Common Issues:**

1. **Gradle sync taking too long?**
   - First time is slow (downloads ~500 MB)
   - Be patient, it's normal

2. **Build errors?**
   - Check Java version: `java -version`
   - Should be 17 or higher

3. **Can't run on device?**
   - Enable USB debugging on phone
   - Install device drivers

4. **App crashes?**
   - Check Logcat in Android Studio
   - Verify backend is running
   - Check API URL in code

**Useful Commands:**

```bash
# Check Capacitor status
npx cap doctor

# Rebuild everything
npm run build && npx cap sync android

# Clean Gradle cache
cd android && ./gradlew clean

# List connected devices
adb devices
```

---

**Built with ❤️ for JalRakshak | Hack A Cause 2025**

**Team: Dead Pixel**

Happy Building! 🚀
