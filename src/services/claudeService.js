// src/services/claudeService.js - Enhanced Voice & Analysis Support
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { callClaudeApi, safeJsonParse, formatApiError } from '../utils/apiUtils';
import { getAuth } from 'firebase/auth';
import { isVisualPath, isVoicePath, isFlexPath } from '../utils/pathTypeUtils';
import i18n from '../i18n/config';
import apiCacheService from './apiCacheService';

// Claude API configuration
const CLAUDE_EXTRACTION_MODEL = 'claude-sonnet-4-6';            // Updated july 2026

// Analysis runs on Sonnet, not Haiku (changed july 2026, was
// 'claude-haiku-4-5-20251001'). The prompts below ask for candid, specific,
// sometimes unwelcome observations — naming an avoidance, contradicting the
// journaler's own framing, saying an entry is thin. That is exactly the kind of
// judgement a small fast model is weakest at: under pressure it retreats to safe
// agreeable phrasing, which is the generic-and-too-kind output we're trying to
// get rid of. The honesty prompting only pays off on a model big enough to hold
// the tension.
//
// Deliberately NOT claude-sonnet-5: it rejects non-default `temperature` with a
// 400, and every analysis call in this file sets one (0.65–0.85). It also runs
// adaptive thinking by default, which would eat the 1200–1600 max_tokens budget
// and truncate the JSON. Moving there means stripping temperature everywhere and
// re-tuning max_tokens first — a separate job, not a constant swap.
const CLAUDE_ANALYSIS_MODEL = 'claude-sonnet-4-6';

// =============================================================================
// 🌍 AI OUTPUT LANGUAGE
// =============================================================================
// Kairos AI insights are generated live per entry. We don't translate the
// (English) prompt engineering — we append a directive telling Claude to write
// its response in the user's selected language. Critical: JSON *keys* stay in
// English (the whole app reads them); only the string *values* are translated.

const AI_LANGUAGE_NAMES = {
  de: 'German (Deutsch), using the informal "du" form',
  ka: 'Georgian (ქართული), written in the Mkhedruli script'
};

/**
 * Returns a directive to append to a system prompt so Claude responds in the
 * user's selected language. Returns '' for English (the default), so English
 * behavior is byte-for-byte unchanged.
 */
export const getLanguageDirective = () => {
  const lng = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
  const languageName = AI_LANGUAGE_NAMES[lng];
  if (!languageName) return '';
  return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 LANGUAGE (MANDATORY):
Write ALL human-readable text in your response in ${languageName}.
This applies to every string VALUE in the JSON — summaries, insights, questions, affirmations, actions, and any prose.
Do NOT translate the JSON keys/field names: keep them EXACTLY as specified in English (e.g. "summary", "insights", "reflectionQuestion", "affirmation", "practicalAction"). Only the values are translated.
Write naturally and idiomatically in this language — do not translate word-for-word from English.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
};

// =============================================================================
// 🪞 HONESTY DIRECTIVE
// =============================================================================
// Shared by every prompt that produces analysis the user reads.
//
// The prompts here used to ask for warmth, celebration, and affirmation on
// every single entry ("honor this", "celebrate authentically", "make them feel
// truly seen"). The model did exactly that — which is the problem. Praise that
// arrives no matter what you wrote carries no information: if every entry is
// brave and profound, none of them are, and the reader learns to skim past it.
//
// This block is NOT permission to be harsh. It is permission to be accurate,
// which is the only thing that makes the warm parts mean anything. It is
// appended to the system prompt AFTER the safety guidelines and explicitly
// defers to them.

