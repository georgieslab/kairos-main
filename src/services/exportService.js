// src/services/exportService.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getPreviousEntries, getJournalEntry } from './claudeService';
import { generateJourneyCompletion } from './claudeService';
// Import getJourneyPath from JourneyData
import { getJourneyPath } from '../data/JourneyData';

/**
 * Add Kairos logo to PDF
 * @param {jsPDF} pdf - PDF document
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {boolean} useCoverLogo - Whether to use the cover logo or standard logo
 */
const addKairosLogo = (pdf, x, y, width = 30, height = 10, useCoverLogo = false) => {
  try {
    // Define SVG data for both logos
    const coverLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 658.41 858.05"><defs><style>.cls-1{fill:none;}.cls-2{fill:#2b463c;}.cls-3{fill:#e6b89c;}.cls-4{fill:#558b6e;}.cls-5{clip-path:url(#clip-path);}.cls-6{fill:#f9dcc4;}</style><clipPath id="clip-path" transform="translate(0 0.36)"><rect id="SVGID" class="cls-1" x="115.37" width="393.23" height="575.64" rx="22.8"/></clipPath></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-2" d="M0,747.84q0-32.79,0-65.58c0-4.35.21-4.58,4.55-4.6q9.79,0,19.59,0c4.26,0,4.62.35,4.61,4.63,0,19.27.25,38.54-.28,57.8-.05,1.64-1,4.18.82,4.77,1.56.51,2.18-2.1,3.06-3.39,9.17-13.48,19.83-25.77,30.38-38.15,6.45-7.57,13-15.08,19.34-22.72a7.5,7.5,0,0,1,6.39-3c8.6.12,17.21,0,25.81.07,1.3,0,3-.5,3.72.84s-.92,2.38-1.74,3.34q-23,26.71-46.18,53.33c-2.19,2.5-2.29,4.25-.43,7q24.64,36,49,72.26c.64,1,2.06,1.88,1.28,3.2-.64,1.09-2.08.68-3.19.69-8.49,0-17-.1-25.49.06-3,0-4.71-1-6.29-3.49-11.7-18-23.53-35.85-35.32-53.76-2.2-3.33-2.69-3.31-5.38-.29-4.33,4.88-8.67,9.76-13.12,14.53a8.24,8.24,0,0,0-2.41,6.11c.08,10.67,0,21.34,0,32,0,4.66-.22,4.84-5,4.85-6.63,0-13.27-.1-19.9,0-3,.07-3.93-1.08-3.92-4,.09-22.17.05-44.34.05-66.52Z" transform="translate(0 0.36)"/><path class="cls-2" d="M324.53,807.34c0-14.71-.19-29.43.06-44.14a56.83,56.83,0,0,1,8.84-30.35c9.25-14.34,22.92-20.74,39.59-21.35a55.6,55.6,0,0,1,23.45,3.76c13.17,5.42,22.15,15,26.41,28.44,5.77,18.11,5.5,36.21-3.11,53.53-8.18,16.44-23.53,24.55-41.67,22.43-10-1.16-17.22-6.57-22.58-14.83-.54-.82-.85-2.37-2-2.1-1.44.33-.83,1.91-.83,2.95,0,15.65,0,31.29,0,46.94,0,4.87-.2,5-5.1,5-6,0-12,0-18,0-5.08,0-5.1,0-5.11-5.27q0-22.54,0-45.07Zm72.76-42.25a37.52,37.52,0,0,0-3.62-18.86c-3.7-7.57-9.62-12.05-18.35-12.06s-14.94,3.92-19,11.59c-2.82,5.27-3.81,11-4.1,16.75-.45,9,.58,17.85,5.71,25.62a20.16,20.16,0,0,0,34.46-.8C396.35,780.61,397.58,773.25,397.29,765.09Z" transform="translate(0 0.36)"/><path class="cls-2" d="M213.77,737.49c1.51-3.7,1.68-7.65,2.54-11.42.78-3.43,1.42-6.9,2-10.36.37-2.06,1.36-3,3.55-3,6.63.08,13.27.06,19.9,0,2.54,0,3.23,1,2.59,3.49-4,15.56-7.83,31.14-11.79,46.69a9.52,9.52,0,0,0,.07,5.16q6.49,23.19,12.86,46.41c.92,3.32.59,3.78-3,3.81-6.32.05-12.64-.08-19,.07-2.76.07-3.89-1.18-4.39-3.68-1.3-6.49-2.71-13-4.08-19.45-.13-.61-.2-1.23-.38-1.82s-.25-1.69-1.05-1.76c-1.15-.1-1,1.1-1.23,1.81-3.05,9-7.44,17.09-16,22.15s-17.71,5.56-27.11,4.55c-25-2.7-40.1-22-42.59-45.14-1.25-11.61-.66-23,3.93-33.89,7-16.68,19.48-26.63,37.64-29.1a52.16,52.16,0,0,1,21.25,1.17c10.82,3,17.65,10.35,21.88,20.44.48,1.15,1,2.29,1.49,3.41C213,737.19,213.28,737.24,213.77,737.49Zm-58.89,28.34a64.74,64.74,0,0,0,1.92,13.89c5.61,19.61,25.77,21.22,36.66,13.16,9-6.68,13.06-16.3,14.95-27a6.9,6.9,0,0,0-.23-2.77c-1.79-7.3-4.42-14.19-9.21-20.16-10.76-13.39-34.58-11.8-41.19,6.24A55.49,55.49,0,0,0,154.88,765.83Z" transform="translate(0 0.36)"/><path class="cls-2" d="M442,766.21c-.28-12.33,2.28-23.94,9.34-34.21,8.39-12.22,20.33-18.56,34.93-20.07,15.8-1.64,30.37,1.23,42.52,12.25,7.63,6.92,12.2,15.64,14.45,25.58,3.31,14.65,2.73,29.08-3.64,42.86-6.24,13.49-16.63,22.32-31.15,25.89-14.86,3.65-29.42,2.71-42.7-5.26-16.29-9.77-22.91-25.23-23.74-43.62C442,768.49,442,767.35,442,766.21Zm28.76,1.42a44.17,44.17,0,0,0,3.63,17.53c4.07,9,10.56,13.06,20.37,12.84,8-.17,15-5.41,18.23-13.76,4-10.08,4.15-20.42,1.92-30.87-1.19-5.58-3.48-10.69-7.77-14.59-10.5-9.55-27-5.43-32.94,8.16C471.61,752.94,470.81,759.28,470.8,767.63Z" transform="translate(0 0.36)"/><path class="cls-2" d="M655.07,833.38c0,3,0,6,0,9,0,2.07-1,3-3.06,3-5.81,0-11.61,0-17.42,0-2.23,0-3.2-1-3.19-3.22,0-3.83,0-7.67,0-11.5-.06-8.37-3.72-12.2-12.19-12.27-8.2-.08-16.36-.13-24.36-2.35a46.38,46.38,0,0,1-33.91-40.91c-1-10.77-.62-21.34,3.09-31.57,7.21-19.85,23.63-31.43,45.45-32.1,12.56-.38,24.33,2.14,34.55,9.92,7.38,5.61,11.89,13.1,14.2,22,.59,2.27-.1,3.24-2.35,3.64-6.93,1.25-13.84,2.61-20.76,4-1.66.33-2.52-.4-3.07-1.86a37.7,37.7,0,0,0-2.14-5.15,20.42,20.42,0,0,0-34.39-1.86,28.69,28.69,0,0,0-5.07,12.25c-1.68,9.92-2,19.81,2.26,29.28,3.67,8.23,10.15,12.31,19.14,12.33,6.63,0,13.24,0,19.75,1.72,14.68,3.78,23.46,14.9,23.52,30,0,1.87,0,3.73,0,5.6Z" transform="translate(0 0.36)"/><path class="cls-2" d="M264.48,755.32c0-12.63,0-25.27,0-37.9,0-4.54.21-4.73,4.74-4.74q9.48,0,19,0c4.47,0,4.79.32,4.79,4.77q0,32.94,0,65.87a55,55,0,0,0,.27,5.89c.6,5.51,3.09,7.63,8.63,7.51,4.89-.11,4.87-.11,5.86,4.8q1.26,6.24,2.65,12.46c.41,1.85-.13,2.93-2.08,3.41-9.48,2.32-18.93,2.36-28.16-.9-10.57-3.73-15-12.12-15.28-22.65-.37-12.83-.09-25.68-.09-38.52Z" transform="translate(0 0.36)"/><path class="cls-2" d="M493.71,699.17c-10.76,0-8.49.45-7.9-8.58.38-5.76,1.28-11.49,1.84-17.25.22-2.27,1.2-3.3,3.54-3.27,6.3.07,12.61,0,18.91,0,2.46,0,3.08.93,2.09,3.29-2.79,6.67-5.47,13.39-8.1,20.12-2.21,5.64-2.16,5.66-8.21,5.67Z" transform="translate(0 0.36)"/><rect class="cls-3" x="311.99" y="86.66" width="19.81" height="507.92" rx="6.02"/><rect class="cls-3" x="267.2" y="99.76" width="19.81" height="507.92" rx="6.02"/><rect class="cls-3" x="499.86" y="44.06" width="19.81" height="507.92" rx="6.02"/><rect class="cls-4" x="115.37" y="0.36" width="393.23" height="575.64" rx="22.8"/><g class="cls-5"><polygon class="cls-2" points="165.62 160.57 373.15 0 443.06 0 165.62 292.74 165.62 160.57"/><polygon class="cls-2" points="165.62 415.08 373.15 575.64 443.06 575.64 165.62 282.91 165.62 415.08"/><rect class="cls-2" x="115.37" y="0.73" width="54.62" height="574.92" rx="16.61"/></g><rect class="cls-6" x="269.11" y="249.32" width="85.75" height="85.75" rx="42.87"/></g></g></svg>`;
    
    const standardLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 658.41 187.61"><defs><style>.cls-1{fill:#2b463c;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M0,77.77Q0,45,0,12.19c0-4.35.21-4.58,4.55-4.6q9.79,0,19.59,0c4.26,0,4.62.35,4.61,4.63,0,19.27.25,38.54-.28,57.8-.05,1.64-1,4.18.82,4.77,1.56.51,2.18-2.09,3.06-3.39,9.17-13.48,19.83-25.77,30.38-38.15,6.45-7.57,13-15.08,19.34-22.72a7.53,7.53,0,0,1,6.39-3c8.6.13,17.21,0,25.81.07,1.3,0,3-.5,3.72.85s-.92,2.37-1.74,3.33q-23,26.72-46.18,53.33c-2.19,2.5-2.29,4.25-.43,7q24.64,36,49,72.27c.64.94,2.06,1.87,1.28,3.19-.64,1.09-2.08.68-3.19.69-8.49,0-17-.09-25.49.06A6.59,6.59,0,0,1,85,144.83c-11.7-18-23.53-35.86-35.32-53.77-2.2-3.33-2.69-3.31-5.38-.29-4.33,4.88-8.67,9.76-13.12,14.53a8.24,8.24,0,0,0-2.41,6.11c.08,10.67,0,21.34,0,32,0,4.66-.22,4.84-5,4.85-6.63,0-13.27-.1-19.9,0-3,.07-3.93-1.07-3.92-4C.09,122.12.05,100,.05,77.77Z"/><path class="cls-1" d="M324.53,137.27c0-14.71-.19-29.43.06-44.13a56.84,56.84,0,0,1,8.84-30.36c9.25-14.34,22.92-20.73,39.59-21.35a55.6,55.6,0,0,1,23.45,3.76c13.17,5.42,22.15,15.05,26.41,28.45,5.77,18.1,5.5,36.21-3.11,53.52-8.18,16.44-23.53,24.55-41.67,22.44-10-1.16-17.22-6.58-22.58-14.84-.54-.82-.85-2.37-2-2.1-1.44.33-.83,1.92-.83,3,0,15.65,0,31.29,0,46.94,0,4.87-.2,5-5.1,5.06h-18c-5.08,0-5.1,0-5.11-5.27q0-22.53,0-45.07ZM397.29,95a37.54,37.54,0,0,0-3.62-18.86c-3.7-7.57-9.62-12-18.35-12.06s-14.94,3.92-19,11.59c-2.82,5.27-3.81,11-4.1,16.75-.45,9,.58,17.85,5.71,25.62a20.16,20.16,0,0,0,34.46-.8C396.35,110.54,397.58,103.18,397.29,95Z"/><path class="cls-1" d="M213.77,67.42c1.51-3.7,1.68-7.65,2.54-11.42.78-3.43,1.42-6.89,2-10.36.37-2.06,1.36-3,3.55-3,6.63.08,13.27.06,19.9,0,2.54,0,3.23,1,2.59,3.49-4,15.55-7.83,31.13-11.79,46.68a9.52,9.52,0,0,0,.07,5.16q6.49,23.19,12.86,46.41c.92,3.33.59,3.79-3,3.81-6.32.06-12.64-.08-19,.07-2.76.07-3.89-1.18-4.39-3.68-1.3-6.49-2.71-13-4.08-19.45-.13-.61-.2-1.23-.38-1.82s-.25-1.69-1.05-1.76c-1.15-.1-1,1.1-1.23,1.81-3.05,9-7.44,17.09-16,22.15s-17.71,5.57-27.11,4.55c-25-2.69-40.1-22-42.59-45.14-1.25-11.61-.66-23,3.93-33.89,7-16.68,19.48-26.63,37.64-29.1a52.16,52.16,0,0,1,21.25,1.17c10.82,3,17.65,10.35,21.88,20.44.48,1.15,1,2.29,1.49,3.42C213,67.12,213.28,67.17,213.77,67.42ZM154.88,95.77a64.65,64.65,0,0,0,1.92,13.88c5.61,19.62,25.77,21.22,36.66,13.16,9-6.68,13.06-16.3,14.95-27a6.93,6.93,0,0,0-.23-2.78c-1.79-7.3-4.42-14.19-9.21-20.15-10.76-13.4-34.58-11.8-41.19,6.23A55.5,55.5,0,0,0,154.88,95.77Z"/><path class="cls-1" d="M442,96.14c-.28-12.33,2.28-23.94,9.34-34.21,8.39-12.22,20.33-18.56,34.93-20.07,15.8-1.64,30.37,1.23,42.52,12.25C536.46,61,541,69.75,543.28,79.69c3.31,14.65,2.73,29.08-3.64,42.87C533.4,136,523,144.88,508.49,148.44c-14.86,3.66-29.42,2.71-42.7-5.26-16.29-9.77-22.91-25.23-23.74-43.62C442,98.42,442,97.28,442,96.14Zm28.76,1.42a44.17,44.17,0,0,0,3.63,17.53c4.07,9,10.56,13.06,20.37,12.85,8-.18,15-5.42,18.23-13.77,4-10.08,4.15-20.42,1.92-30.87-1.19-5.58-3.48-10.68-7.77-14.58-10.5-9.56-27-5.44-32.94,8.16C471.61,82.87,470.81,89.22,470.8,97.56Z"/><path class="cls-1" d="M655.07,163.31c0,3,0,6,0,9,0,2.06-1,3-3.06,3-5.81,0-11.61,0-17.42,0-2.23,0-3.2-1.05-3.19-3.22,0-3.83,0-7.67,0-11.5-.06-8.37-3.72-12.19-12.19-12.27-8.2-.08-16.36-.13-24.36-2.35a46.38,46.38,0,0,1-33.91-40.91c-1-10.76-.62-21.33,3.09-31.57,7.21-19.85,23.63-31.43,45.45-32.09,12.56-.39,24.33,2.13,34.55,9.91,7.38,5.61,11.89,13.11,14.2,22,.59,2.26-.1,3.23-2.35,3.63-6.93,1.26-13.84,2.61-20.76,4-1.66.33-2.52-.4-3.07-1.85A37.83,37.83,0,0,0,629.89,74a20.42,20.42,0,0,0-34.39-1.86,28.69,28.69,0,0,0-5.07,12.25c-1.68,9.92-2,19.81,2.26,29.28,3.67,8.24,10.15,12.31,19.14,12.34,6.63,0,13.24,0,19.75,1.71,14.68,3.79,23.46,14.91,23.52,30,0,1.87,0,3.73,0,5.6Z"/><path class="cls-1" d="M264.48,85.25c0-12.63,0-25.27,0-37.9,0-4.54.21-4.73,4.74-4.74q9.48,0,19,0c4.47,0,4.79.33,4.79,4.77q0,32.94,0,65.88a55.16,55.16,0,0,0,.27,5.89c.6,5.5,3.09,7.62,8.63,7.5,4.89-.11,4.87-.1,5.86,4.8q1.26,6.24,2.65,12.46c.41,1.86-.13,2.93-2.08,3.41-9.48,2.32-18.93,2.36-28.16-.9-10.57-3.72-15-12.12-15.28-22.65-.37-12.83-.09-25.68-.09-38.52Z"/><path class="cls-1" d="M493.71,29.1c-10.76,0-8.49.46-7.9-8.57.38-5.77,1.28-11.5,1.84-17.25C487.87,1,488.85,0,491.19,0c6.3.07,12.61,0,18.91,0,2.46,0,3.08.93,2.09,3.29-2.79,6.67-5.47,13.39-8.1,20.12-2.21,5.65-2.16,5.67-8.21,5.67Z"/></g></g></svg>`;
    
    // Choose the appropriate SVG data based on the useCoverLogo flag
    const svgData = useCoverLogo ? coverLogoSvg : standardLogoSvg;
    
    // Convert the SVG to a data URL format
    const svgEncoded = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    
    // Add the SVG as an image
    pdf.addImage(svgEncoded, 'SVG', x, y, width, height);
  } catch (error) {
    console.warn('SVG rendering failed:', error);
    
    // Fall back to text if SVG fails
    pdf.setTextColor(16, 185, 129); // #10B981 emerald-500
    pdf.setFontSize(14);
    pdf.text('Kairos', x + width/2, y + height/2, { align: 'center' });
  }
};

