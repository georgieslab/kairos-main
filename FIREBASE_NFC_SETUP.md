# ⚠️ CRITICAL: Firebase Hosting Setup for NFC Deep Links

## 🚨 Important Discovery

Your app URL is: **reflection-writer.web.app**

This changes the NFC implementation! Here's what I've updated and what you need to do:

---

## ✅ What I Fixed

### 1. Updated NFC Service
- Changed URL from `kairos-journal.com` → `reflection-writer.web.app`
- NFC chips will now write: `https://reflection-writer.web.app/nfc/KAIROS_20251112_ABC12`

### 2. Updated AndroidManifest.xml
- Intent filters now point to `reflection-writer.web.app`
- Added App Link verification with `autoVerify="true"`

### 3. Updated Intent Handler
- URL pattern matching updated to your domain

### 4. Created assetlinks.json
- Android App Links verification file
- Needs to be deployed to Firebase Hosting

---

## 🔧 Required: Firebase Hosting Configuration

### Step 1: Deploy assetlinks.json

This file **MUST** be accessible at:
```
https://reflection-writer.web.app/.well-known/assetlinks.json
```

**Current location in your project:**
```
public/.well-known/assetlinks.json
```

**When you deploy to Firebase Hosting, this file MUST be publicly accessible!**

### Step 2: Update firebase.json

Add this to your `firebase.json` to ensure the file is served correctly:

```json
{
  "hosting": {
    "public": "dist",
    "headers": [
      {
        "source": "/.well-known/assetlinks.json",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "/nfc/:journalId",
        "destination": "/index.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Step 3: Get Your App Signing Certificate SHA-256

**Debug Build (for testing):**
```bash
cd android
./gradlew signingReport
```

Look for the **SHA-256** fingerprint in the output.

**Release Build (for production):**
You'll need the SHA-256 from your release keystore or Google Play Console.

### Step 4: Update assetlinks.json

Replace `YOUR_RELEASE_KEY_SHA256_FINGERPRINT_HERE` with your actual SHA-256 fingerprint.

Example:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.kairos.journal",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
    ]
  }
}]
```

---

## 🧪 Testing the Setup

### 1. Deploy to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### 2. Verify assetlinks.json is accessible
Open browser:
```
https://reflection-writer.web.app/.well-known/assetlinks.json
```

You should see the JSON file (not a 404).

### 3. Test Deep Link
```bash
adb shell am start -a android.intent.action.VIEW \
  -d "https://reflection-writer.web.app/nfc/TEST_12345" \
  com.kairos.journal
```

If working correctly, the app should launch!

---

## 🎯 Alternative: Use Custom Domain (Optional but Recommended)

If you have a custom domain (e.g., `kairosjournal.app`), you can:

1. **Point custom domain to Firebase Hosting**
2. **Update all URLs to use custom domain**
3. **Better branding & shorter URLs**

### Benefits of Custom Domain:
- ✅ Shorter NFC URLs (saves space on chip)
- ✅ Professional appearance
- ✅ Better for marketing
- ✅ Can change hosting later without breaking NFC tags

Example custom domain setup:
```
NFC URL: https://kairosjournal.app/j/ABC12
Instead of: https://reflection-writer.web.app/nfc/KAIROS_20251112_ABC12
```

---

## 🔄 Migration Path if You Already Have NFC Tags

**If you've already written tags with wrong URL:**

### Option 1: Re-write all tags (recommended)
- Use the NFC Test Panel in Debug page
- Write new URL to all existing tags

### Option 2: Support both domains (temporary)
- Keep old intent filters in AndroidManifest
- Support both `kairos-journal.com` and `reflection-writer.web.app`
- Gradually migrate

---

## 📋 Checklist

Before NFC will work in production:

- [ ] Update `firebase.json` with headers and rewrites
- [ ] Get SHA-256 certificate fingerprint
- [ ] Update `assetlinks.json` with real SHA-256
- [ ] Deploy to Firebase Hosting: `firebase deploy --only hosting`
- [ ] Verify `https://reflection-writer.web.app/.well-known/assetlinks.json` is accessible
- [ ] Build & install Android APK
- [ ] Test deep link with `adb shell am start`
- [ ] Sync Android: `npx cap sync android`
- [ ] Test actual NFC tag tap

---

## 🚀 Quick Start Commands

```bash
# 1. Build the app
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting

# 3. Get certificate fingerprint
cd android
./gradlew signingReport

# 4. Sync Android with updated manifest
npx cap sync android

# 5. Build Android APK
# (Open in Android Studio and build)
```

---

## ❓ FAQ

**Q: Will NFC work in dev/testing without this?**
A: No, Android App Links require verification via assetlinks.json on a live HTTPS domain.

**Q: Can I test without deploying?**
A: You can use the JSON approach instead (write JSON to chip instead of URL), but it's less reliable.

**Q: Do I need a custom domain?**
A: No, `reflection-writer.web.app` works fine! Custom domain is just nicer.

**Q: What if assetlinks.json returns 404?**
A: Check firebase.json hosting config and make sure dist/ contains .well-known/ folder after build.

---

## 🎉 Summary

**What Changed:**
- ✅ All URLs updated to `reflection-writer.web.app`
- ✅ Android manifest intent filters updated
- ✅ assetlinks.json created for App Links verification

**What You Need to Do:**
1. Update `firebase.json` (hosting rewrites)
2. Get SHA-256 certificate fingerprint
3. Update `assetlinks.json` with real fingerprint
4. Deploy to Firebase Hosting
5. Test!

Once this is done, NFC taps will automatically launch your app! 🚀
