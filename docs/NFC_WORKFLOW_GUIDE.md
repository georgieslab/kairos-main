# 📱 Καιρός NFC Workflow Guide

## Complete NFC Journey Flow

### 🎯 Scenario 1: First-Time Registration

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User Opens App → Profile → "Register Journal"      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Select Journal Tier                                 │
│  □ Essential ($29)  → 3 months subscription                │
│  □ Insight ($49)    → 6 months subscription                │
│  □ Legacy ($89)     → 12 months subscription               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Tap "Scan NFC" Button                              │
│ App starts listening for NFC tags...                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: User Taps Phone to Journal's NFC Chip              │
│                                                             │
│  BEFORE TAP (Blank NFC chip):                              │
│  [Empty or manufacturer data]                              │
│                                                             │
│  APP READS: Nothing or random data                         │
│  APP GENERATES: "KAIROS_20251112_ABC12"                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: App Processes Registration                         │
│                                                             │
│ 1. Creates Firestore Document:                             │
│    journals/KAIROS_20251112_ABC12 = {                      │
│      journalId: "KAIROS_20251112_ABC12",                   │
│      userId: "user123",                                     │
│      tier: "insight",                                       │
│      registeredAt: "2025-11-12T10:30:00Z",                 │
│      serialNumber: "KJ-TEST-001",                          │
│      totalEntries: 0,                                       │
│      isActive: true                                         │
│    }                                                        │
│                                                             │
│ 2. Updates User Profile:                                   │
│    users/user123 = {                                        │
│      journals: ["KAIROS_20251112_ABC12"],                  │
│      primaryJournalId: "KAIROS_20251112_ABC12",            │
│      subscription: {                                        │
│        plan: "insight",                                     │
│        expiresAt: "2026-05-12"  // 6 months from now       │
│      }                                                      │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 6: App Writes to NFC Chip                             │
│                                                             │
│  AFTER WRITE (NFC chip now contains):                      │
│  {                                                          │
│    "journalId": "KAIROS_20251112_ABC12",                   │
│    "tier": "insight",                                       │
│    "serialNumber": "KJ-TEST-001",                          │
│    "registeredAt": "2025-11-12T10:30:00Z",                 │
│    "metadata": {                                            │
│      "batchNumber": "BATCH-2025-01",                       │
│      "manufactureDate": "2025-11-12"                       │
│    }                                                        │
│  }                                                          │
│                                                             │
│  ✅ NFC chip is now "claimed" by this user                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 7: Success Screen                                      │
│  ✅ Journal Registered!                                     │
│  📚 Journal ID: KAIROS_20251112_ABC12                      │
│  ⭐ Tier: Insight                                          │
│  📅 Subscription: Active until May 12, 2026                │
│  🎉 You can now start journaling!                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 🚀 Scenario 2: Daily Use (Tapping Registered Journal)

```
┌─────────────────────────────────────────────────────────────┐
│ User is away from app, taps journal to phone               │
│ (Phone screen is locked or app is closed)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Android Detects NFC Tag                                     │
│                                                             │
│ Reads JSON data:                                            │
│ {                                                           │
│   "journalId": "KAIROS_20251112_ABC12",                    │
│   "tier": "insight",                                        │
│   ...                                                       │
│ }                                                           │
│                                                             │
│ Checks AndroidManifest.xml intent filters:                 │
│  ✓ MIME type "text/plain" → matches!                       │
│  ✓ App: "com.kairos.journal" → launch!                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Καιρός App Launches (or comes to foreground)               │
│                                                             │
│ nfcIntentHandler detects:                                   │
│  - App opened via NFC intent                                │
│  - Extracts journalId: "KAIROS_20251112_ABC12"             │
│  - Calls useNFCQuickAccess hook                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ App Validates Journal                                       │
│                                                             │
│ 1. Queries Firestore:                                       │
│    journals/KAIROS_20251112_ABC12                          │
│                                                             │
│ 2. Checks ownership:                                        │
│    userId === currentUser.uid ✓                            │
│                                                             │
│ 3. Updates last used:                                       │
│    lastNFCScan: "2025-11-12T14:23:00Z"                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Smart Navigation (Context-Aware)                           │
│                                                             │
│ IF user has entry from today:                              │
│   → Navigate to: Archive (show today's entry)              │
│                                                             │
│ IF no entry today:                                          │
│   → Navigate to: Upload (camera ready) ← MOST COMMON       │
│                                                             │
│ IF journal inactive:                                        │
│   → Show: "Reactivate journal?" prompt                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 📷 Upload Screen Opens                                      │
│                                                             │
│  Ready to capture journal pages!                           │
│  Camera: ● REC                                             │
│                                                             │
│  [Tap to take photo of your journal entry]                │
│                                                             │
│  Journal: Insight (KAIROS_20251112_ABC12)                  │
│  Today: November 12, 2025                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Takes Photo → Uploads → Gets AI Analysis              │
│ ✅ Entry saved to Firestore                                │
│ 🤖 AI analysis complete                                    │
│ 📊 Progress updated                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### ⚠️ Scenario 3: Someone Else Tries to Tap Your Journal

```
┌─────────────────────────────────────────────────────────────┐
│ Different user taps your registered journal                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ App Opens → Reads Journal ID                                │
│ Queries Firestore: journals/KAIROS_20251112_ABC12          │
│                                                             │
│ CHECK: userId === currentUser.uid?                          │
│ ❌ NO! (Journal belongs to user123, but currentUser is     │
│          user456)                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Security Block                                              │
│                                                             │
│  ⚠️ This journal belongs to another account                │
│                                                             │
│  If this is your journal, contact support.                 │
│  Journal ID: KAIROS_20251112_ABC12                         │
│                                                             │
│  [Contact Support]  [Cancel]                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Details

### What Gets Written to NFC Chip

**Format:** JSON string (text/plain MIME type)

```json
{
  "journalId": "KAIROS_20251112_ABC12",
  "tier": "insight",
  "serialNumber": "KJ-TEST-001",
  "registeredAt": "2025-11-12T10:30:00Z",
  "metadata": {
    "batchNumber": "BATCH-2025-01",
    "manufactureDate": "2025-11-12"
  }
}
```

**Size:** ~200 bytes (fits easily on smallest NFC tags - NTAG213 = 144 bytes usable)

### What Happens When Chip is Tapped

1. **Android NFC Service reads the tag**
2. **Matches intent filter in AndroidManifest.xml:**
   - MIME type: `text/plain`
   - Action: `NDEF_DISCOVERED`
3. **Launches Καιρός app** (or brings to foreground)
4. **App receives intent with NFC data**
5. **nfcIntentHandler parses journalId**
6. **useNFCQuickAccess validates and navigates**

### Security

- ✅ Journal ID stored in Firestore with userId
- ✅ Ownership verified before allowing access
- ✅ Can't steal journal by cloning NFC (userId check fails)
- ✅ Last scan timestamp for audit trail
- ✅ Can deactivate lost/stolen journals remotely

---

## 🎨 User Experience Summary

### First Time (Registration)
1. User selects tier → taps journal → subscription activated
2. **One time setup**, never needs to register again

### Every Day After
1. Tap journal to phone → app opens → camera ready
2. **2 seconds from tap to photo**
3. Zero taps/navigation required

### Magic Moment
**Physical journal becomes a magic button:**
- Tap = instant upload
- No passwords, no menus, no searching
- Analog journaling meets instant digital backup

---

## 📝 Notes for Development

### Testing Without Physical NFC Tags
Use the NFC Test Panel in DebugPage:
- Simulates tag scans
- Tests all workflows
- Validates data parsing

### Recommended NFC Tags
- **NTAG213** (144 bytes) - Basic, cheap
- **NTAG215** (504 bytes) - Recommended
- **NTAG216** (888 bytes) - Premium, future-proof

### Future Enhancements
- [ ] Custom journal names (override "Insight")
- [ ] Multiple journals per user
- [ ] Shared journals (family/couples)
- [ ] Quick voice note via NFC tap + hold
- [ ] NFC tag encryption for premium journals
