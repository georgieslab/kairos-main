// src/services/exportService.js - Enhanced with Mobile-Friendly Features & Icons
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getPreviousEntries, getJournalEntry } from './claudeService';
import { generateJourneyCompletion } from './claudeService';
// Import getJourneyPath from JourneyData
import { getJourneyPath } from '../data/JourneyData';

// Simple Unicode icons that work reliably
// jsPDF's built-in Helvetica is WinAnsi-encoded: Latin-1 and a handful of
// typographic extras, nothing more. Every glyph in the previous version of
// this map except the bullet was outside that range, and jsPDF does not fail
// on an unmappable character — it writes the raw UTF-16 code units as single
// bytes, so '★' became two garbage characters in the finished PDF. Verified
// against jsPDF 3.0.3 by inspecting the emitted content stream.
//
// Everything here is checked WinAnsi-safe. Do not reintroduce emoji,
// dingbats, or arrows without testing what actually lands in the file.
const ICONS = {
  star: '•',      // was ★
  heart: '•',     // was ♥
  check: '•',     // was ✓
  bullet: '•',
  arrow: '»',     // was → ; » is WinAnsi
  sparkle: '•',   // was ✨
  trophy: '•',    // was 🏆
  book: '•',      // was 📖
  pen: '•',       // was ✍️
  light: '•',     // was 💡
  target: '•',    // was 🎯
  growth: '•',    // was 🌱
  complete: '•'   // was ✅
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
    pdf.setFont(FONT(pdf), 'bold');
    
    if (useCoverLogo) {
      // For cover page - larger and more prominent
      pdf.setFontSize(24);
      pdf.text('KAIROS', x + width/2, y + height/2, { align: 'center' });  // romanised: Greek is not WinAnsi
      
      // Add sparkle icons
      pdf.setFontSize(20);
      // (decorative sparkles removed - emoji cannot render in WinAnsi Helvetica)
      
      // Add subtitle
      pdf.setFontSize(12);
      pdf.setFont(FONT(pdf), 'normal');
      pdf.setTextColor(230, 184, 156); // Terracotta color
      pdf.text('Smart Journal', x + width/2, y + height/2 + 8, { align: 'center' });
    } else {
      // For headers and smaller applications
      pdf.setFontSize(14);
      pdf.text('KAIROS', x, y + height/2);  // romanised: Greek is not WinAnsi
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
    pdf.setFont(FONT(pdf), 'bold');
    pdf.text('Kairos', x + (useCoverLogo ? width/2 : 0), y + height/2, useCoverLogo ? { align: 'center' } : null);
  }
};

// =============================================================================
// UNICODE FONT FOR PDF EXPORT
// =============================================================================
// jsPDF's built-in Helvetica is WinAnsi-encoded — Latin-1 only. It does not
// fail on characters outside that range; it writes their raw UTF-16 code units
// as single bytes. So a Georgian journal entry came out as pure garbage, and a
// line mixing Latin and Georgian came out EMPTY (jsPDF emits `<> Tj`).
// Since the export contains the user's own writing, that made the feature
// worthless for every Georgian user.
//
// Noto Sans Georgian covers Latin, Latin-1 (German umlauts, ß) and Mkhedruli
// in one 63 KB file, and it is the same family the app already uses on screen.
// Greek is NOT in it — which is why the Καιρός branding in this file is
// romanised to "KAIROS" rather than relying on the font.
//
// Loaded on demand rather than bundled: exporting is already a slow async
// operation, so the fetch is invisible there, whereas bundling would tax every
// page load. The base64 payload is cached for the session.

const PDF_FONT_NAME = 'NotoSansGeorgian';
const PDF_FONT_FALLBACK = 'helvetica';

/** Font to draw with. Instance-scoped so a failed load can't leak between exports. */
const FONT = (pdf) => pdf.__kairosFont || PDF_FONT_FALLBACK;

let fontPayloadPromise = null;

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  // chunked: String.fromCharCode(...) on a 60k array overflows the call stack
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
};

