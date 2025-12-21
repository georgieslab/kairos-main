# 🏷️ NFC Chip Data Flow - Complete Technical Guide

## What Actually Gets Written to the NFC Chip

### 🎯 RECOMMENDED APPROACH: Deep Link URL

When you register a journal, the app writes a **URL** to the NFC chip, not JSON data.

```
┌─────────────────────────────────────────────────────────────┐
│ NFC Chip Contents (NDEF Record)                             │
├─────────────────────────────────────────────────────────────┤
│ Record Type: URI (0x01)                                     │
│ MIME Type: text/x-vnd.ndef.uri                              │
│                                                              │
│ Payload:                                                     │
│ https://kairos-journal.com/nfc/KAIROS_20251112_ABC12?tier=insight
│                                                              │
│ Size: ~65 bytes (fits on any NFC tag)                       │
└─────────────────────────────────────────────────────────────┘
```

### Why URL Instead of JSON?

✅ **Works with ANY phone** (not just yours)
✅ **Android automatically launches the app**
✅ **If app not installed** → opens Google Play Store
✅ **Smaller size** (65 bytes vs 200+ bytes)
✅ **Standard NFC practice** (like Apple Pay, Google Pay, etc.)
✅ **Can be read by any NFC reader** for debugging

---

## 📱 Complete Flow: Registration to Daily Use

### STEP 1: Initial Registration

```
User taps "Register Journal" → Selects tier → Taps "Scan NFC"
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ BEFORE REGISTRATION                                          │
│                                                              │
│ NFC Chip may contain:                                        │
│ • Nothing (blank from manufacturer)                          │
│ • OR: Generic manufacturer data                             │
│ • OR: Test data                                              │
└─────────────────────────────────────────────────────────────┘
                                ↓
                    User taps phone to chip
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ APP READS CHIP                                               │
│                                                              │
│ IF blank or unrecognized:                                    │
│   → Generate new ID: "KAIROS_20251112_ABC12"                │
│                                                              │
│ IF already has Καιρός URL:                                  │
│   → Extract journal ID from URL                              │
│   → Check if already registered in Firestore                │
│   → If registered to different user → BLOCK                 │
│   → If registered to same user → "Already registered!"      │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ APP SAVES TO FIRESTORE                                       │
│                                                              │
│ Collection: journals/KAIROS_20251112_ABC12                   │
│ {                                                            │
│   journalId: "KAIROS_20251112_ABC12",                       │
│   userId: "user123abc",                                      │
│   tier: "insight",                                           │
│   registeredAt: "2025-11-12T10:30:00Z",                     │
│   serialNumber: "KJ-TEST-001",                               │
│   isActive: true,                                            │
│   totalEntries: 0                                            │
│ }                                                            │
│                                                              │
│ Collection: users/user123abc                                 │
│ {                                                            │
│   journals: ["KAIROS_20251112_ABC12"],                      │
│   primaryJournalId: "KAIROS_20251112_ABC12",                │
│   subscription: {                                            │
│     plan: "insight",                                         │
│     startDate: "2025-11-12",                                 │
│     expiresAt: "2026-05-12"  // 6 months                    │
│   }                                                          │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ APP WRITES TO NFC CHIP                                       │
│                                                              │
│ ⚠️  OVERWRITES whatever was there before!                   │
│                                                              │
│ Writing:                                                     │
│ https://kairos-journal.com/nfc/KAIROS_20251112_ABC12?tier=insight
│                                                              │
│ This is a DEEP LINK that:                                    │
│ 1. Android recognizes as an "App Link"                       │
│ 2. Automatically launches Καιρός app                        │
│ 3. Passes journal ID to the app                              │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ AFTER REGISTRATION                                           │
│                                                              │
│ NFC Chip now contains:                                       │
│ https://kairos-journal.com/nfc/KAIROS_20251112_ABC12?tier=insight
│                                                              │
│ ✅ Chip is "claimed" by user123abc                          │
│ ✅ Can't be re-registered by someone else                   │
│ ✅ Will always launch YOUR Καιρός account                   │
└─────────────────────────────────────────────────────────────┘
```

---

### STEP 2: Daily Use (Tapping the Chip)

