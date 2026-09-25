<div align="center">

# Καιρός — Smart Journal

**The right word, at the right moment.**

An AI-powered journaling companion that turns handwritten pages, spoken reflections, and artwork into guided personal growth — bilingual, beautiful, and built around the ancient Greek idea of *kairos*: the opportune moment.

[**✦ Live App**](https://reflection-writer.web.app) · [Landing Page](https://reflection-writer.web.app/landing.html) · [Portfolio Case Study](https://reflection-writer.web.app/kairos-case-study.html)

![Version](https://img.shields.io/badge/version-2.2.0-d4af37?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-558B6E?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Functions-ffca28?style=flat-square&logo=firebase&logoColor=black)
![Languages](https://img.shields.io/badge/languages-EN%20%7C%20DE%20%7C%20KA-8b5cf6?style=flat-square)

</div>

---

## ✨ What is Καιρός?

Καιρός bridges the analog and the digital: you journal by hand in a physical notebook (optionally an NFC-enabled Καιρός journal), speak your thoughts aloud, or create art — then the app photographs, transcribes, and *understands* it. Claude AI reads each entry with care and returns a summary, key insights, a reflection question, a practical action, and an affirmation written for **you**, in your language.

With **Miro**, Καιρός also provides a calm, contemplative voice companion that listens with deep presence and speaks in quiet reflection.

It ships as a responsive web app (PWA, installable) and a native Android app built from the same codebase.

## 🌟 Feature Highlights

### 🕊️ Miro — The Contemplative AI Companion
Miro is not a productivity chatbot or an intrusive coach; Miro is a quiet, grounded presence designed for deep contemplation:
- **Voice Reflection Chamber** — 1-tap voice mode enabling hands-free, turn-taking vocal reflection with real-time speech transcription and natural vocal synthesis.
- **Living MiroMark & Art** — An organic, breathing visual presence (`miroBreathe`, `miroTurn`, `miroOrbPulse`) that reacts dynamically to listening, thinking, and speaking states.
- **Grounded in Your Words** — Responses emerge directly from your journaling entries and current emotional climate, never from generic self-help scripts.
- **Quiet Reverence** — Speaks only when invited; holds space silently while you write or reflect.

### 🎵 Contemplative Ambient Soundscapes
An in-app procedural Web Audio suite designed to anchor your writing sessions:
- **4 Infinite Audio Loops** — *Rain on Japanese Slate*, *Temple Singing Bowl*, *Fountain Pen Whispers*, and *Celestial Night*.
- **Procedural & Offline** — Generates soothing acoustic textures without network buffering or latency.
- **Focus Session Timer** — Configurable reflection timers (15m–60m) with gentle 3-second acoustic fade-outs.

### 📖 Physical-Digital Journal Harmony
- **NFC Tap-to-Journal** — Tap your smartphone against the brushed brass medallion of a physical Καιρός journal to immediately unlock today's reflection prompt.
- **Journal Status Card** — Apple Spatial Glass status showcase displaying active edition tier, stamped gold foil serial badge, and live NFC readiness.

### 🗺️ 53 Guided Journey Paths
Multi-day programs (7–100 days) across self-discovery, emotional intelligence, mindfulness, habit formation, shadow work, creative expression, voice confidence, and more — each with professionally crafted daily prompts, its own color theme, and difficulty level.

### ✨ The Kairos Collection — three exclusive paths
The trilogy the app is named for, sharing one warm-gold identity and one **€2.99** unlock (no subscription) — or an invite code. Owning any one unlocks all three; every path lets *you* choose your medium each day: **write it, speak it, or draw it.**

- **⏳ Kairos Moments** — *9 days* on the art of the opportune moment: recognizing it, waiting for it, seizing it. Its gold card tops the Paths screen with a flipping hourglass and rising gold dust.
- **🔀 Kairos Cards** — *21 days*, the interactive path. Each day deals you a hand of prompts; if a card doesn't fit, **shuffle** for another until one lands.
- **✨ Kairos Sparks** — *14 days*, the most open path. One single-word spark per day (shuffleable) and a blank canvas — you supply the rest.

### 🎙️ 🖌️ ✍️ Truly Multi-Modal Journaling
- **Handwritten** — photograph up to 5 journal pages; text is extracted and analyzed
- **Voice** — record reflections; automatic transcription (Whisper on Android, live Web Speech on desktop)
- **Visual** — upload drawings and paintings; the AI reads color, composition, and emotional expression
- **Flex paths** — pick a different medium every day; the AI recognizes what you gave it and responds accordingly

### 🔮 Inner Aura & Mood Weather
A one-tap daily mood check-in on the Home screen — lunar, ethereal, sparkle, radiant, or ember — paired with contextual weather moods. Choosing an aura bathes the whole check-in card in that mood's colour glow. Your aura history flows into the Insights dashboard, the Profile mood board, the AI's empathy context, and even your PDF exports.

### 🎧 Listen
A dedicated episode page for **Ink & Intention** — a podcast on handwriting and journaling, for the moments between entries. Animated cover art, an "In this episode" rundown, and an inline player with interactive soundscape controls.

### 🧠 AI Insights
Streaks, emotion trends, recurring themes, a journaling activity calendar, AI personality analysis, and personalized reflection questions — all generated from your actual entries via Claude, proxied server-side so no API key ever touches the client.

### 🌍 Trilingual Localization (EN | DE | KA)
Full **English, German, and Georgian** localization — the entire UI, journey paths, prompts, and companion dialogue switch seamlessly with zero reload.

### 📄 Beautiful PDF Export
Journal entries export as styled, infographic-style PDFs: branded header, hand-drawn vector mood glyph, stat chips, journey progress bar, and tinted insight cards — localized to your language.

### 💎 Design: Apple Spatial Glass
Frosted-glass surfaces, drifting aurora backgrounds, a sliding glass tab pill with unfolding labels, journey-colored gradients, a traveling streak heartbeat, breathing glows, blur-to-focus prompt reveals — every screen is alive, and every animation respects `prefers-reduced-motion`.

### And more
- 🏆 Secret gamified achievements based on journaling patterns
- 🌤️ Weather-aware home screen with location-based conditions
- 📳 NFC quick access — tap a physical Καιρός journal to jump into today's entry (Android)
- 💳 Artisan subscription (Stripe Checkout + Customer Portal) for premium paths
- 📴 Offline-aware: queued operations and IndexedDB caching degrade gracefully
- 📱 Installable PWA with app shortcuts and instant, frictionless launch

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, react-i18next (EN/DE/KA), Recharts, Lucide, Lottie |
| **Audio & Speech** | Web Audio API (ambient soundscapes), Web Speech API & TTS (Miro Voice) |
| **Design system** | Hand-rolled Apple Spatial Glass CSS (no UI framework) |
| **Mobile** | Capacitor 7 (Android) — camera, NFC, haptics, speech recognition |
| **Backend** | Firebase Auth · Firestore · Storage · Cloud Functions · Hosting |
| **AI** | Claude (Anthropic) for analysis · OpenAI Whisper for voice transcription |
| **Payments** | Stripe — subscriptions *and* one-time path purchases with webhook grants |

### Cloud Functions (`functions/`)

| Function | Purpose |
|---|---|
| `callClaude` | Server-side proxy for all AI analysis (API key never leaves the server) |
| `transcribeAudio` / `transcribeAudioHttp` | Whisper transcription for Android voice journals |
| `createCheckoutSession` | Artisan subscription checkout |
| `createPathCheckoutSession` | One-time exclusive path purchase (inline €2.99 price) — buying any Kairos path unlocks the whole Collection |
| `stripeWebhook` | Activates subscriptions & grants purchased paths (`purchasedPaths`) |
| `getCustomerPortalUrl` · `cancelSubscription` · `getSubscriptionStatus` | Subscription lifecycle |

## 📁 Project Structure

```
src/
├── components/          # Feature UI by domain
│   ├── achievements/ analytics/ auth/ common/ journal/
│   ├── journey/ layout/ paths/ settings/ subscription/
│   ├── voice/ weather/ profile/
│   └── (MiroVoiceModal, MiroThinking, PhysicalJournalCard, HomeActivityCalendar)
├── pages/               # Top-level screens (Home, Insights, Profile, Listen...)
├── contexts/            # Auth, Theme, Navigation
├── hooks/               # useUserProgress, useUserStatistics, useNFC, ...
├── services/            # claudeService, ambientAudioService, speechRecognitionService, textToSpeechService, ...
├── data/
│   ├── JourneyData.js           # All 53 paths + daily prompts (EN)
│   ├── podcasts.js              # Listen-screen episodes (handwriting & journaling)
│   └── journeyTranslations/de/  # German prompt translations
├── i18n/                # react-i18next config + locales/{en,de,ka}/*.json
├── constants/           # moods.js, inviteCodes.js, pathBundles.js
├── utils/               # pathTypeUtils, versionControl (changelog), ...
└── styles/              # Per-component CSS (Apple Spatial Glass)

functions/               # Firebase Cloud Functions
android/                 # Capacitor Android project (signed release ready)
public/                  # landing.html, manifest, icons, robots.txt, sitemap
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Firebase project (Auth, Firestore, Storage, Functions enabled)
- Android Studio (only for the Android build)

### Setup

```bash
npm install
cp .env.example .env    # fill in your Firebase web config
npm run dev
```

Required environment variables (see `.env.example`):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

> 🔐 Claude, Whisper, and Stripe keys are **never** client-side — they live in the Cloud Functions config.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run build:android` | Build web + sync into the Capacitor Android project |
| `npm run android` | Open the Android project in Android Studio |
| `npm run android:run` | Build, sync, and run on a device/emulator |
| `npm run generate-icons` | Regenerate app icons/splash screens |

## 🤖 Building for Android

```bash
npm run build:android
cd android && ./gradlew assembleRelease   # signed APK (keystore.properties)
```

The signed release APK lands in `android/app/build/outputs/apk/release/`. The Android app shares the React codebase; platform behavior (voice transcription, NFC, permissions) branches at runtime via `Capacitor.getPlatform()`.

## ☁️ Deployment

```bash
npm run build
npx firebase deploy --only hosting,functions
```

Pushes to main also trigger Firebase Hosting deploys via GitHub Actions (`.github/workflows/`), with preview channels for pull requests.

## 📚 Additional Documentation

- `NFC_INTEGRATION_GUIDE.md` · `NFC_CHIP_PROGRAMMING_GUIDE.md` · `docs/NFC_TECHNICAL_DEEP_DIVE.md` — physical journal pairing
- `FIREBASE_NFC_SETUP.md` — Firebase-side NFC setup
- `pathAddingInstruction.md` — adding a new journey path
- `src/utils/versionControl.js` — the full in-app changelog, from 0.1.0 to today

---

<div align="center">

*"Your next kairos moment is already on its way."* — Day 9, Kairos Moments

Made with 💚 in the opportune moments

</div>
