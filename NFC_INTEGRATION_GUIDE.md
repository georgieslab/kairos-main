# 🏷️ NFC Integration Guide - Καιρός Smart Journal

## ✅ Integration Complete

The NFC functionality has been fully integrated into the Καιρός Smart Journal app using the `@capgo/capacitor-nfc` plugin.

---

## 📦 What Was Installed

### Package
- **@capgo/capacitor-nfc** v7.0.8
- Actively maintained (last update: Nov 2025)
- Supports Android & iOS (though we're using Android-only)
- Handles NDEF tag reading/writing

### Files Updated
1. ✅ `src/services/nfcService.js` - Wired up actual NFC plugin
2. ✅ `capacitor.config.ts` - Added NFC plugin configuration
3. ✅ `package.json` - Added @capgo/capacitor-nfc dependency
4. ✅ Android project synced via `npx cap sync android`

---

## 🎯 Current Features

### ✅ Already Implemented
- **NFC Service Layer** (`src/services/nfcService.js`)
  - Platform detection (Android-only)
  - Tag availability checking
  - Read/write operations
  - Session management
  - Journal ID generation/validation
  - Error handling

- **React Hooks** (`src/hooks/useNFC.js`)
  - `useNFC()` - Full state management
  - `useNFCScan()` - Quick one-time scan
  - `useNFCQuickUpload()` - Auto-upload on scan
  
- **UI Components** (`src/components/journal/NFCStatusBadge.jsx`)
  - Status badges (4 states)
  - Detailed status cards
  - Inline status displays
  - Settings navigation

- **Android Configuration**
  - AndroidManifest.xml with all NFC intent filters
  - NFC tech filters for all tag types
  - Optional hardware feature (app works without NFC)

---

## 🚀 How to Use NFC

### Basic Usage in Components

```javascript
import useNFC from '../hooks/useNFC';

function MyComponent() {
  const nfc = useNFC({
    onScan: (data) => {
      console.log('Scanned journal:', data.journalId);
    },
    onError: (error) => {
      console.error('NFC Error:', error);
    }
  });

  return (
    <div>
      {/* Show NFC status */}
      <p>NFC Ready: {nfc.isReady ? 'Yes' : 'No'}</p>
      
      {/* Start scanning */}
      <button onClick={() => nfc.startReading()}>
        Start NFC Scan
      </button>
      
      {/* Stop scanning */}
      <button onClick={() => nfc.stopReading()}>
        Stop Scanning
      </button>
      
      {/* One-time read */}
      <button onClick={async () => {
        const result = await nfc.readTag();
        console.log('Tag data:', result.data);
      }}>
        Read One Tag
      </button>
    </div>
  );
}
```

### Quick Upload Flow

```javascript
import { useNFCQuickUpload } from '../hooks/useNFC';

function QuickUpload() {
  const { isListening, startListening, stopListening } = useNFCQuickUpload(
    (journalData) => {
      // Triggered when journal is tapped
      console.log('Starting upload for:', journalData.journalId);
      navigateToUpload(journalData);
    }
  );

  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  return <div>Tap your journal to upload...</div>;
}
```

### Writing to NFC Tags (Journal Registration)

```javascript
const nfc = useNFC();

async function registerJournal(tier, serialNumber) {
  const journalData = {
    journalId: nfc.generateJournalId(),
    tier: tier,
    serialNumber: serialNumber,
    metadata: { registeredDate: new Date().toISOString() }
  };

  const result = await nfc.writeTag(journalData);
  if (result.success) {
    console.log('Journal registered!');
  }
}
```

---

## 🔧 NFC Service API

### Methods Available

#### Availability
- `checkAvailability()` - Check if NFC is available/enabled
- `getSupportLevel()` - Get support level: 'full', 'disabled', 'no_hardware', 'none'
- `openNFCSettings()` - Open device NFC settings

#### Reading
- `startReadSession(options)` - Start continuous scanning
- `stopReadSession()` - Stop scanning
- `addScanListener(callback)` - Add scan event listener
- `removeScanListener(id)` - Remove specific listener
- `removeAllListeners()` - Remove all listeners
- `readTag(options)` - One-time tag read

#### Writing
- `writeTag(journalData)` - Write journal data to tag
- `eraseTag()` - Erase tag data
- `makeReadOnly()` - Lock tag (permanent!)

#### Utilities
- `generateJournalId()` - Generate unique ID (KAIROS_YYYYMMDD_XXXXX)
- `isValidJournalId(id)` - Validate journal ID format
- `parseNFCTag(event)` - Parse tag data into journal format

---

## 📱 Testing on Android

### Requirements
1. **Physical Android device** with NFC hardware
2. NFC must be enabled in device settings
3. NFC tags (recommended: NTAG213, NTAG215, or NTAG216)

### Testing Steps

1. **Build Android APK:**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```

2. **Enable NFC on device:**
   - Settings → Connected devices → Connection preferences → NFC
   - Turn ON

3. **Install APK** on device

4. **Test basic detection:**
   - Open app
   - Navigate to any screen with NFC status badge
   - Should show "NFC Ready" if enabled

5. **Test tag scanning:**
   - Navigate to journal upload or registration
   - Tap phone back to NFC tag
   - Should trigger scan event

### Debugging

Enable NFC logs in Chrome DevTools:
1. Connect device via USB
2. Open `chrome://inspect`
3. Select your app
4. Check console for NFC logs (prefixed with 🔷, 📖, 🏷️, ✅, ❌)

---

## 🎨 UI Components

### NFCStatusBadge

```jsx
import NFCStatusBadge from './components/journal/NFCStatusBadge';

<NFCStatusBadge size="md" showLabel={true} />
```

**Props:**
- `size` - 'sm', 'md', 'lg'
- `showLabel` - Show text label
- `onClick` - Custom click handler
- `className` - Additional CSS classes

**States:**
- 🔴 Not Available - No NFC hardware
- 🟠 Disabled - NFC disabled in settings (clickable to open settings)
- 🟢 Ready - Ready to scan
- 🔵 Scanning - Active scan in progress (animated)

### NFCStatusCard

```jsx
import { NFCStatusCard } from './components/journal/NFCStatusBadge';

<NFCStatusCard />
```

Shows detailed status with:
- Icon and color-coded status
- Descriptive message
- Action button (if applicable)

### NFCStatusInline

```jsx
import { NFCStatusInline } from './components/journal/NFCStatusBadge';

<NFCStatusInline onScanClick={() => startScanning()} />
```

Compact inline status with optional scan button.

---

## 🏗️ Data Format

### Journal NFC Tag Structure

```javascript
{
  journalId: "KAIROS_20251112_A7X9K",
  tier: "premium",           // or "standard"
  serialNumber: "KJ-2025-001234",
  registeredAt: "2025-11-12T10:30:00Z",
  metadata: {
    // Custom data
  }
}
```

### Scanned Tag Response

```javascript
{
  tagId: "04:D2:E3:F4:AB:CD:EF",  // Physical chip ID
  type: "kairos",                  // or "plain_text", "unknown"
  journalId: "KAIROS_20251112_A7X9K",
  tier: "premium",
  serialNumber: "KJ-2025-001234",
  metadata: {}
}
```

---

## 🛡️ Error Handling

The service provides user-friendly error messages:

```javascript
const nfc = useNFC();

// Get error message
const errorMsg = nfc.getErrorMessage();

// Error types:
// - not_available: Device doesn't support NFC
// - disabled: NFC disabled in settings
// - scan_error: Error during scanning
// - read_error: Couldn't read tag
// - write_error: Couldn't write to tag
```

---

## 📋 Next Steps

### Ready to Test
✅ Plugin installed and configured
✅ Service layer complete
✅ React hooks ready
✅ UI components built
✅ Android manifest configured

### To Complete Full NFC Flow

1. **Get NFC Tags**
   - Order NTAG213/215/216 tags
   - Stickers, cards, or embedded in journal covers

2. **Test Journal Registration**
   - Use `JournalRegistration.jsx` component
   - Write journal ID to tag
   - Verify data persistence

3. **Test Quick Upload**
   - Tap journal with registered NFC chip
   - Should auto-navigate to upload screen
   - Should pre-fill journal ID

4. **Production Considerations**
   - Consider making production tags read-only (`.makeReadOnly()`)
   - Implement tag authentication if needed
   - Add analytics for NFC usage

---

## 🔗 Useful Resources

- [@capgo/capacitor-nfc Documentation](https://github.com/Cap-go/capacitor-nfc)
- [Android NFC Guide](https://developer.android.com/guide/topics/connectivity/nfc)
- [NDEF Format Specification](https://nfc-forum.org/our-work/specifications-and-application-documents/specifications/nfc-forum-technical-specifications/)
- [NFC Tag Types](https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag:NTAG)

---

## 💡 Tips

1. **NFC only works on physical Android devices** - Emulators don't support it
2. **Hold phone steady** for 1-2 seconds when scanning
3. **NFC antenna location** varies by device (usually near camera or center back)
4. **Use quality tags** - NTAG series from NXP are reliable
5. **Test on multiple devices** - NFC antenna strength varies
6. **Keep tags clean** - Dirt/damage can prevent scanning
7. **Avoid metal surfaces** - Can interfere with NFC signal

---

**Status:** ✅ Ready for Android Device Testing
**Last Updated:** November 12, 2025
