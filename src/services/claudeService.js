<<<<<<< HEAD
// src/services/claudeService.js - Enhanced Voice & Analysis Support
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { callClaudeApi, safeJsonParse, formatApiError } from '../utils/apiUtils';
import { getAuth } from 'firebase/auth';
import { isVisualPath, isVoicePath } from '../utils/pathTypeUtils';

// Claude API configuration
const CLAUDE_EXTRACTION_MODEL = import.meta.env.VITE_CLAUDE_EXTRACTION_MODEL || 'claude-3-haiku-20240307';
const CLAUDE_ANALYSIS_MODEL = import.meta.env.VITE_CLAUDE_ANALYSIS_MODEL || 'claude-3-sonnet-20240229';

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
    console.log(`🎤 Analyzing voice journal entry using ${CLAUDE_ANALYSIS_MODEL}...`);
    
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
    
    // Enhanced system prompt for voice analysis
    const systemPrompt = `You are Καιρός, an empathetic AI guide analyzing a voice journal entry. Your role is to provide deep, meaningful insights that honor the courage of spoken self-reflection.

CONTEXT:
- User: ${userProfile?.displayName || 'Journaler'} (${ageGroup} age group)
- Journey Day: ${day} of ${pathId}
- Today's Prompt: "${prompt}"
- Theme: ${theme}
${voiceInstructions}
${previousContext}
${continuityInsights}

VOICE ANALYSIS PRINCIPLES:
1. COURAGE RECOGNITION: Speaking thoughts aloud requires vulnerability - acknowledge this bravery
2. VOCAL AUTHENTICITY: Notice emotional undertones, pauses, and the raw honesty of spoken words
3. STREAM OF CONSCIOUSNESS: Value the natural flow and spontaneity unique to voice journaling
4. EMOTIONAL RESONANCE: Identify feelings that emerge through vocal expression
5. TRANSFORMATIVE POTENTIAL: Highlight how speaking truths can catalyze personal growth
6. GENTLE GUIDANCE: Offer supportive, non-judgmental observations that encourage continued practice

TRANSCRIPTION TO ANALYZE:
"${transcription}"

${voiceMetadata.duration ? `Voice Duration: ${Math.round(voiceMetadata.duration / 60)} minutes ${voiceMetadata.duration % 60} seconds` : ''}

Provide a deeply personalized analysis that feels like it comes from a wise, caring mentor who truly heard their words.

Respond with JSON only:
{
  "summary": "2-3 warm sentences using 'you' - capture the essence of their spoken reflection and acknowledge their vocal courage",
  "insights": [
    "Deep insight about their emotional state or personal truth revealed through voice",
    "Pattern or theme that emerged in their spoken words",
    "Growth opportunity or strength demonstrated in their vocal expression"
  ],
  "reflectionQuestion": "One profound question that invites deeper exploration of what they shared",
  "affirmation": "Heartfelt statement that validates their experience and encourages continued voice journaling",
  "practicalAction": "Specific, achievable suggestion for their next voice journaling session or daily life",
  "voiceObservations": "Brief, supportive note about their speaking style, emotional tone, or progress in vocal self-expression"
}`;

    const requestContent = [{
      type: 'text',
      text: `Analyze this voice journal entry with deep empathy and insight:\n\nPrompt: "${prompt}"\nTheme: "${theme}"\nSpoken Reflection: "${transcription}"`
    }];
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: requestContent }],
      system: systemPrompt,
      max_tokens: 1000,
      temperature: 0.8 // Slightly higher for more nuanced, empathetic responses
    };

    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const analysisResult = safeJsonParse(content, {
      summary: "You courageously shared your authentic thoughts through voice, creating a powerful moment of self-reflection and honesty.",
      insights: [
        "Your voice carried deep emotional authenticity as you explored your inner landscape",
        "Speaking these thoughts aloud revealed patterns you may not have noticed in written form",
        "Your willingness to vocalize your truth demonstrates remarkable personal courage"
      ],
      reflectionQuestion: "What did you discover about yourself by hearing your own voice speak these truths?",
      affirmation: "Your voice matters, and your willingness to speak your truth creates ripples of positive change in your life.",
      practicalAction: "Tomorrow, try speaking for 2-3 minutes about one specific emotion you noticed in today's reflection.",
      voiceObservations: "Your voice conveyed genuine emotion and thoughtful introspection, showing growing comfort with vocal self-expression."
    });
    
    // Add voice-specific metadata
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
    throw new Error('Failed to get previous voice entries: ' + error.message);
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
=======
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { callClaudeApi, safeJsonParse, formatApiError } from '../utils/apiUtils';
import { getAuth } from 'firebase/auth';
import { isVisualPath, getVisualAnalysisInstructions } from '../utils/pathTypeUtils';

// Claude API configuration - UPDATED WITH NEW MODELS
const CLAUDE_EXTRACTION_MODEL = import.meta.env.VITE_CLAUDE_EXTRACTION_MODEL || 'claude-sonnet-4-20250514';
const CLAUDE_ANALYSIS_MODEL = import.meta.env.VITE_CLAUDE_ANALYSIS_MODEL || 'claude-opus-4-20250514';

// Configurable settings for privacy
const SETTINGS = {
  // Set to true to delete images after text extraction is complete
  DELETE_IMAGES_AFTER_PROCESSING: true,
  
  // Time in milliseconds after which images will be automatically deleted (7 days)
  // This serves as a backup if DELETE_IMAGES_AFTER_PROCESSING fails
  IMAGE_RETENTION_PERIOD: 7 * 24 * 60 * 60 * 1000,
  
  // Set to true to enable local-only analysis option (avoid sending content to Claude)
  ENABLE_LOCAL_ANALYSIS_OPTION: false,
  
  // Privacy level for storage - 'high' deletes immediately, 'medium' keeps temporarily, 'low' keeps permanently
  DEFAULT_PRIVACY_LEVEL: 'high'
};

/**
 * Uploads a journal image to Firebase Storage and returns the download URL
 * Enhanced with privacy features to optionally delete after processing
 * 
 * @param {File} file - Journal image file
 * @param {string} userId - User ID
 * @param {number} day - Journal day number
 * @param {string} extractedText - Text extracted from the image (optional)
 * @param {string} pathId - Journey path ID (optional, defaults to 'self-discovery')
 * @param {object} options - Additional options (keepImage, privacyLevel)
 * @returns {Promise<string>} - Download URL
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
    if (!file || !userId) {
      throw new Error('File and user ID required');
    }
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser || currentUser.uid !== userId) {
      throw new Error('Authentication error');
    }
    
=======
    // Validate inputs
    if (!file) {
      throw new Error('No file provided for upload');
    }
    
    if (!userId) {
      throw new Error('User ID is required for upload');
    }
    
    // Default options
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    const defaultOptions = {
      keepImage: !SETTINGS.DELETE_IMAGES_AFTER_PROCESSING,
      privacyLevel: SETTINGS.DEFAULT_PRIVACY_LEVEL,
      isTemporary: true
    };
    
<<<<<<< HEAD
    const finalOptions = { ...defaultOptions, ...options };
    const storage = getStorage();
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const safeFileName = `journal_entry_${timestamp}.${fileExtension}`;
    const filePrefix = finalOptions.isTemporary ? 'temp_' : '';
    
    const journalRef = ref(storage, `journals/${userId}/${pathId}/day-${day}/${filePrefix}${safeFileName}`);
    
=======
    // Merge options
    const finalOptions = { ...defaultOptions, ...options };
    
    // Get Firebase auth instance to ensure we have fresh tokens
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    // Check if user is authenticated
    if (!currentUser) {
      throw new Error('User is not authenticated');
    }
    
    // Check if the provided userId matches the current user
    if (currentUser.uid !== userId) {
      throw new Error('User ID mismatch - security violation');
    }
    
    // Get a fresh ID token if possible to ensure auth is current
    try {
      await currentUser.getIdToken(true);
    } catch (tokenError) {
      console.warn('Could not refresh auth token, using existing credentials', tokenError);
    }
    
    const storage = getStorage();
    
    // Create a more organized file path
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const safeFileName = `journal_entry_${timestamp}.${fileExtension}`;
    
    // Add a "temp" prefix for temporary images that will be deleted
    const filePrefix = finalOptions.isTemporary ? 'temp_' : '';
    
    // Construct a storage path that matches our security rules
    // Note: This now uses /journals/{userId}/{pathId}/day-{day}/{fileName}
    const journalRef = ref(storage, `journals/${userId}/${pathId}/day-${day}/${filePrefix}${safeFileName}`);
    
    // Log the upload attempt
    console.log(`Attempting to upload image to: journals/${userId}/${pathId}/day-${day}/${filePrefix}${safeFileName}`);
    
    // Upload file to Firebase Storage with metadata
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        day: day.toString(),
        pathId: pathId,
<<<<<<< HEAD
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
=======
        isTemporary: finalOptions.isTemporary.toString(),
        expiresAt: finalOptions.isTemporary ? 
          new Date(Date.now() + SETTINGS.IMAGE_RETENTION_PERIOD).toISOString() : 
          null
      }
    };
    
    try {
      // Upload bytes with metadata
      const snapshot = await uploadBytes(journalRef, file, metadata);
      
      // Get download URL for the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // If extracted text is provided, store it separately
      if (extractedText) {
        // Include pathId in the document path
        const textRef = doc(db, 'users', userId, 'journal_text', `${pathId}_day-${day}`);
        await setDoc(textRef, {
          text: extractedText,
          day,
          pathId,
          imageUrl: finalOptions.keepImage ? downloadURL : null, // Only store URL if keeping image
          hasImage: true, // Flag that there was an image, even if we don't store the URL
          timestamp: serverTimestamp(),
          privacyLevel: finalOptions.privacyLevel
        });
        
        // Log analytics
        logAnalyticsEvent('journal_upload_with_text', {
          day,
          pathId,
          hasExtractedText: true,
          textLength: extractedText.length,
          privacyLevel: finalOptions.privacyLevel
        });
      } else {
        // Log analytics
        logAnalyticsEvent('journal_upload', {
          day,
          pathId,
          hasExtractedText: false,
          privacyLevel: finalOptions.privacyLevel
        });
      }
      
      // Delete the image if we don't want to keep it and we have extracted text
      if (!finalOptions.keepImage && extractedText) {
        try {
          // Schedule deletion after a short delay to ensure the image was processed
          setTimeout(async () => {
            try {
              await deleteObject(journalRef);
              console.log(`Deleted temporary image: ${journalRef.fullPath}`);
              
              // Log analytics for image deletion
              logAnalyticsEvent('journal_image_deleted', {
                day,
                pathId,
                reason: 'privacy_policy'
              });
            } catch (deleteError) {
              console.error('Error deleting temporary image:', deleteError);
            }
          }, 60000); // 1 minute delay
        } catch (deleteError) {
          console.warn('Failed to schedule image deletion:', deleteError);
          // Continue anyway, as this is just a privacy enhancement
        }
      }
      
      return downloadURL;
    } catch (uploadError) {
      console.error('Storage error details:', uploadError);
      
      // Enhanced error handling for storage errors
      if (uploadError.code) {
        switch (uploadError.code) {
          case 'storage/unauthorized':
            throw new Error('You do not have permission to upload files. Please check your authentication status and try again.');
          case 'storage/canceled':
            throw new Error('Upload was canceled by the user or system.');
          case 'storage/unknown':
            throw new Error('An unknown error occurred during upload. Please try again later.');
          default:
            throw new Error(`Storage error: ${uploadError.code} - ${uploadError.message}`);
        }
      }
      
      // Rethrow general errors
      throw uploadError;
    }
  } catch (error) {
    console.error('Error uploading journal image:', error);
    
    // Log the error for analytics
    logAnalyticsEvent('journal_upload_error', {
      errorMessage: error.message,
      errorCode: error.code || 'none'
    });
    
    // Throw a user-friendly error message
    throw new Error(`Failed to upload journal image: ${error.message}`);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  }
};

/**
<<<<<<< HEAD
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
      const journalRef = ref(storage, `journals/${user.uid}/${pathId}/day-${day}/page-${index+1}_${Date.now()}_${file.name}`);
      
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
// 🧠 UNIFIED ANALYSIS FUNCTION with Enhanced Prompts
// =============================================================================

/**
 * Analyze journal entry - automatically handles voice vs regular entries
=======
 * Fetches an image from URL and converts it to base64
 * @param {string} url - URL of the image
 * @returns {Promise<string>} - Base64 encoded image
 */
