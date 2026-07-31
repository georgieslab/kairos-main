# Καιρός Smart Journal: Complete Guide for Adding New Journey Paths

## Required File Updates

When adding a new journey path to the Καιρός Smart Journal application, you will need to update these files:
- **src/data/JourneyData.js** (primary location for defining path data)
- **src/data/journeyTranslations/de/&lt;path-id&gt;.js** (German translation of the path) **[CRITICAL]**
- **src/data/journeyTranslations/ka/&lt;path-id&gt;.js** (Georgian translation of the path) **[CRITICAL]**
- **src/utils/pathTypeUtils.js** (**NEW** - for visual vs text path categorization) **[CRITICAL]**
- **src/pages/HomeScreen.jsx** (to display correct path information on home screen)
- **src/styles/pathSelection.css** (for visual theming and styling) **[CRITICAL]**
- **src/utils/userProgress.js** (optional, for explicit path constants)
- **src/components/journey/JourneyCompletion.jsx** (for path-specific styling)
- **src/services/exportService.js** (for PDF export functionality, usually only needs changes for special cases)

This guide provides step-by-step instructions for adding new journey paths to ensure proper integration across all app components, including visual styling, path type handling, home screen, PDF exports, analytics, and UI rendering.

## 1. Central Path Registry: JourneyData.js

The primary location for defining new paths is in `src/data/JourneyData.js`. This is where all path metadata is defined.

### 1.1 Create the Journey Days Array

First, define the days for your new journey path:

```javascript
// In JourneyData.js
export const newJourneyDays = [
  {
    day: 1,
    title: "First Day Title",
    theme: "First Theme",
    prompt: "First prompt text here"
  },
  // Add more days...
  {
    day: 14, // Or whatever your last day is
    title: "Last Day Title",
    theme: "Last Theme", 
    prompt: "Last prompt text here"
  }
];
```

### 1.2 Register the Path in the JOURNEY_PATHS Registry

Add your path to the central registry:

```javascript
// In JourneyData.js
JOURNEY_PATHS['new-journey-id'] = createJourneyPath({
  id: 'new-journey-id',
  title: "New Journey Name",
  subtitle: "14-day journey description",
  description: "Longer description of the journey...",
  iconName: "IconName", // Must match a Lucide icon name
  days: newJourneyDays,
  color: "123, 45, 67", // RGB format - IMPORTANT for CSS
  tags: ['tag1', 'tag2', 'tag3'],
  duration: 14, // Should match the number of days
  difficulty: 'beginner', // 'beginner', 'intermediate', or 'advanced'
  recommendedFor: ['new journalers', 'specific audiences']
});
```

### 1.3 Available Path Properties

| Property | Type | Description | Required? |
|----------|------|-------------|-----------|
| id | string | Unique identifier (kebab-case) | Yes |
| title | string | Display name of the path | Yes |
| subtitle | string | Short description for path cards | Yes |
| description | string | Longer description of the path | Yes | 
| iconName | string | Name of Lucide icon to display | Yes |
| days | array | Array of day objects with prompts | Yes |
| duration | number | Number of days (should match days array length) | Yes |
| color | string | RGB values for path theming (e.g., "123, 45, 67") | Yes |
| progressField | string | Field name in user profile | Auto-generated |
| isDisabled | boolean | Whether the path is unavailable | No |
| isPremium | boolean | Whether the path requires premium subscription | No |
| tags | array | Tags for filtering and categorization | No |
| difficulty | string | 'beginner', 'intermediate', or 'advanced' | No |
| recommendedFor | array | Audience recommendations | No |

**⚠️ IMPORTANT**: The `color` property must be in RGB format (e.g., "192, 38, 211") as it's used directly in CSS styling.

## 2. **NEW** Path Type Classification: pathTypeUtils.js **[CRITICAL STEP]**

**This is a NEW and ESSENTIAL step!** You must categorize your path as either a visual/artistic path or a traditional text-based journaling path.

### 2.1 Understanding Path Types

**Visual Paths** are for:
- Artistic creation and expression
- Drawing, painting, sketching, digital art
- Color therapy and visual meditation
- Sacred geometry and pattern creation
- Any path focused on creating visual content

**Text Paths** are for:
- Traditional handwritten journaling
- Reflection and written expression
- Goal setting and habit tracking
- Emotional processing through writing

### 2.2 Update pathTypeUtils.js

In `src/utils/pathTypeUtils.js`, add your new path to the appropriate category:

```javascript
// For VISUAL/ARTISTIC paths, add to VISUAL_PATHS array:
const VISUAL_PATHS = [
  'mindful-visualization',
  'artistic-soul-expression', 
  'color-psychology',
  'sacred-geometry',
  'nature-sketching',
  'abstract-emotions',
  'visual-storytelling',
  'ink-essence',
  'your-new-visual-path-id' // ADD HERE if it's visual
];

// For TRADITIONAL JOURNALING paths, add to TEXT_EXTRACTION_PATHS array:
const TEXT_EXTRACTION_PATHS = [
  'self-discovery',
  'emotional-intelligence',
  'mindfulness-awareness',
  'transformation-journey',
  // ... existing paths
  'your-new-text-path-id' // ADD HERE if it's text-based
];
```

### 2.3 Path Type Impact

This categorization affects:
- **Upload UI**: Visual paths show "Upload Artwork" vs "Upload Journal"
- **Text Extraction**: Visual paths skip mandatory text extraction
- **Analysis Approach**: Visual paths analyze artistic elements, text paths analyze written content
- **User Instructions**: Different tips and guidance based on path type

## 3. Path Visual Styling: pathSelection.css **[CRITICAL STEP]**

**This step is ESSENTIAL and often missed!** Every new path needs comprehensive CSS styling to appear correctly in the UI.

### 3.1 Add Color Variable

In the `:root` section of `src/styles/pathSelection.css` (around line 50), add your path's color variable:

```css
:root {
  /* ... existing color variables ... */
  --color-new-journey-id: 123, 45, 67; /* RGB values matching JourneyData.js */
  /* ... rest of variables ... */
}
```

### 3.2 Add Complete CSS Styling (8 Required Sections)

You must add CSS for ALL of these sections. Missing any will cause visual issues:

#### Section 1: Path Card Border Colors (around line 400)
```css
.path-card.new-journey-id {
  border-left-color: rgba(var(--color-new-journey-id), 0.8);
  border-right-color: rgba(var(--color-new-journey-id), 0.8);
  background: linear-gradient(135deg, var(--bg-secondary), rgba(var(--color-new-journey-id), 0.05));
}
```

#### Section 2: Path Card Hover Effects (around line 500)
```css
.path-card.new-journey-id:hover {
  border-left-color: rgb(var(--color-new-journey-id));
  border-right-color: rgb(var(--color-new-journey-id));
  box-shadow: var(--shadow-xl), 0 0 30px rgba(var(--color-new-journey-id), 0.4);
}
```

#### Section 3: Path Icon Wrapper Colors (around line 700)
```css
.path-icon-wrapper.new-journey-id {
  background: rgba(var(--color-new-journey-id), 0.2);
  color: rgb(var(--color-new-journey-id));
  box-shadow: 0 0 20px rgba(var(--color-new-journey-id), 0.3);
}
```

#### Section 4: Progress Fill Colors (around line 900)
```css
.new-journey-id .progress-fill {
  background: linear-gradient(90deg, rgba(var(--color-new-journey-id), 0.8), rgb(var(--color-new-journey-id)));
  box-shadow: 0 0 12px rgba(var(--color-new-journey-id), 0.5);
}
```

#### Section 5: Large Icon Wrapper for Modal (around line 1200)
```css
.path-icon-wrapper-large.new-journey-id {
  background: rgba(var(--color-new-journey-id), 0.2);
  color: rgb(var(--color-new-journey-id));
  box-shadow: 0 0 25px rgba(var(--color-new-journey-id), 0.5);
  border: 2px solid rgba(var(--color-new-journey-id), 0.6);
}
```

#### Section 6: Primary Button Styling (around line 1500)
```css
.primary-button.new-journey-id {
  background: linear-gradient(135deg, rgba(var(--color-new-journey-id), 0.9), rgb(var(--color-new-journey-id)));
}
```

#### Section 7: Modal Header Accents (around line 1700)
```css
.path-details-modal.new-journey-id .modal-header {
  border-bottom: 3px solid rgba(var(--color-new-journey-id), 0.8);
}
```

### 3.3 CSS Implementation Checklist

- [ ] Color variable added to `:root` section
- [ ] Path card border colors and background
- [ ] Path card hover effects with glow
- [ ] Path icon wrapper styling
- [ ] Progress bar fill colors
- [ ] Large icon wrapper for modal
- [ ] Primary button gradient
- [ ] Modal header accent border

**⚠️ Missing any of these CSS sections will result in the path appearing unstyled or with default colors.**