/**
 * Sets up PDF with basic configuration, avoiding external font loading
 */
const setupPDF = (pdf) => {
  // Use default fonts only
  pdf.setFont('helvetica');
};


/**
 * Generate a PDF export of a completed journey with enhanced error handling and progress reporting
 * @param {string} userId - User ID
 * @param {string} pathId - Journey path ID
 * @param {Object} userProfile - User profile data
 * @param {Object} options - Export options
 * @param {Function} onProgress - Optional callback for progress updates
 * @param {Object} forcedCompletionData - Optional completion data to use instead of fetching
 * @returns {Promise<Blob>} - PDF file as Blob
 */
export const exportJourneyToPDF = async (
  userId, 
  pathId, 
  userProfile, 
  options = {}, 
  onProgress = null,
  forcedCompletionData = null
) => {
  try {
    // Report initial progress
    if (onProgress) onProgress({ stage: 'initializing', progress: 0 });
    
    // Default options
    const defaultOptions = {
      includeImages: false,  // Whether to include journal images
      includeFullText: true, // Whether to include full journal text
      includeAnalysis: true, // Whether to include AI analysis
      quality: 'high',       // PDF quality (low, medium, high)
      colorMode: 'color'     // Color mode (color, grayscale)
    };
    
    // Merge options
    const exportOptions = { ...defaultOptions, ...options };
    
    // Progress update
    if (onProgress) onProgress({ stage: 'fetching', progress: 10 });
    
    // Get all journal entries for this path with proper error handling
    let entries;
    try {
      entries = await getPreviousEntries(userId, pathId);
      
      // Validate entries
      if (!entries || entries.length === 0) {
        throw new Error('No journal entries found for this journey');
      }
    } catch (fetchError) {
      console.error('Error fetching journal entries:', fetchError);
      throw new Error(`Failed to retrieve journal entries: ${fetchError.message}`);
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'analyzing', progress: 20 });
    
    // Get journey completion analysis if it exists or use provided data
    let completionAnalysis;
    
    // If forced completion data is provided, use it
    if (forcedCompletionData) {
      console.log("Using provided completion data for PDF export");
      completionAnalysis = forcedCompletionData;
    } else {
      // Try to get or generate completion data with better error handling
      try {
        console.log("Generating completion data for PDF export");
        completionAnalysis = await generateJourneyCompletion(userId, entries, pathId);
        console.log("Generated completion data:", completionAnalysis);
        
        // Validate the generated data
        if (!completionAnalysis || 
            !completionAnalysis.journeyOverview || 
            !completionAnalysis.keyThemes || 
            !Array.isArray(completionAnalysis.keyThemes)) {
          
          console.warn("Incomplete completion data, filling with defaults");
          // Fill in missing data with defaults
          completionAnalysis = {
            ...completionAnalysis,
            journeyOverview: completionAnalysis?.journeyOverview || `You've successfully completed your journey on ${getPathInfo(pathId).name}!`,
            growthNarrative: completionAnalysis?.growthNarrative || "Your entries show progression in self-awareness and reflection skills.",
            keyThemes: Array.isArray(completionAnalysis?.keyThemes) ? completionAnalysis.keyThemes : ["Self-awareness", "Reflection", "Growth"],
            personalStrengths: Array.isArray(completionAnalysis?.personalStrengths) ? completionAnalysis.personalStrengths : ["Commitment to journaling", "Willingness to explore"],
            growthOpportunities: Array.isArray(completionAnalysis?.growthOpportunities) ? completionAnalysis.growthOpportunities : ["Continue developing your journaling practice"],
            meaningfulAffirmation: completionAnalysis?.meaningfulAffirmation || "Your dedication to self-reflection is creating meaningful change in your life.",
            nextSteps: completionAnalysis?.nextSteps || "Continue your journaling practice with new prompts or explore our other journaling paths."
          };
        }
      } catch (analysisError) {
        console.warn('Could not generate journey completion analysis:', analysisError);
        // Create default completion analysis if generation fails
        completionAnalysis = {
          journeyOverview: `You've successfully completed your journey on ${getPathInfo(pathId).name}!`,
          growthNarrative: "Your entries show progression in self-awareness and reflection skills.",
          keyThemes: ["Self-awareness", "Reflection", "Growth"],
          personalStrengths: ["Commitment to journaling", "Willingness to explore"],
          growthOpportunities: ["Continue developing your journaling practice"],
          meaningfulAffirmation: "Your dedication to self-reflection is creating meaningful change in your life.",
          nextSteps: "Continue your journaling practice with new prompts or explore our other journaling paths."
        };
      }
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'creating', progress: 30 });
    
    // Create new PDF document with error handling
    let pdf;
    try {
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Setup PDF with default fonts
      setupPDF(pdf);
      
    } catch (pdfError) {
      console.error('Error creating PDF document:', pdfError);
      throw new Error(`Could not initialize PDF document: ${pdfError.message}`);
    }
    
    // Get path info
    const pathInfo = getPathInfo(pathId);
    const pathName = pathInfo.name;
    
    // Set font sizes based on quality
    const fontSize = exportOptions.quality === 'high' ? 12 : 10;
    const headerSize = exportOptions.quality === 'high' ? 18 : 16;
    const subHeaderSize = exportOptions.quality === 'high' ? 14 : 12;
    
    // Progress update
    if (onProgress) onProgress({ stage: 'branding', progress: 40 });
    
    // Add Καιρός branding
    try {
      addBranding(pdf, pathName, userProfile);
    } catch (brandingError) {
      console.error('Error adding branding to PDF:', brandingError);
      // Non-fatal, continue with the PDF
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'overview', progress: 50 });
    
    // Add journey overview
    try {
      addJourneyOverview(pdf, pathName, completionAnalysis, userProfile, headerSize, subHeaderSize, fontSize);
    } catch (overviewError) {
      console.error('Error adding journey overview to PDF:', overviewError);
      // Non-fatal, continue with the PDF
    }
    
    // Create page header/footer
    try {
      createHeadersAndFooters(pdf, pathName);
    } catch (headerError) {
      console.error('Error adding headers/footers to PDF:', headerError);
      // Non-fatal, continue with the PDF
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'entries', progress: 60 });
    
    // Add entries with chunking to avoid memory issues
    try {
      // Process entries in chunks of 5 to avoid memory issues
      const chunkSize = 5;
      const entryChunks = [];
      
      for (let i = 0; i < entries.length; i += chunkSize) {
        entryChunks.push(entries.slice(i, i + chunkSize));
      }
      
      for (let i = 0; i < entryChunks.length; i++) {
        await addJournalEntries(
          pdf, 
          entryChunks[i], 
          exportOptions, 
          userId, 
          headerSize, 
          subHeaderSize, 
          fontSize
        );
        
        // Update progress for each chunk
        if (onProgress) {
          const chunkProgress = 60 + Math.floor((i / entryChunks.length) * 20);
          onProgress({ stage: 'entries', progress: chunkProgress });
        }
      }
    } catch (entriesError) {
      console.error('Error adding journal entries to PDF:', entriesError);
      throw new Error(`Failed to add journal entries to PDF: ${entriesError.message}`);
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'insights', progress: 80 });
    
    // Always add completion insights - this fixes the missing insights problem
    try {
      console.log("Adding completion insights to PDF:", completionAnalysis);
      // Always add completion section, even if potentially incomplete
      addCompletionInsights(pdf, completionAnalysis, headerSize, subHeaderSize, fontSize);
    } catch (insightsError) {
      console.error('Error adding completion insights to PDF:', insightsError);
      // Continue anyway, but log for debugging
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'finalizing', progress: 90 });
    
    // Add final page with Καιρός information
    try {
      addFinalPage(pdf, pathName);
    } catch (finalPageError) {
      console.error('Error adding final page to PDF:', finalPageError);
      // Non-fatal, continue with the PDF
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'exporting', progress: 95 });
    
    // Generate PDF blob with error handling
    let pdfBlob;
    try {
      pdfBlob = pdf.output('blob');
    } catch (outputError) {
      console.error('Error generating PDF output:', outputError);
      throw new Error(`Failed to generate PDF file: ${outputError.message}`);
    }
    
    // Final progress update
    if (onProgress) onProgress({ stage: 'complete', progress: 100 });
    
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF export:', error);
    // Re-throw with a more descriptive message
    throw new Error(`PDF export failed: ${error.message}`);
  }
};