async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get the base64 string by removing the data URL prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch and encode image: ' + error.message);
  }
}

/**
 * Analyzes a journal entry using Claude API
 * Enhanced with improved privacy instructions and visual path support
 * 
 * @param {string|Array<string>|Array<File>} imageUrl - URL of the journal image, array of URLs, or array of File objects for multiple pages
 * @param {string} prompt - Journal prompt
 * @param {string} theme - Journal theme
 * @param {Object} userProfile - User profile data
 * @param {number} day - Journal day number
 * @param {string} extractedText - Pre-extracted text or manually entered text
 * @param {string} pathId - Journey path ID (optional, defaults to 'self-discovery')
 * @param {boolean} isMultiPage - Whether this is a multi-page entry
 * @param {Array<File>} imageFiles - Array of File objects for visual paths (to avoid CORS)
 * @returns {Promise<Object>} - Analysis results
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
  imageFiles = null,
  voiceData = null // Voice data triggers voice analysis
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
          audioBlob: voiceData.audioBlob
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
=======
  imageFiles = null
) => {
  try {
    console.log(`Analyzing journal entry using ${CLAUDE_ANALYSIS_MODEL}...`);
    
    // Check if this is a visual path
    const isVisual = isVisualPath(pathId);
    
    // Get user's age for age-appropriate analysis
    const userAge = userProfile?.age || null;
    const ageGroup = userAge ? getAgeGroup(userAge) : 'adult';
    
    // Record analytics for this analysis
    logAnalyticsEvent('journal_analysis_started', {
      ageGroup,
      theme,
      pathId,
      hasUserProfile: !!userProfile,
      hasExtractedText: !!extractedText,
      isTextOnly: !imageUrl && !!extractedText,
      isMultiPage: isMultiPage,
      isVisual: isVisual,
      hasImageFiles: !!imageFiles,
      imageCount: Array.isArray(imageUrl) ? imageUrl.length : (imageUrl ? 1 : 0),
      model: CLAUDE_ANALYSIS_MODEL
    });

    // Get previous entries specific to this path
    let previousEntriesContext = "";
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    if (day > 1) {
      try {
        const userId = userProfile.uid;
        const previousEntries = await getPreviousEntries(userId, pathId);
<<<<<<< HEAD
        const priorEntries = previousEntries.filter(entry => entry.day < day && entry.day > 0);
        
        if (priorEntries.length > 0) {
          const recentEntries = priorEntries.slice(-3);
          previousContext = `\nPREVIOUS INSIGHTS:\n${recentEntries.map(entry => 
            `Day ${entry.day}: ${(entry.analysis?.summary || '').substring(0, 100)}`
          ).join('\n')}`;
          
          journeyProgress = `\nJOURNEY PROGRESS:\n- Currently on Day ${day} of their ${pathId} journey
- Has completed ${priorEntries.length} previous entries
- Look for evolving themes and deepening self-awareness`;
=======
        
        const priorEntries = previousEntries.filter(entry => entry.day < day && entry.day > 0);
        
        if (priorEntries.length > 0) {
          previousEntriesContext = `
            Previous journal insights:
            ${priorEntries.map(entry => `Day ${entry.day}: ${entry.analysis?.summary || 'No summary available'}`).join('\n')}
            
            Connect your analysis to these previous insights when appropriate.
          `;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        }
      } catch (error) {
        console.log('Could not retrieve previous entries:', error);
      }
    }
    
<<<<<<< HEAD
    // Path-specific enhanced instructions
    const pathInstructions = isVisual 
      ? getEnhancedVisualPathInstructions(pathId)
      : getEnhancedRegularPathInstructions(pathId);
    
    // Enhanced system prompt for regular analysis
    const systemPrompt = `You are Καιρός, a wise and empathetic AI guide analyzing a ${isVisual ? 'visual' : 'written'} journal entry. Your role is to provide profound, personalized insights that support the user's journey of self-discovery.

CONTEXT:
- User: ${userProfile?.displayName || 'Journaler'} (${ageGroup} age group)
- Journey Day: ${day} of ${pathId}
- Today's Prompt: "${prompt}"
- Theme: ${theme}
${pathInstructions}
${previousContext}
${journeyProgress}
${extractedText ? `\nWRITTEN CONTENT:\n"${extractedText}"` : ''}

ANALYSIS PRINCIPLES:
1. DEEP EMPATHY: Respond as a caring mentor who truly sees and understands them
2. PERSONALIZATION: Reference specific details from their entry to show attentive reading
3. GROWTH FOCUS: Highlight progress, patterns, and opportunities for development
4. GENTLE CHALLENGE: Ask questions that lovingly push them toward deeper insight
5. PRACTICAL WISDOM: Offer actionable suggestions rooted in their actual experience
6. AFFIRMATIVE SUPPORT: Validate their journey while encouraging continued exploration

${isVisual ? 'VISUAL ANALYSIS FOCUS:\n- Interpret colors, composition, and artistic choices as emotional language\n- Notice what their creative expression reveals about their inner world\n- Value the courage required to express through visual means' : ''}

Provide an analysis that feels like it comes from a wise friend who deeply cares about their growth.

Respond with JSON only:
{
  "summary": "2-3 warm, insightful sentences using 'you' - capture the essence of their reflection and progress",
  "insights": [
    "Specific insight about what their entry reveals about them",
    "Pattern or theme that connects to their broader journey",
    "Growth edge or strength that emerged in this reflection"
  ],
  "reflectionQuestion": "One powerful question that opens new doors of self-understanding",
  "affirmation": "Heartfelt recognition of their courage, progress, or authentic expression",
  "practicalAction": "Specific, meaningful action they can take based on today's insights"
}`;

    let requestContent;
    
    if (extractedText && !isVisual) {
      requestContent = [{
        type: 'text',
        text: `Analyze this journal entry with deep wisdom and care:\n\nPrompt: "${prompt}"\nTheme: "${theme}"\nTheir Written Reflection:\n"${extractedText}"`
      }];
    } else if (imageFiles && imageFiles.length > 0) {
=======
    // Path-specific analysis instructions
    let pathSpecificInstructions = "";
    
    if (isVisual) {
      pathSpecificInstructions = getVisualAnalysisInstructions(pathId);
    } else {
      switch(pathId) {
        case 'emotional-intelligence':
          pathSpecificInstructions = `
            This entry is part of the "Emotional Intelligence Expedition" path.
            Focus your analysis on:
            - Emotional awareness and vocabulary
            - Identification of emotional patterns and triggers
            - Strategies for emotional regulation
            - Connections between emotions, thoughts, and behaviors
            - Development of empathy and social awareness
            
            Emphasize emotional insights and growth in your analysis.
          `;
          break;
        case 'mindfulness-awareness':
          pathSpecificInstructions = `
            This entry is part of the "Mindfulness & Present Awareness" path.
            Focus your analysis on:
            - Present-moment awareness and attention
            - Sensory observations and experiences
            - Non-judgmental awareness of thoughts and feelings
            - Ability to observe without immediate reaction
            - Integration of mindfulness into daily activities
            
            Emphasize moments of presence, acceptance, and non-reactivity in your analysis.
          `;
          break;
        case 'transformation-journey':
          pathSpecificInstructions = `
            This entry is part of the "Transformation Journey: Breaking Patterns" path.
            Focus your analysis on:
            - Pattern recognition and awareness
            - Steps toward breaking old habits
            - Progress in recovery or transformation
            - Resilience and coping strategies
            - Support systems and self-care practices
            
            Emphasize growth, recovery insights, and positive changes in your analysis.
          `;
          break;
        case 'self-discovery':
        default:
          pathSpecificInstructions = `
            This entry is part of the "Self-Discovery Journey" path.
            Focus your analysis on:
            - Personal values, beliefs, and aspirations
            - Patterns of thought, behavior, and decision-making
            - Strengths, challenges, and growth opportunities
            - Self-awareness and self-knowledge
            - Future goals and vision
            
            Emphasize self-discovery insights and personal growth in your analysis.
          `;
      }
    }
    
    // Enhanced privacy instructions for Claude
    const privacyInstructions = `
      IMPORTANT: This is a private journaling application. All journal entries are private to the user 
      and will only be accessed by the individual who wrote them. You must extract all text regardless 
      of how personal or sensitive it appears, as this extraction is only for the user's own personal records. 
      
      The user's privacy is paramount, and this content will never be shared with others.
      The extracted text is stored securely with encryption and stringent privacy safeguards.
      
      The user has explicitly consented to and requested text extraction of their personal writing.
    `;
    
    // Construct system prompt for Claude
    const systemPrompt = `
      You are an AI journal analysis assistant for the Καιρός app. 
      ${isVisual 
        ? `You are analyzing a VISUAL journal entry (drawing/painting/doodle) that responds to the prompt: "${prompt}" under the theme "${theme}".`
        : `Your task is to analyze the user's journal entry which addresses the prompt: "${prompt}" under the theme "${theme}".`
      }
      
      ${privacyInstructions}
      
      The user's name is "${userProfile?.displayName || 'the user'}" but ALWAYS address them directly as "you" in your analysis.
      
      The user is in the "${ageGroup}" age group. Adapt your analysis to be appropriate for this age group,
      using language, examples, and insights that resonate with their life stage.
      
      ${pathSpecificInstructions}
      
      ${previousEntriesContext}
      
      ${isMultiPage ? 'This journal entry spans multiple pages. The text has been combined with page break indicators.' : ''}
      
      ${isVisual && !extractedText ? 'This is a visual entry with no text content. Focus on analyzing the visual elements.' : ''}
      
      ${extractedText ? 'I have the text/notes from the journal entry. Here it is:' : ''}
      ${extractedText ? '```\n' + extractedText + '\n```' : ''}
      
      Provide the following in your response:
      1. A summary of the ${isVisual ? 'visual content' : 'journal content'} (3-4 sentences) - ALWAYS use second-person language ("you created", "you expressed", "you drew")
      2. Three key insights from their ${isVisual ? 'artwork' : 'writing'} - ALWAYS frame these as "You..." not "The artist..." or "They..."
      3. One thoughtful follow-up question that encourages deeper reflection
      4. A personalized affirmation based on their entry - this MUST be a complete, supportive statement that acknowledges their effort and growth
      5. A suggestion for a practical action or habit related to their insights
      
      ${isVisual ? `
      For visual entries, focus on:
      - Artistic expression and creative choices
      - Color symbolism and emotional resonance
      - Composition and use of space
      - Shapes, patterns, and recurring motifs
      - Overall mood and energy of the piece
      - How the visual elements respond to the prompt
      ` : ''}
      
      VERY IMPORTANT: Format your response ONLY as a JSON object with the following keys:
      - summary
      - insights (array of 3 strings)
      - reflectionQuestion
      - affirmation
      - practicalAction
      
      Do not include any markdown formatting, explanations, or any text outside the JSON structure.
      The response must be strictly parseable as JSON. The entire response should be a single JSON object.
      
      Example of valid format:
      {"summary":"You created...", "insights":["You explored...", "You expressed...", "You demonstrated..."], "reflectionQuestion":"How might...", "affirmation":"Your artistic expression...", "practicalAction":"Consider creating..."}
      
      The affirmation MUST be a meaningful, complete sentence that validates the user's experience or growth.
      
      If the image is unclear or unreadable, provide a helpful message asking the user to upload a clearer image.
    `;

    // Define variables for the request
    let requestContent;
    
    // Handle different types of journal content
    if (extractedText && !isVisual) {
      requestContent = [
        {
          type: 'text',
          text: `Please analyze this journal entry that responds to the prompt: "${prompt}" under the theme "${theme}".\n\nJournal text:\n${extractedText}`
        }
      ];
    } else if (imageFiles && imageFiles.length > 0) {
      console.log('Converting image file to base64...');
      
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      const primaryFile = imageFiles[0];
      const { data: imageBase64, mediaType } = await fileToBase64(primaryFile);
      
      let textInstruction = isVisual 
<<<<<<< HEAD
        ? `Analyze this visual creation with deep insight into their artistic expression and emotional landscape.`
        : `Analyze this handwritten journal entry, understanding both the content and the care taken in writing.`;
      
      if (extractedText && isVisual) {
        textInstruction += `\n\nTheir notes about this creation: "${extractedText}"`;
=======
        ? `Please analyze this visual journal entry and provide insights as described in your instructions. Focus on the artistic elements, composition, and emotional expression.`
        : `Please analyze this journal entry and provide insights as described in your instructions. This is a private journal and your analysis will only be seen by the person who created it.`;
      
      if (extractedText && isVisual) {
        textInstruction += `\n\nThe user has also provided these notes about their visual creation:\n${extractedText}`;
      }
      
      let multiPageNote = '';
      if (imageFiles.length > 1) {
        multiPageNote = `\nNote: This journal entry includes ${imageFiles.length} pages. I'm showing you the first page${isVisual ? '' : ', but have extracted text from all pages'}.`;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      }
      
      requestContent = [
        {
          type: 'image',
<<<<<<< HEAD
          source: { type: 'base64', media_type: mediaType, data: imageBase64 }
        },
        { type: 'text', text: textInstruction }
=======
          source: {
            type: 'base64',
            media_type: mediaType,
            data: imageBase64
          }
        },
        {
          type: 'text',
          text: textInstruction + multiPageNote
        }
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      ];
    } else if (imageUrl) {
      if (isVisual) {
        throw new Error('Visual journeys require image file objects to avoid CORS issues.');
      }
      
      const primaryImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
<<<<<<< HEAD
=======
      
      console.log('Fetching and converting image to base64...');
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      const imageBase64 = await fetchImageAsBase64(primaryImageUrl);
      
      requestContent = [
        {
          type: 'image',
<<<<<<< HEAD
          source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 }
        },
        { type: 'text', text: 'Analyze this journal entry with wisdom and deep care for their growth journey.' }
=======
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64
          }
        },
        {
          type: 'text',
          text: `Please analyze this journal entry and provide insights as described in your instructions. This is a private journal and your analysis will only be seen by the person who created it.`
        }
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      ];
    } else {
      throw new Error('No journal content provided for analysis.');
    }
    
<<<<<<< HEAD
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: requestContent }],
      system: systemPrompt,
      max_tokens: 900,
      temperature: 0.8 // Slightly higher for more nuanced responses
    };

=======
    // Prepare the request to Claude API
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [
        {
          role: 'user',
          content: requestContent
        }
      ],
      system: systemPrompt,
      max_tokens: 1000
    };

    // Call the Claude API with retry logic
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
<<<<<<< HEAD
    const content = data.content[0].text;
    const analysisResult = safeJsonParse(content, {
      summary: "You've shared meaningful reflections that show your commitment to understanding yourself more deeply. Your willingness to explore these thoughts demonstrates real courage.",
      insights: [
        "Your entry reveals a growing awareness of your inner landscape and emotional patterns",
        "You're developing the ability to observe your thoughts with compassion and curiosity",
        "Your consistent journaling practice is creating space for important insights to emerge"
      ],
      reflectionQuestion: "What would change in your life if you fully embraced the truth you discovered today?",
      affirmation: "Your dedication to this inner work is creating ripples of positive change, even when you can't see them yet.",
      practicalAction: "Take one small action today that honors the insight you've gained, no matter how simple it might seem."
    });
    
    // Add metadata
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
=======
    try {
      const content = data.content[0].text;
      
      const analysisResult = safeJsonParse(content, {
        summary: "We analyzed your journal entry.",
        insights: [
          "You shared your thoughts and feelings about the prompt.",
          "Your expression shows thoughtful reflection.",
          "You've engaged with the journaling process in a meaningful way."
        ],
        reflectionQuestion: "How did creating this entry make you feel?",
        affirmation: "Your journaling practice is valuable, and each entry helps you develop greater self-awareness.",
        practicalAction: "Consider revisiting this entry in a week to see how your perspective has evolved."
      });
      
      analysisResult.prompt = prompt;
      analysisResult.theme = theme;
      analysisResult.extractedText = extractedText;
      analysisResult.pathId = pathId;
      analysisResult.isMultiPage = isMultiPage;
      analysisResult.isVisual = isVisual;
      analysisResult.imageCount = Array.isArray(imageUrl) ? imageUrl.length : (imageUrl ? 1 : 0);
      
      logAnalyticsEvent('journal_analysis_completed', {
        ageGroup,
        theme,
        pathId,
        success: true,
        hasExtractedText: !!extractedText,
        isTextOnly: !imageUrl && !!extractedText,
        isMultiPage: isMultiPage,
        isVisual: isVisual,
        model: CLAUDE_ANALYSIS_MODEL
      });

      if (SETTINGS.DELETE_IMAGES_AFTER_PROCESSING && imageUrl) {
        scheduleImageCleanup(imageUrl);
      }

      return analysisResult;
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      
      logAnalyticsEvent('journal_analysis_error', {
        errorType: 'parsing',
        message: parseError.message,
        model: CLAUDE_ANALYSIS_MODEL
      });
      
      throw new Error('Failed to parse Claude analysis response: ' + parseError.message);
    }
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    
    logAnalyticsEvent('journal_analysis_error', {
      errorType: 'api',
      message: error.message,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    throw new Error('Failed to analyze journal entry: ' + formatApiError(error));
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  }
};

/**
<<<<<<< HEAD
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
    
    // Additional paths
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
=======
 * Analyzes a multi-page journal entry using Claude API
 * Enhanced to handle up to 5 pages
 * 
 * @param {Array<string>} imageUrls - Array of image URLs for multiple pages
 * @param {string} prompt - Journal prompt
 * @param {string} theme - Journal theme
 * @param {Object} userProfile - User profile data
 * @param {number} day - Journal day number
 * @param {string} extractedText - Pre-extracted text or manually entered text
 * @param {string} pathId - Journey path ID
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeMultiPageJournalEntry = async (
  imageUrls,
  prompt,
  theme,
  userProfile,
  day = 1,
  extractedText = '',
  pathId = 'self-discovery'
) => {
  try {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('No journal images provided for analysis.');
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    }
    
    const MAX_PAGES = 5;
    if (imageUrls.length > MAX_PAGES) {
<<<<<<< HEAD
      console.warn(`Processing only first ${MAX_PAGES} of ${imageUrls.length} pages.`);
      imageUrls = imageUrls.slice(0, MAX_PAGES);
    }
    
    logAnalyticsEvent('multi_page_journal_analysis_started', {
      pageCount: imageUrls.length, pathId, model: CLAUDE_ANALYSIS_MODEL
    });
    
    const result = await analyzeJournalEntry(
      imageUrls, prompt, theme, userProfile, day, extractedText, pathId, true
=======
      console.warn(`Received ${imageUrls.length} pages, but only the first ${MAX_PAGES} will be processed.`);
      imageUrls = imageUrls.slice(0, MAX_PAGES);
    }
    
    console.log(`Analyzing multi-page journal entry with ${imageUrls.length} pages...`);
    
    const userAge = userProfile?.age || null;
    const ageGroup = userAge ? getAgeGroup(userAge) : 'adult';
    
    logAnalyticsEvent('multi_page_journal_analysis_started', {
      ageGroup,
      theme,
      pathId,
      pageCount: imageUrls.length,
      hasExtractedText: !!extractedText,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    const result = await analyzeJournalEntry(
      imageUrls,
      prompt,
      theme,
      userProfile,
      day,
      extractedText,
      pathId,
      true
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    );
    
    result.pageCount = imageUrls.length;
    result.isMultiPage = true;
    
    return result;
  } catch (error) {
<<<<<<< HEAD
    console.error('Error analyzing multi-page journal:', error);
=======
    console.error('Error analyzing multi-page journal entry:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    throw new Error('Failed to analyze multi-page journal: ' + error.message);
  }
};

<<<<<<< HEAD
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
      analysis: analysisResult,
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

    await setDoc(entryRef, entryData);

    // Update progress efficiently
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const journeyProgress = userData.journeyProgress || {};
      const progressField = getProgressFieldForPath(pathId);
      
      let pathProgress = journeyProgress[progressField] || { 
        completedDays: [], currentDay: 1, lastActive: null, streak: 0
      };
      
      const completedDays = Array.isArray(pathProgress.completedDays) ? pathProgress.completedDays : [];
      
      if (!completedDays.includes(day)) {
        completedDays.push(day);
        completedDays.sort((a, b) => a - b);
      }
      
      // Calculate streak
      let streak = pathProgress.streak || 0;
      const lastActiveDate = pathProgress.lastActive ? new Date(pathProgress.lastActive.toDate()) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (lastActiveDate) {
        const lastActive = new Date(lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff === 0) {
          // Same day - keep streak
        } else if (daysDiff === 1) {
          streak += 1;
        } else {
          streak = 1; // Reset streak
        }
      } else {
        streak = 1; // First entry
      }
      
      pathProgress = {
        completedDays,
        currentDay: Math.max(...completedDays, 1),
        lastActive: serverTimestamp(),
        streak,
        totalEntries: completedDays.length
      };
      
      journeyProgress[progressField] = pathProgress;
      
      await updateDoc(userRef, {
        journeyProgress,
        lastActiveDate: serverTimestamp()
      });
      
      // Update statistics
      const statsUpdate = isVoiceEntry ? {
        totalVoiceEntries: increment(1),
        [`voiceEntries.${pathId}`]: increment(1)
      } : {
        totalJournalEntries: increment(1),
        [`journalEntries.${pathId}`]: increment(1)
      };
      
      await updateDoc(userRef, statsUpdate);
    }
    
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
// 📄 TEXT EXTRACTION FUNCTIONS with Enhanced Prompts
// =============================================================================

/**
 * Extract text from image using Claude with enhanced accuracy
 */