## 4. Translations: German and Georgian **[CRITICAL STEP]**

The app ships in **English, German (`de`), and Georgian (`ka`)**. A path's English text lives in `JourneyData.js`; the other two languages live in separate per-path files. **A new path is not finished until all three exist.**

**Why this is easy to miss:** translation fallback is per-key. A missing file, a missing day, or a missing field silently falls back to English. Nothing errors, nothing warns — the path just quietly becomes the one untranslated item in a German or Georgian user's list.

### 4.1 Create one file per language

```
src/data/journeyTranslations/de/<path-id>.js
src/data/journeyTranslations/ka/<path-id>.js
```

The filename **must exactly match** the path id you registered in `JOURNEY_PATHS`. That's how the two are linked — there is no mapping table.

```javascript
// src/data/journeyTranslations/ka/new-journey-id.js
export default {
  title: "...",
  subtitle: "...",
  description: "...",
  days: {
    1: { title: "...", theme: "...", prompt: `...` },
    2: { title: "...", theme: "...", prompt: `...` },
    // ...one entry per day
  }
};
```

**⚠️ `days` is an object keyed by day number — not an array.** The keys must match the `day` values in your English days array. This is the single most common mistake, because the English side *is* an array.

### 4.2 You do not need to edit JourneyData.js

`JourneyData.js` globs `journeyTranslations/de/*.js` and `journeyTranslations/ka/*.js`, then overlays them onto `JOURNEY_PATHS` in place on every `languageChanged` event. Every consumer — path selection, home screen, `pathRecommender.js`, PDF export — picks up the active language with no lookup logic of its own.

The glob finds new files automatically. You only touch `JOURNEY_TRANSLATION_MODULES` when adding a whole new **language**, not a new path.

### 4.3 Match the English prompt structure exactly

Current prompts follow: **hook line → blank line → `•` bullets → blank line → closer line.** A translation must preserve:

- the **same number of bullets**
- the **same blank-line block structure**
- **identical `{{placeholders}}`** (`{{count}}`, `{{day}}`, …)

A dropped bullet or an extra blank line breaks the rendered prompt even though the file parses fine.

### 4.4 What stays untranslated

- Brand names: `Kairos Moments`, `Kairos Cards`, `Kairos Sparks`, `Artisan`, `Καιρός`
- **Literal tokens the code compares against** — e.g. the confirmation word `DELETE`, which `UserSettings.jsx` checks with `!== 'DELETE'`. Translating it locks the user out of the action.
- Technical terms with no settled equivalent in the target language

### 4.5 Verify before you call it done

Check every day number is present and that bullet counts and blank-line block counts match English, for both languages. Then:

```bash
npx vite build
```

The build will not catch a missing translation — only a syntax error. The structural check is what actually protects you.

### 4.6 If you later edit an English prompt

Translations **do not** auto-update. Editing English leaves `de` and `ka` holding the old text, and nothing flags it. This has already happened at scale: 49 of 51 German files went stale after an English prompt rewrite, and had to be redone. **Change all three languages in the same commit.**

### 4.7 Translation Checklist

- [ ] `journeyTranslations/de/<path-id>.js` created, filename matches the path id exactly
- [ ] `journeyTranslations/ka/<path-id>.js` created, filename matches the path id exactly
- [ ] `days` is an **object keyed by day number**, not an array
- [ ] Every day from the English array is present in both files
- [ ] Bullet count and blank-line blocks match English for every prompt
- [ ] `{{placeholders}}` identical to English
- [ ] Brand names and code-compared literals left untranslated
- [ ] `npx vite build` passes
- [ ] Switched the app to DE and to KA and confirmed the path renders translated

## 5. Update Home Screen Component

The home screen needs to display the correct path information for new paths. Update the `getPathProgress` function in `src/pages/HomeScreen.jsx`.

### 5.1 Add Your Path to the HomeScreen's getPathProgress Function

```javascript
// In src/pages/HomeScreen.jsx
const getPathProgress = () => {
  // Default to self-discovery
  let pathProgress = userProfile?.journeyProgress?.selfDiscoveryProgress;
  let pathMaxDays = 10;
  let pathName = 'Self-Discovery Journey';
  
  // Determine which path we're on
  switch(currentPath) {
    // Existing cases...
    
    // Add your new path case:
    case 'new-journey-id':
      pathProgress = userProfile?.journeyProgress?.newJourneyProgress;
      pathName = 'New Journey Name';
      pathMaxDays = 14; // Set to the correct number of days
      break;
      
    // Default case...
  }
  
  // Rest of the function...
};
```

