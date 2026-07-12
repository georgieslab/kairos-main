// Add to pathTypeUtils.js
import { getJourneyPath } from '../data/JourneyData';

const MULTI_MODAL_PATHS = [
  'inner-elements',
  'shadow-light-integration',
  'life-chapters-trilogy',
  'sensory-spectrum',
  'emotion-color-sound'
];

export const isMultiModalPath = (pathId) => {
  return MULTI_MODAL_PATHS.includes(pathId);
};

export const getDayType = (pathId, day) => {
  if (isMultiModalPath(pathId)) {
    const pathData = getJourneyPath(pathId);
    const dayData = pathData?.days?.find(d => d.day === day);
    return dayData?.type || 'text';
  }
  
  // Fallback to path-level type for non-multi-modal paths
  return getPathType(pathId);
};

// Flex paths: the user chooses write, speak, or draw per day. Listed in
// VISUAL_PATHS below so getPathType()/isVisualPath() resolve to something
// sane by default (image upload, no text extraction) when no per-day
// override is available; the voice flow is reached by navigating straight
// to the voice-upload screen, which doesn't consult path type. Screens that
// call getUploadInstructions() with an explicit typeOverride (JournalUpload)
// correctly reflect the day's chosen medium — but getPathType() itself, and
// anything built only on top of it (getPathTypeLabels, getPathTypeDescription,
// requiresTextExtraction, getVisualAnalysisInstructions), has no override and
// will always report 'visual' for a flex path regardless of what the user
// picked that day. Nothing else in the app currently reads those for a flex
// path, but wire up a typeOverride there too before using them for one.
const FLEX_PATHS = [
  'kairos-moments'
];

export const isFlexPath = (pathId) => {
  return FLEX_PATHS.includes(pathId);
};

const VISUAL_PATHS = [
  'mindful-visualization',
  'artistic-soul-expression',
  'color-psychology',
  'sacred-geometry',
  'nature-sketching',
  'abstract-emotions',
  'visual-storytelling',
  'ink-essence',
  'kairos-moments' // flex: drawing branch of the voice-or-draw choice
];

// Traditional Text-Based Journaling Paths - handwritten reflection
const TEXT_EXTRACTION_PATHS = [
  'self-discovery',
  'emotional-intelligence',
  'mindfulness-awareness',
  'transformation-journey',
  'gratitude-practice',
  'shadow-work',
  'anxiety-alchemy',
  'nature-connection',
  'creative-expression',
  'life-values',
  'decision-compass',
  'dream-decoder',
  'inner-child',
  'courage-cultivation',
  'forgiveness-freedom',
  'career-compass',
  'financial-mindfulness',
  'transitions-navigator',
  'relationship-mastery',
  'grief-growth',
  'seasonal-rhythms',
  'manifestation-reality',
  'holistic-transformation',
  'life-vision',
  'habit-formation',
  'digital-detox',
  'freestyle-discovery',
  'letter-to-myself',
  'deciding-to-doing',
];

// Voice-Based Journaling Paths - spoken reflection
const VOICE_PATHS = [
  'voice-discovery',
  'spoken-emotions',
  'vocal-confidence',
  'storytelling-voice',
  'meditation-speaking'
];

/**
 * Check if a path is visual/artistic
 */
export const isVisualPath = (pathId) => {
  if (!pathId) return false;
  return VISUAL_PATHS.includes(pathId);
};

/**
 * Check if a path requires text extraction from handwritten pages
 */
export const isTextExtractionPath = (pathId) => {
  if (!pathId) return false;
  return TEXT_EXTRACTION_PATHS.includes(pathId);
};

/**
 * Check if a path is a writing/journaling path (alternative name for text extraction)
 */
export const isWritingPath = (pathId) => {
  return isTextExtractionPath(pathId);
};

/**
 * Check if a path is voice-based
 */
export const isVoicePath = (pathId) => {
  if (!pathId) return false;
  return VOICE_PATHS.includes(pathId);
};

/**
 * Check if a path requires text extraction from handwritten content
 */
export const requiresTextExtraction = (pathId) => {
  if (!pathId) return true; // Default to requiring text extraction
  
  // Visual and voice paths don't require text extraction (though they can have optional notes)
  if (isVisualPath(pathId) || isVoicePath(pathId)) {
    return false;
  }
  
  // All other paths require text extraction
  return true;
};

