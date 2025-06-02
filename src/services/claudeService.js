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
    // Validate inputs
    if (!file) {
      throw new Error('No file provided for upload');
    }
    
    if (!userId) {
      throw new Error('User ID is required for upload');
    }
    
    // Default options
    const defaultOptions = {
      keepImage: !SETTINGS.DELETE_IMAGES_AFTER_PROCESSING,
      privacyLevel: SETTINGS.DEFAULT_PRIVACY_LEVEL,
      isTemporary: true
    };
    
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
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        day: day.toString(),
        pathId: pathId,
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
  }
};

/**
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
    if (day > 1) {
      try {
        const userId = userProfile.uid;
        const previousEntries = await getPreviousEntries(userId, pathId);
        
        const priorEntries = previousEntries.filter(entry => entry.day < day && entry.day > 0);
        
        if (priorEntries.length > 0) {
          previousEntriesContext = `
            Previous journal insights:
            ${priorEntries.map(entry => `Day ${entry.day}: ${entry.analysis?.summary || 'No summary available'}`).join('\n')}
            
            Connect your analysis to these previous insights when appropriate.
          `;
        }
      } catch (error) {
        console.log('Could not retrieve previous entries:', error);
      }
    }
    
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
      
      const primaryFile = imageFiles[0];
      const { data: imageBase64, mediaType } = await fileToBase64(primaryFile);
      
      let textInstruction = isVisual 
        ? `Please analyze this visual journal entry and provide insights as described in your instructions. Focus on the artistic elements, composition, and emotional expression.`
        : `Please analyze this journal entry and provide insights as described in your instructions. This is a private journal and your analysis will only be seen by the person who created it.`;
      
      if (extractedText && isVisual) {
        textInstruction += `\n\nThe user has also provided these notes about their visual creation:\n${extractedText}`;
      }
      
      let multiPageNote = '';
      if (imageFiles.length > 1) {
        multiPageNote = `\nNote: This journal entry includes ${imageFiles.length} pages. I'm showing you the first page${isVisual ? '' : ', but have extracted text from all pages'}.`;
      }
      
      requestContent = [
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
          text: textInstruction + multiPageNote
        }
      ];
    } else if (imageUrl) {
      if (isVisual) {
        throw new Error('Visual journeys require image file objects to avoid CORS issues.');
      }
      
      const primaryImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
      
      console.log('Fetching and converting image to base64...');
      const imageBase64 = await fetchImageAsBase64(primaryImageUrl);
      
      requestContent = [
        {
          type: 'image',
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
      ];
    } else {
      throw new Error('No journal content provided for analysis.');
    }
    
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
    const data = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
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
  }
};

/**
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
    }
    
    const MAX_PAGES = 5;
    if (imageUrls.length > MAX_PAGES) {
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
    );
    
    result.pageCount = imageUrls.length;
    result.isMultiPage = true;
    
    return result;
  } catch (error) {
    console.error('Error analyzing multi-page journal entry:', error);
    throw new Error('Failed to analyze multi-page journal: ' + error.message);
  }
};

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
  }
};

/**
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
    return null;
  }
};

/**
 * Helper function to convert a file to base64 and detect correct mime type
 * @param {File} file - File to convert
 * @returns {Promise<{data: string, mediaType: string}>} - Base64 string and detected media type
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = reader.result;
        const mediaType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const base64Data = dataUrl.split(',')[1];
        resolve({
          data: base64Data,
          mediaType: mediaType
        });
      } catch (error) {
        reject(new Error('Failed to process image: ' + error.message));
      }
    };
    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error.message));
    };
    reader.readAsDataURL(file);
  });
}

/**
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
    'holistic-transformation': 'holisticTransformationProgress'
  };
  
  return fieldMap[pathId] || 'selfDiscoveryProgress';
}

/**
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