const loadFontPayload = () => {
  if (!fontPayloadPromise) {
    fontPayloadPromise = Promise.all([
      fetch('/fonts/NotoSansGeorgian-Regular.ttf').then((r) => {
        if (!r.ok) throw new Error(`font ${r.status}`);
        return r.arrayBuffer();
      }),
      fetch('/fonts/NotoSansGeorgian-Bold.ttf').then((r) => {
        if (!r.ok) throw new Error(`font ${r.status}`);
        return r.arrayBuffer();
      })
    ])
      .then(([reg, bold]) => ({
        regular: arrayBufferToBase64(reg),
        bold: arrayBufferToBase64(bold)
      }))
      .catch((err) => {
        // Let a later export retry rather than caching the failure forever
        fontPayloadPromise = null;
        throw err;
      });
  }
  return fontPayloadPromise;
};

/**
 * Registers the Unicode font on this PDF instance. Falls back to Helvetica if
 * the font can't be fetched — an ASCII-only PDF beats no PDF at all.
 */
const setupPDF = async (pdf) => {
  try {
    const { regular, bold } = await loadFontPayload();
    pdf.addFileToVFS('NotoSansGeorgian-Regular.ttf', regular);
    pdf.addFont('NotoSansGeorgian-Regular.ttf', PDF_FONT_NAME, 'normal');
    pdf.addFileToVFS('NotoSansGeorgian-Bold.ttf', bold);
    pdf.addFont('NotoSansGeorgian-Bold.ttf', PDF_FONT_NAME, 'bold');
    pdf.__kairosFont = PDF_FONT_NAME;
  } catch (err) {
    console.warn('PDF: Unicode font unavailable, falling back to Helvetica. Non-Latin text will not render.', err);
    pdf.__kairosFont = PDF_FONT_FALLBACK;
  }
  pdf.setFont(FONT(pdf));
};

// =============================================================================
// ✨ "Daily Aura" mood check-in — reused as the PDF's aura infographic.
// There's no real meteorological data stored per journal entry, so we use the
// same daily mood check-in the Home/Insights screens already show, keyed by
// the entry's actual date. Ids/colours must match src/constants/moods.js
// exactly (that's the single source of truth for the app + Firestore values).
// =============================================================================

const MOOD_META = {
  lunar:    { color: [129, 140, 248] }, // Indigo
  ethereal: { color: [56, 189, 248]  }, // Sky Blue
  sparkle:  { color: [192, 132, 252] }, // Violet
  radiant:  { color: [251, 191, 36]  }, // Amber
  ember:    { color: [251, 113, 133] }  // Rose
};

/** Local (not UTC) YYYY-MM-DD key, matching MoodWeather.jsx's localDateKey() */
export const dateKeyFromDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Fetches the mood id ('lunar'|'ethereal'|'sparkle'|'radiant'|'ember') for
 * a given date, or null if the user never checked in that day / the read fails. */
export const getMoodForDate = async (userId, dateKey) => {
  if (!userId || !dateKey) return null;
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'moods', dateKey));
    return snap.exists() ? (snap.data().mood || null) : null;
  } catch (error) {
    console.warn('Could not load mood for PDF export (non-fatal):', error);
    return null;
  }
};

/** Mixes an accent colour toward white — used for card backgrounds instead of
 * true alpha compositing, so it renders identically across jsPDF versions. */
const tintColor = (rgb, amount = 0.1) => rgb.map((c) => Math.round(255 - amount * (255 - c)));

/** Draws a small vector aura glyph for the given mood id, centred at (cx, cy).
 * These are hand-drawn with jsPDF primitives (circle/triangle/line) since the
 * standard PDF fonts can't render icon glyphs or emoji. The lunar crescent is
 * carved by overpainting a white circle, so it only reads correctly on a white
 * badge backdrop — which is the only place this is currently used. */