/**
 * Get the path type category
 */
export const getPathType = (pathId) => {
  if (isVoicePath(pathId)) {
    return 'voice';
  } else if (isVisualPath(pathId)) {
    return 'visual';
  } else {
    return 'writing';
  }
};

/**
 * Get all visual path IDs
 */
export const getAllVisualPaths = () => {
  return [...VISUAL_PATHS];
};

/**
 * Get all text extraction path IDs
 */
export const getAllTextExtractionPaths = () => {
  return [...TEXT_EXTRACTION_PATHS];
};

/**
 * Get all voice path IDs
 */
export const getAllVoicePaths = () => {
  return [...VOICE_PATHS];
};

/**
 * Get path counts by type
 */
export const getPathTypeCounts = (pathIds = []) => {
  const visual = pathIds.filter(id => isVisualPath(id)).length;
  const voice = pathIds.filter(id => isVoicePath(id)).length;
  const writing = pathIds.filter(id => isTextExtractionPath(id)).length;
  
  return {
    visual,
    voice,
    writing,
    total: visual + voice + writing
  };
};

/**
 * Get the appropriate upload instructions for a path.
 * `typeOverride` ('voice' | 'visual' | 'writing') lets flex paths pick the
 * instruction set per-day based on the user's chosen medium.
 */
export const getUploadInstructions = (pathId, typeOverride = null) => {
  if (typeOverride === 'voice' || (!typeOverride && isVoicePath(pathId))) {
    return {
      title: 'Record Your Voice Journal',
      dropText: 'Record your voice response to today\'s prompt',
      selectButtonText: 'Start Recording',
      stageTitle: 'Record Voice Entry',
      analysisText: 'Your voice recording is ready to be analyzed.',
      analysisDescription: 'Claude will analyze your spoken words, tone, and emotional expression.',
      submitButtonText: 'Analyze Voice Entry',
      notesPlaceholder: 'Add any additional notes about your recording...',
      notesTitle: 'Optional: Add notes about your voice entry',
      cameraButtonText: 'Start Voice Recording'
    };
  } else if (typeOverride === 'visual' || (!typeOverride && isVisualPath(pathId))) {
    return {
      title: 'Upload Your Artwork',
      dropText: 'Drag and drop your artwork here, or click to select files',
      selectButtonText: 'Select Artwork Files',
      stageTitle: 'Upload Your Visual Creation',
      analysisText: 'Your visual journal entry is ready to be analyzed.',
      analysisDescription: 'Claude will examine the artistic elements, colors, composition, and emotional expression in your',
      submitButtonText: 'Analyze Visual Entry',
      notesPlaceholder: 'Add any notes or reflections about your creative process, choices, or any reflections...',
      notesTitle: 'Optional: Add notes about your creation',
      cameraButtonText: 'Take Photos of Artwork'
    };
  } else {
    return {
      title: 'Upload Your Journal',
      dropText: 'Drag and drop your journal pages here, or click to select files',
      selectButtonText: 'Select Files',
      stageTitle: 'Upload Journal Pages',
      analysisText: 'Your images are ready to be processed.',
      analysisDescription: 'Click the button below to extract text from your journal pages.',
      submitButtonText: 'Submit Journal Entry',
      notesPlaceholder: 'You can edit the extracted text here or add your own notes...',
      notesTitle: 'Extracted Text',
      cameraButtonText: 'Take Photos of Journal Pages'
    };
  }
};

/**
 * Get visual analysis instructions for a path
 */
export const getVisualAnalysisInstructions = (pathId) => {
  const pathType = getPathType(pathId);
  
  if (pathType === 'voice') {
    return {
      type: 'voice',
      instructions: 'Focus on analyzing spoken content, vocal tone, emotional expression, and speech patterns.',
      analysisType: 'vocal'
    };
  } else if (pathType === 'visual') {
    return {
      type: 'visual',
      instructions: 'Focus on analyzing the visual elements, colors, composition, and artistic expression in the uploaded artwork.',
      analysisType: 'artistic'
    };
  } else {
    return {
      type: 'text', 
      instructions: 'Focus on extracting and analyzing the written text content from the journal entry.',
      analysisType: 'textual'
    };
  }
};

/**
 * Get appropriate file types for different path types
 */