export const extractTextFromImage = async (file, options = {}) => {
  try {
    if (!file) throw new Error('No image file provided');
    
    console.log('📝 Extracting text from:', file.name);
    
    const { data: imageBase64, mediaType } = await fileToBase64(file);
    
    const systemPrompt = `You are an expert at extracting handwritten text from journal images with perfect accuracy.

CRITICAL INSTRUCTIONS:
1. Extract ALL visible text EXACTLY as written - every word, every line
2. Preserve the exact line breaks and paragraph structure
3. Include partial words at edges if visible
4. Maintain original spelling, grammar, and punctuation
5. If text is unclear, make your best attempt but note uncertainty
6. Capture dates, headers, or margin notes if present

IMPORTANT: This is private user content for personal reflection. Accuracy is essential for their self-discovery journey.

Return JSON with this exact format:
{
  "text": "the complete extracted text with original formatting",
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
          { type: 'text', text: "Extract ALL handwritten text from this journal entry, preserving exact formatting and line breaks." }
        ]
      }],
      system: systemPrompt,
      max_tokens: 2000,
      temperature: 0.3 // Lower temperature for accuracy
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const extractionResult = safeJsonParse(content, {
      text: '',
      confidence: 0.5,
      warnings: ['Failed to parse extraction response'],
      metadata: { estimatedWords: 0, hasHeaders: false, writingStyle: 'unknown' }
    });
    
    const wordCount = extractionResult.text.split(/\s+/).filter(Boolean).length;
    
    logAnalyticsEvent('text_extraction_completed', {
      success: true, wordCount, confidence: extractionResult.confidence,
      model: CLAUDE_EXTRACTION_MODEL
    });
    
    return {
      text: extractionResult.text,
      wordCount,
      confidence: extractionResult.confidence,
      warnings: extractionResult.warnings,
      metadata: extractionResult.metadata
    };
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
=======
/**
 * Schedule cleanup of temporary images
 * @param {string|Array<string>} imageUrls - URL(s) of images to delete
 */
const scheduleImageCleanup = (imageUrls) => {
  try {
    const storage = getStorage();
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
    
    setTimeout(async () => {
      for (const url of urls) {
        try {
          const imageRef = ref(storage, getPathFromUrl(url));
          await deleteObject(imageRef);
          console.log(`Deleted processed image: ${url}`);
        } catch (error) {
          console.warn(`Failed to delete image ${url}:`, error);
        }
      }
    }, 300000);
  } catch (error) {
    console.warn('Failed to schedule image cleanup:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  }
};

/**
<<<<<<< HEAD
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
        recommendation: `Welcome to your Καιρός journey! This is a sacred space for self-discovery through journaling. Set aside 10-15 minutes daily in a quiet space where you feel comfortable. Whether you choose to write in your journal or record voice reflections, what matters most is showing up authentically. Begin with simple observations about your day, feelings, or thoughts. Trust that each entry, no matter how brief, is a step toward deeper self-understanding. Your journey of a thousand insights begins with a single reflection.`,
        personalizedInsight: "Your story is waiting to be told. Begin whenever you're ready."
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
        growthAreas: ["Building consistent practice", "Deepening self-reflection"],
        recommendation: `Beautiful beginning with ${allEntries.length} ${allEntries.length === 1 ? 'entry' : 'entries'}${hasVoice ? ', including the courage to use your voice' : ''}! You're laying the foundation for a transformative practice. To deepen your journey, aim for 5-7 consecutive days - this is when patterns begin to emerge and insights crystallize. Create a ritual: same time, comfortable space, open heart. ${hasVoice ? 'Your willingness to speak your truth aloud shows remarkable courage. ' : 'Consider trying voice journaling for a different perspective. '}Remember, there's no "perfect" entry - authenticity is your only goal.`,
        personalizedInsight: "You're planting seeds of self-awareness that will bloom in unexpected ways."
      };
    }
    
    // Prepare comprehensive entries data for AI analysis
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
    
    const systemPrompt = `You are Καιρός, analyzing ${allEntries.length} journal entries to provide a deeply personalized progress report that inspires continued growth.

ENTRY DATA:
${JSON.stringify(entriesContent, null, 2)}

JOURNEY STATISTICS:
- Total entries: ${allEntries.length} (${entries.length} written, ${voiceEntries.length} voice)
- Journey paths explored: ${[...new Set(allEntries.map(e => e.pathId))].join(', ')}
- Days since first entry: ${Math.floor((Date.now() - new Date(allEntries[0].timestamp?.toDate()).getTime()) / (1000 * 60 * 60 * 24))}
${hasVoiceEntries ? `- Voice journaling adoption: ${voicePercentage}% of entries` : '- No voice entries yet'}

ANALYSIS GUIDELINES:
1. Identify deep patterns and evolution across their journey
2. Recognize specific breakthroughs and transformative moments
3. Note emerging themes that reveal their authentic self
4. Acknowledge both written and voice journaling courage
5. Provide actionable insights based on their actual patterns
6. Write with warmth, wisdom, and genuine care for their growth

Create a progress report that feels like it comes from a wise mentor who has carefully studied their journey and sees their highest potential.

Respond with JSON:
{
  "completionRate": ${Math.round((allEntries.length / 10) * 100)},
  "totalEntries": ${allEntries.length},
  "voiceEntries": ${voiceEntries.length},
  "commonThemes": ["theme1", "theme2", "theme3", "theme4"],
  "growthAreas": ["specific growth area 1", "specific growth area 2"],
  "recommendation": "200-250 word deeply personalized recommendation using 'you' - reference specific patterns and suggest concrete next steps",
  "personalizedInsight": "A profound observation about their unique journey that shows deep understanding",
  "journeyHighlight": "Specific moment or entry that represents significant growth",
  "emergingStrengths": ["strength that's developing", "another emerging quality"]
}`;
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: "Generate my comprehensive progress report with deep insights into my growth journey." }],
      system: systemPrompt,
      max_tokens: 1200,
      temperature: 0.8
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
      growthAreas: ["Deepening self-awareness", "Building reflective practice"],
      recommendation: `Your ${allEntries.length} entries reveal a beautiful unfolding of self-discovery. ${hasVoiceEntries ? `The combination of written and spoken reflections (${voicePercentage}% voice) shows remarkable range in your self-expression. ` : ''}You're developing a consistent practice that's creating real transformation. Notice how your recent entries show deeper insight than your early ones - this is growth in action. To enhance your journey further, try revisiting earlier entries to see how your perspective has evolved. ${hasVoiceEntries ? 'Your voice entries carry particular power - consider increasing these for deeper emotional processing. ' : 'Consider adding voice entries to access different layers of insight. '}Set an intention to explore one challenging emotion or pattern this week. Remember, the most profound growth often comes from gentle, consistent attention rather than dramatic breakthroughs.`,
      personalizedInsight: "Your unique way of reflecting reveals someone who is courageously committed to authentic self-understanding.",
      journeyHighlight: "Your recent entries show increasing comfort with vulnerability and emotional honesty.",
      emergingStrengths: ["Growing self-compassion", "Deepening introspective ability"]
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
      recommendation: `While we couldn't generate your full progress report, your journaling practice remains deeply valuable. Continue reflecting regularly through writing or voice recording. Review your past entries to notice patterns and growth. Set intentions for upcoming sessions and trust that every moment of honest self-reflection contributes to your transformation. Your commitment to this practice is already creating positive changes, even when they're not immediately visible.`,
      personalizedInsight: "Technical challenges can't diminish the value of your inner work."
    };
  }
};

/**
 * Generate enhanced journey completion celebration
 */
export const generateJourneyCompletion = async (userId, allEntries, pathId = 'self-discovery') => {
  try {
    console.log(`🏆 Generating enhanced journey completion using ${CLAUDE_ANALYSIS_MODEL}...`);
    
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
    
    const systemPrompt = `You are Καιρός, celebrating ${userName}'s completion of their "${pathName}" journey. Create a deeply moving celebration that honors their dedication and transformation.

JOURNEY DATA:
${JSON.stringify(entriesData, null, 2)}

JOURNEY STATISTICS:
- Journey: ${pathName} (${journeyDuration} days)
- Total entries: ${allEntries.length}
- Voice entries: ${voiceEntryCount}
- Completion rate: ${Math.round((allEntries.length / journeyDuration) * 100)}%
${hasVoiceEntries ? '- Demonstrated courage through both written and spoken reflection' : '- Maintained consistent written practice throughout'}

CELEBRATION GUIDELINES:
1. Create a powerful, personalized celebration of their achievement
2. Highlight specific transformations visible in their entries
3. Acknowledge the courage required for this inner work
4. Paint a picture of how they've grown from day 1 to now
5. Offer wisdom about integrating their insights into daily life
6. Make them feel truly seen and celebrated

Write as a wise, loving mentor who has witnessed every step of their journey and is deeply moved by their growth.

Respond with JSON:
{
  "journeyOverview": "3-4 sentences using 'you' - powerful acknowledgment of their journey and transformation",
  "growthNarrative": "A story of their progression from beginning to end, highlighting key transformations",
  "keyThemes": ["deep theme 1", "deep theme 2", "deep theme 3", "deep theme 4"],
  "personalStrengths": ["specific strength demonstrated", "another strength", "third strength"],
  "transformationHighlight": "The most significant transformation observed in their journey",
  "growthOpportunities": ["opportunity for continued growth", "another growth edge"],
  "meaningfulAffirmation": "A profound, personalized affirmation they can carry forward",
  "integrationWisdom": "Specific guidance for integrating their insights into daily life",
  "nextSteps": "Concrete suggestions for continuing their growth journey",
  "celebrationMessage": "A heartfelt message celebrating their unique journey and courage"
}`;
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: "Create a powerful celebration of my completed journey, acknowledging my growth and transformation." }],
      system: systemPrompt,
      max_tokens: 1500,
      temperature: 0.85
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
    'sacred-geometry': 'Sacred Geometry Soul'
  };
  return names[pathId] || 'Self-Discovery Journey';
}

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
    
    const systemPrompt = `You are Καιρός, answering a personal question from ${userProfile?.displayName || 'a dedicated journaler'} based on deep analysis of their journal entries.

USER QUESTION: "${question}"

THEIR JOURNEY CONTEXT:
- Total reflections: ${allEntries.length} (${entries.length} written, ${voiceEntries.length} voice)
- Journey paths explored: ${journeyPaths.join(', ')}
- Days on journey: ${Math.max(...allEntries.map(e => e.day || 0))}
${hasVoiceEntries ? '- Has shown courage through voice journaling' : ''}

RECENT ENTRIES ANALYSIS:
${JSON.stringify(entriesContext, null, 2)}

ANSWER GUIDELINES:
1. Draw specific insights from their actual journal entries
2. Reference patterns, growth, and transformations you observe
3. Provide wisdom that feels deeply personal to their journey
4. Acknowledge specific moments or insights from their entries
5. Offer practical guidance rooted in their own discoveries
6. Write as a wise friend who has read every word they've written

Create an answer that makes them feel truly seen and understood, drawing wisdom from their own journey.

Respond with JSON:
{
  "answer": "200-300 word deeply personalized response using 'you' - must reference specific patterns from their entries",
  "keyInsights": [
    "Specific insight drawn from their entries",
    "Another pattern or theme observed",
    "Growth edge or strength noticed"
  ],
  "personalObservation": "A profound observation about their unique journey or growth pattern",
  "relevantEntry": "Reference to a specific entry or moment that relates to their question",
  "practicalSuggestion": "Concrete action based on their patterns and the question asked"
}`;
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: `Based on my journal journey, please answer: ${question}` }],
      system: systemPrompt,
      max_tokens: 800,
      temperature: 0.85
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
    
    // Create comprehensive journal data
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
    
    const systemPrompt = `You are Καιρός, creating a profound personality description for ${userProfile?.displayName || 'a dedicated journaler'} based on deep analysis of their journal entries.

COMPREHENSIVE JOURNEY DATA:
- Total entries: ${allEntries.length} (${entries.length} written, ${voiceEntries.length} voice)
- Current streak: ${progressStats?.currentStreak || 0} days
- Journey paths explored: ${journeyPaths.join(', ')}
- Dominant themes: ${dominantThemes.join(', ')}
${hasVoiceEntries ? '- Shows remarkable courage through voice journaling' : ''}

DETAILED ENTRY ANALYSIS:
${JSON.stringify(journalData, null, 2)}

DESCRIPTION GUIDELINES:
1. Base everything on specific evidence from their entries
2. Write in third person with warmth and admiration
3. Highlight unique qualities that emerge from their reflections
4. Note evolution and growth patterns across their journey
5. Acknowledge both strengths and growth edges with compassion
6. Create a description they would feel deeply seen by

Craft a personality description that captures their essence as revealed through their courageous self-reflection.

Respond with JSON:
{
  "corePersonality": "3-4 sentences capturing their essential nature as revealed in entries",
  "strengths": ["specific strength with evidence", "another strength", "third strength", "fourth strength", "fifth strength"],
  "valuesAndMotivations": "What drives them based on their reflections",
  "communicationStyle": "How they express themselves in writing/voice",
  "growthMindset": "Their approach to challenges and learning",
  "emotionalIntelligence": "Their relationship with emotions and inner world",
  "lifePhilosophy": "Core beliefs and worldview from their entries",
  "uniqueQualities": "What makes them distinctively themselves",
  "evolutionObserved": "How they've grown through their journey",
  "hiddenDepths": "Subtle qualities that emerge in their reflections",
  "overallSummary": "3-4 sentence synthesis that would make them feel truly understood"
}`;
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [{ role: 'user', content: 'Create my personality description based on deep analysis of all my journal entries.' }],
      system: systemPrompt,
      max_tokens: 1500,
      temperature: 0.85
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
=======
 * Extract storage path from download URL
 * @param {string} url - Download URL
 * @returns {string} - Storage path
 */
const getPathFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+?)(\?|$)/);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
    throw new Error('Could not parse storage path from URL');
  } catch (error) {
    console.error('Error extracting path from URL:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    return null;
  }
};

<<<<<<< HEAD
// =============================================================================
// 📚 ENTRY RETRIEVAL FUNCTIONS
// =============================================================================

/**
 * Get previous entries (regular journals)
 */
export const getPreviousEntries = async (userId, pathId = 'all') => {
  try {
    const entries = [];
    const journalRef = collection(db, 'users', userId, 'journal');
    const journalSnap = await getDocs(journalRef);
    
    journalSnap.forEach((doc) => {
      const data = doc.data();
      if (pathId === 'all' || !data.pathId || data.pathId === pathId) {
        entries.push({ id: doc.id, ...data });
      }
    });
    
    return entries.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error('Error getting previous entries:', error);
    throw new Error('Failed to get previous entries: ' + error.message);
  }
};

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
// 🛠️ UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert file to base64
 */
async function fileToBase64(file) {
=======
/**
 * Helper function to convert a file to base64 and detect correct mime type
 * @param {File} file - File to convert
 * @returns {Promise<{data: string, mediaType: string}>} - Base64 string and detected media type
 */
function fileToBase64(file) {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = reader.result;
        const mediaType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const base64Data = dataUrl.split(',')[1];
<<<<<<< HEAD
        resolve({ data: base64Data, mediaType });
=======
        resolve({
          data: base64Data,
          mediaType: mediaType
        });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      } catch (error) {
        reject(new Error('Failed to process image: ' + error.message));
      }
    };
<<<<<<< HEAD
    reader.onerror = (error) => reject(new Error('Failed to read file: ' + error.message));
=======
    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error.message));
    };
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    reader.readAsDataURL(file);
  });
}

/**
<<<<<<< HEAD
 * Fetch image as base64
 */
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

/**
 * Get age group
 */
function getAgeGroup(age) {
  if (age < 13) return 'child';
  if (age <= 17) return 'teen';
  if (age <= 25) return 'young-adult';
  if (age <= 40) return 'adult';
  if (age <= 60) return 'middle-aged';
  return 'senior';
}

/**
 * Check if description should be regenerated (weekly)
 */
const shouldRegenerateDescription = (lastGenerated) => {
  if (!lastGenerated) return true;
  const lastDate = lastGenerated.toDate ? lastGenerated.toDate() : new Date(lastGenerated);
  const daysSinceGenerated = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceGenerated >= 7;
};

/**
 * Get time until midnight
 */
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

/**
 * Extract common words from entries
 */
function extractCommonWords(entries, limit = 5) {
  const stopWords = new Set(['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'on', 'at', 'from', 'by', 'an', 'this', 'that', 'it', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'must', 'not', 'no', 'yes', 'or', 'but', 'if', 'then', 'else', 'when', 'up', 'down', 'out', 'very', 'just', 'like', 'so', 'really', 'think', 'feel', 'know', 'get', 'go', 'see', 'want', 'need', 'make', 'take', 'come', 'give', 'find', 'say', 'tell', 'ask', 'work', 'seem', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able']);
  
  const wordCount = {};
  
  entries.forEach(entry => {
    const text = [
      entry.extractedText || '',
      entry.transcription || '', // Include voice transcriptions
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

/**
 * Extract key words from entry
 */
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

/**
 * Extract key moments from entry
 */
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

/**
 * Extract themes from entry
 */
function extractThemes(entry) {
  const themes = new Set();
  
  // Extract from insights
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

/**
 * Extract dominant themes from all entries
 */
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

/**
 * Get progress field for path
 */
function getProgressFieldForPath(pathId) {
  const fieldMap = {
    // Regular paths
=======
 * Final enhanced saveAnalysisResult function with profile refresh
 * Replace this in your claudeService.js
 */
export const saveAnalysisResult = async (
  userId, 
  day, 
  analysisResult, 
  imageUrl, 
  pathId = 'self-discovery'
) => {
  try {
    console.log(`🔄 Saving analysis result for user ${userId}, day ${day}, path ${pathId}`);
    
    // Save the journal entry with analysis
    const entryRef = doc(db, 'users', userId, 'journal', `${pathId}_day-${day}`);
    
    const safeAnalysisResult = {
      ...analysisResult,
      prompt: analysisResult.prompt || '',
      theme: analysisResult.theme || '',
      pathId: pathId,
      isTextOnly: !imageUrl && !!analysisResult.extractedText
    };
    
    await setDoc(entryRef, {
      day,
      pathId,
      imageUrl,
      analysis: safeAnalysisResult,
      timestamp: serverTimestamp(),
      prompt: safeAnalysisResult.prompt,
      theme: safeAnalysisResult.theme,
      extractedText: analysisResult.extractedText || '',
      isTextOnly: !imageUrl && !!analysisResult.extractedText
    });

    console.log(`✅ Journal entry saved for day ${day}`);

    // Update user progress - this is the critical part  
    const userRef = doc(db, 'users', userId);
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const journeyProgress = userData.journeyProgress || {};
        
        // Get the progress field for this path
        const progressField = getProgressFieldForPath(pathId);
        console.log(`📊 Progress field for ${pathId}: ${progressField}`);
        
        // Get current progress for this path
        let pathProgress = journeyProgress[progressField] || { 
          completedDays: [],
          currentDay: 1,
          lastActive: null,
          streak: 0
        };
        
        const completedDays = Array.isArray(pathProgress.completedDays) ? pathProgress.completedDays : [];
        
        // Add this day to completed days if not already there
        if (!completedDays.includes(day)) {
          completedDays.push(day);
          completedDays.sort((a, b) => a - b);
          console.log(`📈 Added day ${day} to completed days:`, completedDays);
        } else {
          console.log(`ℹ️ Day ${day} already completed`);
        }
        
        // Calculate streak
        let streak = pathProgress.streak || 0;
        const lastActiveDate = pathProgress.lastActive ? new Date(pathProgress.lastActive.toDate()) : null;
        const today = new Date();
        
        if (lastActiveDate) {
          const timeDiff = today.getTime() - lastActiveDate.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          
          if (daysDiff === 0) {
            // Same day - keep current streak
          } else if (daysDiff === 1) {
            // Next day - increment streak
            streak += 1;
          } else {
            // Gap in days - reset streak
            streak = 1;
          }
        } else {
          // First entry - start streak
          streak = 1;
        }
        
        // Update path progress
        const updatedPathProgress = {
          ...pathProgress,
          completedDays,
          lastCompletedDay: day,
          lastActive: serverTimestamp(),
          streak,
          currentDay: Math.max(day + 1, pathProgress.currentDay || 1)
        };
        
        // Update journey progress
        const updatedJourneyProgress = {
          ...journeyProgress,
          [progressField]: updatedPathProgress,
          lastActive: serverTimestamp(),
          currentPath: pathId // Ensure current path is set
        };
        
        // Save updated progress
        await setDoc(userRef, {
          journeyProgress: updatedJourneyProgress
        }, { merge: true });
        
        console.log(`🎉 Progress updated successfully:`, {
          pathId,
          day,
          completedDays: completedDays.length,
          streak,
          progressField,
          nextDay: updatedPathProgress.currentDay
        });
        
        // 🆕 CRITICAL: Refresh user profile in AuthContext to update UI
        console.log('🔄 Triggering user profile refresh...');
        
        try {
          if (typeof window !== 'undefined' && window.authContextRefresh) {
            await window.authContextRefresh();
            console.log('✅ User profile refreshed - UI will now show updated progress');
          } else {
            console.warn('⚠️ Auth context refresh function not available');
            
            // Fallback: Dispatch custom event for components to listen to
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('journeyProgressUpdated', {
                detail: {
                  userId,
                  pathId,
                  day,
                  completedDays: completedDays.length,
                  progressField,
                  timestamp: Date.now()
                }
              }));
              console.log('📢 Progress update event dispatched as fallback');
            }
          }
        } catch (refreshError) {
          console.error('❌ Error refreshing user profile:', refreshError);
          
          // Even if refresh fails, dispatch the event as a backup
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('journeyProgressUpdated', {
              detail: {
                userId,
                pathId,
                day,
                completedDays: completedDays.length,
                progressField,
                timestamp: Date.now()
              }
            }));
            console.log('📢 Progress update event dispatched after refresh failure');
          }
        }
        
        // Update API cache service
        if (typeof window !== 'undefined' && window.apiCacheService) {
          window.apiCacheService.recordNewJournalEntry(userId, pathId, day);
          console.log(`💾 Cache updated for new entry`);
        }
        
      } else {
        console.error('❌ User document not found:', userId);
        throw new Error('User document not found');
      }
    } catch (progressError) {
      console.error('❌ Error updating user progress:', progressError);
      // Don't throw here - we want the analysis to be saved even if progress update fails
      console.log('⚠️ Analysis saved but progress update failed');
    }
    
  } catch (error) {
    console.error('❌ Error saving analysis result:', error);
    throw new Error('Failed to save analysis result: ' + error.message);
  }
};

/**
 * Helper function to get progress field for path
 */
function getProgressFieldForPath(pathId) {
  const fieldMap = {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    'self-discovery': 'selfDiscoveryProgress',
    'emotional-intelligence': 'emotionalIntelligenceProgress',
    'mindfulness-awareness': 'mindfulnessAwarenessProgress',
    'transformation-journey': 'transformationJourneyProgress',
    'creative-expression': 'creativeExpressionProgress',
    'habit-formation': 'habitFormationProgress',
    'life-vision': 'lifeVisionProgress',
    'mindful-visualization': 'mindfulVisualizationProgress',
    'life-values': 'lifeValuesProgress',
    'relationship-mastery': 'relationshipMasteryProgress',
    'financial-mindfulness': 'financialMindfulnessProgress',
    'gratitude-practice': 'gratitudePracticeProgress',
    'shadow-work': 'shadowWorkProgress',
    'nature-connection': 'natureConnectionProgress',
<<<<<<< HEAD
    'holistic-transformation': 'holisticTransformationProgress',
    // Voice paths
    'voice-discovery': 'voiceDiscoveryProgress',
    'spoken-emotions': 'spokenEmotionsProgress',
    'vocal-confidence': 'vocalConfidenceProgress',
    'storytelling-voice': 'storytellingVoiceProgress',
    'meditation-speaking': 'meditationSpeakingProgress',
    // Visual paths
    'artistic-soul-expression': 'artisticSoulExpressionProgress',
    'color-psychology': 'colorPsychologyProgress',
    'sacred-geometry': 'sacredGeometryProgress',
    'nature-sketching': 'natureSketchingProgress',
    'abstract-emotions': 'abstractEmotionsProgress',
    'visual-storytelling': 'visualStorytellingProgress',
    'ink-essence': 'inkEssenceProgress'
  };
=======
    'holistic-transformation': 'holisticTransformationProgress'
  };
  
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  return fieldMap[pathId] || 'selfDiscoveryProgress';
}

/**
<<<<<<< HEAD
 * Log analytics events
=======
 * Generate a comprehensive analysis for the completed 10-day journey
 * @param {string} userId - User ID
 * @param {Array} allEntries - All journal entries
 * @param {string} pathId - Path ID
 * @returns {Promise<Object>} - Comprehensive analysis
 */
export const generateJourneyCompletion = async (userId, allEntries, pathId = 'self-discovery') => {
  try {
    console.log(`Generating journey completion using ${CLAUDE_ANALYSIS_MODEL}...`);
    
    const entriesData = allEntries.map(entry => ({
      day: entry.day,
      prompt: entry.prompt || '',
      theme: entry.theme || '',
      summary: entry.analysis?.summary || '',
      insights: entry.analysis?.insights || []
    }));

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userProfile = userDoc.exists() ? userDoc.data() : null;
    const userName = userProfile?.displayName || 'user';
    
    logAnalyticsEvent('journey_completion_started', {
      totalEntries: allEntries.length,
      pathId,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    const pathName = pathId === 'emotional-intelligence' ? 'Emotional Intelligence Expedition' :
                     pathId === 'mindfulness-awareness' ? 'Mindfulness & Present Awareness' :
                     'Self-Discovery Journey';
    
    const systemPrompt = `
      You are an AI journey analysis assistant for the Καιρός app. Your task is to create a comprehensive analysis of the user's completed 10-day "${pathName}" journaling journey.
      
      The user's name is "${userName}" but ALWAYS address them directly as "you" in your analysis.
      
      Here is the data from their journal entries:
      ${JSON.stringify(entriesData)}
      
      Provide the following in your response:
      1. Journey Overview: A summary of their overall journey (3-4 sentences)
      2. Growth Narrative: Identify their progress and development throughout the journey
      3. Key Themes: The major themes that emerged across their entries (3-5 themes)
      4. Personal Strengths: Positive attributes you've observed in their writing
      5. Growth Opportunities: Areas where they might benefit from further reflection
      6. Meaningful Affirmation: A powerful, personalized affirmation that captures their journey
      7. Next Steps: Suggestions for continuing their journey
      
      Format your response as a JSON object with these keys.
      ALWAYS use second-person language ("you", "your") throughout the analysis.
      Make the affirmation especially meaningful and personal.
    `;
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [
        {
          role: 'user',
          content: "Please analyze my completed journaling journey."
        }
      ],
      system: systemPrompt,
      max_tokens: 1500
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    
    const completionAnalysis = safeJsonParse(content, {
      journeyOverview: "You've completed your 10-day journaling journey with Καιρός.",
      growthNarrative: "Your journey shows progression in self-reflection.",
      keyThemes: ["Self-awareness", "Personal growth", "Reflection"],
      personalStrengths: ["Commitment to journaling", "Willingness to explore"],
      growthOpportunities: ["Deeper emotional exploration"],
      meaningfulAffirmation: "Your dedication to self-reflection is creating meaningful change in your life.",
      nextSteps: "Consider continuing your journaling practice with a focus on themes that resonated with you."
    });
    
    const completionRef = doc(db, 'users', userId, 'journey', `${pathId}_completion`);
    await setDoc(completionRef, {
      ...completionAnalysis,
      pathId,
      completedAt: serverTimestamp()
    });
    
    logAnalyticsEvent('journey_completion_generated', {
      success: true,
      pathId,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    return completionAnalysis;
  } catch (error) {
    console.error('Error generating journey completion:', error);
    
    logAnalyticsEvent('journey_completion_error', {
      message: error.message,
      pathId,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    throw new Error('Failed to generate journey completion: ' + formatApiError(error));
  }
};

/**
 * Get previous journal entries for the user for a specific path
 * @param {string} userId - User ID
 * @param {string} pathId - Journey path ID (optional, defaults to 'all')
 * @returns {Promise<Array>} - Array of journal entries
 */
export const getPreviousEntries = async (userId, pathId = 'all') => {
  try {
    const entries = [];
    
    const journalRef = collection(db, 'users', userId, 'journal');
    const journalSnap = await getDocs(journalRef);
    
    journalSnap.forEach((doc) => {
      const data = doc.data();
      if (pathId === 'all' || !data.pathId || data.pathId === pathId) {
        entries.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return entries.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error('Error getting previous entries:', error);
    throw new Error('Failed to get previous journal entries: ' + error.message);
  }
};

/**
 * Get a specific journal entry
 * @param {string} userId - User ID
 * @param {number} day - Journal day number
 * @param {string} pathId - Journey path ID (optional, defaults to 'self-discovery')
 * @returns {Promise<Object>} - Journal entry
 */
export const getJournalEntry = async (userId, day, pathId = 'self-discovery') => {
  try {
    const entryRef = doc(db, 'users', userId, 'journal', `${pathId}_day-${day}`);
    let entrySnap = await getDoc(entryRef);
    
    if (!entrySnap.exists() && pathId === 'self-discovery') {
      const legacyEntryRef = doc(db, 'users', userId, 'journal', `day-${day}`);
      entrySnap = await getDoc(legacyEntryRef);
    }
    
    if (entrySnap.exists()) {
      return {
        id: entrySnap.id,
        ...entrySnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting journal entry:', error);
    throw new Error('Failed to get journal entry: ' + error.message);
  }
};

/**
 * Get extracted text for a journal entry
 * @param {string} userId - User ID
 * @param {number} day - Journal day number
 * @returns {Promise<string>} - Extracted text
 */
export const getExtractedText = async (userId, day) => {
  try {
    const textRef = doc(db, 'users', userId, 'journal_text', `day-${day}`);
    const textSnap = await getDoc(textRef);
    
    if (textSnap.exists()) {
      return textSnap.data().text || '';
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error getting extracted text:', error);
    return '';
  }
};

/**
 * Determines the age group of the user
 * @param {number} age - User's age
 * @returns {string} - Age group category
 */
function getAgeGroup(age) {
  if (age < 13) {
    return 'child';
  } else if (age >= 13 && age <= 17) {
    return 'teen';
  } else if (age >= 18 && age <= 25) {
    return 'young-adult';
  } else if (age >= 26 && age <= 40) {
    return 'adult';
  } else if (age >= 41 && age <= 60) {
    return 'middle-aged';
  } else {
    return 'senior';
  }
}

/**
 * Generate a progress report based on all journal entries - ENHANCED with longer recommendations
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Progress report
 */
export const generateProgressReport = async (userId, pathId = 'all') => {
  try {
    console.log(`Generating progress report using ${CLAUDE_ANALYSIS_MODEL}...`);
    
    const entries = await getPreviousEntries(userId, pathId);
    
    if (entries.length === 0) {
      return {
        completionRate: 0,
        totalEntries: 0,
        commonThemes: [],
        growthAreas: [],
        recommendation: `Welcome to your Καιρός journaling journey! Starting a journaling practice is one of the most powerful investments you can make in your personal growth and self-awareness. 

To begin your transformative journey, I recommend setting aside 10-15 minutes each day at a consistent time - perhaps in the morning with your coffee or in the evening before bed. This consistency will help establish journaling as a natural part of your routine rather than an added burden.

When you begin writing, don't worry about perfect grammar or profound insights. Simply let your thoughts flow onto the page. Start by describing your current emotions, what's on your mind, or how your day unfolded. The magic of journaling lies not in creating perfect prose, but in the honest act of self-reflection.

Consider exploring different journaling techniques: stream-of-consciousness writing, gratitude lists, goal setting, or responding to specific prompts. Each approach offers unique benefits and can help you discover what resonates most with your personality and current life circumstances.

Remember that journaling is a practice of self-compassion. Be patient with yourself as you develop this habit, and celebrate the simple act of showing up for yourself each day. Your future self will thank you for starting this journey of deeper self-understanding and personal growth.`
      };
    }
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userProfile = userDoc.exists() ? userDoc.data() : null;
    
    const entriesContent = entries.map(entry => ({
      day: entry.day,
      pathId: entry.pathId || 'self-discovery',
      summary: entry.analysis?.summary || '',
      insights: entry.analysis?.insights || [],
      theme: entry.theme || '',
      prompt: entry.prompt || '',
      extractedText: entry.extractedText ? entry.extractedText.substring(0, 200) + '...' : ''
    }));
    
    logAnalyticsEvent('progress_report_started', {
      totalEntries: entries.length,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    if (entries.length < 3) {
      return {
        completionRate: Math.round((entries.length / 10) * 100),
        totalEntries: entries.length,
        commonThemes: extractCommonWords(entries, 3),
        growthAreas: ["Continue building your journaling habit for deeper insights"],
        recommendation: `You've taken the important first steps in your journaling journey with ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}! This early stage is crucial for establishing the foundation of a sustainable practice that will serve you for years to come.

Based on your initial entries, I can see you're beginning to engage with the reflective process. To deepen this practice and unlock more profound insights, I recommend committing to journaling for at least 5-7 consecutive days. This consistency will help you move beyond surface-level observations into more meaningful self-discovery.

Focus on creating a ritual around your journaling time. Choose a specific time of day when you feel most reflective - many find early morning or evening works best. Create a comfortable environment: perhaps with a warm beverage, soft lighting, or calming music. This ritualistic approach signals to your mind that this is sacred time for self-reflection.

Try expanding your entries beyond daily events to include your emotional responses, dreams for the future, challenges you're facing, or moments of gratitude. Ask yourself deeper questions like: "What am I learning about myself?" "What patterns am I noticing in my thoughts or behaviors?" or "How am I growing through this experience?"

Don't worry about the length of your entries - quality matters more than quantity. Even a few thoughtful sentences that capture your authentic experience are incredibly valuable. Remember, you're building a relationship with yourself through this practice, and like any relationship, it deepens with consistent, honest communication.

As you continue, you'll begin to notice recurring themes and insights that will help guide your personal growth journey. Trust the process and celebrate the commitment you're making to your own development.`
      };
    }
    
    const systemPrompt = `
      You are an AI journal analysis assistant for the Καιρός app. Generate a holistic progress report based on the user's journal entries.
      
      The user has completed ${entries.length} journal entries. Here are the entries with their summaries, insights, and themes:
      ${JSON.stringify(entriesContent, null, 2)}
      
      Based on this journaling data, provide a comprehensive analysis that includes:
      
      1. **Overall patterns and themes** - Identify the most significant recurring themes across their entries
      2. **Growth areas and progress** - Highlight areas where you see development, learning, or positive change
      3. **Detailed personalized recommendations** - This is the most important part. Provide comprehensive, actionable advice for their continued journaling journey
      
      For the RECOMMENDATION section specifically, provide a detailed, multi-paragraph response (at least 300-500 words) that includes:
      - Specific observations about their journaling style and content
      - Personalized suggestions based on their unique themes and patterns
      - Concrete next steps for deepening their practice
      - Encouragement and validation of their progress so far
      - Specific journaling techniques or approaches that might benefit them
      - Questions they might explore in future entries
      - Ways to apply their insights to daily life
      
      Make the recommendation personal, actionable, and inspiring. Reference specific themes or patterns you've observed in their writing. Avoid generic advice - tailor everything to their unique journaling journey.
      
      Format your response as a JSON object with the following keys:
      - completionRate (percentage based on their entries, consider 10 entries as 100%)
      - totalEntries (number of entries they've completed)
      - commonThemes (array of 3-5 specific themes from their writing)
      - growthAreas (array of 3-4 specific areas where you see progress or potential)
      - recommendation (a detailed, comprehensive string with personalized advice - this should be substantial and specific to their journey)
      
      Remember to write in second person ("you", "your") and make everything deeply personal to their specific journaling experience.
    `;
    
    const requestBody = {
      model: CLAUDE_ANALYSIS_MODEL,
      messages: [
        {
          role: 'user',
          content: "Please generate a comprehensive progress report based on my journal entries, with particular attention to providing detailed, personalized recommendations for my continued journaling journey."
        }
      ],
      system: systemPrompt,
      max_tokens: 2000 // Increased to accommodate longer recommendations
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    
    const reportResult = safeJsonParse(content, {
      completionRate: Math.round((entries.length / 10) * 100),
      totalEntries: entries.length,
      commonThemes: extractCommonWords(entries, 3),
      growthAreas: ["Continue developing your journaling practice for deeper self-awareness"],
      recommendation: `Your journaling journey with ${entries.length} entries shows genuine commitment to self-reflection and personal growth. Based on the patterns I observe in your writing, you demonstrate a natural ability to explore your inner world with honesty and curiosity.

To deepen your practice further, I recommend focusing on the themes that emerge most naturally in your writing. Pay attention to the topics you return to repeatedly - these often represent areas of your life that are seeking attention or transformation. Consider dedicating entire journal sessions to exploring these recurring themes more deeply.

I notice you have a thoughtful approach to reflection. To build on this strength, try incorporating more specific questions into your journaling routine. Instead of simply recording events, ask yourself: "What did this experience teach me about myself?" or "How did I grow from this challenge?" This questioning approach will help you extract more insights from your daily experiences.

Consider experimenting with different journaling formats to keep your practice fresh and engaging. Try gratitude lists, letter-writing to your future self, dialogue journaling where you conversation with different aspects of yourself, or stream-of-consciousness writing. Each format can unlock different insights and keep you engaged with the process.

Your consistency shows dedication to personal development. As you continue, remember that journaling is not just about recording experiences - it's about developing a deeper relationship with yourself. Trust the process, be patient with your growth, and celebrate the insights that emerge from your continued practice. Each entry is a step toward greater self-understanding and emotional intelligence.`
    });
    
    const reportRef = doc(db, 'users', userId, 'reports', 'progress');
    await setDoc(reportRef, {
      ...reportResult,
      generatedAt: serverTimestamp()
    });
    
    logAnalyticsEvent('progress_report_completed', {
      totalEntries: entries.length,
      recommendationLength: reportResult.recommendation.length,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    return reportResult;
  } catch (error) {
    console.error('Error generating progress report:', error);
    
    logAnalyticsEvent('progress_report_error', {
      message: error.message,
      model: CLAUDE_ANALYSIS_MODEL
    });
    
    return {
      completionRate: 0,
      totalEntries: 0,
      commonThemes: [],
      growthAreas: [],
      recommendation: `We encountered a temporary issue while analyzing your journal entries, but that doesn't diminish the value of your journaling practice. The fact that you're seeking insights from your writing demonstrates a commitment to personal growth that deserves recognition.

While we work to resolve this technical issue, I encourage you to continue your journaling practice. Even without AI analysis, the act of regular writing and reflection provides immense benefits: improved emotional regulation, enhanced self-awareness, stress reduction, and clearer thinking about your goals and values.

Consider taking some time to manually review your recent entries. Look for patterns in your writing - what themes keep appearing? What emotions surface most frequently? What challenges or successes do you write about repeatedly? This self-analysis can be just as valuable as any automated insights.

In the meantime, try setting specific intentions for your upcoming journal sessions. Perhaps focus on exploring a particular relationship, goal, or life transition. Ask yourself deeper questions and give yourself permission to write honestly about your experiences, both positive and challenging.

Remember that journaling is a practice of self-compassion and growth. Every entry you complete, regardless of length or profundity, contributes to your journey of self-discovery. Your commitment to this practice is already creating positive changes in your life, even if they're not immediately visible. Please try accessing your analytics again later, and continue nurturing this valuable habit of reflection and personal development.`
    };
  }
};

/**
 * Enhanced version of the uploadMultipleJournalImages function 
 * that supports up to 5 pages - FIXED for Firebase serverTimestamp() limitation
 * 
 * @param {Array<File>} files - Array of journal image files
 * @param {string} pathId - Journey path ID
 * @param {number} day - Journal day number
 * @param {string} extractedText - Combined extracted text from all images
 * @returns {Promise<Array<string>>} - Array of download URLs
 */
export const uploadMultipleJournalImages = async (files, pathId, day, extractedText = '') => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const MAX_PAGES = 5;
    if (files.length > MAX_PAGES) {
      throw new Error(`Cannot upload more than ${MAX_PAGES} pages at once.`);
    }
    
    const uploadPromises = files.map(async (file, index) => {
      const storage = getStorage();
      const journalRef = ref(storage, `journals/${user.uid}/${pathId}/day-${day}/page-${index+1}_${Date.now()}_${file.name}`);
      
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          day: day.toString(),
          pathId: pathId,
          pageNumber: (index + 1).toString(),
          totalPages: files.length.toString()
        }
      };
      
      const snapshot = await uploadBytes(journalRef, file, metadata);
      return getDownloadURL(snapshot.ref);
    });
    
    let downloadURLs = [];
    if (files.length <= 2) {
      downloadURLs = await Promise.all(uploadPromises);
    } else {
      for (let i = 0; i < uploadPromises.length; i += 2) {
        const batch = uploadPromises.slice(i, i + 2);
        const batchResults = await Promise.all(batch);
        downloadURLs = [...downloadURLs, ...batchResults];
        if (i + 2 < uploadPromises.length) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    
    if (extractedText) {
      const textRef = doc(db, 'users', user.uid, 'journal_text', `${pathId}_day-${day}`);
      await setDoc(textRef, {
        text: extractedText,
        day,
        pathId,
        imageCount: files.length,
        imageUrls: downloadURLs,
        isMultiPage: files.length > 1,
        pageIdentifiers: downloadURLs.map((url, idx) => ({ 
          pageNumber: idx + 1, 
          url,
          uploadTime: new Date().toISOString()
        })),
        timestamp: serverTimestamp()
      });
      
      logAnalyticsEvent('multi_page_journal_upload', {
        day,
        pathId,
        pageCount: files.length,
        hasExtractedText: true,
        textLength: extractedText.length
      });
    }
    
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading journal images:', error);
    
    logAnalyticsEvent('multi_page_upload_error', {
      errorMessage: error.message,
      pageCount: files.length,
      pathId
    });
    
    throw new Error(`Failed to upload journal images: ${error.message}`);
  }
};