```
┌─────────────────────────────────────────────────────────────┐
│ USER ACTION: Taps phone to journal                          │
│ (Phone can be locked, app can be closed)                    │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ ANDROID NFC SERVICE                                          │
│                                                              │
│ 1. Detects NFC tag                                           │
│ 2. Reads URL:                                                │
│    https://kairos-journal.com/nfc/KAIROS_20251112_ABC12     │
│                                                              │
│ 3. Checks AndroidManifest.xml for matching intent filter:   │
│    ✓ Scheme: https                                           │
│    ✓ Host: kairos-journal.com                                │
│    ✓ App: com.kairos.journal                                 │
│                                                              │
│ 4. Decision: LAUNCH KAIROS APP!                             │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ ΚΑΙΡΌΣ APP LAUNCHES                                         │
│                                                              │
│ CapacitorApp receives intent:                                │
│ {                                                            │
│   action: "VIEW",                                            │
│   url: "https://kairos-journal.com/nfc/KAIROS_20251112_ABC12?tier=insight"
│ }                                                            │
│                                                              │
│ nfcIntentHandler.js extracts:                                │
│ {                                                            │
│   source: "nfc_deep_link",                                   │
│   journalId: "KAIROS_20251112_ABC12",                       │
│   tier: "insight"                                            │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ VALIDATION (useNFCQuickAccess.js)                           │
│                                                              │
│ 1. Query Firestore:                                          │
│    journals/KAIROS_20251112_ABC12                           │
│                                                              │
│ 2. Check ownership:                                          │
│    IF journal.userId === currentUser.uid:                    │
│       ✅ OK, this is your journal                            │
│    ELSE:                                                     │
│       ❌ BLOCK - "This journal belongs to another account"  │
│                                                              │
│ 3. Update last used:                                         │
│    lastNFCScan: "2025-11-12T14:23:00Z"                      │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ NAVIGATION                                                   │
│                                                              │
│ Smart Context-Aware Navigation:                              │
│                                                              │
│ IF (user has entry from today):                              │
│    navigate('/archive', {                                    │
│      filterDate: '2025-11-12',                               │
│      journalId: 'KAIROS_20251112_ABC12'                     │
│    })                                                        │
│    → Shows: "Your entry from today"                         │
│                                                              │
│ ELSE:                                                        │
│    navigate('/upload', {                                     │
│      journalId: 'KAIROS_20251112_ABC12',                    │
│      fromNFC: true                                           │
│    })                                                        │
│    → Shows: Camera ready to capture pages ← MOST COMMON     │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ UPLOAD SCREEN                                                │
│                                                              │
│  ┌────────────────────────────────────────────┐             │
│  │  📷 Camera Preview                          │             │
│  │                                              │             │
│  │  [Tap to capture your journal pages]        │             │
│  │                                              │             │
│  │  Journal: Insight (KAIROS_20251112_ABC12)   │             │
│  │  Today: November 12, 2025                    │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  User takes photos → Uploads → AI analyzes                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security & Ownership

### Can someone "steal" your journal by copying the NFC chip?

**NO!** Here's why:

```
┌─────────────────────────────────────────────────────────────┐
│ SCENARIO: Attacker clones your NFC chip                     │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│ Attacker taps cloned chip to their phone                    │
│                                                              │
│ 1. App launches                                              │
│ 2. Reads URL → journalId: KAIROS_20251112_ABC12            │
│ 3. Queries Firestore                                         │
│ 4. Checks: journal.userId === attacker.uid?                  │
│    ❌ NO! (journal belongs to YOU, not attacker)            │
│                                                              │
│ 5. BLOCKS ACCESS:                                            │
│    "This journal belongs to another account.                 │
│     Contact support if this is your journal."                │
└─────────────────────────────────────────────────────────────┘
```

**Security is in Firestore, not the chip!**
- Chip = Public identifier (just an ID)
- Firestore = Access control (who owns it)

---

## 🆚 Comparison: URL vs JSON Approach

### URL Approach (RECOMMENDED) ✅

**What's written:**
```
https://kairos-journal.com/nfc/KAIROS_20251112_ABC12?tier=insight
```

**Pros:**
- ✅ Standard Android App Link (works automatically)
- ✅ Smaller size (65 bytes)
- ✅ If app not installed → opens Play Store
- ✅ Can tap anywhere (lock screen works)
- ✅ Works with any NFC reader (debugging)
- ✅ Professional standard (Nike, Starbucks use this)

**Cons:**
- ❌ Requires domain ownership (kairos-journal.com)
- ❌ Slightly more setup (intent filters)

---

### JSON Approach (Alternative) ⚠️

**What's written:**
```json
{
  "journalId": "KAIROS_20251112_ABC12",
  "tier": "insight",
  "serialNumber": "KJ-TEST-001",
  "registeredAt": "2025-11-12T10:30:00Z"
}
```

**Pros:**
- ✅ More data stored on chip
- ✅ Works offline (data is on chip)
- ✅ No domain needed

**Cons:**
- ❌ Larger size (200+ bytes)
- ❌ Requires app to be open first
- ❌ Less reliable intent detection
- ❌ No Play Store fallback
- ❌ Not standard practice

---

## 📊 Data Flow Summary

```
Registration Flow:
User → Select Tier → Scan Chip → Write URL → Firestore ✅

Daily Use Flow:
Tap Chip → Android reads URL → Launch App → Validate → Camera 📷

Data Storage:
• NFC Chip: URL only (65 bytes) - PUBLIC
• Firestore: All journal data - PRIVATE, SECURED
• User device: Cached for offline - PRIVATE
```

---

## 🎯 Key Takeaway

**The NFC chip is NOT a storage device - it's a SHORTCUT!**

Think of it like:
- 🏠 House key (chip) → Opens door (launches app)
- 🏚️ But house contents (journal entries) are inside (Firestore)
- 🔒 Only the owner can enter (userId validation)

The chip just says: **"Open Καιρός app with journal ID ABC12"**

Everything else (ownership, entries, subscription) is in Firestore! 🎉