const addBranding = (pdf, pathName, userProfile) => {
  // Add cover page
  pdf.setFillColor(43, 70, 60); // Dark green background
  pdf.rect(0, 0, 210, 297, 'F');
  
  // Add Kairos logo with cover logo variant
  addKairosLogo(pdf, 65, 80, 80, 100, true); // Use cover logo and make it larger
  
  // Add subtitle
  pdf.setTextColor(230, 184, 156); // Terracotta color for subtitle
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Smart Journal', 105, 180, { align: 'center' }); // Adjusted position
  
  // Add journey name
  pdf.setTextColor(255, 255, 255); // White for journey name
  pdf.setFontSize(20);
  pdf.text(pathName, 105, 200, { align: 'center' }); // Adjusted position
  
  // Add user name
  const userName = userProfile?.displayName || 'Journal';
  pdf.setFontSize(14);
  pdf.text(`${userName}'s Journey`, 105, 220, { align: 'center' }); // Adjusted position
  
  // Add date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.setFontSize(12);
  pdf.text(`Generated on ${dateStr}`, 105, 240, { align: 'center' }); // Adjusted position
  
  // Add motto at bottom
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200); // Light gray
  pdf.text('"The unexamined life is not worth living." - Socrates', 105, 270, { align: 'center' });
  
  // Add new page after cover
  pdf.addPage();
};