const drawMoodGlyph = (pdf, moodId, cx, cy, scale, color) => {
  switch (moodId) {
    case 'lunar': {
      pdf.setFillColor(...color);
      pdf.circle(cx, cy, scale * 0.55, 'F');
      pdf.setFillColor(255, 255, 255);
      pdf.circle(cx + scale * 0.28, cy - scale * 0.12, scale * 0.48, 'F');
      break;
    }
    case 'ethereal': {
      const x1 = cx - scale * 0.5, y1 = cy + scale * 0.55;
      const x2 = cx + scale * 0.5, y2 = cy - scale * 0.55;
      pdf.setDrawColor(...color);
      pdf.setLineWidth(0.6);
      pdf.setLineCap('round');
      pdf.line(x1, y1, x2, y2); // spine
      const len = Math.hypot(x2 - x1, y2 - y1);
      const px = -(y2 - y1) / len, py = (x2 - x1) / len; // perpendicular unit vector
      for (let i = 1; i <= 3; i++) {
        const t = i / 4;
        const sx = x1 + (x2 - x1) * t, sy = y1 + (y2 - y1) * t;
        const barbLen = scale * (0.5 - t * 0.25);
        pdf.line(sx, sy, sx + px * barbLen, sy + py * barbLen);
      }
      pdf.setFillColor(...color);
      pdf.circle(x1, y1, scale * 0.12, 'F'); // quill tip
      break;
    }
    case 'sparkle': {
      pdf.setFillColor(...color);
      const spike = scale * 1.0, base = scale * 0.15;
      pdf.triangle(cx, cy - spike, cx - base, cy, cx + base, cy, 'F'); // up
      pdf.triangle(cx, cy + spike, cx - base, cy, cx + base, cy, 'F'); // down
      pdf.triangle(cx - spike, cy, cx, cy - base, cx, cy + base, 'F'); // left
      pdf.triangle(cx + spike, cy, cx, cy - base, cx, cy + base, 'F'); // right
      break;
    }
    case 'radiant': {
      pdf.setFillColor(...color);
      pdf.circle(cx, cy, scale * 0.28, 'F');
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const perp = angle + Math.PI / 2;
        const tipX = cx + Math.cos(angle) * scale * 1.0;
        const tipY = cy + Math.sin(angle) * scale * 1.0;
        const baseX = cx + Math.cos(angle) * scale * 0.22;
        const baseY = cy + Math.sin(angle) * scale * 0.22;
        const bw = scale * 0.22;
        pdf.triangle(
          tipX, tipY,
          baseX + Math.cos(perp) * bw, baseY + Math.sin(perp) * bw,
          baseX - Math.cos(perp) * bw, baseY - Math.sin(perp) * bw,
          'F'
        );
      }
      break;
    }
    case 'ember':
    default: {
      pdf.setFillColor(...color);
      // rounded base
      pdf.circle(cx, cy + scale * 0.32, scale * 0.34, 'F');
      // lower body, tapering up toward the left
      pdf.triangle(
        cx - scale * 0.34, cy + scale * 0.32,
        cx + scale * 0.34, cy + scale * 0.32,
        cx - scale * 0.06, cy - scale * 0.15,
        'F'
      );
      // flickering tip, curling to the right and tapering to a point
      pdf.triangle(
        cx - scale * 0.2, cy - scale * 0.05,
        cx + scale * 0.22, cy - scale * 0.1,
        cx + scale * 0.08, cy - scale * 0.85,
        'F'
      );
      break;
    }
  }
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
      
      // Registers the Unicode font (see setupPDF) before anything is drawn
      await setupPDF(pdf);
      
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
    'inner-elements': 'Inner Elements Journey',
    'shadow-light-integration': 'Shadow & Light Integration',
    'life-chapters-trilogy': 'Life Chapters Trilogy',
    'sensory-spectrum': 'Sensory Spectrum Journey',
    'emotion-color-sound': 'Emotion-Color-Sound Trinity'
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
    'inner-elements': 9,
    'deciding-to-doing': 7,
    'shadow-light-integration': 12,
    'life-chapters-trilogy': 15,
    'sensory-spectrum': 21,
    'emotion-color-sound': 18
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
    'inner-elements': 'A 9-day multi-modal journey exploring Earth, Water, and Fire elements through writing, visual art, and voice to discover your elemental nature.',
    'forgiveness-freedom': 'A 17-day journey to cultivate forgiveness for yourself and others, releasing burdens and fostering emotional freedom.',
    'transitions-navigator': 'A 21-day path to navigate life transitions with resilience, clarity, and purpose through reflective journaling and strategic planning.',
    'digital-detox': 'A 7-day journey to reduce digital overwhelm, cultivate mindful technology use, and reconnect with offline presence through reflective practices.',
    'grief-growth': 'A 30-day path to navigate grief and loss, fostering healing, meaning-making, and personal growth through compassionate journaling.',
    'courage-cultivation': 'A 12-day journey to build courage and resilience by confronting fears, embracing vulnerability, and taking bold actions aligned with your values.',
    'deciding-to-doing': 'A 7-day focused journey to bridge the gap between intention and action, transforming decisions into tangible steps toward your goals.',
    'shadow-light-integration': 'A 12-day multi-modal journey alternating between exploring your shadow self and celebrating your light. Integrate the full spectrum of who you are through text, voice, and visual expression.',
    'life-chapters-trilogy': 'A 15-day narrative journey through past, present, and future chapters of your life story. Explore your life as an unfolding book using multiple modalities.',
    'sensory-spectrum': 'A 21-day exploration of all five senses. Deepen your embodied awareness through text, visual, and voice journaling focused on sensory experience.',
    'emotion-color-sound': 'An 18-day journey exploring six core emotions (joy, sadness, anger, fear, love, peace) through feeling, color, and sound. Express each emotion across all three modalities.'
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
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.book} ${pathName}: Journey Overview`, 15, 20); // Reduced margin
  
  // Add horizontal line
  pdf.setDrawColor(85, 139, 110); // lighter green for line
  pdf.setLineWidth(0.5);
  pdf.line(15, 25, 195, 25); // Extended line
  
  // Set text color for body
  pdf.setTextColor(0, 0, 0); // Black for body text
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
    pdf.setFont(FONT(pdf), 'bold');
    pdf.setTextColor(43, 70, 60);
    pdf.text(`${ICONS.sparkle} Your Journey Summary`, 15, yPos);
    yPos += 8;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(fontSize);
    pdf.setFont(FONT(pdf), 'normal');
    
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
    pdf.setFont(FONT(pdf), 'bold');
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
      pdf.setFont(FONT(pdf), 'italic');
      
      const promptLines = pdf.splitTextToSize(`${ICONS.target} Prompt: ${entry.prompt}`, 180);
      pdf.text(promptLines, 15, yPos);
      yPos += 7 * (promptLines.length);
    }
    
    // Add extracted text if requested
    if (options.includeFullText && entry.extractedText) {
      yPos += 10;
      pdf.setTextColor(0, 0, 0); // Black for entry text
      pdf.setFontSize(fontSize);
      pdf.setFont(FONT(pdf), 'normal');
      
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
      pdf.setFont(FONT(pdf), 'bold');
      pdf.text(`${ICONS.light} Insights`, 15, yPos);
      yPos += 8;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(fontSize);
      pdf.setFont(FONT(pdf), 'normal');
      
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
  pdf.setFont(FONT(pdf), 'bold');
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
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.book} Journey Overview`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.growth} Your Growth Narrative`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.target} Key Themes`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.star} Your Personal Strengths`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.growth} Growth Opportunities`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
  pdf.setFont(FONT(pdf), 'bold');
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
  pdf.setFont(FONT(pdf), 'italic');
  
  const affirmationLines = pdf.splitTextToSize(`"${safeAnalysis.meaningfulAffirmation}"`, 165);
  pdf.text(affirmationLines, 105, yPos + 10, { align: 'center' });
  
  yPos += 50; // Space after affirmation box
  
  // Add next steps
  pdf.setTextColor(43, 70, 60);
  pdf.setFontSize(subHeaderSize);
  pdf.setFont(FONT(pdf), 'bold');
  pdf.text(`${ICONS.arrow} Next Steps`, 15, yPos);
  yPos += 10;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(fontSize);
  pdf.setFont(FONT(pdf), 'normal');
  
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
      pdf.setFont(FONT(pdf), 'bold');
      pdf.text('KAIROS', 105, 25, { align: 'center' });
    }
    
    // Add title with heart icon
    pdf.setTextColor(43, 70, 60); // Dark green
    pdf.setFontSize(24);
    pdf.setFont(FONT(pdf), 'bold');
    pdf.text(`${ICONS.heart} Thank You`, 105, 70, { align: 'center' });
    
    // Add text
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont(FONT(pdf), 'normal');
    
    const text = `Thank you for completing your ${pathName} with Καιρός Smart Journal. This document serves as a record of your journey and the insights you've gained along the way.

Your commitment to self-reflection and personal growth is commendable. We hope this journey has provided valuable insights and will continue to inspire your ongoing development.

Remember that journaling is a practice, not a destination. We encourage you to continue your reflection practice, whether through another Καιρός journey or through your own personal journaling.`;
    
    const textLines = pdf.splitTextToSize(text, 180);
    pdf.text(textLines, 15, 90);
    
    // Add quote
    pdf.setTextColor(43, 70, 60);
    pdf.setFontSize(14);
    pdf.setFont(FONT(pdf), 'italic');
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
    pdf.setFont(FONT(pdf), 'normal');
    pdf.text('Bridging the gap between handwritten journaling and digital insights', 105, 220, { align: 'center' });
    
    // Add website
    pdf.setFontSize(10);
    pdf.setTextColor(85, 139, 110);
    pdf.text('www.kairos-journal.com', 105, 230, { align: 'center' });
    
    // Add copyright in white on the bottom green bar
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text('© 2025 Kairos Smart Journal. All rights reserved.', 105, 275, { align: 'center' });
    
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
    pdf.text('Thank you for using Kairos Smart Journal', 105, 140, { align: 'center' });
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
 * Generate a styled, infographic-flavoured single-entry PDF for the Analysis
 * Results screen.
 *
 * Unlike exportJourneyToPDF (whole-journey, cover page + many entries), this is a
 * compact 1–2 page document for ONE entry: a branded header with a vector mood
 * ("inner aura") glyph, a row of stat chips, a journey-progress bar, and
 * tinted per-section cards mirroring the in-app tabs (Insights / Reflection /
 * Action / Affirmation), plus page footers. Text/labels are passed in already
 * localized via `strings`, so this stays free of i18n coupling and the AI content
 * (which is generated in the user's language) prints in that language.
 *
 * @param {Object} data
 * @param {number} data.dayNumber
 * @param {string} data.pathName        - localized/display path name
 * @param {number[]} [data.pathColor]   - journey path accent colour, e.g. [85,139,110]
 * @param {number} [data.pathDuration]  - total days in the journey, for the progress bar
 * @param {string} data.theme
 * @param {string} [data.prompt]
 * @param {string} [data.entryText]     - written entry or voice transcription
 * @param {boolean} [data.isVoiceEntry]
 * @param {Object} [data.analysis]      - { summary, insights[], reflectionQuestion, practicalAction, affirmation }
 * @param {Object} [data.mood]          - { id: 'lunar'|'ethereal'|'sparkle'|'radiant'|'ember', label } from that day's check-in
 * @param {Object} data.strings         - localized labels (see AnalysisResults handleExport)
 * @returns {Blob} PDF as a Blob
 */
export const exportSingleEntryToPDF = async ({
  dayNumber,
  pathName,
  pathColor,
  pathDuration,
  theme,
  prompt,
  entryText,
  isVoiceEntry = false,
  analysis = null,
  mood = null,
  strings = {}
}) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  await setupPDF(pdf);

  // Layout constants (mm)
  const PAGE_W = 210;
  const MARGIN = 16;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const TOP_Y = 20;      // top text baseline on continuation pages
  const MAX_Y = 268;     // last usable baseline before the footer
  const FOOTER_Y = 285;

  // Palette (matches the app's accent system)
  const DARKGREEN = [43, 70, 60];
  const GREEN = pathColor && pathColor.length === 3 ? pathColor : [85, 139, 110];
  const GOLD = [216, 178, 63];
  const BLUE = [59, 130, 246];
  const ORANGE = [249, 115, 22];
  const PURPLE = [139, 92, 246];
  const INK = [38, 38, 42];
  const MUTE = [122, 122, 130];
  const TRACK = [232, 232, 236];

  let y = 0;

  const ensureSpace = (needed) => {
    if (y + needed > MAX_Y) {
      pdf.addPage();
      y = TOP_Y;
    }
  };

  // Wrapped body text with automatic page breaks (used outside cards, e.g. the entry text)
  const addWrapped = (text, { size = 10.5, style = 'normal', color = INK, x = MARGIN, w = CONTENT_W, lh = 5.3, gapAfter = 3 } = {}) => {
    if (!text) return;
    pdf.setFont(FONT(pdf), style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(String(text), w);
    for (const line of lines) {
      if (y > MAX_Y) { pdf.addPage(); y = TOP_Y; }
      pdf.text(line, x, y);
      y += lh;
    }
    y += gapAfter;
  };

  // A plain (uncarded) coloured section heading with a small accent tick —
  // used only for the entry/transcription text, which can be arbitrarily
  // long and so isn't a good fit for a fixed-height card.
  const sectionHeading = (label, color) => {
    ensureSpace(14);
    y += 4;
    pdf.setFillColor(...color);
    pdf.roundedRect(MARGIN, y - 3.4, 2.4, 4.6, 1, 1, 'F');
    pdf.setFont(FONT(pdf), 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...color);
    pdf.text(String(label), MARGIN + 5.5, y);
    y += 6.5;
  };

  // A tinted, rounded card containing a heading + wrapped body text. Height is
  // measured up front so the card never gets split across a page break —
  // safe here because these sections (summary/reflection/action) are always
  // short; the one unbounded section (entry text) intentionally isn't carded.
  const textSectionCard = (label, color, text, { style = 'normal', fontSize = 10.5, lh = 5.4 } = {}) => {
    if (!text) return;
    pdf.setFont(FONT(pdf), style);
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(String(text), CONTENT_W - 16);
    const headingH = 11;
    const cardH = headingH + lines.length * lh + 8;
    ensureSpace(cardH + 6);
    y += 4;
    const top = y;
    pdf.setFillColor(...tintColor(color, 0.09));
    pdf.roundedRect(MARGIN, top, CONTENT_W, cardH, 3, 3, 'F');
    pdf.setFillColor(...color);
    pdf.roundedRect(MARGIN, top, 2.4, cardH, 1, 1, 'F');
    pdf.setFont(FONT(pdf), 'bold');
    pdf.setFontSize(11.5);
    pdf.setTextColor(...color);
    pdf.text(String(label), MARGIN + 8, top + 8);
    pdf.setFont(FONT(pdf), style);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(...INK);
    let ty = top + headingH + 4;
    lines.forEach((line) => { pdf.text(line, MARGIN + 8, ty); ty += lh; });
    y = top + cardH + 5;
  };

  // ===== Header band (page 1) =====
  const HEADER_H = 54;
  pdf.setFillColor(...DARKGREEN);
  pdf.rect(0, 0, PAGE_W, HEADER_H, 'F');
  pdf.setFillColor(...GREEN);
  pdf.rect(0, HEADER_H, PAGE_W, 1.4, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont(FONT(pdf), 'bold');
  pdf.setFontSize(19);
  pdf.text('Kairos', MARGIN, 19);
  pdf.setFont(FONT(pdf), 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(206, 220, 211);
  pdf.text(strings.tagline || 'Smart Journal', MARGIN, 25);

  pdf.setTextColor(255, 255, 255);
  pdf.setFont(FONT(pdf), 'bold');
  pdf.setFontSize(15);
  const dayHeading = strings.dayHeading || `Day ${dayNumber}`;
  const headerTextW = mood ? CONTENT_W - 26 : CONTENT_W; // leave room for the mood badge
  const themeLines = theme ? pdf.splitTextToSize(`${dayHeading}  ·  ${theme}`, headerTextW) : [dayHeading];
  pdf.text(themeLines[0], MARGIN, 38);

  pdf.setFont(FONT(pdf), 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(206, 220, 211);
  const metaLine = [pathName, strings.generatedOn].filter(Boolean).join('   ·   ');
  pdf.text(pdf.splitTextToSize(metaLine, headerTextW)[0], MARGIN, 45);

  // Mood ("inner aura") badge, top-right of the header
  if (mood?.id && MOOD_META[mood.id]) {
    const bcx = PAGE_W - MARGIN - 11;
    const bcy = 24;
    pdf.setFillColor(255, 255, 255);
    pdf.circle(bcx, bcy, 10, 'F');
    drawMoodGlyph(pdf, mood.id, bcx, bcy, 6, MOOD_META[mood.id].color);
    if (mood.label) {
      pdf.setFont(FONT(pdf), 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text(String(mood.label), bcx, bcy + 15, { align: 'center' });
    }
  }

  y = 66;

  // ===== Infographic strip: stat chips + journey progress =====
  {
    const wordCount = !isVoiceEntry && entryText ? entryText.trim().split(/\s+/).filter(Boolean).length : 0;
    const hasProgress = Number.isFinite(pathDuration) && pathDuration > 0;
    const percent = hasProgress ? Math.max(0, Math.min(100, Math.round((dayNumber / pathDuration) * 100))) : null;

    const chips = [
      {
        big: hasProgress ? `${dayNumber}/${pathDuration}` : `${dayNumber}`,
        label: strings.dayChipLabel || 'Day'
      },
      isVoiceEntry
        ? { big: strings.durationValue || '0:00', label: strings.durationChipLabel || 'Duration' }
        : { big: String(wordCount), label: strings.wordsChipLabel || 'Words' },
      hasProgress
        ? { big: `${percent}%`, label: strings.completeChipLabel || 'Complete' }
        : { big: isVoiceEntry ? '🎤' : '📝', label: strings.entryTypeChipLabel || (isVoiceEntry ? 'Voice' : 'Written') }
    ];

    const gap = 4;
    const chipW = (CONTENT_W - gap * 2) / 3;
    const chipH = 18;
    chips.forEach((chip, i) => {
      const cx = MARGIN + i * (chipW + gap);
      pdf.setFillColor(...tintColor(GREEN, 0.1));
      pdf.roundedRect(cx, y, chipW, chipH, 3, 3, 'F');
      pdf.setFont(FONT(pdf), 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(...GREEN);
      pdf.text(chip.big, cx + chipW / 2, y + 9, { align: 'center' });
      pdf.setFont(FONT(pdf), 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(...MUTE);
      pdf.text(String(chip.label).toUpperCase(), cx + chipW / 2, y + 15, { align: 'center' });
    });
    y += chipH + 6;

    if (hasProgress) {
      pdf.setFont(FONT(pdf), 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...MUTE);
      const progressCaption = strings.progressCaption
        ? strings.progressCaption.replace('{{percent}}', percent)
        : `${percent}% of journey`;
      pdf.text(progressCaption, PAGE_W - MARGIN, y, { align: 'right' });
      y += 3;
      const barH = 3.6;
      pdf.setFillColor(...TRACK);
      pdf.roundedRect(MARGIN, y, CONTENT_W, barH, 1.8, 1.8, 'F');
      const fillW = Math.max(barH, (CONTENT_W * percent) / 100);
      pdf.setFillColor(...GREEN);
      pdf.roundedRect(MARGIN, y, fillW, barH, 1.8, 1.8, 'F');
      y += barH + 8;
    } else {
      y += 4;
    }
  }

  // ===== Prompt =====
  if (prompt) {
    textSectionCard(strings.promptLabel || 'Prompt', GREEN, prompt, { style: 'italic' });
  }

  // ===== Entry / transcription (unbounded length — not carded) =====
  if (entryText) {
    sectionHeading(
      isVoiceEntry ? (strings.transcriptionLabel || 'Voice Transcription') : (strings.entryLabel || 'Journal Entry'),
      GREEN
    );
    if (isVoiceEntry && strings.voiceMeta) {
      addWrapped(strings.voiceMeta, { size: 9, color: MUTE, gapAfter: 2 });
    }
    addWrapped(entryText, {});
  }

  if (analysis) {
    // ===== Summary =====
    if (analysis.summary) {
      textSectionCard(strings.summaryLabel || 'Summary', GREEN, analysis.summary);
    }

    // ===== Key insights (numbered, inside one tinted card) =====
    if (Array.isArray(analysis.insights) && analysis.insights.length > 0) {
      pdf.setFont(FONT(pdf), 'normal');
      pdf.setFontSize(10.5);
      const itemLineGroups = analysis.insights.map((insight) => pdf.splitTextToSize(String(insight), CONTENT_W - 24));
      const headingH = 11;
      const itemsH = itemLineGroups.reduce((sum, lines) => sum + lines.length * 5.3 + 2.5, 0);
      const cardH = headingH + itemsH + 6;
      ensureSpace(cardH + 6);
      y += 4;
      const top = y;
      pdf.setFillColor(...tintColor(GOLD, 0.09));
      pdf.roundedRect(MARGIN, top, CONTENT_W, cardH, 3, 3, 'F');
      pdf.setFillColor(...GOLD);
      pdf.roundedRect(MARGIN, top, 2.4, cardH, 1, 1, 'F');
      pdf.setFont(FONT(pdf), 'bold');
      pdf.setFontSize(11.5);
      pdf.setTextColor(...GOLD);
      pdf.text(strings.insightsLabel || 'Key Insights', MARGIN + 8, top + 8);

      let iy = top + headingH + 4;
      itemLineGroups.forEach((lines, i) => {
        pdf.setFillColor(...GOLD);
        pdf.circle(MARGIN + 11, iy - 1.4, 2.3, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont(FONT(pdf), 'bold');
        pdf.setFontSize(8);
        pdf.text(String(i + 1), MARGIN + 11, iy - 0.2, { align: 'center' });

        pdf.setFont(FONT(pdf), 'normal');
        pdf.setFontSize(10.5);
        pdf.setTextColor(...INK);
        lines.forEach((line) => { pdf.text(line, MARGIN + 17, iy); iy += 5.3; });
        iy += 2.5;
      });
      y = top + cardH + 5;
    }

    // ===== Reflection question =====
    if (analysis.reflectionQuestion) {
      textSectionCard(strings.reflectionLabel || 'A Question to Explore', BLUE, analysis.reflectionQuestion, { style: 'italic' });
    }

    // ===== Suggested action =====
    if (analysis.practicalAction) {
      textSectionCard(strings.actionLabel || 'Your Next Step', ORANGE, analysis.practicalAction);
    }

    // ===== Affirmation (highlighted card) =====
    if (analysis.affirmation) {
      pdf.setFont(FONT(pdf), 'italic');
      pdf.setFontSize(11);
      const quote = `"${analysis.affirmation}"`;
      const lines = pdf.splitTextToSize(quote, CONTENT_W - 12);
      const cardH = lines.length * 5.6 + 18;
      ensureSpace(cardH + 6);
      y += 4;
      // tinted card
      pdf.setFillColor(...tintColor(PURPLE, 0.08));
      pdf.roundedRect(MARGIN, y, CONTENT_W, cardH, 3, 3, 'F');
      pdf.setFillColor(...PURPLE);
      pdf.roundedRect(MARGIN, y, 2.4, cardH, 1, 1, 'F'); // accent edge
      // label
      pdf.setFont(FONT(pdf), 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...PURPLE);
      pdf.text((strings.affirmationLabel || 'Affirmation').toUpperCase(), MARGIN + 8, y + 8);
      // quote
      pdf.setFont(FONT(pdf), 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 45, 90);
      let qy = y + 15;
      lines.forEach((line) => {
        pdf.text(line, MARGIN + 8, qy);
        qy += 5.6;
      });
      y += cardH + 4;
    }
  }

  // ===== Footers on every page =====
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(220, 220, 224);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN, FOOTER_Y - 4, PAGE_W - MARGIN, FOOTER_Y - 4);
    pdf.setFont(FONT(pdf), 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTE);
    pdf.text('Kairos Smart Journal', MARGIN, FOOTER_Y);
    pdf.text(`${i} / ${pageCount}`, PAGE_W - MARGIN, FOOTER_Y, { align: 'right' });
  }

  return pdf.output('blob');
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
  exportSingleEntryToPDF,
  downloadFile
};