## 6. Update Progress Tracking

For consistent progress tracking across the app, ensure the path ID is handled correctly in progress-related utilities.

### 6.1 Update userProgress.js (Optional)

This step is optional as the code now dynamically generates progress field names, but adding explicit constants can improve code readability:

```javascript
// In src/utils/userProgress.js
export const PATHS = {
  // Existing paths...
  NEW_JOURNEY: 'new-journey-id'
};
```

## 7. Update Export Service for PDF Generation

The PDF export service should automatically detect new paths through the central registry, but you should check for any hardcoded path information.

### 7.1 Check Path Information in exportService.js

Make sure the `getPathInfo` function in `src/services/exportService.js` will properly handle your new path:

```javascript
// This function should already be updated to use the central registry
const getPathInfo = (pathId) => {
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
```

### 7.2 Add Fallback Values (Optional)

For additional robustness, you can add fallback values to the default functions:

```javascript
const getDefaultPathName = (pathId) => {
  const pathNames = {
    // Existing paths...
    'new-journey-id': 'New Journey Name'
  };
  
  return pathNames[pathId] || 'Καιρός Journey';
};

const getDefaultPathDuration = (pathId) => {
  const durations = {
    // Existing paths...
    'new-journey-id': 14
  };
  
  return durations[pathId] || 10;
};

const getDefaultPathDescription = (pathId) => {
  const descriptions = {
    // Existing paths...
    'new-journey-id': 'Description of the new journey path.'
  };
  
  return descriptions[pathId] || 'A guided journaling experience that supports personal reflection and growth.';
};
```

## 8. Update Journey Completion Component

The journey completion screen might have path-specific styling that needs to be updated.

### 8.1 Update JourneyCompletion.jsx Path Information

```javascript
// In src/components/journey/JourneyCompletion.jsx
const getPathInfo = () => {
  // Check if this has been updated to use the central registry
  // If not, add your new path case:
  switch(pathId) {
    // Existing cases...
    case 'new-journey-id':
      return {
        title: "New Journey Name",
        subtitle: "You've completed your 14-day New Journey!",
        icon: <YourIcon className="path-icon" />,
        nextSuggestion: "Consider exploring our Emotional Intelligence path...",
        color: "from-blue-400 to-blue-600",
        iconBg: "bg-blue-900",
        iconText: "text-blue-400",
        themeName: "new-journey"
      };
    // Default case...
  }
};
```

## 9. Update Analytics Integration (Optional)

If you've added specialized analytics for specific paths, make sure to incorporate your new path:

### 9.1 JournalAnalyticsDashboard.jsx Path Filtering

Check if there's path-specific analytics logic:

```javascript
// In src/pages/JournalAnalyticsDashboard.jsx
// Look for path-specific filtering or processing logic
```

## 10. Testing Your New Path

After adding a new path, test these key areas:

### 10.1 **NEW** Path Type Testing **[CRITICAL]**
- [ ] **Visual Path Upload**: If visual, shows "Upload Artwork" interface
- [ ] **Text Path Upload**: If text, shows "Upload Journal" interface
- [ ] **Text Extraction**: Visual paths skip mandatory extraction, text paths require it
- [ ] **Analysis Flow**: Appropriate analysis type for path category
- [ ] **User Instructions**: Correct tips and guidance for path type

### 10.2 Visual Styling Tests **[CRITICAL]**
- [ ] **Path Selection Screen**: New path appears with correct color theme
- [ ] **Path Card**: Shows colored left/right borders matching the theme
- [ ] **Hover Effects**: Card glows with appropriate color when hovered
- [ ] **Icon Background**: Icon has colored background with subtle shadow
- [ ] **Progress Bar**: Fills with colored gradient matching the theme
- [ ] **Modal Styling**: Details modal shows colored header accent
- [ ] **Buttons**: Primary buttons use colored gradient
- [ ] **Mobile View**: All styling works correctly on mobile devices

### 10.3 Functionality Tests
- [ ] **Path Metadata**: Verify correct title, subtitle, description, duration, difficulty
- [ ] **Home Screen**: Path name, description, and progress display correctly
- [ ] **Journey Progress**: Day completion tracking works correctly
- [ ] **Path Completion**: Completion celebration appears when all days finished
- [ ] **PDF Export**: Exports include proper path information and colors
- [ ] **Analytics**: Journal entries for new path appear in analytics
- [ ] **Navigation**: Navigation between different paths works smoothly