// This fixes the issue in createHeadersAndFooters where we previously had encoding problems
const createHeadersAndFooters = (pdf, pathName) => {
  const pageCount = pdf.internal.getNumberOfPages();
  
  // Skip the first page (cover) and second page (overview)
  for (let i = 3; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Header
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100); // Gray for header/footer
    
    // Use logo instead of text for the header - use standard logo
    addKairosLogo(pdf, 15, 7, 15, 5, false); // Use standard logo
    pdf.text(`- ${pathName}`, 32, 10);
    
    // Footer
    pdf.text(`Page ${i}`, 105, 287, { align: 'center' });
    pdf.text('© 2025 Kairos', 190, 287, { align: 'right' });
  }
};

/**
 * Get a user-friendly path name and data based on pathId
 * @param {string} pathId - Journey path ID
 * @returns {Object} - Path information including name and description
 */
const getPathInfo = (pathId) => {
  // Try to get path data from the central registry
  try {
    const pathData = getJourneyPath(pathId);
    
    if (pathData) {
      return {
        name: pathData.title,
        description: pathData.description || getDefaultPathDescription(pathId),
        duration: pathData.duration || 10,
        color: pathData.color || '43, 70, 60', // Default green color
        iconName: pathData.iconName || 'Book'
      };
    }
  } catch (error) {
    console.warn(`Could not retrieve path data for ${pathId} from registry:`, error);
    // Fall back to hardcoded values on error
  }
  
  // Fallback to hardcoded values if registry lookup fails
  return {
    name: getDefaultPathName(pathId),
    description: getDefaultPathDescription(pathId),
    duration: getDefaultPathDuration(pathId),
    color: '43, 70, 60', // Default green color
    iconName: 'Book'
  };
};