export const HONESTY_DIRECTIVE = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🪞 HONESTY (THIS OUTRANKS TONE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your entire value to this person is that you tell them the truth about what they
wrote. Praise they would have received regardless tells them nothing. Be the
friend who is honest with them, not the one who flatters them.

SAY WHAT IS ACTUALLY THERE:
• Ground every claim in something they actually wrote. If you cannot point to the
  words that support an observation, delete the observation.
• A thin, rushed, or guarded entry is a thin entry. Say so plainly and ask one
  real question. Do NOT manufacture depth that is not on the page.
• Do not assert emotions, motives, or realizations they did not express. When you
  are inferring, say so in a way they can reject — "this reads like…", "I might be
  wrong, but…" — and be willing to be wrong out loud.

NAME WHAT THEY MAY NOT WANT NAMED:
• Contradictions between what they say they want and what they describe doing.
• Avoidance: the subject circled but never entered, the feeling named but not
  felt, the person or decision conspicuously missing from an entry that is
  obviously about them.
• Repetition: the same problem re-described across entries with nothing changing
  is worth saying out loud, plainly. Do not dress a loop up as "deepening".
• Self-criticism or self-congratulation that their own entry does not support.
• Say it once, straight, without padding it between three compliments. One clear
  sentence respects them more than a cushioned paragraph.

DO NOT:
• Do not praise the act of journaling, showing up, opening up, or being brave.
  They know they wrote it. Comment on WHAT they wrote.
• Do not call ordinary reflection "profound", "beautiful", "powerful", "sacred",
  "transformative", or "a breakthrough". Strong words need strong evidence.
• Do not open with a compliment as a warm-up before the real content.
• Do not resolve, reassure, or tie a bow on something they left open. Leaving a
  question open is a legitimate ending.
• Do not reframe every difficulty as growth in disguise. Sometimes a bad week is
  just a bad week, and saying that is more useful than finding the silver lining.

TONE: warm, direct, specific, unsentimental. Plain language, short sentences.
Someone who has read every word, respects them enough to be straight with them,
and has no interest in performing wisdom.

This never overrides the SAFETY GUIDELINES above. If someone is in distress, care
comes first — honesty there means being steady and clear, not blunt.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

// =============================================================================
// ✨ TODAY'S SELF-REPORTED MOOD ("inner aura" check-in on the Home screen)
// =============================================================================
// Stored per-day at users/{uid}/moods/{YYYY-MM-DD} by MoodWeather.jsx.
// When present, we hand it to Claude as gentle context — the directive tells it
// not to force a reference, only to let it inform tone and empathy.

const MOOD_PROMPT_DESCRIPTIONS = {
  lunar: 'lunar — quiet, introspective, a little withdrawn',
  ethereal: 'ethereal — light, calm, gently drifting',
  sparkle: 'sparkle — playful, bright, energized',
  radiant: 'radiant — confident, glowing, full of warmth',
  ember: 'ember — intense, restless, simmering with feeling'
};

const getTodaysMoodContext = async (userId) => {
  if (!userId) return '';
  try {
    const d = new Date();
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const snap = await getDoc(doc(db, 'users', userId, 'moods', dateKey));
    const mood = snap.exists() ? snap.data().mood : null;
    if (!mood || !MOOD_PROMPT_DESCRIPTIONS[mood]) return '';
    return `

TODAY'S SELF-REPORTED INNER AURA:
Before journaling, they checked in feeling "${MOOD_PROMPT_DESCRIPTIONS[mood]}".
Let this quietly inform your empathy and tone. Acknowledge it only where it genuinely connects to what they wrote — never force the reference.`;
  } catch (error) {
    console.log('Could not retrieve today\'s mood (non-fatal):', error);
    return '';
  }
};

// Privacy settings
const SETTINGS = {
  DELETE_IMAGES_AFTER_PROCESSING: true,
  DELETE_AUDIO_AFTER_PROCESSING: false, // Keep voice recordings by default
  RETENTION_PERIOD: 7 * 24 * 60 * 60 * 1000,
  ENABLE_LOCAL_ANALYSIS_OPTION: false,
  DEFAULT_PRIVACY_LEVEL: 'high'
};

// =============================================================================
// 🎤 VOICE JOURNAL FUNCTIONS
// =============================================================================

/**
 * Upload voice journal with transcription to Firebase
 */
export const uploadVoiceJournal = async (
  audioBlob, 
  transcription, 
  userId, 
  day, 
  pathId = 'voice-discovery',
  options = {}
) => {
  try {
    if (!audioBlob || !userId) {
      throw new Error('Audio blob and user ID required');
    }
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Authentication error');
    }
    
    const defaultOptions = {
      keepAudio: !SETTINGS.DELETE_AUDIO_AFTER_PROCESSING,
      privacyLevel: SETTINGS.DEFAULT_PRIVACY_LEVEL,
      isTemporary: false
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    const storage = getStorage();
    const timestamp = Date.now();
    const safeFileName = `voice_entry_${timestamp}.webm`;
    const filePrefix = finalOptions.isTemporary ? 'temp_' : '';
    
    const voiceRef = ref(storage, `voices/${userId}/${pathId}/day-${day}/${filePrefix}${safeFileName}`);
    
    const metadata = {
      contentType: 'audio/webm',
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        day: day.toString(),
        pathId: pathId,
        isTemporary: finalOptions.isTemporary.toString(),
        hasTranscription: (!!transcription).toString(),
        transcriptionLength: transcription ? transcription.length.toString() : '0',
        duration: options.duration ? options.duration.toString() : '0'
      }
    };
    
    const snapshot = await uploadBytes(voiceRef, audioBlob, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save voice data and transcription to Firestore
    if (transcription) {
      const voiceTextRef = doc(db, 'users', userId, 'voice_entries', `${pathId}_day-${day}`);
      await setDoc(voiceTextRef, {
        transcription,
        day,
        pathId,
        audioUrl: downloadURL,
        hasAudio: true,
        timestamp: serverTimestamp(),
        privacyLevel: finalOptions.privacyLevel,
        wordCount: transcription.split(/\s+/).filter(Boolean).length,
        duration: options.duration || null
      });
      
      logAnalyticsEvent('voice_journal_upload', {
        day, pathId, hasTranscription: true, 
        transcriptionLength: transcription.length,
        wordCount: transcription.split(/\s+/).filter(Boolean).length,
        duration: options.duration
      });
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading voice journal:', error);
    logAnalyticsEvent('voice_upload_error', { errorMessage: error.message });
    throw new Error(`Failed to upload voice: ${error.message}`);
  }
};

/**
 * Analyze voice journal entry with enhanced Claude AI prompts
 * Updated with safety guidelines and lower temperature
 */
export const analyzeVoiceJournalEntry = async (
  transcription,
  audioUrl,
  prompt, 
  theme, 
  userProfile, 
  day = 1, 
  pathId = 'voice-discovery',
  voiceMetadata = {}
) => {
  try {
    console.log(`Analyzing voice journal entry using ${CLAUDE_ANALYSIS_MODEL}...`);

    // Voice analysis had no cache anywhere — unlike the written path, which
    // AnalysisResults.jsx wraps. Re-opening a voice entry re-ran the whole
    // analysis. The transcription is what the model actually reads, so it
    // keys the entry; language is in the key because the same recording
    // yields a different analysis per UI language, and model because a model
    // change should invalidate.
    const voiceCacheKey = apiCacheService.generateCacheKey('voiceAnalysis', {
      uid: userProfile?.uid || 'anon',
      pathId,
      day,
      lang: (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0],
      model: CLAUDE_ANALYSIS_MODEL,
      len: (transcription || '').length
    });
    const cachedVoice = apiCacheService.getFromCache(voiceCacheKey);
    if (cachedVoice) {
      console.log('Using cached voice analysis for day', day);
      return cachedVoice;
    }
    
    if (!transcription || !transcription.trim()) {
      throw new Error('No transcription provided for voice analysis');
    }
    
    const userAge = userProfile?.age || null;
    const ageGroup = userAge ? getAgeGroup(userAge) : 'adult';
    
    logAnalyticsEvent('voice_analysis_started', {
      ageGroup, theme, pathId, hasUserProfile: !!userProfile,
      transcriptionLength: transcription.length, 
      model: CLAUDE_ANALYSIS_MODEL,
      wordCount: transcription.split(/\s+/).filter(Boolean).length
    });

    // Get previous voice entries context
    let previousContext = "";
    let continuityInsights = "";
    if (day > 1) {
      try {
        const userId = userProfile.uid;
        const previousEntries = await getPreviousVoiceEntries(userId, pathId);
        const priorEntries = previousEntries.filter(entry => entry.day < day && entry.day > 0);
        
        if (priorEntries.length > 0) {
          const recentEntries = priorEntries.slice(-3);
          previousContext = `\nPREVIOUS VOICE INSIGHTS:\n${recentEntries.map(entry => 
            `Day ${entry.day}: ${(entry.analysis?.summary || entry.transcription?.substring(0, 100) || '').substring(0, 100)}`
          ).join('\n')}`;
          
          continuityInsights = `\nCONTINUITY NOTES:\n- User has been practicing voice journaling for ${day} days
- Look for evolving themes, growing confidence, or deepening insights
- Note any progression in vocal expression or emotional openness`;
        }
      } catch (error) {
        console.log('Could not retrieve previous voice entries:', error);
      }
    }
    
    // Voice-specific analysis instructions
    const voiceInstructions = getEnhancedVoicePathInstructions(pathId);

    // Today's self-reported mood, if the user checked in on the Home screen
    const moodContext = await getTodaysMoodContext(userProfile?.uid);
    
    // Enhanced system prompt for voice analysis with safety guidelines
    const systemPrompt = `You are Καιρός. You listen to what someone said out loud and tell them what you actually heard in it.

⚠️ SAFETY GUIDELINES (MANDATORY):
- You are an AI companion, not a therapist. Never provide medical or mental health diagnoses.
- If the user expresses thoughts of self-harm or harm to others, respond with: "Thank you for sharing something so difficult. Please reach out to a mental health professional or crisis line. In the US, call 988 for the Suicide and Crisis Lifeline. You matter and support is available."
- Do not guarantee outcomes or make claims about curing conditions.
- Keep responses hopeful but realistic.

YOUR IDENTITY:
Speaking bypasses the editing that writing allows, so the transcript often shows
more than the speaker intended — including hedges, reversals, and the thing they
talked around for two minutes. Your job is to reflect that back accurately, not
to congratulate them for having spoken.

CURRENT SESSION CONTEXT:
- Journaler: ${userProfile?.displayName || 'Friend'} (${ageGroup})
- Journey Stage: Day ${day} of "${pathId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
- Current Theme: "${theme}"
- Guiding Question: "${prompt}"
${voiceInstructions}
${previousContext}
${continuityInsights}
${moodContext}

🎙️ THEIR SPOKEN WORDS:
"${transcription}"

${voiceMetadata.duration ? `⏱️ They spoke for ${Math.floor(voiceMetadata.duration / 60)} minutes ${voiceMetadata.duration % 60} seconds` : ''}
${voiceMetadata.wordCount ? `📝 ${voiceMetadata.wordCount} words of authentic expression` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VOICE ANALYSIS MASTERY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **HEAR WHAT WAS SAID**
   Start with content, not with the fact that they spoke. Do not open by praising
   the act of recording — they know they recorded it.

2. **LISTEN FOR THE GAP**
   • Where the words say one thing and the surrounding detail says another
   • Which subject they approached repeatedly and never actually said
   • Where they downgraded something mid-sentence ("it was awful — well, fine, really")
   • Ignore disfluencies like "um" and "uh" unless they cluster around one subject,
     which is itself worth noting

3. **RECOGNIZE VOCAL PATTERNS**
   • Repetition signals importance — what did they keep returning to?
   • Self-interruption and abrupt topic changes often mark the live wire
   • Shifts from "I" to "you" or "people" usually mark distancing. Say so
   • Long throat-clearing before the real subject tells you where the weight is

4. **DON'T OVERCLAIM WHAT SPEAKING DID**
   Talking is not the same as resolving. If they narrated a problem without
   moving on it, describe that accurately rather than calling it a breakthrough.

5. **CONTINUITY**
   If they've recorded before:
   • Note real changes across sessions — and note when nothing has changed
   • If they've described the same situation the same way three times, say it
   • Do not call increasing entry length "growth" by itself

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**RESPONSE STANDARDS:**
✓ Use "you" and "your" - direct and personal
✓ Quote the exact phrases they said; a quote is the proof you listened
✓ Name emotions only where their words support it — don't assign feelings they didn't voice
✓ No praise for recording, opening up, or being brave. Content only
✓ Plain language. No "profound", "powerful", "raw truth", "vocal courage"
✓ Write like a friend who listened closely and will say the honest thing
✓ Keep summary under 80 words

**RESPOND WITH JSON ONLY:**
{
  "summary": "2-3 sentences on what they actually said and what it points to. Quote a real phrase. Open with the substance, not with a compliment about speaking.",
  "insights": [
    "What their own words point to — quote them",
    "A pattern or emotional theme across this entry and previous ones. If it's the same loop again, say so plainly",
    "The most useful uncomfortable thing you heard: a contradiction, a subject they talked around, a claim their own details undercut. If there is honestly none, name what they left unfinished instead — do not substitute praise"
  ],
  "reflectionQuestion": "ONE question aimed at what they circled but never said. Specific to their actual words.",
  "affirmation": "One true sentence about something specific in THIS recording — something they admitted, named accurately, or stopped defending — with the evidence. If nothing here honestly earns that, don't invent it: say the plainest true thing to them instead.",
  "practicalAction": "One small, concrete thing to do today that follows from what they said. Checkable. Not 'keep reflecting'.",
  "voiceObservations": "What you noticed about HOW they spoke in this entry: where they sped up, hedged, self-interrupted, went abstract, or trailed off — and what that seems to be about. Descriptive, not congratulatory. If their delivery was unremarkable, say that rather than inventing significance."
}${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

    const requestContent = [{
      type: 'text',
      text: `Analyze this voice journal entry with deep empathy and insight:\n\nPrompt: "${prompt}"\nTheme: "${theme}"\nSpoken Reflection: "${transcription}"`
    }];
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: requestContent }],
      system: systemPrompt,
      max_tokens: 1200,
      temperature: 0.75
    };

    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const analysisResult = safeJsonParse(content, {
      // See the note on the written-entry fallback: this runs only when the
      // model's JSON fails to parse, so it cannot know what was said. It says
      // that plainly rather than guessing warmly.
      summary: "Your recording and transcript saved, but the analysis didn't come back this time. Nothing was lost.",
      insights: [
        "This one is on us, not on your recording — the analysis failed to generate",
        "Your audio and transcript are stored and unchanged",
        "If this keeps happening, it's worth reporting as a bug"
      ],
      reflectionQuestion: "Listening back to what you said: which part did you rush past?",
      affirmation: "Analysis unavailable for this entry.",
      practicalAction: "Try analyzing this recording again in a moment. If it fails twice, report it from Settings.",
      voiceObservations: "Not available for this entry."
    });

    analysisResult.voiceMetadata = {
      duration: voiceMetadata?.duration ?? null,
      wordCount: voiceMetadata?.wordCount ?? null
    };
    
    analysisResult.prompt = prompt;
    analysisResult.theme = theme;
    analysisResult.transcription = transcription;
    analysisResult.audioUrl = audioUrl;
    analysisResult.pathId = pathId;
    analysisResult.isVoiceEntry = true;
    analysisResult.wordCount = transcription.split(/\s+/).filter(Boolean).length;
    analysisResult.voiceMetadata = voiceMetadata;
    
    logAnalyticsEvent('voice_analysis_completed', {
      ageGroup, theme, pathId, success: true, 
      model: CLAUDE_ANALYSIS_MODEL,
      wordCount: analysisResult.wordCount
    });

    // Don't cache the safeJsonParse fallback — that object says the analysis
    // failed, and pinning it here would make the failure permanent for this
    // entry. `summary` is only absent on the fallback path.
    if (analysisResult && analysisResult.summary) {
      apiCacheService.storeInCache(voiceCacheKey, analysisResult);
    }

    return analysisResult;
  } catch (error) {
    console.error('Error analyzing voice journal entry:', error);
    logAnalyticsEvent('voice_analysis_error', {
      errorType: 'api', message: error.message, model: CLAUDE_ANALYSIS_MODEL
    });
    throw new Error('Failed to analyze voice entry: ' + formatApiError(error));
  }
};

/**
 * Get enhanced voice-specific path instructions
 */
function getEnhancedVoicePathInstructions(pathId) {
  const instructions = {
    'voice-discovery': `
PATH FOCUS: Authentic Voice Discovery
- Celebrate their courage in using voice for self-exploration
- Notice moments where their true self shines through
- Highlight the unique insights that emerge from spoken reflection
- Encourage continued vocal authenticity and self-expression`,
    
    'spoken-emotions': `
PATH FOCUS: Emotional Expression Through Voice
- Analyze the emotional layers in their vocal tone and word choice
- Recognize courage in speaking difficult emotions aloud
- Identify emotional patterns and shifts throughout the recording
- Guide toward deeper emotional articulation and acceptance`,
    
    'vocal-confidence': `
PATH FOCUS: Building Vocal Confidence & Authority
- Acknowledge moments of strong, clear self-expression
- Notice areas where their voice carries conviction
- Celebrate progress in speaking with authenticity and power
- Suggest ways to expand their confident vocal presence`,
    
    'storytelling-voice': `
PATH FOCUS: Narrative Voice & Storytelling
- Appreciate their natural storytelling abilities
- Notice narrative techniques and engaging moments
- Highlight the power of their personal stories
- Encourage creative exploration through spoken narrative`,
    
    'meditation-speaking': `
PATH FOCUS: Mindful Speech & Presence
- Recognize moments of mindful awareness in their speech
- Notice the quality of presence in their voice
- Appreciate pauses, breath, and conscious communication
- Guide toward deeper integration of mindfulness and voice`
  };
  
  return instructions[pathId] || instructions['voice-discovery'];
}

/**
 * Get previous voice entries for context
 */
export const getPreviousVoiceEntries = async (userId, pathId = 'all') => {
  try {
    const entries = [];
    const voiceRef = collection(db, 'users', userId, 'voice_entries');
    const voiceSnap = await getDocs(voiceRef);
    
    voiceSnap.forEach((doc) => {
      const data = doc.data();
      if (pathId === 'all' || !data.pathId || data.pathId === pathId) {
        entries.push({ id: doc.id, ...data });
      }
    });
    
    return entries.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error('Error getting previous voice entries:', error);
    // Try REST fallback if permission denied or network transport issues
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw error;
      const idToken = await user.getIdToken();
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/voice_entries`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` }, method: 'GET' });
      if (!res.ok) throw new Error('REST fallback failed with status ' + res.status);
      const data = await res.json();
      const docs = data.documents || [];
      const restEntries = docs.map(d => ({ id: d.name.split('/').pop(), ...convertFirestoreFields(d.fields) }));
      return restEntries.filter(e => pathId === 'all' || !e.pathId || e.pathId === pathId).sort((a, b) => a.day - b.day);
    } catch (restErr) {
      console.error('REST fallback for voice entries failed:', restErr);
      throw new Error('Failed to get previous voice entries: ' + error.message);
    }
  }
};

/**
 * Get specific voice journal entry
 */
export const getVoiceJournalEntry = async (userId, day, pathId = 'voice-discovery') => {
  try {
    const entryRef = doc(db, 'users', userId, 'voice_entries', `${pathId}_day-${day}`);
    const entrySnap = await getDoc(entryRef);
    
    return entrySnap.exists() ? { id: entrySnap.id, ...entrySnap.data() } : null;
  } catch (error) {
    console.error('Error getting voice journal entry:', error);
    throw new Error('Failed to get voice journal entry: ' + error.message);
  }
};

// =============================================================================
// 📝 REGULAR JOURNAL FUNCTIONS
// =============================================================================

/**
 * Upload journal image with privacy features
 */
export const uploadJournalImage = async (
  file, 
  userId, 
  day, 
  extractedText = '', 
  pathId = 'self-discovery',
  options = {}
) => {
  try {
    if (!file || !userId) {
      throw new Error('File and user ID required');
    }
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Authentication error');
    }
    
    const defaultOptions = {
      keepImage: !SETTINGS.DELETE_IMAGES_AFTER_PROCESSING,
      privacyLevel: SETTINGS.DEFAULT_PRIVACY_LEVEL,
      isTemporary: true
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    const storage = getStorage();
    const timestamp = Date.now();
    const fileExtension = file.name ? file.name.split('.').pop() : 'jpg';
    const safeFileName = `journal_entry_${timestamp}.${fileExtension}`;
    const filePrefix = finalOptions.isTemporary ? 'temp_' : '';
    
    const journalRef = ref(storage, `journals/${userId}/${pathId}/day-${day}/${filePrefix}${safeFileName}`);
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        day: day.toString(),
        pathId: pathId,
        isTemporary: finalOptions.isTemporary.toString()
      }
    };
    
    const snapshot = await uploadBytes(journalRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    if (extractedText) {
      const textRef = doc(db, 'users', userId, 'journal_text', `${pathId}_day-${day}`);
      await setDoc(textRef, {
        text: extractedText,
        day,
        pathId,
        imageUrl: finalOptions.keepImage ? downloadURL : null,
        hasImage: true,
        timestamp: serverTimestamp(),
        privacyLevel: finalOptions.privacyLevel
      });
      
      logAnalyticsEvent('journal_upload_with_text', {
        day, pathId, hasExtractedText: true, textLength: extractedText.length
      });
    }
    
    // Schedule deletion if not keeping image
    if (!finalOptions.keepImage && extractedText) {
      setTimeout(async () => {
        try {
          await deleteObject(journalRef);
          console.log(`Deleted temporary image: ${journalRef.fullPath}`);
        } catch (deleteError) {
          console.error('Error deleting temporary image:', deleteError);
        }
      }, 60000);
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading journal image:', error);
    logAnalyticsEvent('journal_upload_error', { errorMessage: error.message });
    throw new Error(`Failed to upload: ${error.message}`);
  }
};

/**
 * Upload multiple journal images (up to 5 pages)
 */
export const uploadMultipleJournalImages = async (files, pathId, day, extractedText = '') => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) throw new Error('User not authenticated');
    
    const MAX_PAGES = 5;
    if (files.length > MAX_PAGES) {
      throw new Error(`Cannot upload more than ${MAX_PAGES} pages.`);
    }
    
    const uploadPromises = files.map(async (file, index) => {
      const storage = getStorage();
      const fileName = file.name || `page-${index+1}.jpg`;
      const journalRef = ref(storage, `journals/${user.uid}/${pathId}/day-${day}/page-${index+1}_${Date.now()}_${fileName}`);
      
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          day: day.toString(),
          pathId: pathId,
          pageNumber: (index + 1).toString()
        }
      };
      
      const snapshot = await uploadBytes(journalRef, file, metadata);
      return getDownloadURL(snapshot.ref);
    });
    
    // Batch uploads for better performance
    let downloadURLs = [];
    for (let i = 0; i < uploadPromises.length; i += 2) {
      const batch = uploadPromises.slice(i, i + 2);
      const batchResults = await Promise.all(batch);
      downloadURLs = [...downloadURLs, ...batchResults];
      if (i + 2 < uploadPromises.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    if (extractedText) {
      const textRef = doc(db, 'users', user.uid, 'journal_text', `${pathId}_day-${day}`);
      await setDoc(textRef, {
        text: extractedText,
        day, pathId,
        imageCount: files.length,
        imageUrls: downloadURLs,
        isMultiPage: files.length > 1,
        timestamp: serverTimestamp()
      });
      
      logAnalyticsEvent('multi_page_journal_upload', {
        day, pathId, pageCount: files.length, hasExtractedText: true
      });
    }
    
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading journal images:', error);
    logAnalyticsEvent('multi_page_upload_error', {
      errorMessage: error.message, pageCount: files.length, pathId
    });
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

// =============================================================================
// 🧠 UNIFIED ANALYSIS FUNCTION with Enhanced Prompts & Safety
// =============================================================================

/**
 * Analyze journal entry - automatically handles voice vs regular entries
 * Updated with safety guidelines, lower temperature, and better handling
 */
export const analyzeJournalEntry = async (
  imageUrl, 
  prompt, 
  theme, 
  userProfile, 
  day = 1, 
  extractedText = '', 
  pathId = 'self-discovery',
  isMultiPage = false,
  imageFiles = null,
  voiceData = null
) => {
  try {
    console.log(`🔍 Starting analysis using ${CLAUDE_ANALYSIS_MODEL}...`);
    console.log('Analysis type:', voiceData ? 'VOICE' : 'REGULAR');
    
    // 🎤 VOICE ANALYSIS PATHWAY
    if (voiceData && voiceData.transcription) {
      console.log('🎤 Routing to voice analysis pipeline...');
      return await analyzeVoiceJournalEntry(
        voiceData.transcription,
        voiceData.audioUrl,
        prompt,
        theme,
        userProfile,
        day,
        pathId,
        {
          duration: voiceData.duration,
          wordCount: voiceData.wordCount,
        }
      );
    }
    
    // 📝 REGULAR ANALYSIS PATHWAY
    const isVisual = isVisualPath(pathId);
    const userAge = userProfile?.age || null;
    const ageGroup = userAge ? getAgeGroup(userAge) : 'adult';
    
    logAnalyticsEvent('journal_analysis_started', {
      ageGroup, theme, pathId, hasUserProfile: !!userProfile,
      hasExtractedText: !!extractedText, isVisual, model: CLAUDE_ANALYSIS_MODEL
    });

    // Get previous entries context with enhanced continuity tracking
    let previousContext = "";
    let journeyProgress = "";
    if (day > 1) {
      try {
        const userId = userProfile.uid;
        const previousEntries = await getPreviousEntries(userId, pathId);
        const priorEntries = previousEntries.filter(entry => entry.day < day && entry.day > 0);
        
        if (priorEntries.length > 0) {
          const recentEntries = priorEntries.slice(-3);
          previousContext = `\nPREVIOUS INSIGHTS:\n${recentEntries.map(entry => 
            `Day ${entry.day}: ${(entry.analysis?.summary || '').substring(0, 100)}`
          ).join('\n')}`;
          
          journeyProgress = `\nJOURNEY PROGRESS:\n- Currently on Day ${day} of their ${pathId} journey
- Has completed ${priorEntries.length} previous entries
- Look for evolving themes and deepening self-awareness`;
        }
      } catch (error) {
        console.log('Could not retrieve previous entries:', error);
      }
    }
    
    // Path-specific enhanced instructions
    const pathInstructions = isVisual
      ? getEnhancedVisualPathInstructions(pathId)
      : getEnhancedRegularPathInstructions(pathId);

    // Today's self-reported mood, if the user checked in on the Home screen
    const moodContext = await getTodaysMoodContext(userProfile?.uid);
    
    // Shared safety guidelines (placed once at top)
    const safetyGuidelines = `⚠️ SAFETY GUIDELINES (MANDATORY):
- You are an AI companion, not a therapist. Never provide medical or mental health diagnoses.
- If the user expresses thoughts of self-harm or harm to others, respond with: "Thank you for sharing something so difficult. Please reach out to a mental health professional or crisis line. In the US, call 988 for the Suicide and Crisis Lifeline. You matter and support is available."
- Do not guarantee outcomes or make claims about curing conditions.
- Keep responses hopeful but realistic.`;
    
    // Enhanced system prompt for regular analysis
    const systemPrompt = `${safetyGuidelines}

You are Καιρός. You read someone's journal entry and tell them what you actually see in it.

YOUR IDENTITY:
You are a clear-eyed reader, not a cheerleader. The person writing this does not
need to be told that writing is brave — they need someone who read carefully and
will say the true thing, including the parts that are unflattering or unfinished.
Warmth is in the accuracy and the attention, not in the compliments.

CURRENT SESSION CONTEXT:
- Journaler: ${userProfile?.displayName || 'Friend'} (${ageGroup})
- Journey Stage: Day ${day} of "${pathId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}"
- Current Theme: "${theme}"
- Today's Guiding Question: "${prompt}"
${pathInstructions}
${previousContext}
${journeyProgress}
${moodContext}
${extractedText ? `\n📝 THEIR AUTHENTIC VOICE:\n"${extractedText}"` : ''}

YOUR ANALYTICAL APPROACH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **CLOSE READING**
   → Read what is on the page. Then notice what is missing from it
   → Which subject gets circled but never entered? Who goes unnamed?
   → Where does the language go abstract right when it should go specific?

2. **PATTERN RECOGNITION**
   → Connect this entry to their broader arc — including unwelcome patterns
   → If the same problem keeps reappearing unchanged, say that directly
   → Distinguish an actual shift from the same thought in new words

3. **SPECIFICITY**
   → Speak directly to THEM, not to "users" or "people"
   → Quote or reference their actual words. If you cannot, you have not read closely enough
   → An observation that would fit anyone's entry is not worth sending

4. **A QUESTION THAT COSTS SOMETHING**
   → Ask the question the entry is avoiding, not the comfortable one next to it
   → Challenge assumptions plainly — gentleness is in the tone, not in the vagueness
   → No question they can answer with a sentence they have already written

5. **ACTIONABLE INSIGHT**
   → Suggest one small action rooted in their actual circumstances
   → Concrete enough to do today; if you cannot make it concrete, say nothing
   → Do not prescribe "sit with it" or "be gentle with yourself" as an action

6. **HONEST ASSESSMENT**
   → Name what they did well only when they specifically did it — with the evidence
   → Name what they dodged, contradicted, or left unexamined, once and plainly
   → If the entry is slight, treat it as slight. That is information too

${isVisual ? `
🎨 VISUAL EXPRESSION ANALYSIS:
Your entry includes visual/artistic expression. This is profound—they're communicating beyond words.
• Interpret colors as emotional language (dark=depth, bright=hope, mixed=complexity)
• Notice composition: centered=stable, scattered=overwhelmed, flowing=processing
• Value the courage to express feelings through creative means
• See the artwork as a window into their subconscious mind
${extractedText ? `• Integrate their written notes with visual elements for holistic understanding` : ''}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**RESPONSE QUALITY STANDARDS:**
✓ Use "you" and "your" - personal and direct
✓ Reference specific details from their entry; vague praise is worse than silence
✓ Plain words. No "profound", "beautiful", "powerful", "sacred", "journey of self-discovery"
✓ Write like a straight-talking friend, not a therapist, teacher, or greeting card
✓ Concrete over abstract, every time
✓ Before sending, ask: could I paste this under a stranger's entry unchanged? If yes, rewrite it
✓ If the extracted text is very short (under 20 words), say plainly that there is not much here yet and ask one simple question. Do not inflate it into deep analysis.

**RESPOND WITH JSON ONLY:**
{
  "summary": "2-3 sentences on what they actually wrote and what it suggests. Reference something specific. No opening compliment, no scene-setting — start with the substance. Under 80 words.",
  "insights": [
    "Something their own words point to that they may not have stated outright — quote or paraphrase the words it rests on",
    "A pattern connecting this entry to their broader arc. If the pattern is a loop or a stuck point rather than progress, say that",
    "The most useful uncomfortable observation you can honestly make: a contradiction, an avoidance, a gap between what they say they want and what they describe doing. If the entry genuinely offers none, say what is unresolved instead — do not substitute a compliment"
  ],
  "reflectionQuestion": "ONE question aimed at what they stepped around. Specific to this entry, answerable only by thinking rather than by repeating themselves. Not rhetorical, not flattering.",
  "affirmation": "One true sentence about something specific they did in THIS entry — a thing they admitted, saw clearly, or stated precisely — with the evidence for it. If this entry gives you nothing that honestly earns that, do not invent praise: use this field for the plainest true thing you can say to them instead.",
  "practicalAction": "One small, specific thing to do today that follows from the entry. Concrete and checkable. Not 'reflect on', not 'be kind to yourself'."
}${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

    let requestContent;
    
    if (extractedText && !isVisual) {
      requestContent = [{
        type: 'text',
        text: `Analyze this journal entry with deep wisdom and care:\n\nPrompt: "${prompt}"\nTheme: "${theme}"\nTheir Written Reflection:\n"${extractedText}"`
      }];
    } else if (imageFiles && imageFiles.length > 0) {
      const primaryFile = imageFiles[0];
      const { data: imageBase64, mediaType } = await fileToBase64(primaryFile);
      
      let textInstruction = isVisual
        ? `Analyze this visual creation with deep insight into their artistic expression and emotional landscape.`
        : `Analyze this handwritten journal entry, understanding both the content and the care taken in writing.`;

      // Flex paths (choose-your-medium, e.g. Kairos Moments): the upload may
      // be handwritten pages OR a drawing — recognize first, then analyze.
      if (isFlexPath(pathId)) {
        textInstruction = `This entry comes from a journey where the journaler chooses their medium each day. What you see may be handwritten journal pages, a drawing or painting, or a mix of both. First recognize which it is, then analyze accordingly: if it is writing, read and reflect deeply on the written words; if it is visual art, interpret the artistic expression, colors, and composition; if both, weave them together.`;
      }

      if (extractedText && isVisual) {
        textInstruction += `\n\nTheir notes about this creation: "${extractedText}"`;
      }
      
      requestContent = [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: imageBase64 }
        },
        { type: 'text', text: textInstruction }
      ];
    } else if (imageUrl) {
      if (isVisual) {
        throw new Error('Visual journeys require image file objects to avoid CORS issues.');
      }
      
      const primaryImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
      const imageBase64 = await fetchImageAsBase64(primaryImageUrl);
      
      requestContent = [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 }
        },
        { type: 'text', text: 'Analyze this journal entry with wisdom and deep care for their growth journey.' }
      ];
    } else {
      throw new Error('No journal content provided for analysis.');
    }
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: requestContent }],
      system: systemPrompt,
      max_tokens: 1200,
      temperature: 0.65
    };

    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const analysisResult = safeJsonParse(content, {
      // Fallback: only used when the model's JSON fails to parse. It cannot know
      // what they wrote, so it says that plainly instead of guessing warmly —
      // fake specificity here is exactly the generic praise we're removing.
      summary: "Your entry saved, but the analysis didn't come back this time. Nothing you wrote was lost.",
      insights: [
        "This one is on us, not on your entry — the analysis failed to generate",
        "Your writing is stored and unchanged; you can request analysis again",
        "If this keeps happening, it's worth reporting as a bug"
      ],
      reflectionQuestion: "Reading back what you just wrote: which sentence were you least comfortable putting down?",
      affirmation: "Analysis unavailable for this entry.",
      practicalAction: "Try analyzing this entry again in a moment. If it fails twice, report it from Settings."
    });
    
    analysisResult.prompt = prompt;
    analysisResult.theme = theme;
    analysisResult.extractedText = extractedText;
    analysisResult.pathId = pathId;
    analysisResult.isMultiPage = isMultiPage;
    analysisResult.isVisual = isVisual;
    analysisResult.isVoiceEntry = false;
    
    logAnalyticsEvent('journal_analysis_completed', {
      ageGroup, theme, pathId, success: true, model: CLAUDE_ANALYSIS_MODEL
    });

    return analysisResult;
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    logAnalyticsEvent('journal_analysis_error', {
      errorType: 'api', message: error.message, model: CLAUDE_ANALYSIS_MODEL
    });
    throw new Error('Failed to analyze: ' + formatApiError(error));
  }
};

/**
 * Get enhanced regular path instructions
 */
function getEnhancedRegularPathInstructions(pathId) {
  const instructions = {
    'emotional-intelligence': `
PATH FOCUS: Emotional Intelligence Development
- Recognize emotional patterns and their origins
- Celebrate moments of emotional awareness and regulation
- Guide toward deeper emotional literacy and empathy
- Notice connections between emotions and life experiences`,
    
    'mindfulness-awareness': `
PATH FOCUS: Mindful Presence & Awareness
- Acknowledge moments of present-moment awareness
- Notice quality of attention and conscious observation
- Guide toward deeper mindfulness integration
- Celebrate progress in cultivating inner stillness`,
    
    'transformation-journey': `
PATH FOCUS: Personal Transformation
- Identify old patterns being released
- Celebrate courage in facing change
- Notice emerging new aspects of self
- Guide toward sustainable transformation`,
    
    'self-discovery': `
PATH FOCUS: Authentic Self-Discovery
- Recognize emerging self-awareness
- Notice values and authentic desires surfacing
- Guide toward deeper self-understanding
- Celebrate moments of genuine self-expression`,
    
    'creative-expression': `
PATH FOCUS: Creative Expression & Innovation
- Acknowledge creative breakthroughs and experiments
- Notice how creativity reveals inner truths
- Guide toward expanded creative confidence
- Celebrate unique creative voice emerging`,
    
    'habit-formation': `
PATH FOCUS: Sustainable Habit Development
- Recognize progress in behavior change
- Notice resistance patterns and breakthroughs
- Guide toward self-compassionate consistency
- Celebrate small wins and sustained efforts`,
    
    'life-vision': `
PATH FOCUS: Life Purpose & Vision
- Acknowledge clarity emerging about life direction
- Notice alignment between values and aspirations
- Guide toward concrete vision manifestation
- Celebrate courage in dreaming big`,
    
    'gratitude-practice': `
PATH FOCUS: Gratitude & Appreciation
- Notice depth and specificity of gratitude
- Recognize shifts in perspective toward abundance
- Guide toward gratitude as a way of being
- Celebrate growing capacity for appreciation`,
    
    'shadow-work': `
PATH FOCUS: Shadow Integration
- Honor courage in facing hidden aspects
- Notice patterns of projection or denial
- Guide toward compassionate self-acceptance
- Celebrate integration of disowned parts`,
    
    'nature-connection': `
PATH FOCUS: Nature & Earth Connection
- Acknowledge growing awareness of natural world
- Notice how nature mirrors inner states
- Guide toward deeper ecological consciousness
- Celebrate moments of unity with nature`
  };
  
  return instructions[pathId] || instructions['self-discovery'];
}

/**
 * Get enhanced visual path instructions
 */
function getEnhancedVisualPathInstructions(pathId) {
  const instructions = {
    'mindful-visualization': `
PATH FOCUS: Mindful Visual Expression
- Interpret visual elements as meditation in action
- Notice how colors and forms express inner states
- Guide toward deeper visual mindfulness
- Celebrate the meditative quality of creation`,
    
    'artistic-soul-expression': `
PATH FOCUS: Soul-Level Artistic Expression
- Recognize authentic soul voice in visual form
- Notice breakthrough moments of pure expression
- Guide toward trusting artistic intuition
- Celebrate unique artistic language emerging`,
    
    'color-psychology': `
PATH FOCUS: Color as Emotional Language
- Interpret color choices as emotional communication
- Notice relationships between colors and feelings
- Guide toward conscious color exploration
- Celebrate growing color-emotion literacy`,
    
    'sacred-geometry': `
PATH FOCUS: Sacred Patterns & Universal Harmony
- Recognize connection to universal patterns
- Notice how geometric forms create inner balance
- Guide toward deeper sacred geometry understanding
- Celebrate alignment with cosmic harmony`,
    
    'nature-sketching': `
PATH FOCUS: Nature Observation & Connection
- Acknowledge growing observational skills
- Notice how sketching deepens nature connection
- Guide toward seeing nature's teachings
- Celebrate captured moments of natural beauty`,
    
    'abstract-emotions': `
PATH FOCUS: Abstract Emotional Expression
- Interpret abstract forms as emotional truth
- Notice how non-literal expression reveals depth
- Guide toward trusting abstract intuition
- Celebrate freedom from literal representation`,
    
    'visual-storytelling': `
PATH FOCUS: Visual Narrative & Mythology
- Recognize emerging personal visual mythology
- Notice story elements and symbolic meaning
- Guide toward deeper narrative exploration
- Celebrate unique visual voice`,
    
    'ink-essence': `
PATH FOCUS: Mastery Through Black Ink
- Acknowledge growing technical skill and confidence
- Notice how limitations create creative freedom
- Guide toward deeper ink mastery
- Celebrate the power of monochromatic expression`
  };
  
  return instructions[pathId] || instructions['mindful-visualization'];
}

/**
 * Analyze multi-page journal entry
 */
export const analyzeMultiPageJournalEntry = async (
  imageUrls, prompt, theme, userProfile, day = 1, extractedText = '', pathId = 'self-discovery'
) => {
  try {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No journal images provided.');
    }
    
    const MAX_PAGES = 5;
    if (imageUrls.length > MAX_PAGES) {
      console.warn(`Processing only first ${MAX_PAGES} of ${imageUrls.length} pages.`);
      imageUrls = imageUrls.slice(0, MAX_PAGES);
    }
    
    logAnalyticsEvent('multi_page_journal_analysis_started', {
      pageCount: imageUrls.length, pathId, model: CLAUDE_ANALYSIS_MODEL
    });
    
    const result = await analyzeJournalEntry(
      imageUrls, prompt, theme, userProfile, day, extractedText, pathId, true
    );
    
    result.pageCount = imageUrls.length;
    result.isMultiPage = true;
    
    return result;
  } catch (error) {
    console.error('Error analyzing multi-page journal:', error);
    throw new Error('Failed to analyze multi-page journal: ' + error.message);
  }
};

// =============================================================================
// 💾 SAVE ANALYSIS RESULTS (Handles Both Voice and Regular)
// =============================================================================

/**
 * Save analysis result with voice and regular entry support
 */
export const saveAnalysisResult = async (
  userId, 
  day, 
  analysisResult, 
  imageUrl, 
  pathId = 'self-discovery',
  isVoiceEntry = false
) => {
  try {
    console.log(`💾 Saving analysis: user ${userId}, day ${day}, path ${pathId}, voice: ${isVoiceEntry}`);
    
    // Determine the collection based on entry type
    const collectionName = isVoiceEntry ? 'voice_journal' : 'journal';
    const entryRef = doc(db, 'users', userId, collectionName, `${pathId}_day-${day}`);

    const entryData = {
      day, 
      pathId, 
      analysis: stripNonSerializable(analysisResult),
      timestamp: serverTimestamp(),
      prompt: analysisResult.prompt || '',
      theme: analysisResult.theme || '',
      isVoiceEntry: isVoiceEntry
    };

    if (isVoiceEntry) {
      entryData.audioUrl = analysisResult.audioUrl;
      entryData.transcription = analysisResult.transcription || '';
      entryData.wordCount = analysisResult.wordCount || 0;
      entryData.voiceMetadata = analysisResult.voiceMetadata || {};
    } else {
      entryData.imageUrl = imageUrl;
      entryData.extractedText = analysisResult.extractedText || '';
      entryData.isTextOnly = !imageUrl && !!analysisResult.extractedText;
    }

    function stripNonSerializable(value) {
      if (value == null) return value;
      if (typeof value === 'function') return undefined;
      if (
        (typeof Blob !== 'undefined' && value instanceof Blob) ||
        (typeof File !== 'undefined' && value instanceof File) ||
        (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer)
      ) {
        return undefined;
      }
      if (Array.isArray(value)) {
        return value.map(stripNonSerializable).filter(v => v !== undefined);
      }
      if (typeof value === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
          const cleaned = stripNonSerializable(v);
          if (cleaned !== undefined) out[k] = cleaned;
        }
        return out;
      }
      return value;
    }

    await setDoc(entryRef, entryData);

    // ── Update journey progress ──────────────────────────────────────────
    // IMPORTANT: write ONLY this path's fields via dot-paths, and append the
    // completed day with arrayUnion. The previous approach read the entire
    // user doc, mutated the whole `journeyProgress` map, and wrote it back in
    // one blob. That made the progress write fail (or clobber) whenever the
    // blob contained a value Firestore rejected on write — e.g. a nested
    // serverTimestamp deep inside, or bad data left by an unrelated path — so
    // the journal entry saved but progress silently did NOT (Home color +
    // "next day" stuck on day 1). Dot-path + arrayUnion sidesteps all of it:
    // atomic, no read-modify-write race, and unaffected by other paths' data.
    const userRef = doc(db, 'users', userId);
    const progressField = getProgressFieldForPath(pathId);
    const base = `journeyProgress.${progressField}`;

    // Streak needs the prior progress; read it defensively so a read failure
    // can never block the progress write itself.
    let streak = 1;
    let bestStreakSoFar = 0;
    let priorCompleted = [];
    try {
      const userSnap = await getDoc(userRef);
      const prior = userSnap.exists() ? (userSnap.data()?.journeyProgress?.[progressField] || {}) : {};
      priorCompleted = Array.isArray(prior.completedDays) ? prior.completedDays : [];
      bestStreakSoFar = prior.bestStreak ?? prior.streak ?? 0;
      const prevStreak = prior.currentStreak ?? prior.streak ?? 0;
      const lastActiveDate = prior.lastActive?.toDate ? prior.lastActive.toDate() : null;
      if (lastActiveDate) {
        const lastActive = new Date(lastActiveDate); lastActive.setHours(0, 0, 0, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
        streak = daysDiff === 0 ? (prevStreak || 1) : daysDiff === 1 ? prevStreak + 1 : 1;
      }
    } catch (readErr) {
      console.warn('Could not read prior progress for streak (non-fatal):', readErr);
    }

    const completedCount = priorCompleted.includes(day) ? priorCompleted.length : priorCompleted.length + 1;

    await updateDoc(userRef, {
      [`${base}.completedDays`]: arrayUnion(day),
      [`${base}.currentDay`]: Math.max(day, ...priorCompleted, 1),
      [`${base}.lastActive`]: serverTimestamp(),
      [`${base}.currentStreak`]: streak,
      [`${base}.bestStreak`]: Math.max(bestStreakSoFar, streak),
      [`${base}.totalEntries`]: completedCount,
      lastActiveDate: serverTimestamp(),
      ...(isVoiceEntry
        ? { totalVoiceEntries: increment(1), [`voiceEntries.${pathId}`]: increment(1) }
        : { totalJournalEntries: increment(1), [`journalEntries.${pathId}`]: increment(1) })
    });
    
    logAnalyticsEvent('analysis_saved', {
      day, pathId, isVoiceEntry,
      hasImageUrl: !!imageUrl,
      hasExtractedText: !!analysisResult.extractedText,
      hasTranscription: !!analysisResult.transcription
    });
    
    return { success: true, entryId: entryRef.id };
  } catch (error) {
    console.error('Error saving analysis result:', error);
    logAnalyticsEvent('analysis_save_error', {
      errorMessage: error.message, pathId, isVoiceEntry
    });
    throw new Error(`Failed to save analysis: ${error.message}`);
  }
};

// =============================================================================
// 📄 TEXT EXTRACTION FUNCTIONS with Enhanced Accuracy
// =============================================================================

/**
 * Extract text from image using Claude with enhanced accuracy
 * Added "no text found" handling
 */
export const extractTextFromImage = async (file, options = {}) => {
  try {
    if (!file) throw new Error('No image file provided');
    
    console.log('Extracting text from:', file.name);

    // OCR is the costliest call in the app — a whole image goes up every time,
    // and re-reading the same page returns the same text. Re-analysing an
    // entry, or bouncing off the screen and back, previously paid for it
    // again. Keyed on the file's own identity rather than its bytes: name,
    // size and mtime already distinguish two different photographs, and
    // hashing megabytes on the main thread to save a cache lookup is a poor
    // trade. Model is in the key so a model change invalidates naturally.
    const ocrCacheKey = apiCacheService.generateCacheKey('ocr', {
      n: file.name,
      s: file.size,
      m: file.lastModified,
      model: CLAUDE_EXTRACTION_MODEL
    });
    const cachedText = apiCacheService.getFromCache(ocrCacheKey);
    if (cachedText) {
      console.log('Using cached OCR result for', file.name);
      return cachedText;
    }

    const { data: imageBase64, mediaType } = await fileToBase64(file);
    
    const systemPrompt = `You are an expert at extracting handwritten text from journal images with perfect accuracy.

CRITICAL INSTRUCTIONS:
1. Extract ALL visible text EXACTLY as written - every word, every line
2. Preserve the exact line breaks and paragraph structure
3. Include partial words at edges if visible
4. Maintain original spelling, grammar, and punctuation
5. If text is unclear, make your best attempt but note uncertainty
6. Capture dates, headers, or margin notes if present
7. If the image contains no discernible handwriting (blank page, only drawings, no text), return text: "" and confidence: 0

IMPORTANT: This is private user content for personal reflection. Accuracy is essential for their self-discovery journey.

Return JSON with this exact format:
{
  "text": "the complete extracted text with original formatting (empty string if none found)",
  "confidence": 0.95,
  "warnings": ["list any issues like 'unclear word on line 3' or 'bottom section partially cut off'"],
  "metadata": {
    "estimatedWords": 150,
    "hasHeaders": true,
    "writingStyle": "cursive/print/mixed"
  }
}`;
    
    const requestBody = {
      model: CLAUDE_EXTRACTION_MODEL,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 }
          },
          { type: 'text', text: "Extract ALL handwritten text from this journal entry, preserving exact formatting and line breaks. If no text exists, return empty string." }
        ]
      }],
      system: systemPrompt,
      max_tokens: 1500,
      temperature: 0.3
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const extractionResult = safeJsonParse(content, {
      text: '',
      confidence: 0,
      warnings: ['Failed to parse extraction response'],
      metadata: { estimatedWords: 0, hasHeaders: false, writingStyle: 'unknown' }
    });
    
    const wordCount = extractionResult.text.split(/\s+/).filter(Boolean).length;
    
    logAnalyticsEvent('text_extraction_completed', {
      success: true, wordCount, confidence: extractionResult.confidence,
      model: CLAUDE_EXTRACTION_MODEL
    });
    
    const result = {
      text: extractionResult.text,
      wordCount,
      confidence: extractionResult.confidence,
      warnings: extractionResult.warnings,
      metadata: extractionResult.metadata
    };

    // Only cache a real read. Caching an empty or failed extraction would
    // pin the failure to that file for good, and the user's retry — the one
    // thing that might fix it — would never reach the API.
    if (result.text && result.text.trim()) {
      apiCacheService.storeInCache(ocrCacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Error extracting text:', error);
    logAnalyticsEvent('text_extraction_error', {
      errorType: 'api', message: error.message, model: CLAUDE_EXTRACTION_MODEL
    });
    
    let errorMessage = 'Failed to extract text: ';
    if (error.message.includes('media type')) {
      errorMessage += 'Unsupported image format. Use JPG or PNG.';
    } else if (error.message.includes('too large')) {
      errorMessage += 'Image too large. Try a smaller image.';
    } else {
      errorMessage += formatApiError(error);
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Extract text from multiple images with progress tracking
 */
export const extractTextFromImages = async (files, progressCallback = null) => {
  try {
    const fileArray = Array.isArray(files) ? files : [files];
    const MAX_PAGES = 5;
    
    if (fileArray.length > MAX_PAGES) {
      throw new Error(`Cannot process more than ${MAX_PAGES} images.`);
    }
    
    const results = [];
    for (let i = 0; i < fileArray.length; i++) {
      if (progressCallback) {
        progressCallback({
          currentPage: i + 1,
          totalPages: fileArray.length,
          percentage: Math.round(((i) / fileArray.length) * 100),
          status: `Extracting text from page ${i + 1}...`
        });
      }
      
      const result = await extractTextFromImage(fileArray[i]);
      results.push({ ...result, pageNumber: i + 1 });
      
      if (i < fileArray.length - 1) {
        await new Promise(r => setTimeout(r, 300));
      }
    }
    
    if (progressCallback) {
      progressCallback({
        currentPage: fileArray.length,
        totalPages: fileArray.length,
        percentage: 100,
        status: 'Text extraction complete!'
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error extracting text from images:', error);
    throw new Error('Failed to extract text: ' + error.message);
  }
};

// =============================================================================
// 📊 ENHANCED PROGRESS AND COMPLETION FUNCTIONS
// =============================================================================

/**
 * Generate progress report with enhanced voice support and deeper insights
 * Updated with safety guidelines, split prompt, and temperature 0.85
 */
export const generateProgressReport = async (userId, pathId = 'all') => {
  try {
    console.log(`📊 Generating enhanced progress report using ${CLAUDE_ANALYSIS_MODEL}...`);
    
    // Get both regular and voice entries
    const [entries, voiceEntries] = await Promise.all([
      getPreviousEntries(userId, pathId),
      getPreviousVoiceEntries(userId, pathId)
    ]);
    
    // Combine all entries for analysis
    const allEntries = [...entries, ...voiceEntries.map(entry => ({
      ...entry,
      isVoiceEntry: true,
      analysis: entry.analysis || {
        summary: `Voice entry: ${entry.transcription?.substring(0, 100)}...` || 'Voice reflection completed'
      }
    }))].sort((a, b) => a.day - b.day);
    
    if (allEntries.length === 0) {
      return {
        completionRate: 0,
        totalEntries: 0,
        voiceEntries: 0,
        commonThemes: [],
        growthAreas: [],
        recommendation: `Nothing to report yet — you haven't written an entry. Here's what actually helps: pick a fixed time and keep it, because the hard part is consistency rather than depth. Ten minutes is enough. Write or record whatever is actually on your mind, not what you think belongs in a journal. Early entries are usually shallow and that's fine; the useful patterns only become visible around entry five or six, once you have something to compare against.`,
        personalizedInsight: "No entries yet, so there's nothing to analyze. Start whenever you want."
      };
    }
    
    logAnalyticsEvent('progress_report_started', {
      totalEntries: allEntries.length, 
      voiceEntries: voiceEntries.length,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    if (allEntries.length < 3) {
      const hasVoice = voiceEntries.length > 0;
      return {
        completionRate: Math.round((allEntries.length / 10) * 100),
        totalEntries: allEntries.length,
        voiceEntries: voiceEntries.length,
        commonThemes: extractCommonWords(allEntries, 3),
        growthAreas: ["Not enough entries yet to see a pattern", "Consistency — the analysis needs more to work with"],
        recommendation: `${allEntries.length} ${allEntries.length === 1 ? 'entry' : 'entries'} so far${hasVoice ? ` (${voiceEntries.length} spoken)` : ''}. That's too few to say anything meaningful about your patterns — one entry shows a mood, not a trend, and any report claiming otherwise would be making it up. Get to 5-7 entries and this page starts being useful, because that's the point where the same thing showing up repeatedly becomes distinguishable from a bad Tuesday. Same time each day helps more than long entries do. ${hasVoice ? 'Mixing written and spoken entries is useful — they surface different things.' : 'Worth trying a voice entry at some point; speaking tends to produce different material than writing.'}`,
        personalizedInsight: "Too early to draw conclusions. Check back after a few more entries."
      };
    }
    
    // COST-BEARING CAP — do not remove, and do not "improve" it into sending
    // the full history.
    //
    // This reads like a token-overflow guard, and it is one, but it is also
    // what makes the Insight tier's no-subscription Premium financially safe.
    // Because the slice and the per-field truncation are fixed, a user in
    // year 8 sends the same payload size as a user in week 1 — per-user cost
    // is flat over time rather than compounding with tenure. Lift the cap and
    // an open-ended Premium promise turns into an open-ended liability.
    // The same applies to the slices in generateJourneyCompletion and
    // generatePersonalityDescription.
    const entriesContent = allEntries.slice(0, 20).map(entry => ({
      day: entry.day,
      pathId: entry.pathId || 'self-discovery',
      summary: (entry.analysis?.summary || '').substring(0, 150),
      insights: (entry.analysis?.insights || []).slice(0, 2),
      theme: entry.theme || '',
      isVoiceEntry: entry.isVoiceEntry || false,
      reflectionQuestion: entry.analysis?.reflectionQuestion || '',
      keyWords: extractKeyWords(entry)
    }));
    
    const hasVoiceEntries = voiceEntries.length > 0;
    const voicePercentage = Math.round((voiceEntries.length / allEntries.length) * 100);
    const safetyGuidelines = `⚠️ SAFETY GUIDELINES: Do not diagnose. If user expressed self-harm, redirect to crisis line. Keep hopeful but realistic.`;
    
    // Split into data context (short) + instructions (full)
    const dataContext = `JOURNEY DATA:
- Total entries: ${allEntries.length} (${entries.length} written, ${voiceEntries.length} voice)
- Journey paths: ${[...new Set(allEntries.map(e => e.pathId))].join(', ')}
- Days since first entry: ${Math.floor((Date.now() - new Date(allEntries[0].timestamp?.toDate()).getTime()) / (1000 * 60 * 60 * 24))}
${hasVoiceEntries ? `- Voice adoption: ${voicePercentage}% of entries` : '- No voice entries yet'}
ENTRIES SAMPLE (max 20):
${JSON.stringify(entriesContent, null, 2)}`;

    const instructionPrompt = `You are Καιρός. ${safetyGuidelines}

Based on the journal data above, write an accurate progress report. Accurate means
it should read differently for a person who has actually changed than for a person
who has written twelve entries circling the same problem. If it's the second one,
say so — that is the single most useful thing you can tell them.

Reference specific entries by day. Plain language, no inspirational register.

Respond with JSON:
{
  "completionRate": ${Math.round((allEntries.length / 10) * 100)},
  "totalEntries": ${allEntries.length},
  "voiceEntries": ${voiceEntries.length},
  "commonThemes": ["theme1", "theme2", "theme3", "theme4"],
  "growthAreas": ["A real gap, avoidance, or stuck point visible across their entries — cite the days it shows up in. Not a euphemism, not a reframed strength", "A second one, genuinely different from the first"],
  "recommendation": "200-250 words using 'you'. Lead with the honest state of things — what has actually shifted since day 1 and what has not, citing specific days. If little has changed, open with that instead of burying it. Then one or two concrete next steps. No pep talk, no 'keep going', no praise for consistency.",
  "personalizedInsight": "The observation about their journey they'd be least likely to make themselves — including if it's unflattering. Must rest on specific entries.",
  "journeyHighlight": "The entry where something actually shifted, and what specifically changed in it. If no entry qualifies yet, say that plainly and name the one that came closest.",
  "emergingStrengths": ["A capability their entries actually demonstrate, with the evidence", "Another, or fewer items if the evidence isn't there — do not pad this list"]
}${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [
        { role: 'user', content: dataContext },
        { role: 'user', content: instructionPrompt }
      ],
      max_tokens: 1400,
      temperature: 0.85
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const reportResult = safeJsonParse(content, {
      completionRate: Math.round((allEntries.length / 10) * 100),
      totalEntries: allEntries.length,
      voiceEntries: voiceEntries.length,
      commonThemes: extractCommonWords(allEntries, 4),
      // Fallback: the model's JSON failed to parse, so this text cannot describe
      // their entries. It says that instead of asserting growth it can't see.
      growthAreas: ["Report unavailable — could not be generated this time"],
      recommendation: `We couldn't generate your report this time, so anything specific here would be guesswork. You have ${allEntries.length} entries${hasVoiceEntries ? ` (${voicePercentage}% spoken)` : ''} and they're all safely stored — try again in a moment. In the meantime, the most useful thing you can do yourself is read your first three entries next to your most recent three and see what's actually different. If nothing is, that's worth knowing.`,
      personalizedInsight: "Report generation failed, so there's no analysis to show for this run.",
      journeyHighlight: "Not available — the report couldn't be generated.",
      emergingStrengths: []
    });
    
    const reportRef = doc(db, 'users', userId, 'reports', 'progress');
    await setDoc(reportRef, {
      ...reportResult,
      generatedAt: serverTimestamp(),
      hasVoiceEntries
    });
    
    logAnalyticsEvent('progress_report_completed', {
      totalEntries: allEntries.length,
      voiceEntries: voiceEntries.length,
      recommendationLength: reportResult.recommendation.length,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    return reportResult;
  } catch (error) {
    console.error('Error generating progress report:', error);
    logAnalyticsEvent('progress_report_error', {
      message: error.message, model: CLAUDE_ANALYSIS_MODEL
    });
    
    return {
      completionRate: 0,
      totalEntries: 0,
      voiceEntries: 0,
      commonThemes: [],
      growthAreas: [],
      recommendation: `Your progress report couldn't be generated — this is a technical failure on our side, not a comment on your entries. Nothing you've written was affected. Try again shortly; if it keeps failing, report it from Settings.`,
      personalizedInsight: "No analysis available for this run."
    };
  }
};

/**
 * Generate enhanced journey completion celebration
 * Updated with lower temperature (0.7) and safety guidelines
 */
export const generateJourneyCompletion = async (userId, allEntries, pathId = 'self-discovery') => {
  try {
    console.log(`🏆 Generating enhanced journey completion using ${CLAUDE_ANALYSIS_MODEL}...`);
    
    // COST-BEARING CAP — do not remove. See the note on the slice in
    // generateProgressReport: the Insight tier sells Premium with no
    // subscription, which is only safe because per-call input is bounded.
    const entriesData = allEntries.slice(0, 15).map(entry => ({
      day: entry.day,
      summary: (entry.analysis?.summary || '').substring(0, 200),
      insights: (entry.analysis?.insights || []).slice(0, 3),
      isVoiceEntry: entry.isVoiceEntry || false,
      affirmation: entry.analysis?.affirmation || ''
    }));

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userProfile = userDoc.exists() ? userDoc.data() : null;
    const userName = userProfile?.displayName || 'Brave Journaler';
    
    logAnalyticsEvent('journey_completion_started', {
      totalEntries: allEntries.length, pathId, model: CLAUDE_ANALYSIS_MODEL
    });
    
    const pathName = getPathName(pathId);
    const hasVoiceEntries = entriesData.some(entry => entry.isVoiceEntry);
    const voiceEntryCount = entriesData.filter(entry => entry.isVoiceEntry).length;
    const journeyDuration = Math.max(...allEntries.map(e => e.day));
    
    const safetyGuidelines = `⚠️ SAFETY GUIDELINES: Do not diagnose. If user expressed self-harm, redirect to crisis line. Keep celebration authentic, not hyperbolic. Replace any "sacred" language with "meaningful" or "important".`;
    
    const systemPrompt = `${safetyGuidelines}

You are Καιρός, celebrating ${userName}'s completion of their "${pathName}" journey. Create a deeply moving celebration that honors their dedication and transformation.

JOURNEY DATA:
${JSON.stringify(entriesData, null, 2)}

JOURNEY STATISTICS:
- Journey: ${pathName} (${journeyDuration} days)
- Total entries: ${allEntries.length}
- Voice entries: ${voiceEntryCount}
- Completion rate: ${Math.round((allEntries.length / journeyDuration) * 100)}%
${hasVoiceEntries ? '- Demonstrated courage through both written and spoken reflection' : '- Maintained consistent written practice throughout'}

GUIDELINES:
This one screen is where warmth is appropriate — they finished something. But it
has to be EARNED warmth, about this person specifically. A celebration that would
read identically for any user is not a celebration, it's a form letter.
1. Say what specifically changed between their first entries and their last, with the evidence
2. If little changed, do not fake a transformation — say honestly what they did do:
   they kept a practice for ${journeyDuration} days, and name what that produced
3. Do not praise courage, vulnerability, or showing up as achievements in themselves
4. Quote or reference actual entries — that is what makes this feel like theirs
5. Keep growthOpportunities genuinely honest. This is the field where you tell them
   what they still haven't looked at. Do not soften it into a compliment
6. Keep celebration message under 200 words

Write as someone who read every entry and is telling them plainly what they see —
glad for them, but not performing it.

Respond with JSON:
{
  "journeyOverview": "3-4 sentences using 'you' — what they actually did and what actually shifted. Specific to their entries, not to the idea of finishing a journey.",
  "growthNarrative": "How they moved from their first entries to their last, citing specific days. Include what stayed the same — an honest narrative is more convincing than a triumphant one.",
  "keyThemes": ["theme 1", "theme 2", "theme 3", "theme 4"],
  "personalStrengths": ["a strength their entries actually demonstrate, with the evidence", "another", "a third — drop items rather than padding"],
  "transformationHighlight": "The clearest real change, and the entries that show it. If there isn't a clear one, say what did move instead of overstating.",
  "growthOpportunities": ["Something they consistently avoided, deflected, or never got to across the whole journey — named directly, with the evidence. Not a reframed strength", "A second one, genuinely different"],
  "meaningfulAffirmation": "One sentence they can carry forward, drawn from their own words rather than written at them.",
  "integrationWisdom": "Concrete guidance for keeping this going without the daily prompts. Practical, not inspirational.",
  "nextSteps": "Specific suggestions based on what their entries show is unfinished.",
  "celebrationMessage": "Under 200 words. Warm and specific to THIS person's journey. No generic praise for having journaled — say what they did and what it produced."
}${getLanguageDirective()}`;

    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: "Create a powerful celebration of my completed journey, acknowledging my growth and transformation." }],
      system: systemPrompt,
      max_tokens: 1400,
      temperature: 0.7
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const completionAnalysis = safeJsonParse(content, {
      journeyOverview: `You've completed your ${pathName} with remarkable dedication and openness. Through ${allEntries.length} entries, you've created a profound record of personal transformation. ${hasVoiceEntries ? 'Your courage in using both written and spoken reflection has unlocked deeper layers of self-understanding. ' : ''}This journey has revealed strengths you may not have known you possessed.`,
      growthNarrative: "From your first tentative entry to this moment of completion, you've traversed an inner landscape of discovery. Early entries showed curiosity mixed with uncertainty, but as days progressed, your voice grew stronger and your insights deeper. You've moved from observing your thoughts to understanding their patterns, from noticing emotions to embracing their wisdom.",
      keyThemes: ["Self-awareness and inner wisdom", "Courage in vulnerability", "Authentic self-expression", "Transformative growth"],
      personalStrengths: ["Unwavering commitment to growth", "Courage to face difficult truths", "Deepening self-compassion"],
      transformationHighlight: "Your most profound transformation has been the shift from self-judgment to self-understanding, creating space for genuine self-compassion.",
      growthOpportunities: ["Deepening trust in your inner wisdom", "Expanding your practice to new areas of life"],
      meaningfulAffirmation: "You are a courageous explorer of your inner world, and your commitment to growth creates ripples of positive change in all areas of your life.",
      integrationWisdom: "The insights you've gained are seeds that will continue growing. Water them daily with small actions aligned with your truth. Remember, transformation isn't a destination but an ongoing journey of becoming.",
      nextSteps: "Consider revisiting this journey's entries monthly to witness your continued evolution. Explore a new Καιρός journey that builds on these insights, or create your own prompts based on what calls to you now.",
      celebrationMessage: `${userName}, you've done something extraordinary. Not everyone has the courage to look within with such honesty and persistence. Your ${journeyDuration}-day commitment to self-reflection is a profound act of self-love. Celebrate this achievement - you've created a foundation for lifelong growth and self-understanding. The person who started this journey would be amazed by who you've become.`
    });
    
    const completionRef = doc(db, 'users', userId, 'journey', `${pathId}_completion`);
    await setDoc(completionRef, {
      ...completionAnalysis,
      pathId,
      completedAt: serverTimestamp(),
      hasVoiceEntries,
      voiceEntryCount,
      journeyDuration,
      completionRate: Math.round((allEntries.length / journeyDuration) * 100)
    });
    
    logAnalyticsEvent('journey_completion_generated', {
      success: true, pathId, model: CLAUDE_ANALYSIS_MODEL, 
      hasVoiceEntries, voiceEntryCount, journeyDuration
    });
    
    return completionAnalysis;
  } catch (error) {
    console.error('Error generating journey completion:', error);
    logAnalyticsEvent('journey_completion_error', {
      message: error.message, pathId, model: CLAUDE_ANALYSIS_MODEL
    });
    throw new Error('Failed to generate completion: ' + formatApiError(error));
  }
};

/**
 * Get path name helper (supports voice paths)
 */
function getPathName(pathId) {
  const names = {
    // Regular paths
    'emotional-intelligence': 'Emotional Intelligence Expedition',
    'mindfulness-awareness': 'Mindfulness & Present Awareness',
    'transformation-journey': 'Transformation Journey',
    'self-discovery': 'Self-Discovery Journey',
    'creative-expression': 'Creative Expression',
    'habit-formation': 'Habit Formation',
    'life-vision': 'Life Vision & Purpose',
    'gratitude-practice': 'Gratitude Practice',
    'shadow-work': 'Shadow Work Exploration',
    'nature-connection': 'Nature Connection',
    // Voice paths
    'voice-discovery': 'Voice Discovery Journey',
    'spoken-emotions': 'Spoken Emotions',
    'vocal-confidence': 'Vocal Confidence',
    'storytelling-voice': 'Storytelling Voice',
    'meditation-speaking': 'Meditation Speaking',
    // Visual paths
    'mindful-visualization': 'Mindful Visualization',
    'artistic-soul-expression': 'Artistic Soul Expression',
    'color-psychology': 'Color Psychology Journey',
    'sacred-geometry': 'Sacred Geometry Journey'
  };
  return names[pathId] || 'Self-Discovery Journey';
}

// Export helper for UI usage
export { getPathName };

// =============================================================================
// 🤖 ENHANCED AI INSIGHTS FUNCTIONS
// =============================================================================

/**
 * Daily question limit check
 */
export const checkDailyQuestionLimit = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const questionRef = doc(db, 'users', userId, 'daily_questions', today);
    const questionDoc = await getDoc(questionRef);
    
    if (questionDoc.exists()) {
      return {
        canAsk: false,
        hasAskedToday: true,
        question: questionDoc.data().question,
        answer: questionDoc.data().answer,
        timeUntilReset: getTimeUntilMidnight()
      };
    }
    
    return {
      canAsk: true,
      hasAskedToday: false,
      timeUntilReset: getTimeUntilMidnight()
    };
  } catch (error) {
    console.error('Error checking daily question limit:', error);
    return { canAsk: false, hasAskedToday: false, error: error.message };
  }
};