### 10.4 Cross-Device Tests
- [ ] **Desktop**: Full functionality and styling
- [ ] **Tablet**: Responsive design works correctly
- [ ] **Mobile**: Touch interactions and mobile-specific styling
- [ ] **Dark/Light Theme**: Path styling works in both themes

## 11. Best Practices

1. **Use Kebab Case for IDs**: All path IDs should use kebab-case (e.g., 'new-journey-id')
2. **Complete Metadata**: Always provide all relevant metadata when creating a path
3. **Consistent Colors**: Use RGB format for colors (e.g., "123, 45, 67") and ensure consistency between JourneyData.js and CSS
4. **Icon Names**: Make sure icon names match available Lucide icons
5. **Day Structure**: Always include day number, title, theme, and prompt for each day
6. **Duration Match**: Ensure the path duration matches the number of days in the days array
7. **Complete CSS**: Never skip CSS styling - add all 8 required CSS sections
8. **Path Type Classification**: Always categorize as visual or text in pathTypeUtils.js
9. **Test Thoroughly**: Check path behavior in all app sections, especially visual styling and upload flow
10. **Check Mobile View**: Ensure the path displays correctly on smaller screens
11. **Color Accessibility**: Choose colors that work well in both light and dark themes

## 12. Troubleshooting Common Issues

If you encounter issues when implementing a new path:

### 12.1 Path Not Appearing Issues
1. **Path not showing up**: Ensure it's properly registered in JOURNEY_PATHS
2. **Progress not tracking**: Verify that progressField matches what's expected in userProfile
3. **Home screen shows incorrect info**: Check that you've added your path to the getPathProgress function

### 12.2 **NEW** Path Type Issues **[MOST COMMON]**
4. **Wrong upload interface**: Check that path is correctly categorized in pathTypeUtils.js
5. **Text extraction not working**: Verify visual paths are in VISUAL_PATHS array
6. **Wrong analysis approach**: Ensure path type matches expected behavior
7. **Incorrect user instructions**: Verify path categorization affects UI text properly

### 12.3 Visual Styling Issues **[MOST COMMON]**
8. **Path appears with default/no colors**: Check that CSS color variable is added to `:root`
9. **No colored borders**: Verify `.path-card.your-path-id` CSS is added
10. **No hover glow effect**: Check that hover CSS with `box-shadow` is added
11. **Progress bar is default color**: Verify `.your-path-id .progress-fill` CSS is added
12. **Icon has no background color**: Check `.path-icon-wrapper.your-path-id` CSS is added
13. **Modal lacks colored header**: Verify `.path-details-modal.your-path-id .modal-header` CSS is added
14. **Buttons are default color**: Check `.primary-button.your-path-id` CSS is added

### 12.4 Technical Issues
15. **Completion not detected**: Ensure pathMaxDays in HomeScreen matches your path's actual days count
16. **Icons not displaying**: Check that iconName exactly matches a Lucide icon name
17. **UI not adapting to path length**: Make sure components are using the path registry data
18. **Color format errors**: Verify color values are in correct RGB format without commas in CSS

### 12.5 Export and Integration Issues
19. **PDF export problems**: Confirm fallback values in exportService.js
20. **Analytics not working**: Check path-specific filtering if implemented
21. **Cross-device issues**: Test responsive design with the new path colors

## 13. **NEW** Path Type Reference Guide

### 13.1 Visual/Artistic Paths
**Use for paths involving:**
- Drawing, painting, sketching
- Digital art creation
- Color therapy and exploration
- Sacred geometry and patterns
- Photography and visual documentation
- Abstract expression
- Visual storytelling

**These paths will:**
- Show "Upload Artwork" instead of "Upload Journal"
- Skip mandatory text extraction
- Focus on visual analysis (colors, composition, artistic elements)
- Provide creative-focused tips and instructions

### 13.2 Text-Based Journaling Paths
**Use for paths involving:**
- Traditional handwritten reflection
- Goal setting and planning
- Emotional processing through writing
- Habit tracking and analysis
- Life transitions and decision-making
- Therapeutic writing exercises

**These paths will:**
- Show "Upload Journal" interface
- Require text extraction from handwritten pages
- Focus on text content analysis
- Provide traditional journaling tips and instructions

## 14. CSS Color Reference

