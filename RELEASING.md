# Releasing Καιρός — Android APK

How to cut a new release, from changelog to signed APK. Written for Git Bash on Windows
(the commands assume it; PowerShell equivalents are noted where they differ).

---

## 0. One-time setup per checkout

Four files are required for a release build. **All four are gitignored**, which means a
fresh clone — *or a new git worktree* — will not have them. You must copy them in by hand.

| File | Where it must go | What it's for |
|---|---|---|
| `keystore.properties` | `android/` | Signing passwords + key alias |
| `kairos-release-key.jks` | `android/app/` | The actual signing key |
| `google-services.json` | `android/app/` | Firebase config (Google sign-in, etc.) |
| `local.properties` | `android/` | Points Gradle at your Android SDK |

Where the originals live on this machine:

```bash
# keystore.properties  →  main repo checkout
/c/Users/georg/georgiescoding/kairos-main/android/keystore.properties

# the signing key       →  Desktop, NOT in the repo
/c/Users/georg/Desktop/KAIROS/KAIROS_APP/kairos-release-key.jks

# google-services.json  →  main repo checkout (or re-download from Firebase Console)
/c/Users/georg/georgiescoding/kairos-main/android/app/google-services.json
```

`local.properties` isn't copied — create it:

```bash
echo 'sdk.dir=C:\\Users\\georg\\AppData\\Local\\Android\\Sdk' > android/local.properties
```

> ⚠️ **The `.jks` goes in `android/app/`, not `android/`.** Gradle resolves the `storeFile`
> path in `signingConfigs` relative to the *module* directory (`android/app/`), not the
> project root. Putting it one level up fails with
> `Keystore file ... not found for signing config 'release'`.

**Verify setup before building:**

```bash
for f in android/keystore.properties android/app/kairos-release-key.jks \
         android/app/google-services.json android/local.properties; do
  [ -f "$f" ] && echo "ok      $f" || echo "MISSING $f"
done
```

---

## 1. Decide the version number

Semantic versioning:

| Bump | When | Example |
|---|---|---|
| **Patch** (`1.1.0` → `1.1.1`) | Bug fixes only, no new features | The Google sign-in fix |
| **Minor** (`1.1.1` → `1.2.0`) | New features, content, paths — backward compatible | The journey prompt rewrite |
| **Major** (`1.x` → `2.0.0`) | Breaking changes, or a landmark release | 1.0.0 "Kairos Moments" |

---

## 2. Update `src/utils/versionControl.js`

Two edits, and they must agree with each other.

**a) Bump the constant at the top:**

```js
export const APP_VERSION = '1.1.2';   // ← your new version
```

**b) Append a new entry to the END of the `VERSION_HISTORY` array:**

```js
{
  version: '1.1.2',
  releaseDate: '2026-08-01',        // YYYY-MM-DD
  codename: 'Something Memorable',  // optional
  features: [
    'User-facing description of a new capability'
  ],
  bugFixes: [
    'What was broken, in terms a user would recognise'
  ],
  improvements: [                   // optional
    'Refinements that are not quite features'
  ],
  notes: [                          // optional
    'Context, caveats, or a closing line'
  ]
}
```

Only `version` and `releaseDate` are required; every array is optional — omit the ones
that don't apply (the 1.1.1 entry has no `features`, for instance).

> ⚠️ **Two rules the app actually enforces:**
> 1. `APP_VERSION` must exactly equal the version of the **last** entry in
>    `VERSION_HISTORY`. `isLatestVersion()` compares them literally; if they drift, the
>    in-app "What's New" reports the user is on an outdated build.
> 2. New entries go at the **end** of the array, not the top. The file reads
>    oldest → newest.

**Write the changelog for users, not for git.** Compare:

- ❌ "Refactored `saveAnalysisResult` to use atomic dot-path updates with `arrayUnion`"
- ✅ "Fixed the Home screen streak colour getting stuck on day 1 after completing an entry"

Sanity-check the syntax before moving on:

```bash
node --check src/utils/versionControl.js
```

---

## 3. Update `android/app/build.gradle`

Around line 33:

```gradle
versionCode 4          // ← ALWAYS increment by 1. Integer, never reused.
versionName "1.1.2"    // ← must match APP_VERSION
```

> ⚠️ **`versionCode` is the one that actually matters to Android.** It's how the OS and the
> Play Store decide what counts as "newer". It must increase on *every* build you
> distribute, even a tiny hotfix. Google Play permanently rejects a `versionCode` that has
> already been uploaded — you cannot reuse or lower it, ever.
>
> `versionName` is the human-readable string; it has no ordering semantics.

Current mapping, for reference:

| versionName | versionCode |
|---|---|
| 1.0.0 | 1 |
| 1.1.0 | 2 |
| 1.1.1 | 3 |

---

## 4. Build the web assets and sync into Android

```bash
npm run build:android
```

This runs `vite build` then `npx cap sync android`, which copies `dist/` into
`android/app/src/main/assets/public/` and refreshes the native plugin list.

**Don't skip this.** Gradle only packages what's already in the assets folder — if you go
straight to `assembleRelease`, you'll ship an APK containing the *previous* build's
JavaScript, with your changes silently missing.

Expect to see your plugin count echoed near the end (currently 10 Capacitor + 4 Cordova).

