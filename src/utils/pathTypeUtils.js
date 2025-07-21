<<<<<<< HEAD
// Add to pathTypeUtils.js
const MULTI_MODAL_PATHS = [
  'inner-elements'
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

=======
// src/utils/pathTypeUtils.js - Utility functions for determining path types

/**
 * Visual paths that focus on artistic creation and visual expression
 * These paths should have different upload UI and analysis approach
 */
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
const VISUAL_PATHS = [
  'mindful-visualization',
  'artistic-soul-expression', 
  'color-psychology',
  'sacred-geometry',
  'nature-sketching',
  'abstract-emotions',
  'visual-storytelling',
  'ink-essence'
];

<<<<<<< HEAD
// Traditional Text-Based Journaling Paths - handwritten reflection
=======
/**
 * Paths that primarily require text extraction from handwritten journals
 * These are traditional journaling paths
 */
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
const TEXT_EXTRACTION_PATHS = [
  'self-discovery',
  'emotional-intelligence',
  'mindfulness-awareness',
  'transformation-journey',
  'creative-expression',
  'habit-formation',
  'life-vision',
<<<<<<< HEAD
  'life-values',
  'relationship-mastery',
  'financial-mindfulness',
  'gratitude-practice',
  'shadow-work',
  'nature-connection',
  'anxiety-alchemy',
  'courage-cultivation',
  'inner-child',
  'dream-decoder',
  'forgiveness-freedom',
  'career-compass',
  'transitions-navigator',
  'seasonal-rhythms',
  'grief-growth',
  'digital-detox',
  'holistic-transformation'
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
=======
  'gratitude-practice',
  'shadow-work',
  'nature-connection',
  'relationship-mastery',
  'financial-mindfulness',
  'career-compass',
  'inner-child',
  'anxiety-alchemy',
  'dream-decoder',
  'seasonal-rhythms',
  'forgiveness-freedom',
  'transitions-navigator',
  'digital-detox',
  'grief-growth',
  'courage-cultivation',
  'holistic-transformation',
  'life-values',
  
];

/**
 * Check if a path is primarily visual/artistic in nature
 * @param {string} pathId - The journey path ID
 * @returns {boolean} - True if this is a visual path
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
 */
export const isVisualPath = (pathId) => {
  if (!pathId) return false;
  return VISUAL_PATHS.includes(pathId);
};

/**
<<<<<<< HEAD
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
=======
 * Check if a path requires text extraction from handwritten content
 * @param {string} pathId - The journey path ID
 * @returns {boolean} - True if text extraction is needed
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
 */
export const requiresTextExtraction = (pathId) => {
  if (!pathId) return true; // Default to requiring text extraction
  
<<<<<<< HEAD
  // Visual and voice paths don't require text extraction (though they can have optional notes)
  if (isVisualPath(pathId) || isVoicePath(pathId)) {
=======
  // Visual paths don't require text extraction (though they can have optional notes)
  if (isVisualPath(pathId)) {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    return false;
  }
  
  // All other paths require text extraction
  return true;
};

/**
<<<<<<< HEAD
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
 * Get the appropriate upload instructions for a path
 */
export const getUploadInstructions = (pathId) => {
  if (isVoicePath(pathId)) {
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
  } else if (isVisualPath(pathId)) {
=======
 * Get the appropriate upload instructions for a path
 * @param {string} pathId - The journey path ID
 * @returns {object} - Upload instructions object
 */
export const getUploadInstructions = (pathId) => {
  if (isVisualPath(pathId)) {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    return {
      title: 'Upload Your Artwork',
      dropText: 'Drag and drop your artwork here, or click to select files',
      selectButtonText: 'Select Artwork Files',
      stageTitle: 'Upload Your Visual Creation',
      analysisText: 'Your visual journal entry is ready to be analyzed.',
      analysisDescription: 'Claude will examine the artistic elements, colors, composition, and emotional expression in your',
      submitButtonText: 'Analyze Visual Entry',
      notesPlaceholder: 'Add any notes or reflections about your creative process, choices, or any reflections...',
<<<<<<< HEAD
      notesTitle: 'Optional: Add notes about your creation',
      cameraButtonText: 'Take Photos of Artwork'
=======
      notesTitle: 'Optional: Add notes about your creation'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
      notesTitle: 'Extracted Text',
      cameraButtonText: 'Take Photos of Journal Pages'
=======
      notesTitle: 'Extracted Text'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    };
  }
};

/**
<<<<<<< HEAD
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
=======
 * Get visual analysis instructions for a path - FIXED VERSION
 * @param {string} pathId - The journey path ID
 * @returns {object} - Analysis instructions object
 */
export const getVisualAnalysisInstructions = (pathId) => {
  const pathIsVisual = isVisualPath(pathId); // Fixed: renamed variable to avoid naming conflict
  
  if (pathIsVisual) {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
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
=======
 * Get the appropriate analysis approach for a path
 * @param {string} pathId - The journey path ID
 * @returns {string} - Analysis approach ('visual', 'text', or 'mixed')
 */
export const getAnalysisApproach = (pathId) => {
  if (isVisualPath(pathId)) {
    return 'visual'; // Focus on visual elements, colors, composition
  } else {
    return 'text'; // Focus on extracted text content
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  }
};

/**
<<<<<<< HEAD
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
=======
 * Check if a path supports multi-page uploads
 * @param {string} pathId - The journey path ID  
 * @returns {boolean} - True if multi-page uploads are supported
 */
export const supportsMultiPage = (pathId) => {
  // Most paths support multi-page, but some visual paths might be single-image focused
  if (pathId === 'abstract-emotions') {
    return false; // Single abstract piece per entry
  }
  return true;
};

/**
 * Get the maximum number of pages/images allowed for a path
 * @param {string} pathId - The journey path ID
 * @returns {number} - Maximum pages allowed
 */
export const getMaxPages = (pathId) => {
  if (isVisualPath(pathId)) {
    // Visual paths might have different limits
    switch (pathId) {
      case 'visual-storytelling':
        return 10; // Stories might need more images
      case 'abstract-emotions':
        return 1; // Single emotional expression
      default:
        return 5; // Default for visual paths
    }
  } else {
    return 5; // Default for text-based journal paths
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  }
};

/**
<<<<<<< HEAD
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
  VOICE_PATHS
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
  requiresTextExtraction,
  getPathType,
  getAllVisualPaths,
  getAllTextExtractionPaths,
  getAllVoicePaths,
  getPathTypeCounts,
=======
 * Get appropriate file type restrictions for a path
 * @param {string} pathId - The journey path ID
 * @returns {string} - File accept string for input element
 */
export const getAcceptedFileTypes = (pathId) => {
  if (isVisualPath(pathId)) {
    // Visual paths might accept more image types
    return 'image/*';
  } else {
    // Text-based paths focus on photographed journal pages
    return 'image/jpeg,image/png,image/webp';
  }
};

export default {
  isVisualPath,
  requiresTextExtraction,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  getUploadInstructions,
  getVisualAnalysisInstructions,
  getAnalysisApproach,
  supportsMultiPage,
  getMaxPages,
  getAcceptedFileTypes,
<<<<<<< HEAD
  getPathTypeDescription,
  getPathTypeLabels,
  isSamePathType,
  VISUAL_PATHS,
  TEXT_EXTRACTION_PATHS,
  VOICE_PATHS,
  ALL_PATHS,
  PATH_TYPES
=======
  VISUAL_PATHS,
  TEXT_EXTRACTION_PATHS
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
};