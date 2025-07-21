// src/services/exportService.js - Enhanced with Mobile-Friendly Features & Icons
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getPreviousEntries, getJournalEntry } from './claudeService';
import { generateJourneyCompletion } from './claudeService';
// Import getJourneyPath from JourneyData
import { getJourneyPath } from '../data/JourneyData';

// Simple Unicode icons that work reliably
const ICONS = {
  star: '★',
  heart: '♥',
  check: '✓',
  bullet: '•',
  arrow: '→',
  sparkle: '✨',
  trophy: '🏆',
  book: '📖',
  pen: '✍️',
  light: '💡',
  target: '🎯',
  growth: '🌱',
  complete: '✅'
};

/**
 * Add Kairos logo to PDF using canvas-based approach
 * @param {jsPDF} pdf - PDF document
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {boolean} useCoverLogo - Whether to use the cover logo or standard logo
 */
const addKairosLogo = (pdf, x, y, width = 30, height = 10, useCoverLogo = false) => {
  try {
    // Create a simple text-based logo with styling that looks professional
    pdf.setTextColor(85, 139, 110); // Settings primary color
    pdf.setFont('helvetica', 'bold');
    
    if (useCoverLogo) {
      // For cover page - larger and more prominent
      pdf.setFontSize(24);
      pdf.text('ΚΑΙΡΌΣ', x + width/2, y + height/2, { align: 'center' });
      
      // Add sparkle icons
      pdf.setFontSize(20);
      pdf.text('✨', x + width/2 - 35, y + height/2);
      pdf.text('✨', x + width/2 + 35, y + height/2);
      
      // Add subtitle
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(230, 184, 156); // Terracotta color
      pdf.text('Smart Journal', x + width/2, y + height/2 + 8, { align: 'center' });
    } else {
      // For headers and smaller applications
      pdf.setFontSize(14);
      pdf.text('ΚΑΙΡΌΣ', x, y + height/2);
    }
    
    // Add a decorative underline for the cover logo
    if (useCoverLogo) {
      pdf.setDrawColor(85, 139, 110);
      pdf.setLineWidth(1);
      pdf.line(x + width/2 - 20, y + height/2 + 3, x + width/2 + 20, y + height/2 + 3);
    }
    
  } catch (error) {
    console.warn('Logo rendering failed, using fallback:', error);
    
    // Ultimate fallback - simple text
    pdf.setTextColor(85, 139, 110);
    pdf.setFontSize(useCoverLogo ? 20 : 12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Kairos', x + (useCoverLogo ? width/2 : 0), y + height/2, useCoverLogo ? { align: 'center' } : null);
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
    
    // Set font sizes based on quality - made slightly smaller for mobile
    const fontSize = exportOptions.quality === 'high' ? 11 : 9;
    const headerSize = exportOptions.quality === 'high' ? 16 : 14;
    const subHeaderSize = exportOptions.quality === 'high' ? 13 : 11;
    
    // Progress update
    if (onProgress) onProgress({ stage: 'branding', progress: 40 });
    
    // Add Καιρός branding
    try {
      addBranding(pdf, pathName, userProfile, entries.length);
    } catch (brandingError) {
      console.error('Error adding branding to PDF:', brandingError);
      // Non-fatal, continue with the PDF
    }
    
    // Progress update
    if (onProgress) onProgress({ stage: 'overview', progress: 50 });
    
    // Add journey overview
    try {
      addJourneyOverview(pdf, pathName, completionAnalysis, userProfile, headerSize, subHeaderSize, fontSize, entries.length);
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

const addBranding = (pdf, pathName, userProfile, totalEntries = 0) => {
  // Add cover page
  pdf.setFillColor(43, 70, 60); // Dark green background
  pdf.rect(0, 0, 210, 297, 'F');
  
  // Add Kairos logo with cover logo variant
  addKairosLogo(pdf, 65, 80, 80, 100, true); // Use cover logo and make it larger
  
  // Add journey name with icon
  pdf.setTextColor(255, 255, 255); // White for journey name
  pdf.setFontSize(20);
  pdf.text(`${ICONS.book} ${pathName}`, 105, 200, { align: 'center' }); // Adjusted position
  
  // Add user name with heart icon
  const userName = userProfile?.displayName || 'Journal';
  pdf.setFontSize(14);
  pdf.text(`${ICONS.heart} ${userName}'s Journey`, 105, 220, { align: 'center' }); // Adjusted position
  
  // Add completion badge if journey is complete
  if (totalEntries > 0) {
    pdf.setFontSize(16);
    pdf.text(`${ICONS.trophy} Journey Complete!`, 105, 235, { align: 'center' });
  }
  
  // Add date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.setFontSize(12);
  pdf.text(`Generated on ${dateStr}`, 105, 250, { align: 'center' }); // Adjusted position
  
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
    
    // Footer with page number
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
    'courage-cultivation': 'Courage Cultivation',
    'inner-elements': 'Inner Elements Journey' // Added new multi-modal path
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
    'courage-cultivation': 12,
    'inner-elements': 9 // Added new multi-modal path
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
    'inner-elements': 'A 9-day multi-modal journey exploring Earth, Water, and Fire elements through writing, visual art, and voice to discover your elemental nature.' // Added new multi-modal path
  };
  
  return descriptions[pathId] || 'A guided journaling experience that supports personal reflection and growth.';
};

/**
 * Add journey overview section - enhanced with stats
 * @param {jsPDF} pdf - PDF document
 * @param {string} pathName - Journey path name
 * @param {Object} completionAnalysis - Journey completion analysis
 * @param {Object} userProfile - User profile data
 * @param {number} headerSize - Header font size
 * @param {number} subHeaderSize - Subheader font size
 * @param {number} fontSize - Body font size
 * @param {number} totalEntries - Total number of entries
 */
const addJourneyOverview = (pdf, pathName, completionAnalysis, userProfile, headerSize, subHeaderSize, fontSize, totalEntries = 0) => {
  // Add title with icon
  pdf.setTextColor(43, 70, 60); // Dark green for headers
  pdf.setFontSize(headerSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${ICONS.book} ${pathName}: Journey Overview`, 15, 20); // Reduced margin
  
  // Add horizontal line
  pdf.setDrawColor(85, 139, 110); // lighter green for line
  pdf.setLineWidth(0.5);
  pdf.line(15, 25, 195, 25); // Extended line
  
  // Set text color for body
  pdf.setTextColor(0, 0, 0); // Black for body text
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  let yPos = 35;
  
  // Add journey stats if available
  if (totalEntries > 0) {
    pdf.setFontSize(fontSize);
    pdf.text(`${ICONS.check} Days Completed: ${totalEntries}`, 15, yPos);
    pdf.text(`${ICONS.complete} Completion Rate: 100%`, 105, yPos);
    yPos += 10;
  }
  
  // Get path description
  const pathInfo = getPathInfo(pathName);
  const description = pathInfo.description;
  
  // Split text to fit page width with word wrap - increased width
  const textLines = pdf.splitTextToSize(description, 180); // Increased from 170
  pdf.text(textLines, 15, yPos); // Reduced margin
  yPos += 7 * (textLines.length);
  
  // Add completion analysis overview if available
  if (completionAnalysis && completionAnalysis.journeyOverview) {
    yPos += 10;
    pdf.setFontSize(subHeaderSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(43, 70, 60);
    pdf.text(`${ICONS.sparkle} Your Journey Summary`, 15, yPos);
    yPos += 8;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    
    const overviewLines = pdf.splitTextToSize(completionAnalysis.journeyOverview, 180);
    pdf.text(overviewLines, 15, yPos);
    yPos += 7 * (overviewLines.length);
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
  pdf.text(`Journey completed on: ${dateStr}`, 15, yPos);
  
  // Add new page
  pdf.addPage();
};

/**
 * Add journal entries to the PDF - enhanced with icons
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
    // Add entry header with icon
    pdf.setTextColor(43, 70, 60); // Dark green for headers
    pdf.setFontSize(headerSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${ICONS.pen} Day ${entry.day}: ${entry.theme || 'Reflection'}`, 15, 20);
    
    // Add horizontal line
    pdf.setDrawColor(85, 139, 110); // lighter green for line
    pdf.setLineWidth(0.5);
    pdf.line(15, 25, 195, 25);
    
    let yPos = 35;
    
    // Add prompt with icon
    if (entry.prompt) {
      pdf.setTextColor(230, 184, 156); // Terracotta for prompt
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'italic');
      
      const promptLines = pdf.splitTextToSize(`${ICONS.target} Prompt: ${entry.prompt}`, 180);
      pdf.text(promptLines, 15, yPos);
      yPos += 7 * (promptLines.length);
    }
    
    // Add extracted text if requested
    if (options.includeFullText && entry.extractedText) {
      yPos += 10;
      pdf.setTextColor(0, 0, 0); // Black for entry text
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      
      const textLines = pdf.splitTextToSize(entry.extractedText, 180);
      
      // Check if we need a new page
      if (yPos + (textLines.length * 5) > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(textLines, 15, yPos);
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
          pdf.addImage(img, 'JPEG', 15, yPos, width, height);
          
          yPos += height + 10;
        } catch (imgError) {
          // Fallback to placeholder if image loading fails
          console.warn(`Failed to load image for day ${entry.day}:`, imgError);
          
          // Add placeholder instead
          pdf.setFillColor(240, 240, 240);
          pdf.rect(15, yPos, 180, 60, 'F');
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
      pdf.text(`${ICONS.light} Insights`, 15, yPos);
      yPos += 8;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      
      // Add summary
      if (entry.analysis.summary) {
        const summaryLines = pdf.splitTextToSize(entry.analysis.summary, 180);
        pdf.text(summaryLines, 15, yPos);
        yPos += 6 * (summaryLines.length);
      }
      
      // Add insights as bullet points with stars
      if (entry.analysis.insights && entry.analysis.insights.length > 0) {
        yPos += 5;
        
        for (const insight of entry.analysis.insights) {
          // Check if we need a new page
          if (yPos + 10 > 270) {
            pdf.addPage();
            yPos = 20;
          }
          
          const bulletLines = pdf.splitTextToSize(`${ICONS.star} ${insight}`, 175);
          pdf.text(bulletLines, 20, yPos);
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
  // Set the title with trophy icon
  pdf.setTextColor(43, 70, 60); // Dark green for headers
  pdf.setFontSize(headerSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${ICONS.trophy} Journey Completion Insights`, 15, 20);
  
  // Add horizontal line
  pdf.setDrawColor(85, 139, 110); // lighter green for line
  pdf.setLineWidth(0.5);
  pdf.line(15, 25, 195, 25);
  
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
  pdf.text(`${ICONS.book} Journey Overview`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  const overviewLines = pdf.splitTextToSize(safeAnalysis.journeyOverview, 180);
  pdf.text(overviewLines, 15, yPos);
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
  pdf.text(`${ICONS.growth} Your Growth Narrative`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  const narrativeLines = pdf.splitTextToSize(safeAnalysis.growthNarrative, 180);
  pdf.text(narrativeLines, 15, yPos);
  yPos += (narrativeLines.length * 7);
  
  // Add key themes section
  if (yPos + 60 > 270) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Add key themes with target icon
  yPos += 15;
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${ICONS.target} Key Themes`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add themes as bullet points
  for (const theme of safeAnalysis.keyThemes) {
    const themeLines = pdf.splitTextToSize(`${ICONS.bullet} ${theme}`, 175);
    pdf.text(themeLines, 20, yPos);
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
  pdf.text(`${ICONS.star} Your Personal Strengths`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add strengths as bullet points
  for (const strength of safeAnalysis.personalStrengths) {
    const strengthLines = pdf.splitTextToSize(`${ICONS.check} ${strength}`, 175);
    pdf.text(strengthLines, 20, yPos);
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
  pdf.text(`${ICONS.growth} Growth Opportunities`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Add opportunities as bullet points
  for (const opportunity of safeAnalysis.growthOpportunities) {
    const opportunityLines = pdf.splitTextToSize(`${ICONS.arrow} ${opportunity}`, 175);
    pdf.text(opportunityLines, 20, yPos);
    yPos += (opportunityLines.length * 7);
  }
  
  // IMPORTANT: Always start a new page for affirmation to avoid overlap
  pdf.addPage();
  yPos = 20;
  
  // Add meaningful affirmation
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${ICONS.sparkle} Your Affirmation`, 15, yPos);
  yPos += 15;
  
  // Create a decorative box for the affirmation
  // Background
  pdf.setFillColor(245, 245, 240); // Light cream background
  pdf.roundedRect(15, yPos - 10, 180, 40, 5, 5, 'F');
  
  // Border
  pdf.setDrawColor(85, 139, 110); // Green border
  pdf.setLineWidth(1);
  pdf.roundedRect(15, yPos - 10, 180, 40, 5, 5, 'S');
  
  // Left accent bar
  pdf.setDrawColor(85, 139, 110);
  pdf.setLineWidth(4);
  pdf.line(17, yPos - 8, 17, yPos + 28);
  
  // Affirmation text
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(fontSize + 2); // Slightly larger font for emphasis
  pdf.setFont('helvetica', 'italic');
  
  const affirmationLines = pdf.splitTextToSize(`"${safeAnalysis.meaningfulAffirmation}"`, 165);
  pdf.text(affirmationLines, 105, yPos + 10, { align: 'center' });
  
  yPos += 50; // Space after affirmation box
  
  // Add next steps
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${ICONS.arrow} Next Steps`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  
  const nextStepsLines = pdf.splitTextToSize(safeAnalysis.nextSteps, 180);
  pdf.text(nextStepsLines, 15, yPos);
  
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
    
    // Add title with heart icon
    pdf.setTextColor(43, 70, 60); // Dark green
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${ICONS.heart} Thank You`, 105, 70, { align: 'center' });
    
    // Add text
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const text = `Thank you for completing your ${pathName} with Καιρός Smart Journal. This document serves as a record of your journey and the insights you've gained along the way.

Your commitment to self-reflection and personal growth is commendable. We hope this journey has provided valuable insights and will continue to inspire your ongoing development.

Remember that journaling is a practice, not a destination. We encourage you to continue your reflection practice, whether through another Καιρός journey or through your own personal journaling.`;
    
    const textLines = pdf.splitTextToSize(text, 180);
    pdf.text(textLines, 15, 90);
    
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