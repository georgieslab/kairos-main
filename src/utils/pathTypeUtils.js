// src/utils/pathTypeUtils.js - Utility functions for determining path types

/**
 * Visual paths that focus on artistic creation and visual expression
 * These paths should have different upload UI and analysis approach
 */
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

/**
 * Paths that primarily require text extraction from handwritten journals
 * These are traditional journaling paths
 */
const TEXT_EXTRACTION_PATHS = [
  'self-discovery',
  'emotional-intelligence',
  'mindfulness-awareness',
  'transformation-journey',
  'creative-expression',
  'habit-formation',
  'life-vision',
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
 */
export const isVisualPath = (pathId) => {
  if (!pathId) return false;
  return VISUAL_PATHS.includes(pathId);
};

/**
 * Check if a path requires text extraction from handwritten content
 * @param {string} pathId - The journey path ID
 * @returns {boolean} - True if text extraction is needed
 */
export const requiresTextExtraction = (pathId) => {
  if (!pathId) return true; // Default to requiring text extraction
  
  // Visual paths don't require text extraction (though they can have optional notes)
  if (isVisualPath(pathId)) {
    return false;
  }
  
  // All other paths require text extraction
  return true;
};

/**
 * Get the appropriate upload instructions for a path
 * @param {string} pathId - The journey path ID
 * @returns {object} - Upload instructions object
 */
export const getUploadInstructions = (pathId) => {
  if (isVisualPath(pathId)) {
    return {
      title: 'Upload Your Artwork',
      dropText: 'Drag and drop your artwork here, or click to select files',
      selectButtonText: 'Select Artwork Files',
      stageTitle: 'Upload Your Visual Creation',
      analysisText: 'Your visual journal entry is ready to be analyzed.',
      analysisDescription: 'Claude will examine the artistic elements, colors, composition, and emotional expression in your',
      submitButtonText: 'Analyze Visual Entry',
      notesPlaceholder: 'Add any notes or reflections about your creative process, choices, or any reflections...',
      notesTitle: 'Optional: Add notes about your creation'
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
      notesTitle: 'Extracted Text'
    };
  }
};

/**
 * Get visual analysis instructions for a path - FIXED VERSION
 * @param {string} pathId - The journey path ID
 * @returns {object} - Analysis instructions object
 */
export const getVisualAnalysisInstructions = (pathId) => {
  const pathIsVisual = isVisualPath(pathId); // Fixed: renamed variable to avoid naming conflict
  
  if (pathIsVisual) {
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
 * Get the appropriate analysis approach for a path
 * @param {string} pathId - The journey path ID
 * @returns {string} - Analysis approach ('visual', 'text', or 'mixed')
 */
export const getAnalysisApproach = (pathId) => {
  if (isVisualPath(pathId)) {
    return 'visual'; // Focus on visual elements, colors, composition
  } else {
    return 'text'; // Focus on extracted text content
  }
};

/**
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
  }
};

/**
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
  getUploadInstructions,
  getVisualAnalysisInstructions,
  getAnalysisApproach,
  supportsMultiPage,
  getMaxPages,
  getAcceptedFileTypes,
  VISUAL_PATHS,
  TEXT_EXTRACTION_PATHS
};