/**
 * Get a default path name based on pathId (fallback function)
 * @param {string} pathId - Journey path ID
 * @returns {string} - Path name
 */
const getDefaultPathName = (pathId) => {
  const pathNames = {
    'self-discovery': 'Self-Discovery Journey',
    'emotional-intelligence': 'Emotional Intelligence Expedition',
    'mindfulness-awareness': 'Mindfulness & Present Awareness',
    'transformation-journey': 'Transformation Journey: Breaking Patterns',
    'creative-expression': 'Creative Expression',
    'habit-formation': 'Habit Formation',
    'life-vision': 'Life Vision & Purpose',
    'life-values': 'Life Values & Core Principles',
  'relationship-mastery': 'Relationship Mastery',
  'artistic-soul-expression': 'Artistic Soul Expression', 
  'financial-mindfulness': 'Financial Mindfulness',
  'holistic-transformation': 'Holistic Transformation',
   'career-compass': 'Career Compass',
    'inner-child': 'Inner Child Healing',
    'anxiety-alchemy': 'Anxiety Alchemy', 
    'dream-decoder': 'Dream Journal Decoder',
    'seasonal-rhythms': 'Seasonal Soul Rhythms',
    'forgiveness-freedom': 'Forgiveness Freedom',
    'transitions-navigator': 'Life Transitions Navigator',
    'digital-detox': 'Digital Detox Reflection',
    'grief-growth': 'Grief & Growth',
    'courage-cultivation': 'Courage Cultivation'

  };
  
  return pathNames[pathId] || 'Καιρός Journey';
};

/**
 * Get default duration for a path (fallback function)
 * @param {string} pathId - Journey path ID
 * @returns {number} - Default duration
 */
const getDefaultPathDuration = (pathId) => {
  const durations = {
    'self-discovery': 10,
    'emotional-intelligence': 10,
    'mindfulness-awareness': 10,
    'transformation-journey': 21,
    'creative-expression': 14,
    'habit-formation': 30,
    'life-vision': 100,
    'artistic-soul-expression': 14,
    'life-values': 22,
  'relationship-mastery': 30,
  'financial-mindfulness': 21,
  'gratitude-practice': 10,
  'shadow-work': 10,
  'nature-connection': 10,
  'holistic-transformation': 100,
   'career-compass': 21,
    'inner-child': 14,
    'anxiety-alchemy': 10,
    'dream-decoder': 14,
    'seasonal-rhythms': 28,
    'forgiveness-freedom': 17,
    'transitions-navigator': 21,
    'digital-detox': 7,
    'grief-growth': 30,
    'courage-cultivation': 12


  };
  
  return durations[pathId] || 10;
};

/**
 * Get a default path description (fallback function)
 * @param {string} pathId - Journey path ID
 * @returns {string} - Path description
 */
const getDefaultPathDescription = (pathId) => {
  const descriptions = {
    'self-discovery': 'A 10-day path focused on exploring your core values, beliefs, and personal narrative. This journey helps identify authentic strengths and growth areas, developing a clearer sense of your personal identity.',
    'emotional-intelligence': 'A 10-day journey focused on building awareness of emotional patterns, developing vocabulary for nuanced feelings, and creating strategies for emotional regulation.',
    'mindfulness-awareness': 'A 10-day path cultivating attention to the present moment, reducing rumination and future anxiety, and enhancing appreciation and gratitude.',
    'transformation-journey': 'A 21-day comprehensive journey designed to identify and transform limiting patterns. This path supports personal growth through sustained reflection and action.',
    'creative-expression': 'A 14-day journey for developing your artistic practice and overcoming creative blocks.',
    'habit-formation': 'A 30-day path designed to establish lasting behavior changes through consistent daily practice.',
    'life-vision': 'A 100-day comprehensive life planning journey divided into 10 thematic sections.',
    'artistic-soul-expression': 'Discover your unique artistic voice through stream-of-consciousness creation, emotional healing through art, and intuitive expression that bypasses the analytical mind.', 
    'life-values': 'A 22-day journey to clarify your core values and learn to align your daily choices with what matters most for a more authentic and purposeful life.',
  'relationship-mastery': 'A 30-day path to develop deeper connections through communication, empathy, and boundary-setting practices for healthier relationships.',
  'financial-mindfulness': 'A 21-day journey to transform your relationship with money by examining beliefs, patterns, and developing a mindful approach to resources and wealth.',
 'gratitude-practice': 'A 10-day journey focused on cultivating a practice of gratitude to enhance wellbeing and shift perspective toward appreciation and abundance.',
  'shadow-work': 'A 10-day exploration of the hidden aspects of your psyche to integrate disowned parts of yourself and move toward greater wholeness.',
  'nature-connection': 'A 10-day journey to deepen your relationship with the natural world through mindful observation and sensory exploration.',
  'holistic-transformation': 'A 100-day comprehensive journey integrating mind, body, emotions, habits, relationships, purpose, and resilience through 10 powerful modules for complete personal transformation.',
  'career-compass': 'Navigate career transitions, clarify professional goals, and align your work with your deeper purpose and values through strategic self-reflection.',
    'inner-child': 'Reconnect with your inner child to heal old wounds, reclaim lost gifts, and integrate childhood wisdom into your adult life.',
    'anxiety-alchemy': 'Transform anxiety from an enemy into a messenger, learning to work with worry as a pathway to wisdom and growth.',
    'dream-decoder': 'Unlock the wisdom of your dreams through systematic recording, analysis, and interpretation of your nighttime messages.',
    'seasonal-rhythms': 'Align your inner seasons with nature\'s cycles, learning to honor your natural rhythms and seasonal energy patterns.',

  };
  
  return descriptions[pathId] || 'A guided journaling experience that supports personal reflection and growth.';
};

/**
 * Add journey overview section
 * @param {jsPDF} pdf - PDF document
 * @param {string} pathName - Journey path name
 * @param {Object} completionAnalysis - Journey completion analysis
 * @param {Object} userProfile - User profile data
 * @param {number} headerSize - Header font size
 * @param {number} subHeaderSize - Subheader font size
 * @param {number} fontSize - Body font size
 */