Common RGB color values for inspiration:
- **Purple**: `192, 38, 211` (vibrant), `124, 58, 237` (deep), `147, 51, 234` (medium)
- **Pink**: `236, 72, 153` (vibrant), `244, 114, 182` (soft)
- **Blue**: `59, 130, 246` (bright), `37, 99, 235` (medium)
- **Green**: `16, 185, 129` (emerald), `22, 163, 74` (forest)
- **Orange**: `234, 88, 12` (vibrant), `245, 158, 11` (amber)
- **Red**: `220, 38, 38` (vibrant), `239, 68, 68` (softer)

## 15. Future Improvements

For developers working on enhancing the path system further:

1. **Refactor HomeScreen.jsx**: Consider updating the HomeScreen component to use the centralized registry instead of a switch statement. This would eliminate the need to update HomeScreen for each new path:

```javascript
// Better approach using the path registry
const getPathProgress = () => {
  try {
    // Get path information from the centralized registry
    const pathData = getJourneyPath(currentPath);
    
    if (!pathData) {
      console.warn(`Path data not found for ${currentPath}`);
      return defaultPathProgress;
    }
    
    // Get the progress field name dynamically
    const progressField = getProgressFieldForPath(currentPath);
    
    // Get the path progress from user profile
    const pathProgress = userProfile?.journeyProgress?.[progressField];
    
    return {
      completedDays: pathProgress?.completedDays || [],
      progressPercentage: Math.round(((pathProgress?.completedDays || []).length / pathData.duration) * 100),
      pathName: pathData.title,
      pathMaxDays: pathData.duration
    };
  } catch (error) {
    console.error('Error getting path progress:', error);
    return defaultPathProgress;
  }
};
```

2otras**Improve JourneyCompletion.jsx**: Similarly, update the completion component to use the registry
3. **Enhance Path Validation**: Add validation to ensure all required fields are present when creating paths
4. **Auto-generate CSS**: Create a build tool that automatically generates CSS from path definitions
5. **Color Theme Validation**: Add tools to ensure color accessibility and consistency
6. **Dynamic Path Type Detection**: Automatically detect path type based on prompt content or metadata

## 16. Complete Implementation Checklist

Use this checklist to ensure you haven't missed any steps:

### Core Implementation
- [ ] Journey days array created in JourneyData.js
- [ ] Path registered in JOURNEY_PATHS registry
- [ ] All required properties provided (id, title, subtitle, description, iconName, days, duration, color)

### Translations (see Section 4) **[CRITICAL]**
- [ ] `journeyTranslations/de/<path-id>.js` created (filename == path id)
- [ ] `journeyTranslations/ka/<path-id>.js` created (filename == path id)
- [ ] `days` is an object keyed by day number in both files
- [ ] Every day present; bullet counts and blank-line blocks match English
- [ ] Verified by switching the app to DE and KA

### **NEW** Path Type Classification
- [ ] Path categorized as visual or text in pathTypeUtils.js VISUAL_PATHS or TEXT_EXTRACTION_PATHS
- [ ] Path type matches intended user experience (artwork vs writing)
- [ ] Upload flow tested for correct path type behavior

### CSS Styling (8 Required Sections)
- [ ] Color variable added to `:root` section
- [ ] Path card border colors and background (.path-card.your-path-id)
- [ ] Path card hover effects (.path-card.your-path-id:hover)
- [ ] Path icon wrapper styling (.path-icon-wrapper.your-path-id)
- [ ] Progress bar fill colors (.your-path-id .progress-fill)
- [ ] Large icon wrapper for modal (.path-icon-wrapper-large.your-path-id)
- [ ] Primary button gradient (.primary-button.your-path-id)
- [ ] Modal header accent (.path-details-modal.your-path-id .modal-header)

### Component Updates
- [ ] HomeScreen.jsx switch statement updated
- [ ] exportService.js fallback values added (optional)
- [ ] JourneyCompletion.jsx path case added
- [ ] userProgress.js constants added (optional)

### Testing
- [ ] Path appears in selection screen with correct styling
- [ ] **NEW** Upload interface matches path type (artwork vs journal)
- [ ] **NEW** Text extraction behavior matches path type
- [ ] Home screen displays path information correctly
- [ ] Progress tracking works across sessions
- [ ] Completion flow works properly
- [ ] PDF export includes path data
- [ ] Mobile and desktop views work correctly
- [ ] Dark and light themes work correctly

By following this comprehensive guide, you can seamlessly add new journaling paths to the Καιρός Smart Journal app while maintaining consistency across all components, ensuring proper visual styling, and providing the appropriate user experience for both visual/artistic paths and traditional text-based journaling paths.