/**
 * Answer daily question with enhanced personalization
 * Updated with safety guidelines and lower temperature
 */
export const answerDailyQuestion = async (userId, question, entries, userProfile) => {
  try {
    const limitCheck = await checkDailyQuestionLimit(userId);
    if (!limitCheck.canAsk) {
      throw new Error('Daily question already asked. Try tomorrow!');
    }
    
    // Get both regular and voice entries
    const voiceEntries = await getPreviousVoiceEntries(userId);
    const allEntries = [...entries, ...voiceEntries.map(entry => ({
      ...entry,
      isVoiceEntry: true,
      analysis: entry.analysis || {
        summary: `Voice entry: ${entry.transcription?.substring(0, 100)}...` || 'Voice reflection completed'
      }
    }))].sort((a, b) => a.day - b.day);
    
    // Create rich context from entries
    const entriesContext = allEntries.slice(-15).map(entry => ({
      day: entry.day,
      pathId: entry.pathId || 'unknown',
      summary: (entry.analysis?.summary || '').substring(0, 200),
      insights: (entry.analysis?.insights || []).slice(0, 3),
      theme: entry.theme || '',
      isVoiceEntry: entry.isVoiceEntry || false,
      keyMoments: extractKeyMoments(entry)
    }));
    
    const hasVoiceEntries = voiceEntries.length > 0;
    const journeyPaths = [...new Set(allEntries.map(e => e.pathId))];
    
    const safetyGuidelines = `⚠️ SAFETY GUIDELINES: Do not diagnose. If user expresses self-harm, redirect to crisis line. If question is unrelated to journal content, respond: "That's a great question, but I don't have enough information from your journal to answer. Could you rephrase it based on your reflections?"`;
    
    const systemPrompt = `${safetyGuidelines}

You are Καιρός, answering a personal question from ${userProfile?.displayName || 'a dedicated journaler'} based on deep analysis of their journal entries.

USER QUESTION: "${question}"

THEIR JOURNEY CONTEXT:
- Total reflections: ${allEntries.length} (${entries.length} written, ${voiceEntries.length} voice)
- Journey paths explored: ${journeyPaths.join(', ')}
- Days on journey: ${Math.max(...allEntries.map(e => e.day || 0))}
${hasVoiceEntries ? '- Has shown courage through voice journaling' : ''}

RECENT ENTRIES ANALYSIS:
${JSON.stringify(entriesContext, null, 2)}

ANSWER GUIDELINES:
1. Answer the question they asked. Do not answer an adjacent, easier question
2. Draw the answer from their actual entries, citing days
3. If their entries genuinely don't contain the answer, say that instead of
   improvising something that sounds insightful
4. If the honest answer isn't what they're hoping to hear, give the honest answer
5. Write as a friend who has read every word and will be straight with them

Respond with JSON:
{
  "answer": "200-300 words using 'you'. Answer directly in the first sentence, then the evidence from specific entries. If the entries contradict the premise of their question, say so. No preamble, no compliment before the answer.",
  "keyInsights": [
    "Specific insight drawn from their entries, with the evidence",
    "Another pattern — including an unwelcome one if that's what's there",
    "The thing relevant to their question that they haven't said out loud"
  ],
  "personalObservation": "An observation about their journey they'd be unlikely to make themselves. Accurate over flattering.",
  "relevantEntry": "The specific entry or day that bears most on their question, and what in it is relevant",
  "practicalSuggestion": "Concrete, checkable action based on their patterns and the question asked"
}${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: `Based on my journal journey, please answer: ${question}` }],
      system: systemPrompt,
      max_tokens: 1000,
      temperature: 0.75
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const result = safeJsonParse(content, {
      answer: `Based on your ${allEntries.length} journal entries, I can see meaningful patterns in your journey. Your consistent practice of self-reflection${hasVoiceEntries ? ', including the courage to use voice journaling,' : ''} reveals someone committed to genuine self-understanding. While I need more context from your entries to fully address your specific question, I can see that you're building valuable self-awareness through your practice. Continue trusting the process - the answers you seek often emerge through consistent, honest reflection.`,
      keyInsights: [
        "Your dedication to regular journaling shows deep commitment to growth",
        "Your entries reveal increasing self-awareness and emotional intelligence",
        "You're developing a strong practice of honest self-reflection"
      ],
      personalObservation: "Your unique approach to self-reflection demonstrates both courage and wisdom in equal measure.",
      relevantEntry: "Your recent entries show a pattern of deeper self-understanding emerging.",
      practicalSuggestion: "Set aside time this week to review your past entries, looking for patterns related to your question."
    });
    
    // Save question and answer
    const today = new Date().toISOString().split('T')[0];
    const questionRef = doc(db, 'users', userId, 'daily_questions', today);
    
    await setDoc(questionRef, {
      question: question.trim(),
      answer: result.answer,
      keyInsights: result.keyInsights,
      personalObservation: result.personalObservation,
      relevantEntry: result.relevantEntry,
      practicalSuggestion: result.practicalSuggestion,
      timestamp: serverTimestamp(),
      entriesAnalyzed: allEntries.length,
      hasVoiceEntries
    });
    
    logAnalyticsEvent('daily_ai_question_answered', {
      questionLength: question.length,
      entriesAnalyzed: allEntries.length,
      voiceEntries: voiceEntries.length,
      feature: 'ai_insights'
    });
    
    return result;
  } catch (error) {
    console.error('Error answering daily question:', error);
    throw new Error('Failed to answer question: ' + formatApiError(error));
  }
};