/**
 * Extracts text from a single journal image
 * @param {File} file - Journal image file
 * @param {Object} options - Additional options (keepImage, privacyLevel)
 * @returns {Promise<Object>} - Extraction result with text and word count
 */
export const extractTextFromImage = async (file, options = {}) => {
  try {
    if (!file) {
      throw new Error('No image file provided for text extraction');
    }
    
    const defaultOptions = {
      keepImage: !SETTINGS.DELETE_IMAGES_AFTER_PROCESSING,
      privacyLevel: SETTINGS.DEFAULT_PRIVACY_LEVEL
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    console.log('Extracting text from single image:', file.name, file.type);
    
    const { data: imageBase64, mediaType } = await fileToBase64(file);
    
    console.log('Image converted to base64 with media type:', mediaType);
    
    const systemPrompt = `
      You are a text extraction assistant for a journaling app. Your task is to extract handwritten text from the provided image.
      
      ${SETTINGS.ENABLE_LOCAL_ANALYSIS_OPTION ? `
      If the user has enabled local-only analysis, return an error message indicating that 
      local text extraction is not supported at this time.
      ` : ''}
      
      ${finalOptions.privacyLevel === 'high' ? `
      This user has selected HIGH privacy settings. Ensure that after text extraction, 
      the image is not retained in any form, and all processing respects the user's privacy.
      ` : ''}
      
      IMPORTANT: This is a private journaling application. All journal entries are private to the user. 
      Please extract ALL text visible in the image, regardless of how personal it appears.
      
      Return the extracted text in the following JSON format:
      {
        "text": "extracted text here",
        "confidence": 0.95,
        "warnings": ["any warnings about extraction quality"]
      }
      
      The "text" field should contain the extracted text.
      The "confidence" field should be a number between 0 and 1 indicating your confidence in the extraction accuracy.
      The "warnings" field should be an array of strings with any issues encountered (e.g., "Text may be incomplete due to image quality").
      
      If the image is unclear or unreadable, include a warning: "The image is unclear. Please upload a clearer image of your journal entry."
    `;
    
    const requestBody = {
      model: CLAUDE_EXTRACTION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64
              }
            },
            {
              type: 'text',
              text: "Please extract all text from this journal entry image."
            }
          ]
        }
      ],
      system: systemPrompt,
      max_tokens: 1500
    };
    
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    const content = data.content[0].text;
    const extractionResult = safeJsonParse(content, {
      text: '',
      confidence: 0.5,
      warnings: ['Failed to parse Claude response']
    });
    
    const wordCount = extractionResult.text.split(/\s+/).filter(Boolean).length;
    
    logAnalyticsEvent('text_extraction_completed', {
      success: true,
      wordCount,
      confidence: extractionResult.confidence,
      warnings: extractionResult.warnings,
      model: CLAUDE_EXTRACTION_MODEL
    });
    
    return {
      text: extractionResult.text,
      wordCount,
      confidence: extractionResult.confidence,
      warnings: extractionResult.warnings
    };
  } catch (error) {
    console.error('Error extracting text from image:', error);
    
    logAnalyticsEvent('text_extraction_error', {
      errorType: 'api',
      message: error.message,
      model: CLAUDE_EXTRACTION_MODEL
    });
    
    let errorMessage = 'Failed to extract text from image: ';
    
    if (error.message.includes('media type')) {
      errorMessage += 'Image format not supported. Please try a JPG or PNG image.';
    } else if (error.message.includes('too large')) {
      errorMessage += 'Image is too large. Please try a smaller image or crop it.';
    } else {
      errorMessage += formatApiError(error);
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Extracts text from multiple journal images with progress updates
 * Enhanced to handle up to 5 pages with optimized processing
 * 
 * @param {Array<File>|File} files - Array of journal image files or single file
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise<Array<Object>>} - Array of extraction results
 */
export const extractTextFromImages = async (files, progressCallback = null) => {
  try {
    const fileArray = Array.isArray(files) ? files : [files];
    
    const MAX_PAGES = 5;
    if (fileArray.length > MAX_PAGES) {
      throw new Error(`Cannot process more than ${MAX_PAGES} images at once.`);
    }
    
    console.log(`Extracting text from ${fileArray.length} images...`);
    
    const results = [];
    for (let i = 0; i < fileArray.length; i++) {
      console.log(`Processing image ${i + 1}/${fileArray.length}`);
      
      if (progressCallback) {
        progressCallback({
          currentPage: i + 1,
          totalPages: fileArray.length,
          percentage: Math.round(((i) / fileArray.length) * 100)
        });
      }
      
      const result = await extractTextFromImage(fileArray[i]);
      
      results.push({
        ...result,
        pageNumber: i + 1
      });
      
      if (i < fileArray.length - 1) {
        await new Promise(r => setTimeout(r, 300));
      }
      
      if (progressCallback && i === fileArray.length - 1) {
        progressCallback({
          currentPage: fileArray.length,
          totalPages: fileArray.length,
          percentage: 100
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error extracting text from images:', error);
    throw new Error('Failed to extract text from images: ' + error.message);
  }
};

/**
 * Extract common words from journal entries
 * @param {Array} entries - Array of journal entries
 * @param {number} limit - Maximum number of themes to extract
 * @returns {Array} - Array of common themes
 */
function extractCommonWords(entries, limit = 5) {
  const stopWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 
                     'on', 'at', 'from', 'by', 'an', 'this', 'that', 'it', 'each',
                     'are', 'was', 'were', 'be', 'been', 'being', 'have', 'that',
                     'which', 'who', 'whom', 'whose', 'where', 'when', 'how', 'why',
                     'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must',
                     'not', 'no', 'yes', 'or', 'and', 'but', 'if', 'unless', 'until',
                     'while', 'since', 'for', 'because', 'as', 'so', 'then', 'than',
                     'whether', 'either', 'neither', 'both', 'all', 'any', 'some', 'most',
                     'few', 'many', 'much', 'more', 'less', 'least', 'other', 'another',
                     'such', 'own', 'same', 'different', 'opposite', 'similar', 'like',
                     'unlike', 'instead', 'however', 'nevertheless', 'therefore', 'thus',
                     'hence', 'consequently', 'accordingly', 'furthermore', 'moreover',
                     'also', 'besides', 'additionally',
                     'has', 'had', 'do', 'does', 'did', 'but', 'or', 'as', 'into',
                     'if', 'then', 'else', 'when', 'up', 'down', 'out', 'very'];
  
  const wordCount = {};
  
  entries.forEach(entry => {
    const text = [
      entry.extractedText || '',
      entry.analysis?.summary || '',
      ...(entry.analysis?.insights || [])
    ].join(' ').toLowerCase();
    
    const words = text
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);
    
    words.forEach(word => {
      if (word.length <= 3 || stopWords.includes(word)) return;
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });
  
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * Log analytics events for tracking user behavior and app performance
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Parameters to log with the event
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
 */
function logAnalyticsEvent(eventName, eventParams = {}) {
  console.log(`[Analytics] ${eventName}:`, eventParams);
  
  if (typeof window !== 'undefined' && window.analyticsService) {
    window.analyticsService.logEvent(eventName, {
      ...eventParams,
      timestamp: new Date().toISOString()
    });
  }
}

<<<<<<< HEAD
// =============================================================================
// 📤 EXPORTS
// =============================================================================

/**
 * Main export object with all functions
 */
export default {
  // 🎤 Voice Functions
  uploadVoiceJournal,
  analyzeVoiceJournalEntry,
  getPreviousVoiceEntries,
  getVoiceJournalEntry,
  
  // 📝 Regular Journal Functions
  uploadJournalImage,
  uploadMultipleJournalImages,
  extractTextFromImage,
  extractTextFromImages,
  
  // 🧠 Analysis Functions (Unified)
  analyzeJournalEntry, // Handles both voice and regular
  analyzeMultiPageJournalEntry,
  saveAnalysisResult, // Handles both voice and regular
  
  // 📊 Progress & Completion
  generateProgressReport, // Enhanced with voice support
  generateJourneyCompletion, // Enhanced with voice support
  
  // 📚 Entry Retrieval
  getPreviousEntries,
  getJournalEntry,
  getExtractedText,
  
  // 🤖 AI Insights
  checkDailyQuestionLimit,
  answerDailyQuestion, // Enhanced with voice support
  generatePersonalityDescription, // Enhanced with voice support
  getPersonalityDescription
};

// =============================================================================
// 📝 INDIVIDUAL FUNCTION EXPORTS
// =============================================================================

// Individual functions are already exported inline with 'export const'
// No need for additional export statement since we're using named exports throughout

// =============================================================================
// 🎉 ENHANCED CLAUDE SERVICE WITH VOICE ANALYSIS COMPLETE! 
// =============================================================================

/*
🚀 ENHANCED FEATURES IMPLEMENTED:

✅ Complete voice journal support with enhanced prompts
✅ Deeper, more empathetic AI analysis for all entry types
✅ Enhanced progress reports with journey-specific insights
✅ Profound journey completion celebrations
✅ Rich personality descriptions based on comprehensive analysis
✅ Daily AI questions with deep personalization
✅ Path-specific instructions for all journey types
✅ Multi-page journal support with progress tracking
✅ Privacy-conscious design with configurable settings
✅ Comprehensive error handling and user feedback

🔥 KEY IMPROVEMENTS:

1. VOICE ANALYSIS:
   - Acknowledges courage of spoken reflection
   - Analyzes emotional tone and authenticity
   - Provides voice-specific observations
   - Tracks voice journaling progress

2. ENHANCED PROMPTS:
   - Deeper empathy and personalization
   - References specific user patterns
   - Provides actionable, meaningful insights
   - Celebrates growth and transformation

3. JOURNEY AWARENESS:
   - Path-specific guidance and analysis
   - Progress tracking across journeys
   - Continuity between entries
   - Evolution tracking over time

4. PERSONALITY INSIGHTS:
   - Comprehensive analysis of all entries
   - Evolution and growth tracking
   - Hidden depths recognition
   - Unique qualities identification

The service now provides a truly transformative journaling experience! 🌟
*/
=======
export default {
  uploadJournalImage,
  extractTextFromImage,
  extractTextFromImages,
  analyzeJournalEntry,
  analyzeMultiPageJournalEntry,
  saveAnalysisResult,
  getPreviousEntries,
  getJournalEntry,
  getExtractedText,
  generateProgressReport,
  generateJourneyCompletion,
  uploadMultipleJournalImages
};
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