---

## 5. Build the signed APK

```bash
cd android
./gradlew assembleRelease
```

First run takes a few minutes; later ones are faster thanks to the Gradle cache. Output:

```
android/app/build/outputs/apk/release/app-release.apk
```

Signing is automatic: `build.gradle` reads `keystore.properties` and applies it via
`signingConfig signingConfigs.release`. If the `.jks` is missing you get a loud failure
(`Keystore file ... not found`), but if `keystore.properties` itself is absent the signing
config is simply left empty — so don't assume a successful build means a signed one.
Always run the `jarsigner` check in the next step.

To force a clean rebuild when something seems stale:

```bash
./gradlew clean assembleRelease
```

---

## 6. Verify before you ship

Run all three from the `android/` directory.

**Version and package:**

```bash
AAPT=$(ls -d /c/Users/georg/AppData/Local/Android/Sdk/build-tools/*/ | sort -V | tail -1)
"${AAPT}aapt.exe" dump badging app/build/outputs/apk/release/app-release.apk | head -1
```

Expect: `package: name='com.kairos.journal' versionCode='4' versionName='1.1.2'`

**Signature:**

```bash
jarsigner -verify app/build/outputs/apk/release/app-release.apk
```

Expect: `jar verified.`

For the full certificate details, add `-verbose -certs` — you should see
`CN=Giorgi.Akopashvili, OU=KairosAIJournal`. Two warnings are **expected and harmless**:
the self-signed certificate chain, and the missing timestamp. An Android release key is
supposed to be self-signed.

**Firebase config baked in** (only relevant if you touched `google-services.json`):

```bash
AAPT=$(ls -d /c/Users/georg/AppData/Local/Android/Sdk/build-tools/*/ | sort -V | tail -1)
"${AAPT}aapt.exe" dump --values resources app/build/outputs/apk/release/app-release.apk \
  | grep -A1 default_web_client_id | head -4
```

Expect a real `...apps.googleusercontent.com` string. If it's absent, the google-services
Gradle plugin didn't run and Google sign-in will fail on device.

---

## 7. Install and smoke-test

```bash
adb install -r app/build/outputs/apk/release/app-release.apk
```

`-r` reinstalls over an existing copy, preserving data. If you get
`INSTALL_FAILED_UPDATE_INCOMPATIBLE`, the installed build was signed with a different key
(e.g. a debug build) — uninstall first: `adb uninstall com.kairos.journal`.

Worth checking on every release:
- Sign in with Google, and sign in with email/password
- Open a journey, submit an entry, confirm progress advances
- Check the version shown in-app matches what you built

> Google Sign-In requires **Google Play Services** — it will not work on an emulator image
> without the Play Store. Use a physical device or a Play-enabled AVD.

---

## Troubleshooting

**`Keystore file ... not found for signing config 'release'`**
The `.jks` isn't where Gradle expects. It belongs in `android/app/`, and its filename must
match `storeFile` in `keystore.properties`.

**`No matching client found for package name 'com.kairos.journal'`**
`google-services.json` was generated for a different package. In Firebase Console the app
must be registered as exactly `com.kairos.journal` — the same string as `applicationId` in
`build.gradle`. Never change `applicationId` to match a stale registration; that makes it a
different app and breaks upgrades for everyone who already installed it.

**Google sign-in hangs on "Connecting…" in the app (works on web)**
Means the code fell back to the web `signInWithPopup` path. In a WebView that opens the
system browser, completes OAuth in a process the app can't reach, and never resolves. The
native path in `AuthContext.jsx` must be taken — check `Capacitor.isNativePlatform()`
branching, and confirm `rgcfaIncludeGoogle = true` is still in `android/variables.gradle`
(the auth plugin gates its Google dependencies behind that flag, defaulting to `false`).

**Google sign-in fails only in debug builds**
The debug keystore's SHA-1 isn't registered in Firebase. Debug and release builds are
signed with different keys, so *both* fingerprints must be added.

```bash
# release
keytool -list -v -keystore android/app/kairos-release-key.jks -alias kairos | grep SHA1
# debug
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey \
  -storepass android | grep SHA1
```

Add both in Firebase Console → Project Settings → your Android app → **Add fingerprint**,
then **re-download `google-services.json`**. Order matters: the file embeds the fingerprints
at download time, so downloading before adding them gives you an incomplete file.

**APK builds but my code changes aren't in it**
You skipped step 4. Run `npm run build:android` before `assembleRelease`.

**Play Store rejects the upload**
Almost always a duplicate `versionCode`. Increment it and rebuild.

---

## Quick reference

```bash
# 1. edit src/utils/versionControl.js   (APP_VERSION + new VERSION_HISTORY entry at end)
# 2. edit android/app/build.gradle      (versionCode +1, versionName)

node --check src/utils/versionControl.js
npm run build:android
cd android && ./gradlew assembleRelease

jarsigner -verify app/build/outputs/apk/release/app-release.apk
adb install -r app/build/outputs/apk/release/app-release.apk
```

---

## Note on Play Store submissions

The Play Store no longer accepts APKs for new releases — it requires an **Android App
Bundle** (`.aab`):

```bash
./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

Same signing config, same version rules. The APK remains the right format for direct
distribution and sideloading (beta testers, your own device).