/**
 * Generate enhanced personality description
 * Updated with positivity filter, safety guidelines, and lower temperature
 */
export const generatePersonalityDescription = async (userId, entries, userProfile, progressStats) => {
  try {
    // Check if regeneration needed
    const existing = await getPersonalityDescription(userId);
    if (existing && !shouldRegenerateDescription(existing.generatedAt)) {
      return existing;
    }
    
    // Get both regular and voice entries
    const voiceEntries = await getPreviousVoiceEntries(userId);
    const allEntries = [...entries, ...voiceEntries.map(entry => ({
      ...entry,
      isVoiceEntry: true,
      analysis: entry.analysis || {
        summary: `Voice entry: ${entry.transcription?.substring(0, 100)}...` || 'Voice reflection completed'
      }
    }))].sort((a, b) => a.day - b.day);
    
    // COST-BEARING CAP — do not remove. See the note on the slice in
    // generateProgressReport. "Comprehensive" here means the most recent 25
    // entries, not the whole history, and that bound is deliberate.
    const journalData = allEntries.slice(0, 25).map(entry => ({
      day: entry.day,
      pathId: entry.pathId || 'self-discovery',
      summary: (entry.analysis?.summary || '').substring(0, 250),
      insights: (entry.analysis?.insights || []).slice(0, 3),
      affirmation: entry.analysis?.affirmation || '',
      isVoiceEntry: entry.isVoiceEntry || false,
      themes: extractThemes(entry)
    }));
    
    const hasVoiceEntries = voiceEntries.length > 0;
    const journeyPaths = [...new Set(allEntries.map(e => e.pathId))];
    const dominantThemes = extractDominantThemes(allEntries);
    
    // NOTE: this used to mandate "at least 80% affirmative language" and to
    // relabel traits euphemistically ("impatient" -> "seeks efficiency"). That
    // quota is exactly why these descriptions read as flattery: the ratio was
    // fixed in advance, so it could never reflect the person. Removed.
    const safetyGuidelines = `⚠️ SAFETY GUIDELINES: Do not diagnose. This is a portrait drawn from journal entries, not a clinical assessment — say so if you characterize anything sensitive. If they expressed self-harm, redirect to a crisis line. Describe traits accurately and without euphemism, but describe them as patterns in what they wrote, not as fixed verdicts about who they are.`;
    
    const systemPrompt = `${safetyGuidelines}

You are Καιρός, creating a profound personality description for ${userProfile?.displayName || 'a dedicated journaler'} based on deep analysis of their journal entries.

COMPREHENSIVE JOURNEY DATA:
- Total entries: ${allEntries.length} (${entries.length} written, ${voiceEntries.length} voice)
- Current streak: ${progressStats?.currentStreak || 0} days
- Journey paths explored: ${journeyPaths.join(', ')}
- Dominant themes: ${dominantThemes.join(', ')}
${hasVoiceEntries ? '- Shows remarkable courage through voice journaling' : ''}

DETAILED ENTRY ANALYSIS:
${JSON.stringify(journalData, null, 2)}

DESCRIPTION GUIDELINES:
1. Base every sentence on specific evidence from their entries. Cite it
2. Write in third person, level and observant — a good portrait, not a tribute
3. A portrait made only of strengths is a portrait of nobody. Include the tensions,
   the recurring blind spot, the thing they consistently do that costs them
4. Do not euphemize. If their entries show avoidance, call it avoidance
5. Note real evolution across the journey — and where they haven't moved
6. The test: would they recognize themselves, including the parts they'd wince at?
   If it reads like a horoscope or a LinkedIn summary, rewrite it

Respond with JSON:
{
  "corePersonality": "3-4 sentences on their essential nature as their entries actually show it — including the tension or contradiction that runs through them.",
  "strengths": ["a strength with the specific evidence for it", "another", "a third", "a fourth", "a fifth — drop items rather than inventing them if the evidence isn't there"],
  "valuesAndMotivations": "What actually drives them, judged by what they return to and what they protect — which may differ from what they say they value. If it does, say so.",
  "communicationStyle": "How they express themselves — including their characteristic evasions: where they go abstract, intellectualize, joke, or trail off.",
  "growthMindset": "How they actually meet challenges, based on what they describe doing rather than what they resolve to do.",
  "emotionalIntelligence": "Their real relationship with their emotions: which they name easily, which they route around, which they only reach through other topics.",
  "lifePhilosophy": "Beliefs and worldview visible in their entries, stated plainly.",
  "uniqueQualities": "What genuinely distinguishes them. If a trait would apply to most people, it doesn't belong here.",
  "evolutionObserved": "What has actually changed across their journey, with the entries that show it — and what has stayed exactly the same.",
  "hiddenDepths": "The pattern they seem not to have noticed about themselves. This is the most valuable field: make it a real observation, not a compliment in disguise.",
  "overallSummary": "3-4 sentences. Accurate before flattering. They should finish it thinking 'that's right', not 'that's nice'."
}${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: 'Create my personality description based on deep analysis of all my journal entries.' }],
      system: systemPrompt,
      max_tokens: 1600,
      temperature: 0.8
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const result = safeJsonParse(content, {
      corePersonality: "This individual demonstrates remarkable depth of self-awareness and commitment to personal growth. Their journal entries reveal someone who approaches life with both curiosity and courage, willing to explore difficult emotions and celebrate moments of joy with equal authenticity.",
      strengths: [
        "Deep capacity for self-reflection and introspection",
        "Courage to face difficult truths about themselves",
        "Growing ability to hold complexity and paradox",
        "Authentic expression of vulnerability",
        "Commitment to continuous growth and learning"
      ],
      valuesAndMotivations: "Driven by a desire for authentic self-understanding and meaningful connection, they value growth, truth, and the courage to be genuinely themselves.",
      communicationStyle: `Expresses thoughts and feelings with ${hasVoiceEntries ? 'remarkable range, using both written and spoken word to access different layers of truth' : 'thoughtful clarity and emotional honesty'}. Their style reveals someone who values authentic expression over perfection.`,
      growthMindset: "Approaches challenges as opportunities for deeper understanding, showing remarkable resilience and willingness to learn from all experiences.",
      emotionalIntelligence: "Demonstrates growing awareness of emotional patterns and increasing capacity to hold space for complex feelings without judgment.",
      lifePhilosophy: "Believes in the transformative power of honest self-reflection and the importance of showing up authentically, even when it's difficult.",
      uniqueQualities: "Possesses a rare combination of analytical insight and emotional depth, able to observe their inner world with both precision and compassion.",
      evolutionObserved: "Their journey shows clear evolution from self-discovery to self-acceptance, with growing confidence in their own wisdom and intuition.",
      hiddenDepths: "Beneath their thoughtful exterior lies a wellspring of creativity and a capacity for profound joy that emerges more freely as they continue their practice.",
      overallSummary: `${userProfile?.displayName || 'This person'} is a courageous explorer of the inner landscape, someone who understands that true growth comes from honest self-reflection. Their commitment to this practice reveals not just who they are, but who they are becoming - someone increasingly aligned with their authentic self and capable of profound positive impact.`
    });
    
    // Save enhanced description
    const descriptionData = {
      ...result,
      generatedAt: serverTimestamp(),
      basedOnEntries: allEntries.length,
      voiceEntries: voiceEntries.length,
      currentStreakAtTime: progressStats?.currentStreak || 0,
      timestamp: Date.now(),
      hasVoiceEntries,
      journeyPaths,
      dominantThemes
    };
    
    const descriptionRef = doc(db, 'users', userId, 'ai_insights', 'personality_description');
    await setDoc(descriptionRef, descriptionData);
    
    logAnalyticsEvent('personality_description_generated', {
      entriesAnalyzed: allEntries.length,
      voiceEntries: voiceEntries.length,
      streak: progressStats?.currentStreak || 0,
      feature: 'ai_insights'
    });
    
    return descriptionData;
  } catch (error) {
    console.error('Error generating personality description:', error);
    throw new Error('Failed to generate personality description: ' + formatApiError(error));
  }
};

/**
 * Get personality description
 */
export const getPersonalityDescription = async (userId) => {
  try {
    const descriptionRef = doc(db, 'users', userId, 'ai_insights', 'personality_description');
    const descriptionDoc = await getDoc(descriptionRef);
    return descriptionDoc.exists() ? descriptionDoc.data() : null;
  } catch (error) {
    console.error('Error getting personality description:', error);
    return null;
  }
};

// =============================================================================
// 📚 ENTRY RETRIEVAL FUNCTIONS
// =============================================================================

/**
 * Get previous entries (regular journals)
 */
export const getPreviousEntries = async (userId, pathId = 'all') => {
  try {
    const entries = [];
    
    // Fetch regular journal entries
    const journalRef = collection(db, 'users', userId, 'journal');
    const journalSnap = await getDocs(journalRef);
    
    journalSnap.forEach((doc) => {
      const data = doc.data();
      if (pathId === 'all' || !data.pathId || data.pathId === pathId) {
        entries.push({ id: doc.id, ...data });
      }
    });
    
    // Fetch voice journal entries
    const voiceJournalRef = collection(db, 'users', userId, 'voice_journal');
    const voiceJournalSnap = await getDocs(voiceJournalRef);
    
    voiceJournalSnap.forEach((doc) => {
      const data = doc.data();
      if (pathId === 'all' || !data.pathId || data.pathId === pathId) {
        entries.push({ id: doc.id, ...data, isVoiceEntry: true });
      }
    });
    
    return entries.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error('Error getting previous entries:', error);
    // REST fallback: list documents via Firestore REST API
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw error;
      const idToken = await user.getIdToken();
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      
      // Fetch both journal and voice_journal via REST
      const journalUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/journal`;
      const voiceUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/voice_journal`;
      
      const [journalRes, voiceRes] = await Promise.all([
        fetch(journalUrl, { headers: { Authorization: `Bearer ${idToken}` }, method: 'GET' }),
        fetch(voiceUrl, { headers: { Authorization: `Bearer ${idToken}` }, method: 'GET' }).catch(() => ({ ok: false }))
      ]);
      
      if (!journalRes.ok && !voiceRes.ok) throw new Error('REST fallback failed');
      
      const entries = [];
      
      if (journalRes.ok) {
        const journalData = await journalRes.json();
        const journalDocs = journalData.documents || [];
        const journalEntries = journalDocs.map(d => ({ id: d.name.split('/').pop(), ...convertFirestoreFields(d.fields) }));
        entries.push(...journalEntries.filter(e => pathId === 'all' || !e.pathId || e.pathId === pathId));
      }
      
      if (voiceRes.ok) {
        const voiceData = await voiceRes.json();
        const voiceDocs = voiceData.documents || [];
        const voiceEntries = voiceDocs.map(d => ({ id: d.name.split('/').pop(), ...convertFirestoreFields(d.fields), isVoiceEntry: true }));
        entries.push(...voiceEntries.filter(e => pathId === 'all' || !e.pathId || e.pathId === pathId));
      }
      
      return entries.sort((a, b) => a.day - b.day);
    } catch (restErr) {
      console.error('REST fallback for previous entries failed:', restErr);
      throw new Error('Failed to get previous entries: ' + error.message);
    }
  }
};

// Convert Firestore REST fields map to plain JS object
function convertFirestoreFields(fields) {
  if (!fields) return {};
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue !== undefined) out[k] = v.stringValue;
    else if (v.integerValue !== undefined) out[k] = parseInt(v.integerValue, 10);
    else if (v.doubleValue !== undefined) out[k] = Number(v.doubleValue);
    else if (v.booleanValue !== undefined) out[k] = v.booleanValue;
    else if (v.mapValue !== undefined) out[k] = convertFirestoreFields(v.mapValue.fields || {});
    else if (v.arrayValue !== undefined) out[k] = (v.arrayValue.values || []).map(item => {
      if (item.stringValue !== undefined) return item.stringValue;
      if (item.integerValue !== undefined) return parseInt(item.integerValue, 10);
      if (item.doubleValue !== undefined) return Number(item.doubleValue);
      if (item.booleanValue !== undefined) return item.booleanValue;
      if (item.mapValue !== undefined) return convertFirestoreFields(item.mapValue.fields || {});
      return null;
    });
    else if (v.nullValue !== undefined) out[k] = null;
    else out[k] = undefined;
  }
  return out;
}

/**
 * Get specific journal entry
 */
export const getJournalEntry = async (userId, day, pathId = 'self-discovery') => {
  try {
    const entryRef = doc(db, 'users', userId, 'journal', `${pathId}_day-${day}`);
    let entrySnap = await getDoc(entryRef);
    
    if (!entrySnap.exists() && pathId === 'self-discovery') {
      const legacyEntryRef = doc(db, 'users', userId, 'journal', `day-${day}`);
      entrySnap = await getDoc(legacyEntryRef);
    }
    
    return entrySnap.exists() ? { id: entrySnap.id, ...entrySnap.data() } : null;
  } catch (error) {
    console.error('Error getting journal entry:', error);
    throw new Error('Failed to get journal entry: ' + error.message);
  }
};

/**
 * Get extracted text
 */
export const getExtractedText = async (userId, day) => {
  try {
    const textRef = doc(db, 'users', userId, 'journal_text', `day-${day}`);
    const textSnap = await getDoc(textRef);
    return textSnap.exists() ? textSnap.data().text || '' : '';
  } catch (error) {
    console.error('Error getting extracted text:', error);
    return '';
  }
};

// =============================================================================
// 🛠️ UTILITY FUNCTIONS (unchanged)
// =============================================================================

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = reader.result;
        const mediaType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const base64Data = dataUrl.split(',')[1];
        resolve({ data: base64Data, mediaType });
      } catch (error) {
        reject(new Error('Failed to process image: ' + error.message));
      }
    };
    reader.onerror = (error) => reject(new Error('Failed to read file: ' + error.message));
    reader.readAsDataURL(file);
  });
}

async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error('Failed to fetch image: ' + error.message);
  }
}

function getAgeGroup(age) {
  if (age < 13) return 'child';
  if (age <= 17) return 'teen';
  if (age <= 25) return 'young-adult';
  if (age <= 40) return 'adult';
  if (age <= 60) return 'middle-aged';
  return 'senior';
}

const shouldRegenerateDescription = (lastGenerated) => {
  if (!lastGenerated) return true;
  const lastDate = lastGenerated.toDate ? lastGenerated.toDate() : new Date(lastGenerated);
  const daysSinceGenerated = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceGenerated >= 7;
};

const getTimeUntilMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeDiff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

function extractCommonWords(entries, limit = 5) {
  const stopWords = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'on', 'at', 'from', 'by', 'an', 'this', 'that', 'it', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'not', 'no', 'yes', 'or', 'but', 'if', 'then', 'else', 'when', 'up', 'down', 'out', 'very', 'just', 'like', 'so', 'really', 'think', 'feel', 'know', 'get', 'go', 'see', 'want', 'need', 'make', 'take', 'come', 'give', 'find', 'say', 'tell', 'ask', 'work', 'seem', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able']);
  
  const wordCount = {};
  
  entries.forEach(entry => {
    const text = [
      entry.extractedText || '',
      entry.transcription || '',
      entry.analysis?.summary || '',
      ...(entry.analysis?.insights || [])
    ].join(' ').toLowerCase();
    
    text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .split(/\s+/)
        .forEach(word => {
          if (word.length > 3 && !stopWords.has(word)) {
            wordCount[word] = (wordCount[word] || 0) + 1;
          }
        });
  });
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function extractKeyWords(entry) {
  const text = [
    entry.extractedText || '',
    entry.transcription || '',
    entry.analysis?.summary || ''
  ].join(' ').toLowerCase();
  
  const words = text.split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 5);
  
  return [...new Set(words)];
}

function extractKeyMoments(entry) {
  const moments = [];
  
  if (entry.analysis?.insights && entry.analysis.insights.length > 0) {
    moments.push(entry.analysis.insights[0]);
  }
  
  if (entry.analysis?.affirmation) {
    moments.push(entry.analysis.affirmation);
  }
  
  return moments.slice(0, 2);
}

function extractThemes(entry) {
  const themes = new Set();
  
  if (entry.analysis?.insights) {
    entry.analysis.insights.forEach(insight => {
      if (insight.toLowerCase().includes('emotion')) themes.add('emotions');
      if (insight.toLowerCase().includes('growth')) themes.add('growth');
      if (insight.toLowerCase().includes('pattern')) themes.add('patterns');
      if (insight.toLowerCase().includes('strength')) themes.add('strengths');
      if (insight.toLowerCase().includes('challenge')) themes.add('challenges');
    });
  }
  
  return Array.from(themes);
}

function extractDominantThemes(entries) {
  const themeCount = {};
  
  entries.forEach(entry => {
    const themes = extractThemes(entry);
    themes.forEach(theme => {
      themeCount[theme] = (themeCount[theme] || 0) + 1;
    });
  });
  
  return Object.entries(themeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);
}

// Derive the journeyProgress field name for any path id, algorithmically:
// kebab/space id -> camelCase + "Progress" (e.g. 'kairos-sparks' ->
// 'kairosSparksProgress'). This MUST match pathUtils.getProgressFieldForPath
// so writes here land where the rest of the app reads. It previously used a
// hardcoded lookup that silently fell back to 'selfDiscoveryProgress' for any
// unmapped id — which misfiled every Kairos-path entry (Moments/Cards/Sparks)
// into self-discovery, leaving those journeys' progress and the Home glow stuck.
function getProgressFieldForPath(pathId) {
  if (!pathId) return 'selfDiscoveryProgress';

  const camelId = pathId
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  return `${camelId}Progress`;
}

function logAnalyticsEvent(eventName, eventParams = {}) {
  console.log(`[Analytics] ${eventName}:`, eventParams);
  if (typeof window !== 'undefined' && window.analyticsService) {
    window.analyticsService.logEvent(eventName, {
      ...eventParams,
      timestamp: new Date().toISOString()
    });
  }
}

// =============================================================================
// 📤 EXPORTS
// =============================================================================

export default {
  // Voice Functions
  uploadVoiceJournal,
  analyzeVoiceJournalEntry,
  getPreviousVoiceEntries,
  getVoiceJournalEntry,
  
  // Regular Journal Functions
  uploadJournalImage,
  uploadMultipleJournalImages,
  extractTextFromImage,
  extractTextFromImages,
  
  // Analysis Functions (Unified)
  analyzeJournalEntry,
  analyzeMultiPageJournalEntry,
  saveAnalysisResult,
  
  // Progress & Completion
  generateProgressReport,
  generateJourneyCompletion,
  
  // Entry Retrieval
  getPreviousEntries,
  getJournalEntry,
  getExtractedText,
  
  // AI Insights
  checkDailyQuestionLimit,
  answerDailyQuestion,
  generatePersonalityDescription,
  getPersonalityDescription
};