export const getAcceptedFileTypes = (pathId) => {
  const pathType = getPathType(pathId);
  
  switch (pathType) {
    case 'voice':
      return 'audio/*';
    case 'visual':
      return 'image/*';
    case 'writing':
    default:
      return 'image/jpeg,image/png,image/webp';
  }
};

/**
 * Get analysis approach for a path
 */
export const getAnalysisApproach = (pathId) => {
  const pathType = getPathType(pathId);
  
  switch (pathType) {
    case 'voice':
      return 'voice'; // Focus on vocal analysis
    case 'visual':
      return 'visual'; // Focus on visual elements, colors, composition
    case 'writing':
    default:
      return 'text'; // Focus on extracted text content
  }
};

/**
 * Check if a path supports multiple file uploads
 */
export const supportsMultiPage = (pathId) => {
  const pathType = getPathType(pathId);
  
  // Voice paths typically use single recordings
  // Visual and text paths can support multiple files
  return pathType !== 'voice';
};

/**
 * Get maximum pages/files allowed for a path
 */
export const getMaxPages = (pathId) => {
  const pathType = getPathType(pathId);
  
  switch (pathType) {
    case 'voice':
      return 1; // Single voice recording per entry
    case 'visual':
      return 5; // Multiple artwork pieces
    case 'writing':
    default:
      return 5; // Multiple journal pages
  }
};

/**
 * Get user-friendly description for path type
 */
export const getPathTypeDescription = (pathId) => {
  const pathType = getPathType(pathId);
  
  switch (pathType) {
    case 'voice':
      return 'Voice journaling journey focusing on spoken reflection and vocal expression. Record your voice responses for AI analysis of speech patterns and emotional tone.';
    case 'visual':
      return 'Visual art journey focusing on creative expression through drawing, painting, and artistic exploration. Upload your artwork for AI analysis of colors, compositions, and artistic elements.';
    case 'writing':
    default:
      return 'Writing journey focusing on traditional handwritten reflection and personal growth. Upload your journal pages for AI analysis of handwriting patterns and text content.';
  }
};

/**
 * Get user-facing labels for different path types
 */
export const getPathTypeLabels = (pathId) => {
  const pathType = getPathType(pathId);
  
  switch (pathType) {
    case 'voice':
      return {
        uploadButton: 'Record Voice Entry',
        uploadInstructions: 'Speak your thoughts and reflections',
        processingText: 'Transcribing and analyzing your voice...',
        completedText: 'Voice entry analyzed'
      };
    case 'visual':
      return {
        uploadButton: 'Upload Artwork',
        uploadInstructions: 'Share your visual creation',
        processingText: 'Analyzing your artwork...',
        completedText: 'Artwork analyzed'
      };
    case 'writing':
    default:
      return {
        uploadButton: 'Upload Journal Pages',
        uploadInstructions: 'Take photos of your handwritten pages',
        processingText: 'Extracting text and analyzing...',
        completedText: 'Journal entry analyzed'
      };
  }
};

/**
 * Check if two paths are the same type
 */
export const isSamePathType = (pathId1, pathId2) => {
  const type1 = getPathType(pathId1);
  const type2 = getPathType(pathId2);
  return type1 === type2;
};

// Export path arrays for external use
export {
  VISUAL_PATHS,
  TEXT_EXTRACTION_PATHS,
  VOICE_PATHS,
  FLEX_PATHS
};

// Export all paths combined
export const ALL_PATHS = [
  ...TEXT_EXTRACTION_PATHS,
  ...VISUAL_PATHS,
  ...VOICE_PATHS
];

// Path type constants
export const PATH_TYPES = {
  TEXT: 'text',
  VISUAL: 'visual',
  VOICE: 'voice'
};

// Default export with all functions
export default {
  isVisualPath,
  isTextExtractionPath,
  isWritingPath,
  isVoicePath,
  isFlexPath,
  requiresTextExtraction,
  getPathType,
  getAllVisualPaths,
  getAllTextExtractionPaths,
  getAllVoicePaths,
  getPathTypeCounts,
  getUploadInstructions,
  getVisualAnalysisInstructions,
  getAnalysisApproach,
  supportsMultiPage,
  getMaxPages,
  getAcceptedFileTypes,
  getPathTypeDescription,
  getPathTypeLabels,
  isSamePathType,
  VISUAL_PATHS,
  TEXT_EXTRACTION_PATHS,
  VOICE_PATHS,
  ALL_PATHS,
  PATH_TYPES
};