const addJourneyOverview = (pdf, pathName, completionAnalysis, userProfile, headerSize, subHeaderSize, fontSize) => {
  // Add title
  pdf.setTextColor(43, 70, 60); // Dark green for headers
  pdf.setFontSize(headerSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${pathName}: Journey Overview`, 20, 20);
  
  // Add horizontal line
  pdf.setDrawColor(85, 139, 110); // lighter green for line
  pdf.setLineWidth(0.5);
  pdf.line(20, 25, 190, 25);
  
  // Set text color for body
  pdf.setTextColor(0, 0, 0); // Black for body text
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add journey description
  let yPos = 35;
  const journeyDescriptions = {
    'Self-Discovery Journey': 'A 10-day path focused on exploring your core values, beliefs, and personal narrative. This journey helps identify authentic strengths and growth areas, developing a clearer sense of your personal identity.',
    'Emotional Intelligence Expedition': 'A 10-day journey focused on building awareness of emotional patterns, developing vocabulary for nuanced feelings, and creating strategies for emotional regulation.',
    'Mindfulness & Present Awareness': 'A 10-day path cultivating attention to the present moment, reducing rumination and future anxiety, and enhancing appreciation and gratitude.',
    'Transformation Journey: Breaking Patterns': 'A 21-day comprehensive journey designed to identify and transform limiting patterns. This path supports personal growth through sustained reflection and action.',
    'Creative Expression': 'A 14-day journey for developing your artistic practice and overcoming creative blocks.',
    'Habit Formation': 'A 30-day path designed to establish lasting behavior changes through consistent daily practice.',
    'Life Vision & Purpose': 'A 100-day comprehensive life planning journey divided into 10 thematic sections.',
    'life-values': 'A 22-day journey to clarify your core values and learn to align your daily choices with what matters most for a more authentic and purposeful life.',
  'relationship-mastery': 'A 30-day path to develop deeper connections through communication, empathy, and boundary-setting practices for healthier relationships.',
  'artistic-soul-expression': 'Discover your unique artistic voice through stream-of-consciousness creation, emotional healing through art, and intuitive expression that bypasses the analytical mind.', 
  'financial-mindfulness': 'A 21-day journey to transform your relationship with money by examining beliefs, patterns, and developing a mindful approach to resources and wealth.',
   'gratitude-practice': 'A 10-day journey focused on cultivating a practice of gratitude to enhance wellbeing and shift perspective toward appreciation and abundance.',
  'shadow-work': 'A 10-day exploration of the hidden aspects of your psyche to integrate disowned parts of yourself and move toward greater wholeness.',
  'nature-connection': 'A 10-day journey to deepen your relationship with the natural world through mindful observation and sensory exploration.',
  'holistic-transformation': 'A 100-day comprehensive journey integrating mind, body, emotions, habits, relationships, purpose, and resilience through 10 powerful modules for complete personal transformation.'
  };
  
  // Add description based on path
  const description = journeyDescriptions[pathName] || 'A Καιρός guided journaling experience that supports personal reflection and growth.';
  
  // Split text to fit page width with word wrap
  const textLines = pdf.splitTextToSize(description, 170);
  pdf.text(textLines, 20, yPos);
  yPos += 10 * (textLines.length);
  
  // Add completion analysis overview if available
  if (completionAnalysis && completionAnalysis.journeyOverview) {
    yPos += 10;
    pdf.setFontSize(subHeaderSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(43, 70, 60);
    pdf.text('Your Journey Summary', 20, yPos);
    yPos += 8;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    
    const overviewLines = pdf.splitTextToSize(completionAnalysis.journeyOverview, 170);
    pdf.text(overviewLines, 20, yPos);
    yPos += 10 * (overviewLines.length);
  }
  
  // Add completion date
  yPos += 10;
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.setFontSize(fontSize);
  pdf.text(`Journey completed on: ${dateStr}`, 20, yPos);
  
  // Add new page
  pdf.addPage();
};

/**
 * Add journal entries to the PDF
 * @param {jsPDF} pdf - PDF document
 * @param {Array} entries - Journal entries
 * @param {Object} options - Export options
 * @param {string} userId - User ID
 * @param {number} headerSize - Header font size
 * @param {number} subHeaderSize - Subheader font size
 * @param {number} fontSize - Body font size
 */
const addJournalEntries = async (pdf, entries, options, userId, headerSize, subHeaderSize, fontSize) => {
  // Sort entries by day
  entries.sort((a, b) => a.day - b.day);
  
  // Process each entry
  for (const entry of entries) {
    // Add entry header
    pdf.setTextColor(43, 70, 60); // Dark green for headers
    pdf.setFontSize(headerSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Day ${entry.day}: ${entry.theme || 'Reflection'}`, 20, 20);
    
    // Add horizontal line
    pdf.setDrawColor(85, 139, 110); // lighter green for line
    pdf.setLineWidth(0.5);
    pdf.line(20, 25, 190, 25);
    
    let yPos = 35;
    
    // Add prompt
    if (entry.prompt) {
      pdf.setTextColor(230, 184, 156); // Terracotta for prompt
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'italic');
      
      const promptLines = pdf.splitTextToSize(`Prompt: ${entry.prompt}`, 170);
      pdf.text(promptLines, 20, yPos);
      yPos += 8 * (promptLines.length);
    }
    
    // Add extracted text if requested
    if (options.includeFullText && entry.extractedText) {
      yPos += 10;
      pdf.setTextColor(0, 0, 0); // Black for entry text
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      
      const textLines = pdf.splitTextToSize(entry.extractedText, 170);
      
      // Check if we need a new page
      if (yPos + (textLines.length * 5) > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(textLines, 20, yPos);
      yPos += 5 * (textLines.length);
    }
    
    // Add journal image if requested and available
    if (options.includeImages && entry.imageUrl) {
      try {
        yPos += 10;
        
        // Check if we need a new page
        if (yPos + 80 > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        try {
          // Fetch the image as data URL
          const img = await fetchImageAsDataURL(entry.imageUrl);
          
          // Get image dimensions
          const imgDimensions = await getImageDimensions(img);
          
          // Calculate scaled dimensions (max width 160mm)
          const maxWidth = 160;
          const aspectRatio = imgDimensions.width / imgDimensions.height;
          const width = Math.min(maxWidth, aspectRatio * 70);
          const height = width / aspectRatio;
          
          // Add image to PDF
          pdf.addImage(img, 'JPEG', 20, yPos, width, height);
          
          yPos += height + 10;
        } catch (imgError) {
          // Fallback to placeholder if image loading fails
          console.warn(`Failed to load image for day ${entry.day}:`, imgError);
          
          // Add placeholder instead
          pdf.setFillColor(240, 240, 240);
          pdf.rect(20, yPos, 170, 60, 'F');
          pdf.setTextColor(150, 150, 150);
          pdf.setFontSize(10);
          pdf.text('Journal Image', 105, yPos + 30, { align: 'center' });
          
          yPos += 65;
        }
      } catch (error) {
        console.warn(`Could not add image for day ${entry.day}:`, error);
      }
    }
    
    // Add analysis if requested
    if (options.includeAnalysis && entry.analysis) {
      yPos += 10;
      
      // Check if we need a new page
      if (yPos + 50 > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setTextColor(43, 70, 60);
      pdf.setFontSize(subHeaderSize);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Insights', 20, yPos);
      yPos += 8;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      
      // Add summary
      if (entry.analysis.summary) {
        const summaryLines = pdf.splitTextToSize(entry.analysis.summary, 170);
        pdf.text(summaryLines, 20, yPos);
        yPos += 6 * (summaryLines.length);
      }
      
      // Add insights as bullet points
      if (entry.analysis.insights && entry.analysis.insights.length > 0) {
        yPos += 5;
        
        for (const insight of entry.analysis.insights) {
          // Check if we need a new page
          if (yPos + 10 > 270) {
            pdf.addPage();
            yPos = 20;
          }
          
          const bulletLines = pdf.splitTextToSize(`• ${insight}`, 165);
          pdf.text(bulletLines, 25, yPos);
          yPos += 6 * (bulletLines.length);
        }
      }
    }
    
    // Add new page for next entry
    pdf.addPage();
  }
};

/**
 * Add completion insights to the PDF with improved rendering and error handling
 * @param {jsPDF} pdf - PDF document
 * @param {Object} completionAnalysis - Journey completion analysis
 * @param {number} headerSize - Header font size
 * @param {number} subHeaderSize - Subheader font size
 * @param {number} fontSize - Body font size
 */
const addCompletionInsights = (pdf, completionAnalysis, headerSize, subHeaderSize, fontSize) => {
  // Set the title
  pdf.setTextColor(43, 70, 60); // Dark green for headers
  pdf.setFontSize(headerSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Journey Completion Insights', 20, 20);
  
  // Add horizontal line
  pdf.setDrawColor(85, 139, 110); // lighter green for line
  pdf.setLineWidth(0.5);
  pdf.line(20, 25, 190, 25);
  
  // Starting position for content
  let yPos = 40;
  
  // Validate completionAnalysis for safety
  const safeAnalysis = {
    journeyOverview: completionAnalysis?.journeyOverview || "You've completed your journey with Καιρός Smart Journal. Congratulations on your achievement!",
    growthNarrative: completionAnalysis?.growthNarrative || "Through consistent journaling, you've developed deeper insight and self-awareness.",
    keyThemes: Array.isArray(completionAnalysis?.keyThemes) && completionAnalysis.keyThemes.length > 0 
      ? completionAnalysis.keyThemes 
      : ["Self-awareness", "Reflection", "Growth"],
    personalStrengths: Array.isArray(completionAnalysis?.personalStrengths) && completionAnalysis.personalStrengths.length > 0 
      ? completionAnalysis.personalStrengths 
      : ["Commitment to journaling", "Willingness to explore", "Self-reflection"],
    growthOpportunities: Array.isArray(completionAnalysis?.growthOpportunities) && completionAnalysis.growthOpportunities.length > 0 
      ? completionAnalysis.growthOpportunities 
      : ["Continue developing your journaling practice", "Apply insights to daily life"],
    meaningfulAffirmation: completionAnalysis?.meaningfulAffirmation || "Your dedication to self-reflection is creating meaningful change in your life.",
    nextSteps: completionAnalysis?.nextSteps || "Continue your journaling practice with new prompts or explore our other journaling paths."
  };
  
  // Log what we're adding for debugging
  console.log("Adding completion insights with data:", safeAnalysis);
  
  // Add journey overview
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Journey Overview', 20, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  const overviewLines = pdf.splitTextToSize(safeAnalysis.journeyOverview, 170);
  pdf.text(overviewLines, 20, yPos);
  yPos += (overviewLines.length * 7);
  
  // Add growth narrative if space permits, otherwise new page
  if (yPos + 60 > 270) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add growth narrative
  yPos += 10;
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Growth Narrative', 20, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  const narrativeLines = pdf.splitTextToSize(safeAnalysis.growthNarrative, 170);
  pdf.text(narrativeLines, 20, yPos);
  yPos += (narrativeLines.length * 7);
  
  // Add key themes section
  if (yPos + 60 > 270) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add key themes
  yPos += 15;
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Themes', 20, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add themes as bullet points
  for (const theme of safeAnalysis.keyThemes) {
    const themeLines = pdf.splitTextToSize(`• ${theme}`, 165);
    pdf.text(themeLines, 25, yPos);
    yPos += (themeLines.length * 7);
  }
  
  // Add personal strengths
  if (yPos + 60 > 270) {
    pdf.addPage();
    yPos = 20;
  }
  
  yPos += 15;
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personal Strengths', 20, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add strengths as bullet points
  for (const strength of safeAnalysis.personalStrengths) {
    const strengthLines = pdf.splitTextToSize(`• ${strength}`, 165);
    pdf.text(strengthLines, 25, yPos);
    yPos += (strengthLines.length * 7);
  }
  
  // Add growth opportunities
  if (yPos + 60 > 270) {
    pdf.addPage();
    yPos = 20;
  }
  
  yPos += 15;
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Growth Opportunities', 20, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add opportunities as bullet points
  for (const opportunity of safeAnalysis.growthOpportunities) {
    const opportunityLines = pdf.splitTextToSize(`• ${opportunity}`, 165);
    pdf.text(opportunityLines, 25, yPos);
    yPos += (opportunityLines.length * 7);
  }
  
  // IMPORTANT: Always start a new page for affirmation to avoid overlap
  pdf.addPage();
  yPos = 20;
  
  // Add meaningful affirmation
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Affirmation', 20, yPos);
  yPos += 15;
  
  // Create a decorative box for the affirmation
  // Background
  pdf.setFillColor(245, 245, 240); // Light cream background
  pdf.roundedRect(20, yPos - 10, 170, 40, 5, 5, 'F');
  
  // Border
  pdf.setDrawColor(85, 139, 110); // Green border
  pdf.setLineWidth(1);
  pdf.roundedRect(20, yPos - 10, 170, 40, 5, 5, 'S');
  
  // Left accent bar
  pdf.setDrawColor(85, 139, 110);
  pdf.setLineWidth(4);
  pdf.line(22, yPos - 8, 22, yPos + 28);
  
  // Affirmation text
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(fontSize + 2); // Slightly larger font for emphasis
  pdf.setFont('helvetica', 'italic');
  
  const affirmationLines = pdf.splitTextToSize(`"${safeAnalysis.meaningfulAffirmation}"`, 155);
  pdf.text(affirmationLines, 105, yPos + 10, { align: 'center' });
  
  yPos += 50; // Space after affirmation box
  
  // Add next steps
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Next Steps', 20, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  const nextStepsLines = pdf.splitTextToSize(safeAnalysis.nextSteps, 170);
  pdf.text(nextStepsLines, 20, yPos);
  
  // Always add a new page after completion insights for separation
  pdf.addPage();
};

/**
 * Add enhanced final page to PDF with reliable rendering
 * @param {jsPDF} pdf - PDF document
 * @param {string} pathName - Journey path name
 */
const addFinalPage = (pdf, pathName) => {
  try {
    // Add gradient background effect (simulated with rectangles)
    pdf.setFillColor(245, 245, 240); // Light cream background  
    pdf.rect(0, 0, 210, 297, 'F');
    
    // Add top decorative element
    pdf.setFillColor(43, 70, 60); // Dark green
    pdf.rect(0, 0, 210, 40, 'F');
    
    // Add bottom decorative element
    pdf.setFillColor(43, 70, 60); // Dark green
    pdf.rect(0, 257, 210, 40, 'F');
    
    // Add Kairos logo centered at top with error handling
    try {
      addKairosLogo(pdf, 65, 8, 80, 25, false); // Use standard logo for final page
    } catch (logoError) {
      console.warn('Could not add logo to final page:', logoError);
      // Fallback text if logo fails
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ΚΑΙΡΟΣ', 105, 25, { align: 'center' });
    }
    
    // Add title
    pdf.setTextColor(43, 70, 60); // Dark green
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank You', 105, 70, { align: 'center' });
    
    // Add text
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const text = `Thank you for completing your ${pathName} with Καιρός Smart Journal. This document serves as a record of your journey and the insights you've gained along the way.

Your commitment to self-reflection and personal growth is commendable. We hope this journey has provided valuable insights and will continue to inspire your ongoing development.

Remember that journaling is a practice, not a destination. We encourage you to continue your reflection practice, whether through another Καιρός journey or through your own personal journaling.`;
    
    const textLines = pdf.splitTextToSize(text, 170);
    pdf.text(textLines, 20, 90);
    
    // Add quote
    pdf.setTextColor(43, 70, 60);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'italic');
    pdf.text('"The journey of a thousand miles begins with one step."', 105, 170, { align: 'center' });
    pdf.text('- Lao Tzu', 105, 180, { align: 'center' });
    
    // Add decorative elements
    try {
      // Add decorative separator line
      pdf.setDrawColor(85, 139, 110); // lighter green for line
      pdf.setLineWidth(0.5);
      pdf.line(40, 200, 170, 200);
      
      // Add decorative flourishes (small circles at each end of the line)
      pdf.setFillColor(85, 139, 110);
      pdf.circle(40, 200, 2, 'F');
      pdf.circle(170, 200, 2, 'F');
    } catch (decorError) {
      console.warn('Could not add decorative elements:', decorError);
      // Non-fatal, continue without decorations
    }
    
    // Add tagline
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Bridging the gap between handwritten journaling and digital insights', 105, 220, { align: 'center' });
    
    // Add website
    pdf.setFontSize(10);
    pdf.setTextColor(85, 139, 110);
    pdf.text('www.kairos-journal.com', 105, 230, { align: 'center' });
    
    // Add copyright in white on the bottom green bar
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text('© 2025 Καιρός Smart Journal. All rights reserved.', 105, 275, { align: 'center' });
    
    // Add app version with fallback if APP_VERSION is undefined
    const versionString = typeof APP_VERSION !== 'undefined' ? APP_VERSION : '1.0.0';
    pdf.setFontSize(8);
    pdf.text(`v${versionString}`, 182, 285, { align: 'right' });
    
    // Add document generation info
    const dateString = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    pdf.text(`Generated on ${dateString}`, 28, 285, { align: 'left' });
  } catch (error) {
    console.error('Error creating final page:', error);
    // Create a simple final page as fallback
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('Thank you for using Καιρός Smart Journal', 105, 140, { align: 'center' });
  }
};

/**
 * Generate a simplified text export of a journey
 * @param {string} userId - User ID
 * @param {string} pathId - Journey path ID
 * @returns {Promise<string>} - Text content
 */
export const exportJourneyToText = async (userId, pathId) => {
  try {
    // Get all journal entries for this path
    const entries = await getPreviousEntries(userId, pathId);
    
    // If no entries, throw error
    if (!entries || entries.length === 0) {
      throw new Error('No journal entries found for this journey');
    }
    
    // Get path name
    const pathInfo = getPathInfo(pathId);
    const pathName = pathInfo.name;
    
    // Build text content
    let content = `# ${pathName}\n\n`;
    content += `Generated on ${new Date().toLocaleDateString()}\n\n`;
    
    // Sort entries by day
    entries.sort((a, b) => a.day - b.day);
    
    // Add each entry
    for (const entry of entries) {
      content += `## Day ${entry.day}: ${entry.theme || 'Reflection'}\n\n`;
      
      if (entry.prompt) {
        content += `Prompt: ${entry.prompt}\n\n`;
      }
      
      if (entry.extractedText) {
        content += `Entry:\n${entry.extractedText}\n\n`;
      }
      
      if (entry.analysis) {
        content += `Insights:\n${entry.analysis.summary || ''}\n\n`;
        
        if (entry.analysis.insights && entry.analysis.insights.length > 0) {
          content += `Key points:\n`;
          for (const insight of entry.analysis.insights) {
            content += `- ${insight}\n`;
          }
          content += '\n';
        }
      }
      
      content += `---\n\n`;
    }
    
    return content;
  } catch (error) {
    console.error('Error generating text export:', error);
    throw new Error('Failed to generate text export: ' + error.message);
  }
};

/**
 * Download a file in the browser with enhanced error handling
 * @param {Blob|string} content - File content
 * @param {string} filename - Filename
 * @param {string} type - MIME type
 * @returns {Promise<boolean>} - Success status
 */
export const downloadFile = (content, filename, type = 'application/pdf') => {
  return new Promise((resolve, reject) => {
    try {
      // Create blob if content is string
      const blob = typeof content === 'string' 
        ? new Blob([content], { type: 'text/plain' })
        : content;
      
      // Validate blob
      if (!(blob instanceof Blob)) {
        throw new Error('Invalid content format');
      }
      
      // Create URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      
      // Use a more robust method for clicking
      const clickHandler = () => {
        setTimeout(() => {
          // Clean up
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Remove event listener
          a.removeEventListener('click', clickHandler);
          
          // Resolve the promise
          resolve(true);
        }, 200); // Increased timeout for larger files
      };
      
      // Add event listener for click
      a.addEventListener('click', clickHandler);
      
      // Append to body
      document.body.appendChild(a);
      
      // Trigger download with proper error handling
      setTimeout(() => {
        try {
          a.click();
        } catch (clickError) {
          // Fallback for browsers that block programmatic clicks
          console.warn('Click method failed, trying alternative download approach');
          alert(`Your download is ready. Please click "OK" to download the file "${filename}".`);
          a.focus();
          reject(new Error(`Download click failed: ${clickError.message}`));
        }
      }, 100);
    } catch (error) {
      console.error('Error in file download:', error);
      reject(new Error(`Download failed: ${error.message}`));
    }
  });
};

/**
 * Fetch an image and convert it to a data URL
 * @param {string} url - Image URL
 * @returns {Promise<string>} - Data URL
 */
const fetchImageAsDataURL = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

/**
 * Get image dimensions from a data URL
 * @param {string} dataURL - Image data URL
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
const getImageDimensions = (dataURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataURL;
  });
};

export default {
  exportJourneyToPDF,
  exportJourneyToText,
  downloadFile
};