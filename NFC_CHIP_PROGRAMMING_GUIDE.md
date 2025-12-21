# NFC Chip Programming Guide for Καιρός Smart Journal

## Overview

This guide covers everything you need to know about programming NFC chips for the Καιρός Smart Journal app, including hardware requirements, programming process, testing procedures, and troubleshooting.

---

## Table of Contents

1. [Hardware Requirements](#hardware-requirements)
2. [NFC Chip Specifications](#nfc-chip-specifications)
3. [Programming the NFC Chip](#programming-the-nfc-chip)
4. [Data Format & Structure](#data-format--structure)
5. [Testing & Verification](#testing--verification)
6. [Production Workflow](#production-workflow)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

---

## Hardware Requirements

### NFC Chips/Tags

**Recommended NFC Tag Types:**
- **NTAG213** (144 bytes user memory) - **RECOMMENDED**
  - Capacity: 144 bytes
  - Cost: ~$0.30-0.50 per tag
  - Perfect for URL + metadata
  - ISO14443A compliant
  
- **NTAG215** (504 bytes user memory)
  - Capacity: 504 bytes
  - Cost: ~$0.50-0.80 per tag
  - Overkill but works perfectly
  
- **NTAG216** (888 bytes user memory)
  - Capacity: 888 bytes
  - Cost: ~$0.80-1.20 per tag
  - Maximum capacity option

**NOT Recommended:**
- ❌ **MIFARE Classic** - Security vulnerabilities, encryption overhead
- ❌ **NTAG210** - Only 48 bytes (too small for our needs)

### Physical Form Factors

Choose based on journal integration:
1. **NFC Stickers** (25mm-30mm diameter)
   - Adhesive backing
   - Can be embedded in journal cover
   - Discrete and professional

2. **NFC Cards** (credit card size)
   - Durable plastic housing
   - Can be inserted in journal pocket
   - More robust for frequent use

3. **NFC Inlays** (paper-thin)
   - Can be laminated between pages
   - Completely invisible integration
   - Most professional appearance

### Programming Device

**Option 1: Android Phone with NFC (Recommended)**
- Any Android 4.4+ device with NFC
- Free apps available
- Most convenient for testing
- **Required apps:**
  - **NFC Tools** (for reading/writing)
  - **NFC TagWriter by NXP** (alternative)

**Option 2: ACR122U USB NFC Reader/Writer**
- Professional desktop solution
- Cost: ~$30-40
- Works with PC/Mac
- Better for bulk programming
- **Required software:**
  - NFC Tools PC/Mac (free)
  - TagXplorer (NXP official tool)

---

## NFC Chip Specifications

### Memory Layout (NTAG213)

```
Total Memory: 180 bytes
├── UID (7 bytes) - Read-only, unique identifier
├── Lock Bytes (2 bytes) - Protection settings
├── Capability Container (4 bytes) - Tag type info
├── User Memory (144 bytes) - YOUR DATA GOES HERE
└── Configuration Pages (8 bytes) - Access control
```

### Our Data Requirements

**Minimum Space Needed:**
- NDEF Record Header: ~8 bytes
- URL Prefix: ~3 bytes (https://)
- Domain: 25 bytes (reflection-writer.web.app)
- Path: 4 bytes (/nfc)
- Journal ID: 20 bytes (Firebase auto-generated ID)
- Tier Parameter: 8 bytes (?tier=X)
- **Total: ~68 bytes**

✅ NTAG213 (144 bytes) provides plenty of space

---

## Programming the NFC Chip

### Method 1: Using the Καιρός App (Recommended)

**Prerequisites:**
1. Android device with NFC enabled
2. Καιρός app installed and logged in
3. Blank NFC chip (NTAG213 or compatible)

**Step-by-Step Process:**

1. **Navigate to Registration**
   ```
   App → Profile/Settings → Register New Journal
   ```

2. **Tap "Register Journal" Button**
   - App generates unique Journal ID
   - Creates Firestore document
   - Prepares NFC write operation

3. **Position NFC Chip**
   - Hold chip against back of phone
   - Keep steady for 2-3 seconds
   - Wait for success confirmation

4. **Verification**
   - App automatically reads chip back
   - Confirms data integrity
   - Shows success message

**What Gets Written:**
```
URL: https://reflection-writer.web.app/nfc/{journalId}?tier={userTier}

Example:
https://reflection-writer.web.app/nfc/abc123XYZ789def456?tier=premium
```

### Method 2: Using NFC Tools App (Manual)

**When to Use:**
- Pre-programming chips before journal assembly
- Batch programming multiple journals
- Testing with specific Journal IDs
- App not available

**Step-by-Step:**

1. **Install NFC Tools**
   - Download from Play Store
   - Grant NFC permissions

2. **Get Journal ID**
   - Option A: Generate via Καιρός Debug Panel
   - Option B: Use existing Firestore document ID
   - Option C: Create in Firebase Console

3. **Configure Write Operation**
   ```
   NFC Tools → WRITE
   ├── Add Record → URL/URI
   ├── Enter: https://reflection-writer.web.app/nfc/{JOURNAL_ID}?tier={TIER}
   └── Write to chip
   ```

4. **Write to Chip**
   - Tap "Write"
   - Hold chip against phone
   - Wait for confirmation beep/vibration

5. **Verify Write**
   ```
   NFC Tools → READ
   - Scan the chip you just wrote
   - Verify URL is correct
   - Check all parameters present
   ```

### Method 3: Bulk Programming (ACR122U)

**For Production Batches:**

1. **Setup**
   ```
   - Connect ACR122U to PC/Mac via USB
   - Install drivers (usually automatic)
   - Launch NFC Tools PC/Mac
   ```

2. **Create Template**
   ```
   File → New Write Template
   ├── Record Type: URI
   ├── Protocol: HTTPS://
   ├── Domain: reflection-writer.web.app
   ├── Path: /nfc/{VARIABLE}
   └── Parameter: ?tier={TIER}
   ```

3. **Batch Process**
   ```
   For each journal:
   1. Get Journal ID from spreadsheet/database
   2. Update template with ID
   3. Place chip on reader
   4. Click "Write"
   5. Wait for green checkmark
   6. Remove chip, label with ID
   7. Repeat for next journal
   ```

---

## Data Format & Structure

### NDEF Message Structure

```json
{
  "records": [
    {
      "recordType": "URI",
      "encoding": "UTF-8",
      "uri": "https://reflection-writer.web.app/nfc/{journalId}?tier={tier}"
    }
  ]
}
```

### URL Components Explained

```
https://reflection-writer.web.app/nfc/{journalId}?tier={tier}
│      │                         │    │          │      │
│      │                         │    │          │      └─ User subscription tier
│      │                         │    │          └─ Query parameter separator
│      │                         │    └─ Unique journal identifier (20 chars)
│      │                         └─ NFC-specific path prefix
│      └─ Firebase Hosting domain
└─ Secure HTTPS protocol
```

### Journal ID Format

- **Length:** 20 characters
- **Character Set:** Alphanumeric (a-z, A-Z, 0-9)
- **Example:** `abc123XYZ789def456gh`
- **Generated by:** Firestore `collection.add()` method
- **Must match:** Firestore document ID in `/journals/{journalId}`

### Tier Values

```javascript
tier = "free" | "premium" | "lifetime"
```

---

## Testing & Verification

### Pre-Deployment Testing

**Test 1: Write Verification**
```
1. Write data to chip using any method
2. Use NFC Tools → READ to verify
3. Confirm URL is exactly correct
4. Check no extra characters/spaces
```

**Test 2: App Recognition**
```
1. Open Καιρός app
2. Navigate to Debug Page → NFC Test Panel
3. Tap "Start Reading"
4. Scan your programmed chip
5. Verify logs show correct journal ID
```

**Test 3: Deep Link Launch**
```
1. Close Καιρός app completely
2. Tap NFC chip with phone
3. App should launch automatically
4. Should navigate to correct screen
5. Check navigation logs in Debug Panel
```

**Test 4: Ownership Validation**
```
Test with chip owner (should work):
1. User A writes chip with their journal
2. User A taps chip → navigates to camera/archive

Test with non-owner (should be rejected):
1. User A writes chip with their journal
2. User B taps chip → sees "not your journal" message
```

### Production Verification Checklist

Before shipping each journal:

- [ ] NFC chip physically secured in journal
- [ ] Chip readable from outside cover (test scan)
- [ ] URL format correct (check with NFC Tools)
- [ ] Journal ID matches Firestore document
- [ ] Tier parameter matches user subscription
- [ ] App launches on tap (test with Android)
- [ ] No duplicate Journal IDs (query Firestore)
- [ ] Write-protect enabled (if using lock feature)

---

## Production Workflow

### End-to-End Journal Preparation

**Step 1: Firestore Setup**
```javascript
// Create journal document in Firestore
const journalRef = await addDoc(collection(db, "journals"), {
  userId: currentUser.uid,
  createdAt: serverTimestamp(),
  tier: userSubscriptionTier,
  status: "pending_nfc_write",
  journalNumber: sequentialNumber // Optional: J001, J002, etc.
});

const journalId = journalRef.id; // Use this ID for NFC chip
```

**Step 2: NFC Programming**
```
Choose method:
├── Manual (NFC Tools app)
│   ├── Enter journalId from Step 1
│   └── Write to chip
│
├── App-based (Καιρός app)
│   ├── User initiates registration
│   └── App handles Firestore + NFC automatically
│
└── Bulk (ACR122U + CSV)
    ├── Export journalIds from Firestore
    ├── Load into programming software
    └── Process batch sequentially
```

**Step 3: Physical Integration**
```
1. Clean journal cover surface (alcohol wipe)
2. Position chip in designated spot (back cover, inside front, etc.)
3. Peel adhesive backing
4. Press firmly for 10 seconds
5. Verify chip is flush and secure
```

**Step 4: Quality Control**
```
1. Scan chip with NFC Tools
2. Verify URL is correct
3. Test app launch (close app, tap chip)
4. Mark journal as "ready to ship"
5. Update Firestore: status = "shipped"
```

**Step 5: User Onboarding**
```
Include in package:
├── Quick Start Card
│   ├── "Tap your phone to the journal cover"
│   ├── "First tap: Claim your journal"
│   └── "Daily taps: Quick upload photos"
│
└── NFC Positioning Diagram
    └── Show exact location of chip on journal
```

---

## Troubleshooting

### Common Issues & Solutions

**Problem: "No NFC tag detected"**
- ✅ Check NFC is enabled in phone settings
- ✅ Remove phone case if thick/metallic
- ✅ Try different position/angle
- ✅ Ensure chip isn't damaged
- ✅ Test with NFC Tools to verify chip works

**Problem: "Tag is empty" after writing**
- ✅ Some chips require 2-second hold time
- ✅ Don't move phone during write
- ✅ Check chip isn't write-protected
- ✅ Try different NFC app (NFC Tools vs TagWriter)

**Problem: App doesn't launch on tap**
- ✅ Verify assetlinks.json is live and accessible
- ✅ Check AndroidManifest.xml has correct intent filters
- ✅ Ensure app is installed on device
- ✅ Try manual URL: `adb shell am start -a android.intent.action.VIEW -d "https://reflection-writer.web.app/nfc/TEST_123"`
- ✅ Clear app data and reinstall

**Problem: "Journal not found" error**
- ✅ Verify journalId in Firestore exists
- ✅ Check URL on chip matches exactly
- ✅ Ensure no extra spaces or characters
- ✅ Confirm tier parameter is valid

**Problem: "Access denied" / "Not your journal"**
- ✅ This is expected behavior (security working)
- ✅ Only owner can access their journal
- ✅ Verify user is logged into correct account
- ✅ Check userId in Firestore matches current user

**Problem: Chip works once, then stops**
- ✅ Likely a memory corruption issue
- ✅ Reformat chip using NFC Tools
- ✅ Write data again
- ✅ Consider using higher quality tags (NTAG215+)

---

## Security Considerations

### What's Secure

✅ **Journal Ownership:** Firestore validates userId matches
✅ **Deep Links:** Android App Links verified via assetlinks.json
✅ **HTTPS:** All communication encrypted in transit
✅ **No Sensitive Data on Chip:** Only public journal ID stored

### What's NOT Secure

⚠️ **Journal ID is Public:** Anyone can read chip and see ID
⚠️ **Physical Access:** Chip can be removed/replaced
⚠️ **No Chip Authentication:** We trust data on chip (validated server-side)

### Best Practices

1. **Never store passwords/tokens on chip**
2. **Always validate ownership server-side (Firestore)**
3. **Use write-protection after programming** (optional)
   ```
   NFC Tools → Other → Lock Tag
   - Prevents tampering
   - Permanent (irreversible)
   - Use only for production journals
   ```
4. **Log all NFC access attempts** (already implemented)
5. **Monitor for suspicious patterns** (multiple failed access attempts)

### Write Protection (Advanced)

**When to Use:**
- Production journals only
- After final verification
- When journal shipped to customer

**How to Enable:**
```
NFC Tools → Other → Lock Tag
├── WARNING: This is permanent!
├── Tag becomes read-only forever
├── Cannot update URL if journal transferred
└── Confirm lock operation
```

**Why Lock:**
- Prevents tampering
- Professional security posture
- Ensures data integrity

**Why NOT Lock:**
- Can't fix mistakes
- Can't repurpose journals
- Limits flexibility for testing

**Recommendation:** Lock only for final production units, keep test journals unlocked.

---

## Quick Reference Card

### Chip Programming Cheat Sheet

```
┌─────────────────────────────────────────┐
│  NFC CHIP QUICK REFERENCE               │
├─────────────────────────────────────────┤
│  Chip Type: NTAG213                     │
│  Capacity: 144 bytes                    │
│  Data Format: NDEF URI Record           │
│                                         │
│  URL Template:                          │
│  https://reflection-writer.web.app      │
│         /nfc/{JOURNAL_ID}?tier={TIER}   │
│                                         │
│  Journal ID: 20 characters              │
│  Tier: free|premium|lifetime            │
│                                         │
│  Apps Needed:                           │
│  • NFC Tools (read/write/verify)        │
│  • Καιρός app (testing)                 │
│                                         │
│  Testing Steps:                         │
│  1. Write data to chip                  │
│  2. Verify with NFC Tools               │
│  3. Test app launch (close app, tap)    │
│  4. Confirm correct navigation          │
└─────────────────────────────────────────┘
```

### URL Format Examples

```
Free Tier User:
https://reflection-writer.web.app/nfc/a1b2c3d4e5f6g7h8i9j0?tier=free

Premium User:
https://reflection-writer.web.app/nfc/x9y8z7w6v5u4t3s2r1q0?tier=premium

Lifetime User:
https://reflection-writer.web.app/nfc/m1n2o3p4q5r6s7t8u9v0?tier=lifetime
```

---

## Appendix: Technical Specifications

### NDEF URI Record Structure

```
Byte Layout:
┌────────────────────────────────────────┐
│ 0x03  - NDEF Message Start             │
│ 0xXX  - Payload Length                 │
│ 0xD1  - Record Header (TNF + Flags)    │
│ 0x01  - Type Length                    │
│ 0xXX  - Payload Length                 │
│ 0x55  - Record Type (URI)              │
│ 0x04  - URI Prefix (https://)          │
│ ...   - URI String                     │
│ 0xFE  - NDEF Message End               │
└────────────────────────────────────────┘
```

### Android Intent Filter (Reference)

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.nfc.action.NDEF_DISCOVERED" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:scheme="https" />
    <data android:host="reflection-writer.web.app" />
    <data android:pathPrefix="/nfc" />
</intent-filter>
```

### Firestore Journal Document Schema

```javascript
{
  journals/{journalId}: {
    userId: string,           // Owner's Firebase Auth UID
    createdAt: timestamp,     // Journal creation time
    tier: string,             // "free" | "premium" | "lifetime"
    status: string,           // "pending_nfc_write" | "active" | "shipped"
    journalNumber: number,    // Optional sequential number
    lastAccessed: timestamp,  // Last NFC tap time
    accessCount: number       // Total NFC taps
  }
}
```

---

## Support & Resources

### Developer Tools

- **NFC Tools (Android):** https://play.google.com/store/apps/details?id=com.wakdev.wdnfc
- **NFC TagWriter (NXP):** https://play.google.com/store/apps/details?id=com.nxp.nfc.tagwriter
- **ACR122U Drivers:** https://www.acs.com.hk/en/driver/3/acr122u-usb-nfc-reader/

### Documentation

- **NDEF Specification:** https://nfc-forum.org/our-work/specifications-and-application-documents/
- **Android App Links:** https://developer.android.com/training/app-links
- **Capacitor NFC Plugin:** https://github.com/capgo/capacitor-nfc

### Hardware Suppliers

- **Amazon:** Search "NTAG213 NFC tags" (bulk packs available)
- **AliExpress:** Lower cost, longer shipping
- **TagsForDroid:** Specialty NFC supplier
- **Bulk Tag Orders:** Contact NXP Semiconductors directly

---

## Version History

- **v1.0** (2025-11-12): Initial guide created
  - Complete programming workflows
  - Testing procedures
  - Security best practices
  - Production integration steps

---

**Document ID:** NFC_CHIP_PROGRAMMING_GUIDE.md  
**Last Updated:** November 12, 2025  
**Author:** Καιρός Development Team  
**App Version:** 1.0 (Capacitor 7.4.4, @capgo/capacitor-nfc 7.0.8)
