// src/utils/versionControl.js

export const APP_VERSION = '0.2-beta';

export const VERSION_HISTORY = [
  {
    version: '0.1.0',
    releaseDate: '2025-02-15',
    features: [
      'Initial release with Self-Discovery journey',
      'AI-powered journal analysis',
      'Handwriting recognition',
      'Journey completion analysis'
    ],
    bugFixes: []
  },
  {
    version: '0.1.1',
    releaseDate: '2025-03-04',
    features: [
      '3 different 10 days journey for free users',
      'New premium "coming soon" journey available',
      'UI improvements',
    ],
    bugFixes: [
      'fixed image/text extraction bug'
    ]
  },
  {
    version: '0.2.0',
    releaseDate: '2025-03-09',
    features: [
      '3 different 10-day journaling paths available for all users',
      'Enhanced path progress tracking and visualization',
      'Improved navigation between journaling paths',
      'Smarter day tracking that remembers your progress',
      'New premium "coming soon" journeys preview',
      'More detailed analytics on your journaling patterns',
      'Offline support for journal uploads'
    ],
    bugFixes: [
      'Fixed "Continue Journey" navigation issues',
      'Improved reliability of text extraction from journal images',
      'Fixed incorrect day display in Write tab',
      'Resolved Firestore permission issues with image uploads',
      'Fixed journey preview to respect user progress',
      'Improved error handling throughout the app',
      'Enhanced data loading with better fallback options'
    ],
    improvements: [
      'Faster journaling analysis with Claude 3.7 Sonnet',
      'Smoother transitions between screens',
      'More detailed instructions for each journaling day',
      'Enhanced user interface for path selection',
      'Better display of completed days and progress'
    ],
    notes: [
      'This update focuses on improving the core user journey and fixing navigation issues',
      'For the best experience, please ensure you have an active internet connection when analyzing journal entries',
      'Your journaling data is now automatically synced when you come back online after writing in offline mode'
    ]
  },
  {
    version: '0.3.0',
    releaseDate: '2025-03-10',
    features: [
      'New 21-day "Transformation Journey: Breaking Patterns" recovery path',
      'Enhanced analytics system with intelligent caching',
      'Specialized recovery resources and support information',
      'Teal color scheme for the Transformation Journey experience',
      'Special disclaimer system for sensitive journaling topics',
      'Support for different journey lengths (10-day and 21-day paths)',
      'Add-on product catalog with premium journaling accessories',
      'Automatic analytics refresh when new journal entries are made'
    ],
    bugFixes: [
      'Fixed analytics tab data refreshing unnecessarily',
      'Resolved timestamp handling issues in calendar visualization',
      'Fixed infinite loop bug when viewing journey details',
      'Corrected navigation issues between different path lengths',
      'Improved date and time handling for journal entries',
      'Fixed cache persistence issues between sessions',
      'Resolved path selection navigation edge cases'
    ],
    improvements: [
      'Optimized API usage with intelligent caching system',
      'Enhanced navigation between different journey path types',
      'Improved progress tracking for longer journeys',
      'Better performance on analytics tab with caching',
      'Enhanced visualization handling for date-based analytics',
      'More descriptive journey details and path information',
      'Smoother experience when switching between analytics views'
    ],
    notes: [
      'The new Transformation Journey is designed to support pattern-breaking and recovery',
      'This update significantly improves performance for users with many journal entries',
      'The 21-day journey offers a more comprehensive experience for serious journalers',
      'For users in recovery: journaling is a supplement to, not replacement for, professional support',
      'Links to professional resources are available within the Transformation Journey',
      'All analytics are now cached locally for improved privacy and performance'
    ]
  },
  {
    version: "0.4.0",
    releaseDate: "2025-03-16",
    features: [
      "Flexible journey path architecture supporting varied durations (10, 14, 21, 30, and 100 days)",
      "New 14-day 'Creative Expression' journey for developing artistic practice",
      "New 30-day 'Habit Formation' journey for establishing lasting behavior changes",
      "Premium 100-day 'Life Vision & Purpose' comprehensive life planning journey",
      "Path filtering system (All, In Progress, Not Started, by duration)",
      "Complete 21-day Transformation Journey with recovery focus",
      "Expanded Premium Journeys section with 8 upcoming specialized paths",
      "Dynamic UI that adapts to journey length with intelligent day grouping",
      "Journey-specific color theming and iconography system",
      "Centralized path registry for easy future expansion"
    ],
    bugFixes: [
      "Fixed infinite loop issue in path selection component",
      "Resolved auto-expanding issue with self-discovery path",
      "Fixed path details toggle behavior across all journey types",
      "Corrected styling issues with filter buttons",
      "Fixed React key warnings for journey path lists",
      "Resolved syntax errors in component descriptions",
      "Fixed event bubbling issues with path action buttons",
      "Corrected edge cases in journey day completion tracking",
      "Fixed memory leaks in path selection rendering",
      "Resolved inconsistent state updates in expanded path views"
    ],
    improvements: [
      "Optimized state management with useMemo hooks for better performance",
      "Enhanced path navigation between different journey lengths",
      "Improved progress visualization for longer journeys",
      "Streamlined path addition process requiring changes to only one file",
      "Better responsive design for path selection on all devices",
      "Intelligence pagination for journeys longer than 20 days",
      "Enhanced path completion status visualization",
      "More descriptive journey details with difficulty levels and duration indicators",
      "Smoother transitions between expanded and collapsed path views",
      "Improved accessibility with ARIA attributes on interactive elements"
    ],
    notes: [
      "The flexible architecture allows for journeys of any length from 1-100+ days",
      "The 100-day Life Vision journey guides users through comprehensive life planning with 10 thematic sections",
      "Premium paths provide a preview of upcoming features in the Premium subscription",
      "Each journey has a consistent theme structure regardless of length",
      "Long journeys (>20 days) display intelligently to avoid overwhelming users",
      "The new path filtering system helps users find journeys based on their needs and time commitment",
      "All new journeys feature unique color schemes and icons that reflect their themes",
      "Future journeys can now be added with minimal code changes thanks to the registry architecture",
      "Path progress is consistently tracked across all journey lengths",
      "The Creative Expression journey helps users overcome creative blocks and establish artistic practice"
    ]
  },
  {
    version: '0.5.0',
    releaseDate: '2025-02-15',
    features: [
      'Export journal entries to PDF',
      'Text Extraction Enhancements',
    ],
    bugFixes: []
  },
  {
    version: '0.5.1',
    releaseDate: '2025-04-05',
    features: [
      'PDF export functionality for completed journeys',
      'Enhanced multi-page journal support (up to 2 pages per entry)',
      'Improved journey completion experience',
      'Active journey tracking with streak counter',
      'Updated profile page with journey progress visualization'
    ],
    bugFixes: [
      'Fixed text extraction issues with various image formats',
      'Resolved navigation issues between different journeys',
      'Improved handling of Claude API responses',
      'Fixed incorrect prompt display on homepage',
      'Enhanced error handling during image processing'
    ]
  },
  {
    version: '0.5.2',
    releaseDate: '2025-04-24',
    features: [
      'Universal path handling architecture for consistent journey tracking',
      'Improved current path synchronization across all components',
      'Enhanced Firebase integration for journey progress storage',
      'Context-aware journey UI that displays correct path information',
      'Transformation Journey disclaimer with improved accessibility'
    ],
    bugFixes: [
      'Fixed journey completion screen loop when viewing completed paths',
      'Resolved "Cannot access M before initialization" module error',
      'Fixed Transformation Journey disclaimer button functionality',
      'Corrected path display inconsistencies between home screen and write tab',
      'Fixed path context synchronization issues across components',
      'Improved handling of multiple active journeys'
    ],
    improvements: [
      'Centralized path registry for consistent path identification',
      'Enhanced path progress tracking with standardized field names',
      'Safer initialization patterns for better error handling',
      'More robust navigation state management',
      'Better debug logging for troubleshooting',
      'Improved backward compatibility for legacy path structures'
    ],
    notes: [
      'This update focuses on journey context consistency and navigation stability',
      'Path selection now properly updates the current path in your profile',
      'All components now display the correct path information consistently',
      'Added ability to switch between journeys with confirmation',
      'Fixed multiple journey paths appearing active simultaneously'
    ]
  },
  {
    version: '0.5.3',
    releaseDate: '2025-04-26',
    features: [
      'Enhanced PDF export with improved visual design',
      'New Καιρός branding throughout exported documents',
      'Text export option for journal entries'
    ],
    bugFixes: [
      'Fixed journey completion data display issues',
      'Resolved logo display problems in PDF exports',
      'Fixed overlapping text in "Your Affirmation" and "Next Steps" sections',
      'Corrected theme tags rendering in completion screen',
      'Fixed validation issues with completion analysis data',
      'Addressed missing data in journey completion screen'
    ],
    improvements: [
      'More lenient validation of completion data for better user experience',
      'Enhanced error handling for PDF generation',
      'Better spacing and typography in exported documents',
      'Improved rendering of journey analysis sections',
      'More robust fallbacks for missing completion data',
      'Consistent export options across all journey paths',
      'Better progress reporting during export process'
    ],
    notes: [
      'This update focuses on improving the journey completion experience and export functionality',
      'PDF exports now include high-quality Καιρός branding and logos',
      'Journey completion now shows all insights and themes consistently',
      'The export process provides clearer feedback on progress',
      'Exports now support both PDF and plain text formats for flexibility'
    ]
  },
  {
    version: '0.5.4',
    releaseDate: '2025-05-02',
    features: [
      'Persistent back button in daily journey view for easier navigation',
      'Redesigned journey day view with enhanced visual styling',
      'Improved path theme integration throughout journal screens',
      'Visual Enhancements & Animations'
    ],
    bugFixes: [
      'Fixed navigation issue where viewing archived entries showed blank screens',
      'Resolved bottom navigation indicator not highlighting correctly on daily view',
      'Fixed journey context reset issues when navigating between day views',
      'Corrected view context problems causing entries not to load properly',
      'Fixed data fetching logic to properly reset when changing viewing contexts'
    ],
    improvements: [
      'Completely redesigned day journey view with enhanced typography and layout',
      'Better visual hierarchy for daily prompts and entry information',
      'Improved navigation between day entries with smoother transitions',
      'More consistent path color theming across all journey components',
      'Enhanced loading states with animated indicators',
      'Design Improvements for Home Screen',
      'Better error handling for journal entry loading',
      'Clearer content organization for journal entries and analysis',
      'Improved responsive design for all screen sizes'
    ],
    notes: [
      'This update focuses on navigation improvements and visual refinements',
      'The daily journey view now shows a back button for easier path navigation',
      'Bottom navigation now correctly indicates which section you\'re in',
      'The redesigned day view provides a more immersive journaling experience',
      'Journal archives can now be viewed reliably without navigation issues',
      'Path colors are now consistently applied throughout the journey experience'
    ]
  },
  {
    version: '0.5.5',
    releaseDate: '2025-05-04',
    features: [
      'Enhanced version display with changelog history',
      'Redesigned analytics dashboard with improved visualizations',
      'Updated visualization components with better data handling'
    ],
    bugFixes: [
      'Fixed overlapping "Your Journaling Habits" title in calendar visualization',
      'Resolved spacing issue between "Entry Count" legend and "Current Streak" metrics', 
      'Fixed duplicate headings in Emotions tab analytics',
      'Corrected text cutoff issues in journal entry summaries',
      'Fixed theme cloud visualization layout issues',
      'Resolved inconsistent spacing in analytics cards',
      'Fixed bar chart label alignment in emotion analytics'
    ],
    improvements: [
      'Added proper spacing between visualization components',
      'Enhanced calendar component with better title handling',
      'Improved spacing in consistency metrics section',
      'Better visual hierarchy for analytics dashboard sections',
      'Added animated transitions between analytics tabs',
      'Enhanced responsive design for all analytics components',
      'Optimized data processing for faster visualization rendering',
      'More consistent styling across all analytics visualizations'
    ],
    notes: [
      'This update focuses on visual refinements to the analytics dashboard',
      'Analytics visualizations now properly handle all data types and edge cases',
      'The new version display makes it easier to track app changes and improvements',
      'All analytics components now maintain proper spacing and avoid overlapping elements',
      'Visualizations now respond better to different screen sizes and data volumes'
    ]
  },
  {
    version: '0.6.0',
    releaseDate: '2025-05-10',
    features: [
      'Multi-image upload support (up to 5 pages per entry)',
      'User choice between single and multiple page uploads',
      'Enhanced analysis for multi-page journal entries'
    ],
    bugFixes: [
      'Fixed issues with image upload limits in previous versions',
      'Resolved text extraction errors for multi-page entries'
    ],
    improvements: [
      'Streamlined upload process with clearer user options',
      'Optimized performance for processing multiple images',
      'Enhanced UI feedback during multi-page analysis'
    ],
    notes: [
      'This update significantly enhances the journaling experience by allowing more flexible entry formats',
      'Users can now upload up to 5 images per journal entry for more comprehensive daily reflections',
      'The analysis system has been upgraded to handle multi-page entries seamlessly'
    ]
  },
  {
    version: '0.6.1',
    releaseDate: '2025-05-15',
    features: [
      'Unified journal upload interface combining single and multi-page options',
      'Automatic text extraction for all uploaded journal images',
      'Streamlined two-step upload process (Upload → Review & Submit)',
      'Enhanced multi-page preview with thumbnail navigation',
      'Text editing capabilities for refined journal entries'
    ],
    bugFixes: [
      'Fixed issue where upload interface showed incorrect stages',
      'Resolved navigation problems between upload steps',
      'Fixed inconsistent text extraction for multi-page entries',
      'Corrected visual issues with image carousel controls'
    ],
    improvements: [
      'Simplified user experience by removing unnecessary decision points',
      'Enhanced visual feedback during text extraction and upload processes',
      'Optimized file handling for smoother multi-page uploads',
      'Improved accessibility of image controls and navigation',
      'Better error handling with clearer user messages'
    ],
    notes: [
      'This update refines the multi-page upload experience introduced in version 0.6.0',
      'Users no longer need to choose between single and multi-page uploads upfront',
      'Journal entries now automatically include extracted text for better analysis and record-keeping',
      'The simplified interface makes journaling more intuitive while maintaining advanced functionality'
    ]
  },
  {
    version: '0.6.2',
    releaseDate: '2025-05-20',
    features: [
      'Improved multi-page journal upload with user-initiated text extraction',
      'New "Upload and Analyze" button for greater control over image processing',
      'Enhanced visual feedback during the upload and extraction process'
    ],
    bugFixes: [
      'Fixed issue with automatic text extraction starting immediately after image upload',
      'Improved error handling during the extraction process',
      'Resolved UI inconsistencies in the upload flow'
    ],
    improvements: [
      'More intuitive journal upload workflow with clear step progression',
      'Better user guidance with explanatory text at each stage',
      'Enhanced styling for action buttons and interactive elements',
      'Improved responsiveness of upload interface on smaller screens'
    ],
    notes: [
      'This update provides greater user control over the journal analysis process',
      'Users can now add all desired images before initiating the text extraction',
      'The improved flow helps users understand each step in the journaling process',
      'This change addresses user feedback about wanting more control over when processing begins'
    ]
  },
  {
    version: '0.6.3',
    releaseDate: '2025-05-25',
    features: [
      'Enhanced visual design for the daily journal prompt interface',
      'Improved WriteTab with more intuitive prompt styling',
      'New pill-style day heading with clearer visual hierarchy',
      'Refined quotation styling for journal prompts'
    ],
    bugFixes: [
      'Fixed blurry icon rendering in journal entry buttons',
      'Resolved inconsistent styling in day titles and theme indicators',
      'Fixed animation issues causing UI jitter on some devices',
      'Corrected padding and alignment issues in prompt containers'
    ],
    improvements: [
      'Added meaningful icons throughout the journaling interface',
      'Enhanced typography with better readability and contrast',
      'Improved color scheme for prompt themes and indicators',
      'More consistent visual styling across all journey paths',
      'Enhanced mobile experience with better button sizing and spacing',
      'Optimized animations for smoother performance on all devices',
      'Added CSS variables for easier theming and maintenance'
    ],
    notes: [
      'This update focuses on visual refinements to improve the journaling experience',
      'The day title now appears in a distinctive pill-shaped container for better visibility',
      'Prompt text is now styled with clear quotation marks and improved readability',
      'The new design creates a more cohesive and premium feel across the application'
    ]
  },
  {
    version: '0.7.0',
    releaseDate: '2025-05-30',
    features: [
      'Centralized theme system with consistent dark/light mode across all screens',
      'New ThemeProvider context for app-wide theme state management',
      'Persistent theme preferences saved across sessions',
      'Theme toggle in Profile and Home screens for easy switching'
    ],
    bugFixes: [
      'Fixed inconsistent theme state between screens and tabs',
      'Resolved theme flickering when navigating between screens',
      'Fixed light theme rendering issues in certain components',
      'Corrected theme-related styling inconsistencies across the app'
    ],
    improvements: [
      'Unified theme variables across all components for consistent styling',
      'Enhanced theme switching with smooth transitions',
      'Better accessibility with improved color contrast in both themes',
      'Optimized theme implementation for better performance',
      'Simplified theme integration for future components and features',
      'More intuitive theme controls with consistent placement'
    ],
    notes: [
      'The new theme system provides a unified experience across the entire application',
      'Your theme preference is now remembered between sessions for a more personalized experience',
      'Light mode has been redesigned to ensure optimal readability and reduced eye strain',
      'Future updates will extend theming capabilities with additional customization options'
    ]
  },
  {
    version: '0.7.1',
    releaseDate: '2025-06-05',
    features: [
      'Six new journey paths with diverse themes and durations',
      'New 22-day "Life Values & Core Principles" journey for value exploration',
      'New 30-day "Relationship Mastery" journey for deeper connections',
      'New 21-day "Financial Mindfulness" journey for healthy money relationship',
      'New 10-day "Gratitude Practice" journey for cultivating daily appreciation',
      'New 10-day "Shadow Work Exploration" journey for psychological integration',
      'New 10-day "Nature Connection" journey for deepening environmental awareness',
      'Enhanced path selection screen with color-themed journey cards',
      'Extended support for varied journey durations (10, 21, 22, 30, 33, and 100 days)'
    ],
    bugFixes: [
      'Fixed inconsistent path theming between selection and daily views',
      'Resolved progress tracking issues for journeys longer than 30 days',
      'Corrected icon display for newly added journey paths'
    ],
    improvements: [
      'Unified CSS theme system for all journey paths with consistent styling',
      'Enhanced journey path information in PDF exports',
      'Optimized path registration system for easier future expansions',
      'Improved journey classification with difficulty levels and tags',
      'Better consistency between path selection and journey completion screens'
    ],
    notes: [
      'This update significantly expands the app\'s content offering with diverse growth-focused journeys',
      'The new paths explore complementary themes that build upon each other for continued growth',
      'Life Values & Core Principles helps identify personal values that guide all other journeys',
      'Gratitude Practice, Shadow Work, and Nature Connection provide essential 10-day experiences for beginners',
      'Relationship Mastery and Financial Mindfulness address key life domains for holistic development',
      'All new journeys feature rich, research-based content with progressive day structures'
    ]
  },
  {
    version: '0.7.2',
    releaseDate: '2025-06-05',
    features: [
      'Update user registration flow: Now it includes the location'
    ],
  },
  {
    version: '0.7.3',
    releaseDate: '2025-06-12',
    features: [
      'New personalized weather widget on the home screen',
      'Location-based weather updates with detailed conditions',
      'Interactive weather dialog with temperature, humidity, wind speed, and forecast',
      'Streamlined location setup process with Google Places integration',
      'Enhanced city selection with intelligent address suggestions',
      'Improved location management in user settings'
    ],
    bugFixes: [
      'Fixed Google Places API integration issues in location prompts',
      'Resolved location data persistence problems for existing users',
      'Fixed weather API error handling for invalid locations',
      'Corrected CSS inconsistencies in home screen components',
      'Addressed navigation issues between home screen and settings'
    ],
    improvements: [
      'Enhanced home screen with subtle hover animations and visual polish',
      'Improved card designs with gradient effects and smoother transitions',
      'Optimized weather data caching for reduced API usage',
      'More intuitive location prompt for users without city information',
      'Better theme integration for weather components in both light and dark modes',
      'Enhanced accessibility for all weather and location UI elements',
      'Improved responsive design for weather components on different screen sizes'
    ],
    notes: [
      'This update enhances your journaling experience with personalized weather information',
      'The weather widget helps provide environmental context to your daily reflections',
      'Location data is stored securely and used only for weather information',
      'Weather updates refresh automatically to provide current conditions',
      'Users can manage their location information in the Profile section of Settings',
      'All new features respect your theme preferences with consistent styling'
    ]
  },
  {
    version: '0.7.4',
    releaseDate: '2025-06-18',
    features: [
      'Complete redesign of journal analysis interface with modern mobile-first UI',
      'Enhanced analytics dashboard with real-time data processing and intelligent caching',
      'New ThemeCloud visualization with smart word positioning and collision detection',
      'Improved EmotionTrends component with meaningful emotion abbreviations and better readability',
      'Touch-optimized mobile navigation with swipe gestures for multi-page journal entries',
      'Advanced text processing utilities for sophisticated theme and emotion extraction',
      'Real-time consistency analysis with streak tracking and personalized insights',
      'Enhanced multi-page image carousel with thumbnail navigation and touch controls',
      'Smart data caching system for improved performance and reduced API usage',
      'Progressive data loading with skeleton screens and smooth animations'
    ],
    bugFixes: [
      'Fixed emotion labels showing only first 3 characters (Anx, Lov, Hop) in analytics overview',
      'Resolved ThemeCloud word overlapping and positioning issues',
      'Fixed confusing legend labels in theme visualizations',
      'Corrected duplicate explanation text in analytics components',
      'Resolved theme cloud words being cut off at container edges',
      'Fixed mobile responsiveness issues in analysis results tabs',
      'Addressed import errors with missing analyzeConsistency function',
      'Fixed inconsistent data processing between mock and real journal data',
      'Resolved touch navigation issues on mobile devices',
      'Fixed loading states and error handling in analytics components'
    ],
    improvements: [
      'Completely redesigned analysis results interface with 6 distinct tabs for better organization',
      'Enhanced emotion analysis with 12+ emotion categories and smart abbreviation system',
      'Improved theme extraction using weighted keyword analysis and 14 theme categories',
      'Better visual hierarchy with consistent spacing, typography, and color usage',
      'Optimized data processing algorithms for faster analytics generation',
      'Enhanced mobile experience with 44px minimum touch targets and gesture support',
      'Improved accessibility with proper focus states, ARIA labels, and reduced motion support',
      'Better error boundaries and fallback states throughout the analytics system',
      'Performance optimizations with useMemo, useCallback, and intelligent re-rendering',
      'Consistent theme integration across all analytics components',
      'Enhanced loading animations and progress indicators for better user feedback',
      'Improved data validation and error handling for robust analytics processing'
    ],
    notes: [
      'This major update focuses on transforming the analytics experience with real data integration',
      'The new analysis interface processes actual journal content instead of generating mock data',
      'Mobile users will notice significantly improved touch navigation and responsive design',
      'ThemeCloud now intelligently positions words to prevent overlapping and provides meaningful insights',
      'Emotion trends display full emotion names with percentages for better understanding',
      'The enhanced caching system reduces load times and improves offline functionality',
      'All analytics components now work with real user data for accurate personal insights',
      'The new text processing utilities provide more sophisticated analysis of journaling patterns',
      'Performance improvements make analytics loading up to 3x faster on average',
      'This update lays the foundation for future advanced analytics and machine learning features'
    ]
  },
  {
    version: '0.7.5',
    releaseDate: '2025-05-25',
    features: [
      'Visual Journaling Support - Draw, paint, or doodle your journal entries',
      'New mindful-visualization path for artistic expression and visual meditation',
      'Intelligent path type detection (text-based vs visual journaling)',
      'Customized upload flow for visual entries - no text extraction required',
      'AI-powered visual analysis examining colors, composition, and emotional expression',
      'Support for optional notes/reflections on visual creations',
      'Different UI instructions based on journey type (Write vs Create)',
      'Multi-page visual journal support (up to 5 artwork pages per entry)',
      'Visual-specific analysis prompts focusing on artistic elements'
    ],
    bugFixes: [
      'Fixed CORS error when analyzing images from Firebase Storage',
      'Resolved "Visual journeys require image file objects" error',
      'Fixed image analysis flow by passing File objects through navigation',
      'Corrected visual path detection in upload and analysis components'
    ],
    improvements: [
      'Added centralized path type management system (pathTypeUtils.js)',
      'Enhanced JournalUpload component with visual journey-specific UI',
      'Improved WriteTab to show appropriate instructions for visual paths',
      'Better separation of concerns between text and visual analysis',
      'More intuitive user experience for artistic journaling',
      'Optimized image handling to avoid unnecessary network requests',
      'Added visual journey indicators throughout the app',
      'Enhanced Claude prompts for better visual content analysis'
    ],
    notes: [
      'Visual journaling opens up new possibilities for creative self-expression',
      'The mindful-visualization path focuses on artistic response to daily prompts',
      'Users can create drawings, paintings, collages, or any visual art form',
      'Claude AI analyzes visual elements like color, composition, and emotional expression',
      'This update lays the foundation for additional visual journaling paths',
      'Visual entries can include optional text notes about the creative process',
      'The new path type system makes it easy to add more visual paths in the future',
      'All visual journal entries are stored securely with the same privacy standards'
    ]
  },
  {
    version: '0.8.0',
    releaseDate: '2025-05-27',
    features: [
      'Massive content expansion with 16 brand new journey paths',
      'New writing-focused journeys: Career Compass (21 days), Inner Child Healing (14 days), Anxiety Alchemy (10 days)',
      'New transformational paths: Dream Journal Decoder (14 days), Seasonal Soul Rhythms (28 days), Forgiveness Freedom (17 days)',
      'New life navigation journeys: Life Transitions Navigator (21 days), Digital Detox Reflection (7 days), Grief & Growth (30 days), Courage Cultivation (12 days)',
      'New creative expression paths: Color Psychology Journey (21 days), Sacred Geometry Soul (14 days), Nature Sketching Sanctuary (10 days)',
      'New artistic journeys: Abstract Emotions (12 days), Visual Storytelling (15 days)',
      'Special bonus: Ink & Essence Black Ink Mastery (33 days) - intensive drawing journey with Eastern and Western techniques',
      'Complete visual theming system with 16 unique color schemes and custom animations',
      'Enhanced path selection interface with difficulty levels, tags, and detailed descriptions',
      'Extended journey duration support from 7 to 33 days',
      'Advanced CSS styling system with hover effects, progress indicators, and themed components'
    ],
    bugFixes: [
      'Fixed path registration consistency across all app components',
      'Resolved HomeScreen progress tracking for varied journey lengths',
      'Corrected export service integration for all new paths',
      'Fixed CSS theming conflicts between different journey paths'
    ],
    improvements: [
      'Unified path architecture supporting any journey length (7-100+ days)',
      'Enhanced createJourneyPath utility for consistent path creation',
      'Comprehensive CSS theming with 128 style sections for visual consistency',
      'Improved path metadata system with tags, difficulty levels, and recommendations',
      'Optimized path selection UI with filtering and categorization',
      'Better progress visualization for longer journeys',
      'Enhanced PDF export with path-specific information and styling',
      'Streamlined development process for adding future journey paths'
    ],
    notes: [
      'This is the largest content expansion in Καιρός history with 293 new journey days',
      'The 16 new paths cover writing, healing, creativity, and artistic expression',
      'Ink & Essence offers the most intensive artistic journey with 33 days of progressive skill building',
      'Each journey features unique visual theming and professionally crafted daily prompts',
      'Journey difficulty ranges from beginner (7-day Digital Detox) to advanced (33-day Ink Mastery)',
      'New paths include specialized content for career development, emotional healing, creative expression, and life transitions',
      'The enhanced theming system provides visual distinction between different journey types',
      'All paths are immediately available and fully integrated with existing features',
      'Future path additions now require minimal code changes thanks to the unified architecture',
      'This update establishes Καιρός as the most comprehensive guided journaling platform available'
    ]
  },
  {
    version: '0.8.1',
    releaseDate: '2025-05-27',
    features: [
      'Progressive Web App (PWA) "Add to Home Screen" functionality',
      'New Install App button in Settings → Help & Support section',
      'Smart install prompt that appears after user engagement',
      'iOS-specific installation instructions with step-by-step guide',
      'Android/Desktop native install prompt integration',
      'App installation status detection and management',
      'Install benefits display showing offline access and full-screen experience',
      'Persistent install prompt dismissal with 7-day cooldown',
      'Enhanced manifest.json with app shortcuts for quick journal access',
      'Automatic detection of standalone mode when launched from home screen'
    ],
    bugFixes: [
      'Fixed manifest.json icon paths to correctly reference app icons',
      'Resolved PWA installation detection on various devices',
      'Fixed iOS Safari detection for proper instruction display',
      'Corrected install prompt timing and user engagement tracking',
      'Fixed message alert styling for info-type notifications'
    ],
    improvements: [
      'Enhanced Settings UI with new install app section and benefits display',
      'Improved PWA manifest with proper theme colors and orientation settings',
      'Better handling of deferred install prompt across sessions',
      'Optimized install flow for different platforms (iOS, Android, Desktop)',
      'Added visual feedback for installation success and app status',
      'Improved accessibility for install instructions and dialogs',
      'Better integration with device home screen and app drawer'
    ],
    notes: [
      'Καιρός can now be installed as a native-like app on any device',
      'Once installed, the app works offline and launches in full-screen mode',
      'iOS users receive custom instructions for adding to home screen via Safari',
      'Android and desktop users get the native browser install experience',
      'The app remembers if users dismiss the install prompt and waits 7 days before showing again',
      'Installed app includes shortcuts for quick access to daily journaling and analytics',
      'This update makes Καιρός more accessible and convenient for daily journaling practice',
      'All PWA features respect user preferences and can be managed in Settings'
    ]
  },
  {
    version: '0.8.2',
    releaseDate: '2025-05-29',
    features: [
      'Enhanced path type classification system for visual vs traditional journaling paths',
      'Dynamic upload interface that adapts based on journey type (artwork vs journal uploads)',
      'Improved visual journaling experience with artwork-focused UI and instructions',
      'Path-specific upload instructions and guidance throughout the app',
      'Enhanced WriteTab interface with creative vs writing-focused messaging',
      'Smart text extraction - optional for visual paths, mandatory for traditional journaling',
      'Updated Complete Guide documentation with visual path integration instructions'
    ],
    bugFixes: [
      'Fixed visual journaling paths incorrectly showing "Upload Journal" instead of "Upload Artwork"',
      'Resolved text extraction requirement for artistic paths that should focus on visual analysis',
      'Corrected upload interface not adapting to path type (Color Psychology, Sacred Geometry, etc.)',
      'Fixed WriteTab showing writing-focused tips for creative/artistic journey paths',
      'Resolved inconsistent user instructions between visual and text-based journaling paths',
      'Fixed pathTypeUtils.js not properly categorizing all visual paths',
      'Corrected analysis approach mismatch for artistic vs written journal entries'
    ],
    improvements: [
      'Centralized path type management in pathTypeUtils.js for consistent behavior',
      'Enhanced JournalUpload component with dynamic UI based on journey classification',
      'Improved user experience with appropriate prompts for creative vs reflective journaling',
      'Better separation of visual analysis (colors, composition) vs text analysis workflows',
      'More intuitive interface for artistic journaling paths with creative-focused guidance',
      'Streamlined upload flow that respects the nature of different journaling approaches',
      'Enhanced developer documentation for adding new visual or traditional journaling paths',
      'Optimized path categorization system for easier future expansion'
    ],
    notes: [
      'This critical update ensures all 8 visual journaling paths display the correct interface',
      'Visual paths (Artistic Soul Expression, Color Psychology, Sacred Geometry, Nature Sketching, Abstract Emotions, Visual Storytelling, Ink & Essence, Mindful Visualization) now show "Upload Artwork" appropriately',
      'Text extraction is now optional for visual paths, allowing focus on artistic expression',
      'Traditional journaling paths maintain the existing text-focused workflow and analysis',
      'The enhanced path type system makes it easier to add new visual or artistic journeys',
      'Users will now see appropriate tips and guidance based on their chosen journey type',
      'This fix resolves confusion where creative paths were treated as traditional writing journeys',
      'All existing user data and progress remains unaffected by these interface improvements'
    ]
  },
  {
    version: '0.8.3',
    releaseDate: '2025-06-01',
    features: [
      'Removed text entry functionality to preserve physical-digital journal connection',
      'Streamlined journaling workflow focused exclusively on handwritten journal uploads',
      'Enhanced physical journal emphasis throughout the app interface'
    ],
    bugFixes: [
      'Fixed critical "isVisualJourneyPath is not defined" error in visual journaling analysis',
      'Resolved function name mismatch in pathTypeUtils.js getVisualAnalysisInstructions',
      'Corrected visual path analysis workflow that was preventing artwork uploads',
      'Fixed variable naming conflict in visual analysis instructions function',
      'Resolved mindful-visualization path analysis errors during artwork processing'
    ],
    improvements: [
      'Strengthened physical journal integration by removing digital text entry bypass',
      'Enhanced user experience with clear focus on handwritten journaling benefits',
      'Improved visual journaling path stability and error handling',
      'Simplified WriteTab interface with single "Upload Journal Pages" action',
      'Updated journaling tips to emphasize physical writing and handwriting benefits',
      'Removed confusing dual-mode interface that could bypass physical journal usage',
      'Better alignment with Καιρός core mission of bridging physical and digital journaling'
    ],
    notes: [
      'This update reinforces Καιρός core value proposition of physical-digital integration',
      'Users can no longer bypass the physical journal by typing directly into the app',
      'The streamlined interface emphasizes the neurological benefits of handwriting',
      'Visual journaling paths (artwork uploads) now work reliably without analysis errors',
      'All journaling must now go through the intended physical → digital workflow',
      'Text editing remains available for correcting OCR extraction errors from handwritten pages',
      'This change strengthens the unique value of Καιρός Smart Journal\'s NFC-enabled physical journals',
      'The update ensures users experience the full benefits of analog writing with digital insights'
    ]
  },
  {
    version: '0.9.0',
    releaseDate: '2025-06-03',
    features: [
      'Native Android app support with full Capacitor integration',
      'Offline-first mobile experience with automatic sync when reconnected',
      'Native camera integration for seamless journal photo capture on mobile devices',
      'Mobile-optimized UI with enhanced touch interactions and gestures',
      'App icon and branding updates featuring the Καιρός green theme',
      'Push notification support for daily journaling reminders (Android)',
      'Improved image compression for faster uploads on mobile networks',
      'Device-specific optimizations for better battery life during journal analysis',
      'Local storage management with automatic cleanup of old cached data',
      'Mobile-specific onboarding flow for first-time app users'
    ],
    bugFixes: [
      'Fixed white screen issues when launching app without internet connection',
      'Resolved memory leaks in image processing on mobile devices',
      'Fixed navigation stack issues causing back button inconsistencies',
      'Corrected touch target sizes for better mobile accessibility',
      'Fixed offline mode not properly queuing journal uploads',
      'Resolved camera permission request timing on Android devices',
      'Fixed theme persistence issues when switching between web and mobile',
      'Corrected image orientation problems when capturing photos on certain devices'
    ],
    improvements: [
      'Optimized build size from 12MB to 7MB for faster app downloads',
      'Enhanced offline capabilities with intelligent data caching strategies',
      'Improved image capture quality with automatic lighting adjustment',
      'Better error messages and recovery options for mobile-specific issues',
      'Streamlined sync process reducing data usage by 40%',
      'Enhanced performance on lower-end Android devices',
      'Improved splash screen with smooth transition to app content',
      'Better handling of app lifecycle events (background/foreground)',
      'Optimized WebView performance for smoother scrolling and animations',
      'Enhanced security with certificate pinning for API communications'
    ],
    notes: [
      'This major release marks Καιρός transition from web-only to a true cross-platform experience',
      'The Android app is available as an APK for beta testing before Play Store release',
      'Mobile users can now journal anywhere without worrying about internet connectivity',
      'All features from the web version are fully available in the mobile app',
      'The offline-first approach ensures your journaling practice is never interrupted',
      'Camera integration makes capturing journal pages faster and more convenient',
      'Push notifications help maintain consistent journaling habits (can be disabled in settings)',
      'Future updates will add iOS support and additional mobile-specific features',
      'Existing users can seamlessly switch between web and mobile with automatic sync',
      'This release lays the foundation for NFC journal integration in future updates'
    ]
  },
  {
    version: '0.10.0',
    releaseDate: '2025-06-12',
    features: [
      'Full Stripe subscription system integration with Firebase Functions',
      'Artisan tier subscription (€11.99/month) for premium journey access',
      'Complete subscription management with status checking and user upgrades',
      'Premium path access control - 9 free 10-day journeys + 24 Artisan premium journeys',
      'Stripe checkout session creation with secure payment processing',
      'Real-time subscription status tracking and UI updates',
      'Upgrade prompts for premium journeys with elegant modal design',
      'Firebase Functions deployed to us-central1 with proper CORS handling',
      'Subscription-aware path selection interface with tier badges and access indicators',
      'Secure customer management with Stripe customer ID linking to Firebase users',
      'Revenue-generating subscription model ready for Kickstarter campaign launch'
    ],
    bugFixes: [
      'Fixed critical CORS errors preventing Stripe checkout session creation',
      'Resolved "No such price" error by properly configuring live Stripe price IDs',
      'Fixed Firebase Functions configuration access using functions.config() v1 syntax',
      'Corrected subscription status detection causing incorrect access permissions',
      'Fixed upgrade button processing states and error handling',
      'Resolved region mismatch between app configuration and deployed functions',
      'Fixed subscription service caching issues affecting real-time status updates'
    ],
    improvements: [
      'Streamlined subscription upgrade flow with clear pricing and benefits display',
      'Enhanced error handling throughout the payment and subscription system',
      'Optimized Firebase Functions performance with proper Stripe client initialization',
      'Improved user experience with loading states and processing feedback',
      'Better subscription status caching for improved app performance',
      'Enhanced security with proper authentication checks in all subscription functions',
      'Comprehensive subscription service with status formatting and access control utilities',
      'Professional upgrade modal design with crown icons and clear value proposition'
    ],
    notes: [
      'This is a major business milestone - Καιρός now has a working revenue generation system',
      'The subscription system successfully processes real payments and grants access to premium content',
      'Free users get 9 curated 10-day journeys, while Artisan subscribers access all 33 premium paths',
      'All 24 premium journeys (14+ days) including Transformation Journey, Life Vision, and artistic paths are now monetized',
      'The system is ready for the Kickstarter campaign with proven payment infrastructure',
      'Stripe integration supports international payments with proper EUR pricing for European market',
      'Firebase Functions architecture is scalable and ready for increased user volume',
      'This update establishes the foundation for sustainable business growth and development funding',
      'The premium tier provides significant value with 260+ premium journaling days vs 90 free days',
      'Subscription management is fully automated with proper customer lifecycle handling'
    ]
  },
  {
    version: '0.10.1',
    releaseDate: '2025-06-20',
    features: [
      'Complete Stripe webhook system for automatic subscription activation',
      'Enhanced customer portal integration with full subscription management',
      'Bulletproof payment flow ensuring instant premium access after checkout',
      'Consistent database structure for both existing and new subscribers',
      'Advanced subscription lifecycle management (create, update, cancel, payment failures)',
      'Multi-location customer ID detection for enhanced reliability',
      'Production-ready subscription system with comprehensive error handling'
    ],
    bugFixes: [
      'CRITICAL: Fixed subscription not activating after successful Stripe payment',
      'CRITICAL: Fixed missing Stripe webhook handlers causing payment processing failures',
      'CRITICAL: Fixed customer portal access issues with "object instead of string" errors',
      'Fixed inconsistent stripeCustomerId storage location between checkout and webhooks',
      'Fixed database field corruption with extra quotes around subscription values',
      'Resolved subscription status displaying as "free" despite successful payment',
      'Fixed customer portal requiring activation in Stripe Dashboard',
      'Corrected webhook metadata detection across different Stripe event structures',
      'Fixed Firebase Functions region mismatch causing deployment issues',
      'Resolved subscription data overwriting instead of merging during updates'
    ],
    improvements: [
      'Enhanced webhook reliability with comprehensive Firebase UID detection across multiple metadata locations',
      'Improved error handling with detailed logging for payment flow debugging',
      'Optimized subscription data structure for consistent access patterns',
      'Enhanced customer verification with subscription history validation before portal access',
      'Better subscription caching with automatic status refresh after payment events',
      'Improved backwards compatibility supporting both old and new user data structures',
      'Streamlined subscription management with atomic database updates',
      'Enhanced security with proper webhook signature verification',
      'Better production URL handling for post-payment redirects',
      'Comprehensive subscription service with intelligent field detection and cleanup'
    ],
    notes: [
      'This critical patch fixes all major subscription system issues discovered after 0.10.0 launch',
      'Users who paid but did not receive premium access will now be automatically upgraded',
      'All future payments will instantly activate premium access without manual intervention',
      'The subscription system is now production-ready and can handle scale for Kickstarter launch',
      'Existing subscribers will experience improved reliability and portal access',
      'New subscribers will have seamless payment-to-activation flow with zero manual intervention',
      'This update resolves the critical payment success / access denied bug that was blocking revenue',
      'The webhook system now processes all Stripe events reliably with comprehensive error recovery',
      'Customer portal integration provides full self-service subscription management',
      'Database structure is now consistent and optimized for both current and future subscription features'
    ]
  },
  {
  version: '0.10.2',
  releaseDate: '2025-06-26',
  features: [
    'Enhanced Journal Upload with multiple camera captures - users can now take multiple photos in sequence',
    'Advanced drag-and-drop image reordering with visual feedback and larger thumbnails',
    'Support for up to 5 images per journal entry with intelligent sequence preservation',
    'Enhanced HomeScreen with beautiful stats overview showing entries, streaks, and progress',
    'Improved visual design system with consistent animations and micro-interactions',
    'Enhanced quote system with themed categories and better visual presentation',
    'Advanced thumbnail strip with drag handles and visual reordering capabilities',
    'Enhanced upload progress indicators with better user feedback'
  ],
  bugFixes: [
    'CRITICAL: Fixed camera only allowing one photo capture - users can now take multiple photos',
    'CRITICAL: Fixed image sequence not following user selection order during upload',
    'Fixed debug popup appearing on HomeScreen despite cache clearing',
    'Fixed thumbnail sizing being too small for comfortable interaction',
    'Fixed drag-and-drop not providing adequate visual feedback during reordering',
    'Fixed upload progress information showing generic text instead of helpful stats',
    'Fixed missing visual feedback during image capture and processing',
    'Fixed inconsistent hover states and animations across upload interface',
    'Fixed mobile touch interactions not being optimized for drag operations',
    'Fixed theme inconsistencies in upload interface components'
  ],
  improvements: [
    'Enhanced drag visuals with rotation, scaling, and pulsing animations during reordering',
    'Improved thumbnail size from 60px to 80px for better visibility and interaction',
    'Better visual hierarchy in upload interface with enhanced staging system',
    'Enhanced HomeScreen stats overview with flame icons for streaks and activity indicators',
    'Improved quote presentation with theme badges and enhanced typography',
    'Better mobile responsiveness for thumbnail interactions and drag operations',
    'Enhanced loading states and progress feedback throughout upload flow',
    'Improved visual consistency between light and dark themes',
    'Better accessibility with proper focus states and reduced motion support',
    'Enhanced error handling with more informative user feedback messages',
    'Streamlined upload workflow with clearer step-by-step progression',
    'Better visual feedback for touch interactions on mobile devices'
  ],
  notes: [
    'This update significantly improves the journal upload experience based on user feedback',
    'Users can now capture multiple photos seamlessly without workflow interruption',
    'The drag-and-drop reordering makes organizing journal pages intuitive and satisfying',
    'Enhanced visuals throughout the app provide a more polished, professional experience',
    'All camera and upload issues reported by beta users have been resolved',
    'The HomeScreen now provides immediate value with beautiful progress visualization',
    'Enhanced mobile experience ensures smooth interactions across all device sizes',
    'Visual improvements align with modern app design standards and user expectations',
    'Debug elements have been completely removed for clean production experience',
    'Upload interface now supports complex multi-page journaling workflows efficiently'
  ]
},
{
  version: '0.10.3',
  releaseDate: '2025-06-27',
  features: [
    'Completely modernized DailyJourneyView with native Android-like design and Material Design principles',
    'Enhanced Journal Archive with beautiful stats dashboard showing total entries, day streaks, paths explored, and weekly activity',
    'New mobile-first responsive design system ensuring perfect display across all screen sizes without cut-offs',
    'Advanced conflict-free CSS architecture with unique class names (ja- and djv- prefixes) preventing style conflicts',
    'Smart progress visualization with animated progress bars and compact day navigation for journeys up to 100 days',
    'Enhanced entry analysis display with organized insights, summaries, and actionable suggestions',
    'Streamlined user experience focused on text content and meaningful insights rather than image display',
    'Native app-like interactions with proper touch targets, smooth animations, and intuitive navigation patterns'
  ],
  bugFixes: [
    'CRITICAL: Fixed Journal Archive stats being invisible due to CSS conflicts with profile.css and other stylesheets',
    'CRITICAL: Fixed mobile layout cut-offs on both sides preventing users from seeing content properly',
    'CRITICAL: Removed problematic image display functionality that was causing broken image icons due to base64 decoding issues',
    'Fixed DailyJourneyView not following mobile-first design principles with proper responsive breakpoints',
    'Fixed CSS class naming conflicts causing style inheritance issues between different components',
    'Fixed touch targets being too small on mobile devices making navigation difficult',
    'Fixed progress indicators not adapting properly to different journey lengths (10-100 days)',
    'Fixed missing hover states and active animations throughout the journey interface',
    'Fixed day navigation being unusable on longer journeys without proper ellipsis and smart navigation',
    'Fixed inconsistent spacing and padding causing layout shifts between different screen sizes'
  ],
  improvements: [
    'Enhanced visual hierarchy with proper Material Design elevation, shadows, and card-based layouts',
    'Improved accessibility with proper focus states, reduced motion support, and keyboard navigation',
    'Better performance by removing complex image handling and focusing on fast text-based content',
    'Enhanced mobile experience with touch-optimized buttons (44px minimum) and proper gesture support',
    'Improved loading states with beautiful spinners and meaningful progress messages',
    'Better error handling with informative messages and retry mechanisms where appropriate',
    'Enhanced typography scaling from mobile (0.8rem) to desktop (1.1rem) for optimal readability',
    'Improved color contrast and theme consistency between light and dark modes',
    'Better content organization with proper card layouts and visual separation',
    'Enhanced animations with smooth transitions and micro-interactions that feel native',
    'Streamlined navigation patterns that match Android design guidelines',
    'Better use of screen real estate with optimized padding and margin systems'
  ],
  notes: [
    'This update transforms the app into a truly native-feeling Android application with proper Material Design',
    'All CSS conflicts have been resolved using unique naming conventions (ja- for archive, djv- for daily view)',
    'Mobile-first design ensures perfect functionality across all device sizes from 320px to 2560px+',
    'Stats dashboard in Journal Archive now provides immediate value with streak tracking and progress metrics',
    'Removed image display complexity allows for faster loading and better user experience focus',
    'Enhanced DailyJourneyView provides smooth navigation through journeys of any length (10-100 days)',
    'Touch interactions now feel responsive and natural matching user expectations from native apps',
    'All visual elements now scale properly ensuring accessibility and usability across different screen densities',
    'The app now follows Android design guidelines with proper elevation, typography, and interaction patterns',
    'Performance improvements make the app feel faster and more responsive throughout the user journey',
    'Enhanced focus on content and insights rather than technical image handling complexities',
    'Design system now supports consistent theming and smooth animations throughout the entire application'
  ]
},

{
  version: '0.10.4',
  releaseDate: '2025-06-27',
  features: [
    'Advanced popup blocker prevention system for web app subscription upgrades with multiple fallback methods',
    'Enhanced subscription management with seamless popup-to-tab transition ensuring reliable payment access',
    'Smart form submission fallback method that bypasses browser popup restrictions automatically',
    'Improved user guidance with clear popup blocker instructions and manual navigation options'
  ],
  bugFixes: [
    'CRITICAL: Fixed "Upgrade to Artisan" button being blocked by browser popup blockers on web version',
    'CRITICAL: Fixed subscription management portal not opening due to popup blocking restrictions',
    'Fixed payment flow interruption causing users unable to complete subscription purchases',
    'Fixed inconsistent popup behavior across different browsers (Chrome, Firefox, Safari)'
  ],
  improvements: [
    'Enhanced web browser compatibility with multi-tier fallback system for payment processing',
    'Better user experience with immediate popup opening before async operations to maintain user gesture chain',
    'Improved error handling with informative messages and alternative navigation options',
    'Streamlined subscription flow with beautiful loading screens and progress indicators in popup windows'
  ],
  notes: [
    'This update ensures reliable subscription upgrades across all web browsers regardless of popup blocker settings',
    'Multiple fallback methods guarantee users can always access payment pages through popup, form submission, or same-tab navigation',
    'Enhanced error messages provide clear instructions for users to enable popups or use alternative methods',
    'Payment flow now works seamlessly on both web app and Android versions with consistent user experience'
  ]
},

{
  version: '1.0.0_alpha',
  releaseDate: '2025-06-27',
  features: [
    'Experimental journaling mode with real-time AI reflections',
    'Early-stage integration with Kairos Smart Journal NFC support',
    'Beta tester feedback widget embedded in WriteTab',
    'Live journaling timeline with AI-enhanced visual prompts'
  ],
  notes: [
    'This is an experimental beta release intended for internal testing',
    'Features may change or be removed in future builds',
    'Not all production features are available in beta mode',
    'Beta feedback is essential — please use the embedded feedback tool'
  ]
},

{
  version: '2.0.0_alpha',
  releaseDate: '2025-01-15',
  codename: 'AI Insights',
  features: [
    'Daily AI Question - Ask personalized questions about your journaling journey (1 per day)',
    'AI Personality Analysis - Comprehensive personality descriptions based on writing patterns',
    'Enhanced Analytics Dashboard with dedicated AI Insights tab for all users',
    'Smart question suggestions with contextual prompts for deeper self-reflection',
    'Advanced personality trait analysis including strengths, values, and growth opportunities',
    'Improved mobile-responsive design for AI components with premium visual styling',
    'Real-time AI insights generation with elegant loading states and error handling',
    'Weekly personality analysis regeneration with progress tracking over time'
  ],
  technicalUpdates: [
    'Claude Sonnet 4 integration with optimized prompt engineering for personality analysis',
    'Firebase Firestore integration for AI insights storage with rate limiting',
    'Enhanced caching system for improved AI response performance',
    'Mobile-first responsive design with advanced CSS animations and transitions',
    'Comprehensive error handling and fallback states for AI feature reliability'
  ],
  userExperience: [
    'AI features now available to all users regardless of subscription tier',
    'Visually stunning gradient designs with animated components for AI sections', 
    'Intuitive daily question interface with smart suggestion system',
    'Expandable personality analysis with detailed breakdown sections',
    'Seamless integration with existing analytics dashboard and navigation'
  ],
  notes: [
    'This is a major AI-powered update introducing advanced personality insights',
    'All AI features are now universally accessible - no subscription requirements',
    'Daily AI questions are rate-limited to 1 per day to encourage thoughtful reflection',
    'Personality analysis regenerates weekly to capture evolving user patterns',
    'AI responses are cached for improved performance and reduced API costs',
    'New AI components feature premium visual design with gradients and animations',
    'Beta testing phase - user feedback highly encouraged via analytics dashboard'
  ],
  compatibility: [
    'Requires Claude Sonnet 4 API access configured in backend',
    'Firebase Firestore rules updated for AI insights collections',
    'Mobile browsers: iOS Safari 14+, Android Chrome 90+',
    'Desktop browsers: Chrome 90+, Firefox 88+, Safari 14+',
    'Graceful degradation implemented for users with limited connectivity'
  ],
},


{
  version: '3.0.0_alpha',
  releaseDate: '2025-06-29',
  codename: 'Android Material Profile',
  features: [
    'Completely redesigned Android ProfileScreen built on Material Design 3 principles: consistent elevation, shadow system, 48dp touch targets, and native scale-on-press animations',
    'Full Material color system with light/dark theme support and Android-native ripple feedback (Capacitor Haptics plugin supported)',
    'Achievement system overhaul: 18 unique achievement types (streaks, milestones, path completions, special awards), proper count display, and new category icons',
    'User level and points system: earn points for achievements and journaling activity, progress through Beginner, Intermediate, Advanced, Expert, and Master levels',
    'Progress bar showing advancement to next user level',
    '"View All" achievements option for users with more than 4 achievements',
    'Enhanced journey display with completion percentages and clickable active journeys',
    'Quick actions grid for fast navigation to key features',
    'New BEM-inspired CSS architecture with md- prefix and component-based structure for consistent spacing, sizing, and Android-specific interactions',
    'All interactive elements feature Android-native touch feedback and smooth 60fps animations',
    'Material elevation and shadow values applied to all cards and surfaces',
  ],
  improvements: [
    'Strictly component-based CSS for maintainability and scalability',
    'Consistent spacing and sizing throughout ProfileScreen',
    'Android-specific interaction patterns for a native feel',
    'Optimized icon mapping for new achievement categories (Flame, Zap, Trophy, Crown, Feather, PenTool, Medal, Gem, Rocket, Sunrise, Brain, Activity, etc.)',
    'Enhanced accessibility with proper touch targets and feedback',
    'Improved navigation and progress visualization for journeys and achievements',
  ],
  bugFixes: [
    'Fixed incorrect achievement count display in header',
    'Resolved missing icon issues for new achievement types',
    'Corrected user level and progress bar calculation errors',
    'Fixed sign out dialog and subscription card display inconsistencies',
    'Addressed navigation issues in quick actions and journey links',
    'Ensured all buttons and interactive elements have proper Android press effects',
  ],
  notes: [
    'This update delivers a fully modernized, Android-native ProfileScreen experience with robust achievement and leveling systems, improved navigation, and a new CSS architecture.',
    'All visual and interactive elements now match Material Design 3 standards for a polished, consistent, and engaging user journey on Android.',
    'To implement: replace ProfileScreen.jsx and add androidProfile.css, update DynamicIcon mappings, and test all checklist items for Android-specific enhancements.',
    'Beta testers: Please report any issues with touch feedback, achievement display, or navigation in the new ProfileScreen.'
  ],
},

{
  version: '4.0.0_alpha',
  releaseDate: '2025-01-16',
  codename: 'Voice & Soul',
  features: [
    'Complete Voice Journaling System - Record voice reflections with real-time transcription using Web Speech API',
    '5 specialized voice journaling paths: Voice Discovery (10 days), Spoken Emotions (14 days), Vocal Confidence (12 days), Storytelling Voice (15 days), Meditation Speaking (21 days)',
    'Real-time speech-to-text transcription with automatic transcription editing capabilities',
    'Voice-specific AI analysis with enhanced Claude prompts acknowledging vocal courage and authenticity',
    'Audio storage and playback system with Firebase Storage integration for voice recordings',
    'Intelligent path type detection system distinguishing voice, visual, and text-based journaling approaches',
    'Voice entry archive and analytics integration with specialized voice statistics and insights',
    'Enhanced analysis results component with voice-specific tabs, audio playback, and vocal observations',
    'Multi-modal journaling support allowing users to choose between written, visual, or spoken reflection',
    'Voice metadata tracking including duration, word count, transcription accuracy, and speaking patterns'
  ],
  technicalUpdates: [
    'Web Speech API integration with continuous recognition and interim results processing',
    'Enhanced claudeService.js with comprehensive voice analysis pipeline and voice-specific Claude prompts',
    'Firebase Storage voice recording management with automatic cleanup and privacy controls',
    'Advanced VoiceJournalUpload component with real-time audio level monitoring and recording controls',
    'Enhanced navigation system supporting voice data propagation through screen transitions',
    'Voice-specific analysis prompts designed to acknowledge speaking courage and vocal authenticity',
    'Improved pathTypeUtils.js with voice path classification and appropriate UI handling',
    'Voice entry storage in Firestore with transcription, audio URLs, and voice metadata',
    'Enhanced AnalysisResults component with voice-aware content checking and audio playback',
    'Multi-modal upload interface adapting to voice, visual, or text journaling approaches'
  ],
  bugFixes: [
    'CRITICAL: Fixed voice data not being passed correctly from VoiceJournalUpload to AnalysisResults component',
    'CRITICAL: Fixed "No journal entry provided" error for voice entries due to improper content detection',
    'CRITICAL: Fixed isVoiceEntry flag not being propagated through navigation state causing analysis failures',
    'Fixed voice transcription not appearing in extractedText field for analysis processing',
    'Fixed screen data not properly passing voice data objects through navigation system',
    'Fixed AnalysisResults component not receiving voiceData prop from navigation screenData',
    'Fixed analysis screen props not reading voice-specific data from navigation state',
    'Fixed voice upload completion handler not structuring data correctly for analysis pipeline',
    'Fixed speech recognition ending prematurely without saving final transcription results',
    'Fixed audio recording cleanup issues causing memory leaks during extended recording sessions'
  ],
  improvements: [
    'Enhanced AI analysis with voice-specific insights acknowledging courage in vocal self-expression',
    'Improved voice recording interface with visual audio level indicators and professional controls',
    'Better error handling throughout voice journaling pipeline with user-friendly feedback messages',
    'Enhanced transcription accuracy with continuous speech recognition and real-time text display',
    'Streamlined voice upload workflow with proper data flow from recording to analysis',
    'Improved voice path UI with appropriate prompts and guidance for spoken reflection',
    'Enhanced WriteTab component with voice journaling option and path-appropriate instructions',
    'Better voice data preservation through complex navigation flows and screen transitions',
    'Improved voice analysis with specialized Claude prompts recognizing unique aspects of spoken reflection',
    'Enhanced voice entry management with proper storage, retrieval, and analytics integration'
  ],
  userExperience: [
    'Intuitive voice recording interface with visual feedback and easy-to-use controls',
    'Real-time transcription provides immediate feedback while speaking naturally',
    'Voice-specific journey paths designed for authentic vocal self-expression and storytelling',
    'Seamless integration between voice recordings and traditional written journaling workflows',
    'Enhanced analysis results showing voice-specific observations and speaking pattern insights',
    'Audio playback capability allowing users to revisit their recorded reflections',
    'Voice courage acknowledgment in AI analysis recognizing the vulnerability of spoken truth',
    'Flexible journaling options allowing users to choose their preferred expression method daily'
  ],
  notes: [
    'This major release introduces complete voice journaling capabilities, representing a significant expansion of self-expression options in Καιρός',
    'Voice journaling acknowledges that some truths are easier to speak than write, providing an alternative pathway to authentic self-reflection',
    'The 5 voice paths are specifically designed to help users develop confidence, emotional expression, and storytelling abilities through spoken word',
    'Real-time transcription using Web Speech API ensures users can review and edit their spoken thoughts before submitting',
    'Voice-specific AI analysis recognizes the unique courage required for vocal self-expression and provides appropriate encouragement',
    'Audio recordings are securely stored in Firebase Storage with full privacy controls and optional retention settings',
    'The voice journaling system complements rather than replaces written journaling, offering users multiple pathways to self-discovery',
    'Voice path selection is seamlessly integrated with existing path selection interface using intelligent path type detection',
    'This release lays the foundation for future audio features including voice-to-voice AI responses and advanced speech analysis',
    'Beta testing phase - voice journaling represents a new frontier in digital self-reflection and personal growth tools'
  ],
  compatibility: [
    'Requires modern browser with Web Speech API support (Chrome 60+, Safari 14+, Firefox 88+)',
    'Microphone permission required for voice recording functionality',
    'Audio playback requires HTML5 audio support across all target browsers',
    'Firebase Storage integration requires updated security rules for voice file handling',
    'Enhanced Claude AI prompts optimized for voice content analysis and emotional recognition',
    'Mobile browsers: Voice recording tested on iOS Safari 14+ and Android Chrome 90+',
    'Graceful degradation: Voice paths are hidden on browsers without speech recognition support'
  ],
  betaFeatures: [
    'Voice journaling is in beta - user feedback actively sought through integrated feedback systems',
    'Voice path content and prompts may be refined based on user engagement and feedback',
    'Speech recognition accuracy may vary by user accent, speaking style, and environmental conditions',
    'Audio storage and transcription features are being optimized for performance and user experience'
  ]
},

{
  version: '5.0.0_alpha',
  releaseDate: '2025-11-05',
  codename: 'Voice Evolution & Mobile Perfection',
  features: [
    'Advanced mobile voice transcription with OpenAI Whisper API integration for post-recording processing',
    'Enhanced voice journaling with automatic AI-powered transcription after recording completes',
    'Native Android speech recognition support via cordova-plugin-speechrecognition',
    'Hybrid transcription system: Web Speech API for desktop, Whisper API for Android mobile',
    'Real-time speech-to-text with continuous recognition and auto-restart for desktop browsers',
    'Mobile-optimized voice recording interface with progress indicators and processing feedback',
    'Streamlined voice upload experience with automatic transcription workflow on Android',
    'Firebase Storage integration for voice recordings with secure user-specific paths',
    'Enhanced VoiceJournalUpload component with device-specific transcription methods',
    'Removed voice journaling tips and recommendations section for cleaner, focused interface'
  ],
  technicalUpdates: [
    'OpenAI Whisper API integration via Firebase Cloud Functions for reliable mobile transcription',
    'Enhanced uploadVoiceJournal service with automatic Whisper transcription for Android devices',
    'Native Android speech plugin detection with fallback to post-recording transcription',
    'Improved Web Speech API implementation with robust error handling and auto-restart logic',
    'Enhanced speech recognition state management with ref-based tracking for reliability',
    'Advanced recognition restart scheduling with delay-based recovery mechanisms',
    'Improved audio blob handling and Firebase Storage upload workflow',
    'Enhanced error recovery with detailed logging for speech recognition debugging',
    'Firebase Storage security rules updated for voices/{userId}/** path structure',
    'Mobile-optimized transcription progress tracking with percentage-based UI updates'
  ],
  bugFixes: [
    'CRITICAL: Fixed voice transcription failing on Android mobile devices due to Web Speech API limitations',
    'CRITICAL: Fixed Firebase Storage permission errors preventing voice journal uploads',
    'CRITICAL: Fixed speech recognition auto-restart causing duplicate transcriptions',
    'Fixed speech recognition state not persisting across component lifecycle events',
    'Fixed interim transcript not being preserved during speech recognition restarts',
    'Fixed final transcript loss when recognition unexpectedly ended',
    'Fixed Web Speech API compatibility issues on mobile WebView environments',
    'Fixed voice recording not capturing audio properly on certain Android devices',
    'Fixed transcription progress not updating correctly during Whisper API processing',
    'Fixed audio blob size validation and error handling in upload flow'
  ],
  improvements: [
    'Enhanced Android full-screen immersive mode with WindowInsetsController implementation',
    'Improved edge-to-edge display with transparent status bar and navigation bar on Android',
    'Better speech recognition reliability with instance ID tracking and stale detection',
    'Enhanced mobile UI with device-specific transcription method indicators',
    'Improved voice recording state management with proper cleanup on unmount',
    'Better error messages and user feedback throughout voice journaling workflow',
    'Enhanced Firebase Storage upload with progress tracking and error recovery',
    'Improved audio level monitoring with visual feedback for desktop recordings',
    'Better handling of microphone permissions across different mobile platforms',
    'Enhanced voice data structure with metadata for transcription method and device type'
  ],
  androidEnhancements: [
    'Full-screen immersive mode with both status bar and navigation bar hidden',
    'Edge-to-edge content display using WindowCompat.setDecorFitsSystemWindows(false)',
    'FLAG_LAYOUT_NO_LIMITS for unrestricted window layout on Android',
    'Transparent system bars with proper theme configuration in styles.xml',
    'Immersive sticky behavior with BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE',
    'Combined modern WindowInsetsController API with legacy SYSTEM_UI_FLAGS for compatibility',
    'Black background theme to eliminate grey areas from system UI',
    'Enhanced MainActivity.java with comprehensive enableFullScreenMode() method',
    'Proper lifecycle management with full-screen reapplication in onCreate, onResume, onWindowFocusChanged',
    'Removed safe area insets from CSS for true edge-to-edge mobile experience'
  ],
  userExperience: [
    'Seamless voice journaling on Android with automatic transcription after recording',
    'Real-time transcription feedback on desktop browsers with continuous speech recognition',
    'Clear progress indicators during Whisper AI transcription processing',
    'Simplified voice interface without distracting tips and recommendations',
    'Professional voice recording controls with pause, resume, and stop functionality',
    'Smooth full-screen experience on Android with no visible system UI distractions',
    'Better visual feedback during voice recording with audio level indicators (desktop)',
    'Enhanced error recovery with helpful messages guiding users through permission issues'
  ],
  notes: [
    'This major update revolutionizes voice journaling with reliable mobile transcription via OpenAI Whisper',
    'Android users now get automatic AI-powered transcription after recording completes',
    'Desktop users maintain real-time speech-to-text with improved stability and auto-restart',
    'The hybrid approach ensures optimal transcription quality across all devices and platforms',
    'OpenAI Whisper provides superior transcription accuracy compared to native mobile speech recognition',
    'Full-screen immersive mode on Android creates distraction-free journaling environment',
    'Voice recordings are securely stored in Firebase Storage with user-specific access controls',
    'The streamlined interface removes unnecessary UI elements for focused voice journaling',
    'Enhanced error handling ensures users always understand what\'s happening during transcription',
    'This update establishes Καιρός as a leader in multi-modal journaling with professional voice capabilities'
  ],
  compatibility: [
    'Android: OpenAI Whisper API transcription via Firebase Cloud Functions',
    'Desktop: Web Speech API with Chrome 60+, Firefox 88+, Safari 14+',
    'Mobile browsers: Enhanced error handling and fallback to manual transcription',
    'Firebase Storage: Updated security rules for voices/{userId}/{pathId}/{dayNumber}/ structure',
    'Capacitor Android: Full immersive mode requires AndroidX Core library',
    'OpenAI API: Whisper-1 model integration for audio-to-text transcription',
    'All voice features gracefully degrade on unsupported browsers with clear user guidance'
  ]
},

{
  version: '5.0.3_alpha',
  releaseDate: '2025-11-08',
  codename: 'Customizable SVG avatars & UI enhancements',
  features: [
    'Fully customizable SVG-based avatar system with 216 unique combinations (6 themes × 6 patterns × 6 fonts)',
    'Avatar picker modal with live preview and easy customization in both Profile and Settings',
    'Enhanced WelcomeScreen first slide with tagline and 3 new highlight items (Write/Speak/Create, AI Insights, Track Growth)',
    'Comprehensive Terms of Service page redesign with multi-modal platform messaging and premium expandable sections',
    'Privacy Policy page updated with multi-modal content (text, voice, visual) and enhanced AI transparency',
    'Premium legal document styling with animated info cards, color-coded boxes, and responsive design'
  ],
  technicalUpdates: [
    'Created Avatar.jsx component with 6 color gradient themes (Forest, Sunset, Ocean, Lavender, Amber, Sage)',
    'Implemented 6 SVG pattern overlays (Dots, Waves, Circles, Geometric, Sparkles, None) with 50-90% opacity',
    'Added 6 font style options (Sans Serif, Serif, Monospace, Rounded, Display, Elegant)',
    'Built AvatarPicker modal component with style/pattern/font selection grids',
    'Integrated avatar system into ProfileScreen and UserSettings with Firebase persistence',
    'Created avatar.css with responsive design and modal scrolling optimization',
    'Created terms.css (800+ lines) with expandable sections, gradient animations, and responsive layouts',
    'Updated AuthContext updateUserProfile to save avatarStyle, avatarPattern, and avatarFont',
    'Enhanced WelcomeScreen CSS with new highlight items matching chip design'
  ],
  bugFixes: [
    'Fixed avatar picker modal scrolling background page instead of modal content',
    'Fixed missing semicolon in profile.css causing CSS parsing errors',
    'Removed duplicate "AI Insights" chip from WelcomeScreen features',
    'Removed swipe hint arrows and text from WelcomeScreen first slide',
    'Fixed UserSettings modal structure with proper div closing tags'
  ],
  improvements: [
    'Avatar patterns now use dedicated patternColor with 50-90% opacity for better visibility',
    'Vibrant 3-color gradients for all avatar themes (e.g., Forest: #2d5016 → #558B6E → #7BA888)',
    'Larger, more prominent patterns (dots 3-4.5px, waves 3px stroke width, etc.)',
    'WelcomeScreen spacing optimized: feature chips 1rem margin, highlights 3rem margin',
    'Terms and Privacy pages now use expandable sections with smooth animations',
    'Avatar save button has proper top and bottom margins (1rem each)',
    'Modal overlays have overflow-y: auto to prevent background scrolling',
    'Enhanced multi-modal platform messaging across legal documents'
  ],
  avatarSystem: [
    '6 vibrant gradient themes with dedicated pattern colors for optimal contrast',
    '6 bold SVG patterns with increased size and opacity (50-90%)',
    '6 professional font styles with proper weights (600-700)',
    'Live preview in picker modal showing real-time customization',
    'Automatic initials generation from user display name (max 2 characters)',
    'Camera icon edit button for quick avatar customization',
    'Firebase persistence of avatarStyle, avatarPattern, and avatarFont',
    'Responsive grid layouts (3 columns on mobile, auto-fit on desktop)',
    'Hover effects and selected states for all picker options'
  ],
  uiEnhancements: [
    'WelcomeScreen tagline: "Transform your thoughts into profound insights"',
    'Three new highlight items with circular icons and single-line text',
    'Terms of Service with Quick Overview grid and expandable sections',
    'Privacy Policy with multi-modal content organization',
    'Color-coded info boxes (info: blue, warning: orange, disclaimer: gray, highlight: green)',
    'Animated glow effects on info cards with termsGlow keyframe',
    'Styled lists with checkmark bullets (✓) and prohibition X bullets (✗)',
    'Contact cards with Mail icon and external links with proper styling'
  ],
  userExperience: [
    'Personalized avatars with 216 unique combinations reflecting user style',
    'Easy avatar customization in both Profile and Settings screens',
    'Cleaner WelcomeScreen first slide with focused messaging',
    'Comprehensive legal transparency with multi-modal platform details',
    'Professional, readable Terms and Privacy pages with expandable sections',
    'Improved onboarding with clear feature highlights',
    'Consistent avatar display across Profile and Settings',
    'Smooth modal interactions with proper scrolling behavior'
  ],
  notes: [
    'This update introduces a powerful SVG-based avatar system allowing users to create 216 unique avatar combinations without file uploads',
    'The avatar system uses vibrant 3-color gradients and prominent patterns for visually striking profile pictures',
    'WelcomeScreen enhancements focus users on the core multi-modal journaling value proposition',
    'Terms and Privacy pages now clearly communicate the multi-modal platform (text, voice, visual) and AI transparency',
    'All avatar preferences are stored in Firebase userProfile document for seamless persistence',
    'The expandable legal document design improves readability while maintaining comprehensive information',
    'Avatar initials are automatically generated from user display name for immediate personalization',
    'Premium styling throughout legal pages matches the overall app aesthetic and brand identity'
  ],
  compatibility: [
    'SVG avatars: All modern browsers with SVG support (Chrome 4+, Firefox 3+, Safari 3.1+, Edge 12+)',
    'Avatar persistence: Firebase Firestore with userProfile.avatarStyle, avatarPattern, avatarFont fields',
    'Responsive design: Optimized for mobile (320px+) and desktop (1920px+)',
    'Modal scrolling: Fixed overlays with overflow-y: auto for proper UX',
    'Legal pages: Expandable sections with CSS max-height transitions',
    'Font support: System fonts with fallbacks for all 6 font styles'
  ]
},

{
  version: '5.0.2_alpha',
  releaseDate: '2025-11-06',
  codename: '4 new multi-modal journey paths & Android full-screen mode',
  features: [
    'Added 4 new multi-modal journaling paths combining voice, visual, and text reflection: Expressive Voice (14 days), Visual Storytelling (15 days), Mindful Speaking (21 days), Creative Narration (12 days)',
    'Full-screen immersive mode on Android devices hiding both status bar and navigation bar for distraction-free journaling',
    'Edge-to-edge content display on Android with transparent system bars and proper theme configuration',
    'New message added for Firefox mobile users indicating limited Web Speech API support and recommending desktop usage for voice journaling',
    'Enhanced voice journaling experience on Android with automatic OpenAI Whisper transcription after recording completes',
    'Improved voice recording controls with pause, resume, and stop functionality for professional journaling experience',
  ],
  technicalUpdates: [
    'Added 4 new multi-modal journaling paths with appropriate pathType classification and UI handling',
    'Implemented full-screen immersive mode on Android using WindowInsetsController and legacy SYSTEM_UI_FLAGS for compatibility',
    'Configured transparent status bar and navigation bar in styles.xml for edge-to-edge content display',
  ],
  bugFixes: [
    'CRITICAL: Fixed Android full-screen mode only hiding status bar but not navigation bar',
    'CRITICAL: Fixed voice journaling transcription not triggering on Android devices after recording completion',
    'Fixed Web Speech API limitations on Firefox mobile causing inconsistent voice journaling experience',
  ],
  improvements: [
    'Added 4 new multi-modal journaling paths expanding self-expression options',
    'Improved Android full-screen mode with proper hiding of both status and navigation bars',
    'Enhanced voice journaling transcription reliability on Android with OpenAI Whisper integration',
    'Better user guidance for Firefox mobile users regarding voice journaling limitations',
    'Improved voice recording controls for a more professional and flexible journaling experience'
  ],
  androidEnhancements: [
      'Full immersive mode hiding both status bar and navigation bar',
      'Edge-to-edge content display with transparent system bars',
      'Proper theme configuration in styles.xml for system bar transparency',
      'Compatibility with both WindowInsetsController (Android R+) and legacy SYSTEM_UI_FLAGS',
      'Improved user experience with distraction-free journaling environment'
  ],
  userExperience: [
    'Seamless multi-modal journaling experience with 4 new paths',
    'Distraction-free journaling on Android with full-screen immersive mode',
    'Reliable voice transcription on Android with OpenAI Whisper after recording',
    'Clear messaging for Firefox mobile users about voice journaling limitations',
    'Professional voice recording controls enhancing journaling flexibility'
  ],
  notes: [
    'This update expands the journaling experience with 4 new multi-modal paths, allowing users to combine voice, visual, and text reflection for deeper self-expression.',
    'The full-screen immersive mode on Android provides a distraction-free environment, enhancing focus during journaling sessions.',
    'Voice journaling on Android is significantly improved with automatic transcription via OpenAI Whisper, ensuring users receive accurate text representations of their spoken reflections.',
    'Firefox mobile users are informed about the limitations of Web Speech API support, guiding them to use desktop browsers for optimal voice journaling experience.',
    'Voice recording controls have been enhanced to include pause, resume, and stop functionality, offering users a more professional and flexible journaling experience.'
  ],
  compatibility: [
    'Android: Full-screen immersive mode with WindowInsetsController and legacy SYSTEM_UI_FLAGS',
    'Voice journaling: OpenAI Whisper API transcription via Firebase Cloud Functions on Android',
    'Desktop: Web Speech API with Chrome 60+, Firefox 88+, Safari 14+',
    'Firefox mobile: Limited Web Speech API support; voice journaling recommended on desktop browsers'
  ]
},

{
  version: '5.0.2_alpha',
  releaseDate: '2025-11-06',
  codename: '4 new multi-modal journey paths & Android full-screen mode',
  features: [
    'Added 4 new multi-modal journaling paths combining voice, visual, and text reflection: Expressive Voice (14 days), Visual Storytelling (15 days), Mindful Speaking (21 days), Creative Narration (12 days)',
    'Full-screen immersive mode on Android devices hiding both status bar and navigation bar for distraction-free journaling',
    'Edge-to-edge content display on Android with transparent system bars and proper theme configuration',
    'New message added for Firefox mobile users indicating limited Web Speech API support and recommending desktop usage for voice journaling',
    'Enhanced voice journaling experience on Android with automatic OpenAI Whisper transcription after recording completes',
    'Improved voice recording controls with pause, resume, and stop functionality for professional journaling experience',
  ],
  technicalUpdates: [
    'Added 4 new multi-modal journaling paths with appropriate pathType classification and UI handling',
    'Implemented full-screen immersive mode on Android using WindowInsetsController and legacy SYSTEM_UI_FLAGS for compatibility',
    'Configured transparent status bar and navigation bar in styles.xml for edge-to-edge content display',
  ],
  bugFixes: [
    'CRITICAL: Fixed Android full-screen mode only hiding status bar but not navigation bar',
    'CRITICAL: Fixed voice journaling transcription not triggering on Android devices after recording completion',
    'Fixed Web Speech API limitations on Firefox mobile causing inconsistent voice journaling experience',
  ],
  improvements: [
    'Added 4 new multi-modal journaling paths expanding self-expression options',
    'Improved Android full-screen mode with proper hiding of both status and navigation bars',
    'Enhanced voice journaling transcription reliability on Android with OpenAI Whisper integration',
    'Better user guidance for Firefox mobile users regarding voice journaling limitations',
    'Improved voice recording controls for a more professional and flexible journaling experience'
  ],
  androidEnhancements: [
      'Full immersive mode hiding both status bar and navigation bar',
      'Edge-to-edge content display with transparent system bars',
      'Proper theme configuration in styles.xml for system bar transparency',
      'Compatibility with both WindowInsetsController (Android R+) and legacy SYSTEM_UI_FLAGS',
      'Improved user experience with distraction-free journaling environment'
  ],
  userExperience: [
    'Seamless multi-modal journaling experience with 4 new paths',
    'Distraction-free journaling on Android with full-screen immersive mode',
    'Reliable voice transcription on Android with OpenAI Whisper after recording',
    'Clear messaging for Firefox mobile users about voice journaling limitations',
    'Professional voice recording controls enhancing journaling flexibility'
  ],
  notes: [
    'This update expands the journaling experience with 4 new multi-modal paths, allowing users to combine voice, visual, and text reflection for deeper self-expression.',
    'The full-screen immersive mode on Android provides a distraction-free environment, enhancing focus during journaling sessions.',
    'Voice journaling on Android is significantly improved with automatic transcription via OpenAI Whisper, ensuring users receive accurate text representations of their spoken reflections.',
    'Firefox mobile users are informed about the limitations of Web Speech API support, guiding them to use desktop browsers for optimal voice journaling experience.',
    'Voice recording controls have been enhanced to include pause, resume, and stop functionality, offering users a more professional and flexible journaling experience.'
  ],
  compatibility: [
    'Android: Full-screen immersive mode with WindowInsetsController and legacy SYSTEM_UI_FLAGS',
    'Voice journaling: OpenAI Whisper API transcription via Firebase Cloud Functions on Android',
    'Desktop: Web Speech API with Chrome 60+, Firefox 88+, Safari 14+',
    'Firefox mobile: Limited Web Speech API support; voice journaling recommended on desktop browsers'
  ]
},


{
  version: '5.0.3_alpha',
  releaseDate: '2025-11-08',
  codename: 'Customizable SVG avatars & UI enhancements',
  features: [
    'Fully customizable SVG-based avatar system with 216 unique combinations (6 themes × 6 patterns × 6 fonts)',
    'Avatar picker modal with live preview and easy customization in both Profile and Settings',
    'Enhanced WelcomeScreen first slide with tagline and 3 new highlight items (Write/Speak/Create, AI Insights, Track Growth)',
    'Comprehensive Terms of Service page redesign with multi-modal platform messaging and premium expandable sections',
    'Privacy Policy page updated with multi-modal content (text, voice, visual) and enhanced AI transparency',
    'Premium legal document styling with animated info cards, color-coded boxes, and responsive design'
  ],
  technicalUpdates: [
    'Created Avatar.jsx component with 6 color gradient themes (Forest, Sunset, Ocean, Lavender, Amber, Sage)',
    'Implemented 6 SVG pattern overlays (Dots, Waves, Circles, Geometric, Sparkles, None) with 50-90% opacity',
    'Added 6 font style options (Sans Serif, Serif, Monospace, Rounded, Display, Elegant)',
    'Built AvatarPicker modal component with style/pattern/font selection grids',
    'Integrated avatar system into ProfileScreen and UserSettings with Firebase persistence',
    'Created avatar.css with responsive design and modal scrolling optimization',
    'Created terms.css (800+ lines) with expandable sections, gradient animations, and responsive layouts',
    'Updated AuthContext updateUserProfile to save avatarStyle, avatarPattern, and avatarFont',
    'Enhanced WelcomeScreen CSS with new highlight items matching chip design'
  ],
  bugFixes: [
    'Fixed avatar picker modal scrolling background page instead of modal content',
    'Fixed missing semicolon in profile.css causing CSS parsing errors',
    'Removed duplicate "AI Insights" chip from WelcomeScreen features',
    'Removed swipe hint arrows and text from WelcomeScreen first slide',
    'Fixed UserSettings modal structure with proper div closing tags'
  ],
  improvements: [
    'Avatar patterns now use dedicated patternColor with 50-90% opacity for better visibility',
    'Vibrant 3-color gradients for all avatar themes (e.g., Forest: #2d5016 → #558B6E → #7BA888)',
    'Larger, more prominent patterns (dots 3-4.5px, waves 3px stroke width, etc.)',
    'WelcomeScreen spacing optimized: feature chips 1rem margin, highlights 3rem margin',
    'Terms and Privacy pages now use expandable sections with smooth animations',
    'Avatar save button has proper top and bottom margins (1rem each)',
    'Modal overlays have overflow-y: auto to prevent background scrolling',
    'Enhanced multi-modal platform messaging across legal documents'
  ],
  avatarSystem: [
    '6 vibrant gradient themes with dedicated pattern colors for optimal contrast',
    '6 bold SVG patterns with increased size and opacity (50-90%)',
    '6 professional font styles with proper weights (600-700)',
    'Live preview in picker modal showing real-time customization',
    'Automatic initials generation from user display name (max 2 characters)',
    'Camera icon edit button for quick avatar customization',
    'Firebase persistence of avatarStyle, avatarPattern, and avatarFont',
    'Responsive grid layouts (3 columns on mobile, auto-fit on desktop)',
    'Hover effects and selected states for all picker options'
  ],
  uiEnhancements: [
    'WelcomeScreen tagline: "Transform your thoughts into profound insights"',
    'Three new highlight items with circular icons and single-line text',
    'Terms of Service with Quick Overview grid and expandable sections',
    'Privacy Policy with multi-modal content organization',
    'Color-coded info boxes (info: blue, warning: orange, disclaimer: gray, highlight: green)',
    'Animated glow effects on info cards with termsGlow keyframe',
    'Styled lists with checkmark bullets (✓) and prohibition X bullets (✗)',
    'Contact cards with Mail icon and external links with proper styling'
  ],
  userExperience: [
    'Personalized avatars with 216 unique combinations reflecting user style',
    'Easy avatar customization in both Profile and Settings screens',
    'Cleaner WelcomeScreen first slide with focused messaging',
    'Comprehensive legal transparency with multi-modal platform details',
    'Professional, readable Terms and Privacy pages with expandable sections',
    'Improved onboarding with clear feature highlights',
    'Consistent avatar display across Profile and Settings',
    'Smooth modal interactions with proper scrolling behavior'
  ],
  notes: [
    'This update introduces a powerful SVG-based avatar system allowing users to create 216 unique avatar combinations without file uploads',
    'The avatar system uses vibrant 3-color gradients and prominent patterns for visually striking profile pictures',
    'WelcomeScreen enhancements focus users on the core multi-modal journaling value proposition',
    'Terms and Privacy pages now clearly communicate the multi-modal platform (text, voice, visual) and AI transparency',
    'All avatar preferences are stored in Firebase userProfile document for seamless persistence',
    'The expandable legal document design improves readability while maintaining comprehensive information',
    'Avatar initials are automatically generated from user display name for immediate personalization',
    'Premium styling throughout legal pages matches the overall app aesthetic and brand identity'
  ],
  compatibility: [
    'SVG avatars: All modern browsers with SVG support (Chrome 4+, Firefox 3+, Safari 3.1+, Edge 12+)',
    'Avatar persistence: Firebase Firestore with userProfile.avatarStyle, avatarPattern, avatarFont fields',
    'Responsive design: Optimized for mobile (320px+) and desktop (1920px+)',
    'Modal scrolling: Fixed overlays with overflow-y: auto for proper UX',
    'Legal pages: Expandable sections with CSS max-height transitions',
    'Font support: System fonts with fallbacks for all 6 font styles'
  ]
},

{
  version: '5.2.0_alpha',
  releaseDate: '2025-11-09',
  codename: 'AI-Powered Path Recommender',
  features: [
    'AI-Powered Path Recommendation Engine using Claude Sonnet 4',
    'Personalized journey recommendations based on user interests, goals, and journaling behavior',
    'Smart recommendation caching system (7-day cache for improved performance)',
    'Beautiful recommendation cards on HomeScreen with gradient designs and animations',
    'Three recommendation categories: Growth (builds on progress), Exploration (new territory), Challenge (stretch goals)',
    'Real-time analysis of recent journal entries for contextual recommendations',
    'Match scoring system (0-100) showing how well each path fits the user',
    'AI-generated explanations for WHY each path is recommended',
    'Expandable recommendation cards revealing benefits and perfect timing insights',
    'Quick starter recommendations for new users based on onboarding preferences'
  ],
  technicalUpdates: [
    'Created pathRecommender.js service with comprehensive recommendation engine',
    'Built getAiRecommendations() function using Claude API for personalized suggestions',
    'Implemented algorithmic fallback recommendations for when AI is unavailable',
    'Created buildUserContext() analyzing interests, goals, completed paths, and journaling patterns',
    'Built scorePathRelevance() algorithm with multi-factor scoring (interests: 30pts, goals: 30pts, difficulty: 20pts, novelty: 10pts, length: 10pts)',
    'Implemented determineExperienceLevel() classifying users as beginner/intermediate/advanced',
    'Created extractEmotionTrends() and extractRecentThemes() for behavioral analysis',
    'Built cacheRecommendations() and getCachedRecommendations() for Firestore caching',
    'Integrated getStarterRecommendations() for onboarding-based path matching',
    'Created PathRecommendationCard.jsx component with category badges and match scores',
    'Built PathRecommendations.jsx container component with loading/error states',
    'Enhanced HomeScreen.jsx with AI recommendations section above journeys',
    'Created pathRecommendation.css with beautiful gradient cards and animations'
  ],
  aiPromptEngineering: [
    'Comprehensive Claude prompts analyzing user profile, completed paths, and journaling stats',
    'Request format includes interests, goals, experience level, entry patterns, and emotion trends',
    'AI provides structured JSON responses with pathId, matchScore, reason, benefit, timing, and category',
    'Prompt guidelines ensure beginner-friendly 10-day paths for new users',
    'Advanced users receive longer, more challenging path recommendations',
    'AI considers emotional themes and recent topics for contextual relevance',
    'Recommendations balance familiarity with novelty for optimal engagement',
    'Temperature set to 0.7 for creative yet consistent suggestions'
  ],
  recommendationAlgorithms: [
    'Interest matching: Tags aligned with user interests (0-30 points)',
    'Goal alignment: Path benefits matching journaling goals (0-30 points)',
    'Difficulty progression: Experience-appropriate challenge level (0-20 points)',
    'Novelty bonus: Unexplored paths receive priority (0-10 points)',
    'Length preference: Matches user streak patterns for optimal commitment (0-10 points)',
    'Difficulty fit scoring: Perfect match (20pts), slight stretch (10pts), mismatch (5pts)',
    'Average entry length analysis for writer profiling',
    'Most active journaling time detection (morning/afternoon/evening/night)',
    'Recent emotion trends from last 10 entries',
    'Theme extraction from analysis data'
  ],
  userExperience: [
    'Prominent "Recommended For You" section on HomeScreen with AI sparkle icon',
    'Three beautifully designed gradient cards with unique colors per recommendation',
    'Match score badges showing percentage fit with star icon',
    'Category badges (Growth/Exploration/Challenge) with distinct colors and icons',
    'Tap-to-expand cards revealing detailed AI explanations',
    '"Why This Path?" section with personalized reasoning',
    '"What You\'ll Gain" section highlighting specific benefits',
    '"Why Now?" section explaining perfect timing',
    'Refresh button to generate new recommendations on demand',
    'Smooth loading state with animated sparkles and encouraging messages',
    'Graceful error handling with helpful fallback messages',
    'One-tap journey start from recommendation cards'
  ],
  visualDesign: [
    'Gradient card backgrounds: Purple (#667eea to #764ba2), Pink (#f093fb to #f5576c), Cyan (#4facfe to #00f2fe)',
    'Match score badges with white background and purple text',
    'Category-specific colors: Growth (green #10b981), Exploration (purple #6366f1), Challenge (orange #f59e0b)',
    'Difficulty badges with color coding: Beginner (green), Intermediate (blue), Advanced (purple)',
    'Frosted glass effect on explanation sections with backdrop-filter blur',
    'Shimmer animation on card hover and tap interactions',
    'Sparkle icon rotation animation (2s infinite)',
    'Staggered entrance animations: Card 1 (0s), Card 2 (0.1s), Card 3 (0.2s)',
    'Responsive design from 320px mobile to 2560px+ desktop',
    'Dark theme support with adjusted colors and contrast'
  ],
  performance: [
    '7-day caching system reduces API calls and improves load times',
    'Fallback to algorithmic recommendations if AI unavailable',
    'Recent entries limited to 20 for efficient context building',
    'useMemo optimization for expensive calculations',
    'Lazy loading of recommendation component',
    'Cached recommendations retrieved from Firestore subcollection',
    'Minimal re-renders with proper React component structure',
    'Efficient scoring algorithms with O(n) complexity'
  ],
  integration: [
    'Seamless integration with existing JOURNEY_PATHS registry',
    'Compatible with all 50 journey paths (10-100 days)',
    'Works with onboarding data (interests and goals from SignUpScreen)',
    'Analyzes userProfile.pathProgress for completion tracking',
    'Integrates with journal_entries collection for behavioral analysis',
    'Connects to path selection screen with highlight support',
    'Compatible with subscription system (can prioritize premium paths)',
    'Works with all path types: writing, visual, voice, multi-modal'
  ],
  notes: [
    'This revolutionary feature makes Καιρός the first AI-powered journaling app with truly personalized path recommendations',
    'Claude AI analyzes your unique journaling journey to suggest perfect next steps',
    'Recommendations evolve as you complete more paths and develop journaling patterns',
    'The system learns from 20+ data points including interests, goals, emotions, themes, and behavior',
    'New users get instant starter recommendations based on onboarding preferences',
    'Experienced users receive sophisticated AI suggestions considering growth trajectory',
    'The 7-day cache ensures consistent recommendations while allowing for periodic refresh',
    'Algorithmic fallback guarantees recommendations even without AI API access',
    'Beautiful visual design makes discovering new paths exciting and engaging',
    'This feature increases user engagement by surfacing relevant paths at the perfect time'
  ],
  futureEnhancements: [
    'Seasonal and time-based recommendations (e.g., "Spring is perfect for Nature Connection")',
    'Mood-based suggestions (detected stressed → recommend Anxiety Alchemy)',
    'Achievement-unlocked paths (complete 3 paths → unlock Life Vision 100-day journey)',
    'Social recommendations (users like you also enjoyed...)',
    'Weekly discovery notifications for fresh path suggestions',
    'Premium user exclusive AI recommendations with deeper analysis',
    'Voice-based recommendation explanations',
    'Path recommendation sharing with friends'
  ],
  compatibility: [
    'Claude Sonnet 4 API integration for AI-powered recommendations',
    'Firestore subcollection for recommendation caching',
    'React 18+ with hooks (useState, useEffect, useMemo)',
    'Lucide React icons for UI elements',
    'CSS animations and transitions (Chrome 43+, Firefox 16+, Safari 9+)',
    'Mobile-first responsive design (320px+)',
    'Touch-optimized for mobile devices',
    'Keyboard navigation support',
    'Screen reader accessible with ARIA labels'
  ]
},

{
  version: '5.1.0_alpha',
  releaseDate: '2025-11-09',
  codename: 'Gamified Achievements & Secret Unlocks',
  features: [
    'Comprehensive achievement system with 12 total achievements (7 regular + 5 secret)',
    'Secret achievement system with hidden unlockables and mystery rewards',
    'Five brand-new secret achievements: Night & Day, Mood Master, Power User, Random Explorer, Fortune Teller',
    'Achievement rarity system with badges: UNCOMMON (green), RARE (blue), EPIC (purple)',
    'Points-based achievement scoring (50-500 points per achievement)',
    'Total achievement score display with trophy icon in profile header',
    'Visual effects system: shimmer animations, glow effects, sparkle icons for secret achievements',
    'Achievement category system: streak, volume, paths, and secret achievements',
    'Real-time achievement tracking via enhanced useUserStatistics hook',
    'Separate UI sections for regular vs secret achievements in profile'
  ],
  technicalUpdates: [
    'Enhanced ACHIEVEMENT_DEFINITIONS in ProfileScreen.jsx with 5 new secret achievements',
    'Added secret achievement CSS with unique color schemes (achievement-secret, achievement-rainbow, achievement-electric, achievement-mystery, achievement-mystic)',
    'Implemented @keyframes profileSecretShimmer animation (3s infinite diagonal shimmer)',
    'Created @keyframes profileAchievementGlow animation (2s pulsing glow 10px-30px)',
    'Built rarity badge system with gradient colors for all tiers',
    'Enhanced useUserStatistics.js with 5 new tracking algorithms',
    'Night & Day tracking: Time-based analysis grouping entries by date, detecting morning (5-9 AM) AND night (10 PM-5 AM) entries',
    'Mood Master tracking: Emotion detection using 58 keywords across 8 categories (joy, sadness, anger, fear, surprise, disgust, trust, anticipation)',
    'Random Explorer tracking: Path completion filtering excluding defaults and voice paths',
    'Fortune Teller tracking: Goal achievement detection with keyword matching (\'achieved\', \'accomplished\', \'completed\', etc.)',
    'Added totalInsights calculation (sum of all entry.analysis.insights.length)',
    'Created achievementTracking.js utility with helper functions for tracking progress',
    'Built trackRandomPathCompletion, trackGoalAchievement, unlockAchievement functions',
    'Enhanced ProfileScreen with achievement score calculation and display'
  ],
  secretAchievements: [
    '🎭 Night & Day (RARE, 150 pts): Journal both early morning (5-9 AM) and late night (10 PM-5 AM) on the same day',
    '🌈 Mood Master (EPIC, 300 pts): Experience and journal about all 8 emotion categories',
    '⚡ Power User (RARE, 250 pts): Maintain a 7-day journaling streak without missing a day',
    '✨ Random Explorer (UNCOMMON, 200 pts): Complete a random/recommended journey path',
    '🎯 Fortune Teller (EPIC, 350 pts): Set and achieve 3 personal goals tracked through journaling'
  ],
  trackingAlgorithms: [
    'Night & Day: Groups entries by toDateString(), tracks morning/night flags per day, counts days with BOTH flags true',
    'Mood Master: 8 emotion categories with keyword arrays, searches extractedText/transcription/summary/insights, returns Set.size of detected emotions (0-8)',
    'Random Explorer: Filters completedPaths for non-default/non-voice paths, falls back to userProfile.randomPathsCompleted',
    'Fortune Teller: Checks userProfile.achievedGoals array, searches for goal keywords in entry text, divides mentions by 2 to avoid over-counting',
    'Total Insights: Reduces entry.analysis.insights.length across all entries'
  ],
  visualEffects: [
    'achievement-secret: Purple gradient (#8b5cf6 to #6d28d9) with profileSecretShimmer overlay',
    'achievement-rainbow: 7-color gradient border (red, orange, yellow, green, blue, indigo, violet)',
    'achievement-electric: Purple glow with profileAchievementGlow animation',
    'achievement-mystery: Pink-purple gradient (#ec4899 to #8b5cf6)',
    'achievement-mystic: Deep purple with enhanced glow',
    'profileSecretShimmer: 3s infinite diagonal shimmer from left (-200px) to right (200px)',
    'profileAchievementGlow: 2s ease-in-out pulsing glow (10px to 30px box-shadow)',
    'profileSparkleRotate: 2s infinite 360° rotation for sparkle emoji',
    'Rarity badges with gradient backgrounds and 0.8rem font size'
  ],
  userExperience: [
    'Discover hidden achievements through natural journaling behavior',
    'Visual distinction between regular and secret achievements with shimmer/glow effects',
    'Progress tracking shows how close users are to unlocking achievements',
    'Achievement scoring adds gamification layer to journaling practice',
    'Rarity badges create collection/completion incentives',
    'Secret achievements encourage diverse journaling patterns (time, emotion, path exploration)',
    'Achievement unlocks provide positive reinforcement for consistent practice',
    'Mystery element adds excitement and discovery to the journaling journey'
  ],
  improvements: [
    'Enhanced ProfileScreen with achievement categorization and scoring',
    'Improved statistics hook with comprehensive tracking for secret achievements',
    'Added achievement helper utilities for easy progress tracking',
    'Better visual feedback for achievement unlocks with animations',
    'Streamlined achievement display with "View All" option for many achievements',
    'Enhanced profile header with achievement score and trophy icon',
    'Improved CSS architecture with unique prefixes preventing conflicts',
    'Better mobile responsiveness for achievement cards and rarity badges'
  ],
  notes: [
    'This major update introduces a comprehensive gamification system to encourage consistent and diverse journaling',
    'Secret achievements are designed to be discovered naturally through varied journaling behavior',
    'The emotion detection system uses sophisticated keyword matching across 8 psychological categories',
    'Time-based tracking enables discovery of journaling patterns across different times of day',
    'Achievement tracking is fully integrated with existing statistics system for real-time updates',
    'All achievements include point values creating a scoring system for long-term engagement',
    'Rarity system (UNCOMMON, RARE, EPIC) adds collection incentives',
    'Visual effects (shimmer, glow, sparkle) make secret achievements feel special and rewarding',
    'The achievement system lays foundation for future features like leaderboards and sharing',
    'Helper functions enable easy expansion with additional achievements in future updates'
  ],
  compatibility: [
    'Achievement tracking: Real-time calculation via useUserStatistics hook with useMemo optimization',
    'Firebase integration: Achievement data stored in userProfile document',
    'Browser support: CSS animations work on all modern browsers (Chrome 43+, Firefox 16+, Safari 9+)',
    'Mobile optimization: Touch-friendly achievement cards with 44px minimum targets',
    'Performance: Memoized calculations prevent unnecessary re-renders',
    'Accessibility: Proper ARIA labels and reduced motion support for animations'
  ]
},

{
  version: '5.2.0_alpha',
  releaseDate: '2025-11-10',
  codename: 'Enhanced AI Analysis Experience',
  features: [
    'Completely rewritten AI analysis prompts with psychological depth and personalization',
    'Enhanced system prompts referencing Carl Rogers (empathy), James Clear (habits), and Brené Brown (compassion)',
    'Voice journal analysis with vocal authenticity focus and specific listening techniques',
    'Redesigned AnalysisResults.jsx with enhanced visual presentation and user engagement',
    'New featured card designs with subtitles, icons, and pulse animations',
    'Voice observations card for voice entries with special styling',
    'Enhanced affirmation display with decorative quote marks and highlighted styling',
    'Improved reflection tab with question exploration suggestions and expandable options',
    'Enhanced action tab with "Why this matters" insight boxes and dual-button layout',
    'Comprehensive CSS updates with new card variants and animations'
  ],
  technicalUpdates: [
    'Rewrote claudeService.js regular journal analysis system prompt (120+ lines)',
    'Rewrote claudeService.js voice journal analysis system prompt (100+ lines)',
    'Enhanced AnalysisResults.jsx insights tab with featured summary card',
    'Added voice observations conditional card for voice entries',
    'Redesigned reflection tab with icon circle, question wrapper, and suggestion list',
    'Redesigned action tab with text wrapper, insight box, and button group',
    'Created ar.css enhancements: --featured, --voice-obs, --enhanced card variants',
    'Added animation keyframes: iconPulse, fadeInUp, shimmer for enhanced visual feedback',
    'Implemented connector lines between enhanced insights for visual flow',
    'Added subtitle support for card headers with proper typography'
  ],
  aiPromptEnhancements: [
    'Regular journal analysis: Quote user\'s specific words, avoid clichés, balance validation with challenge',
    'Enhanced response standards: Personalized insights based on actual content, actionable next steps',
    'Voice analysis: Acknowledge vocal courage, analyze tone/pacing/pauses, quote authentic phrases',
    'Visual analysis sections for image-based entries when applicable',
    'Psychological frameworks: Rogers\' unconditional positive regard, Clear\'s habit formation, Brown\'s vulnerability work',
    'Depth over surface: Move beyond obvious to uncover patterns and deeper meaning',
    'Strengths-based approach highlighting user\'s wisdom and resilience in entries'
  ],
  uiEnhancements: [
    'Featured "What We Discovered Together" summary card with Brain icon and pulse animation',
    'Enhanced insights with connector lines showing progression between numbered items',
    'Voice observations card with microphone icon for voice-specific reflections',
    'Highlighted affirmation with large decorative quote marks and enhanced border',
    'Reflection question wrapper with gradient background and proper spacing',
    '"Ways to explore this further" section with 4 actionable suggestions',
    'Action tab "Why this matters" insight box with blue gradient background',
    'Set Reminder (primary) and I\'ll Remember This (secondary) action buttons',
    'Subtitles on card headers for additional context ("Your reflection reveals deep insight")',
    'Icon animations and glow effects for featured elements'
  ],
  cssImprovements: [
    '.ar-card--featured: Enhanced featured card with stronger borders and shadows',
    '.ar-card__subtitle: New subtitle styling for card headers',
    '.ar-card__icon--pulse: Pulsing icon animation (scale 1.0 to 1.1)',
    '.ar-card__icon--glow: Glowing icon effect with drop-shadow',
    '.ar-insights__item--enhanced: Enhanced insight layout with left padding',
    '.ar-insights__connector: Visual connector lines between insights',
    '.ar-card--voice-obs: Voice observations card with purple gradient',
    '.ar-affirmation--enhanced: Enhanced affirmation with quote marks',
    '.ar-reflection--enhanced: Enhanced reflection layout with animations',
    '.ar-action--enhanced: Enhanced action layout with insight boxes',
    '.ar-action__buttons: Flex button group for action tab',
    '.ar-reflection__suggestion: Enhanced suggestion items with icons and descriptions'
  ],
  visualDesign: [
    'Pulse animation: Smooth icon scaling creating breathing effect',
    'Connector lines: 2px gradient lines showing insight progression',
    'Quote marks: 4rem serif font positioned absolutely for affirmations',
    'Gradient backgrounds: Blue/purple gradients for insight and note boxes',
    'Featured cards: 2px borders with enhanced shadows and glow effects',
    'Voice observations: Purple theme matching voice journaling brand',
    'Icon circles: 100px diameter with 3px borders and pulse animations',
    'Frosted glass effects: Backdrop blur on explanation sections',
    'Staggered animations: 0.1s delays for sequential card reveals'
  ],
  userExperience: [
    'More personal AI responses that quote user\'s actual words and phrases',
    'Deeper psychological insights moving beyond surface-level observations',
    'Voice entries acknowledged with vocal courage and authenticity recognition',
    'Visual hierarchy guiding users through insights, reflection, and action',
    'Featured summary feels impactful with enhanced design treatment',
    'Reflection questions feel exploratory with actionable next steps',
    'Action suggestions feel meaningful with "why this matters" explanations',
    'Affirmations feel powerful with decorative quote presentation',
    'Smooth animations and transitions create polished experience',
    'Enhanced visual feedback makes analysis results engaging to read'
  ],
  improvements: [
    'AI prompts now reference psychological best practices and frameworks',
    'Analysis results display matches quality of enhanced AI responses',
    'Voice entries receive appropriate recognition for vocal expression',
    'Visual consistency across all analysis tabs with enhanced styling',
    'Better mobile responsiveness for all enhanced card components',
    'Improved accessibility with proper focus states and ARIA labels',
    'Enhanced performance with CSS-only animations (no JavaScript)',
    'Better theme integration with consistent colors and gradients'
  ],
  notes: [
    'This update significantly improves the AI analysis experience with both content quality and visual presentation',
    'Enhanced prompts produce more personalized, psychologically-grounded insights for users',
    'Voice journaling now receives appropriate acknowledgment for the courage of vocal self-expression',
    'New UI design makes analysis results feel premium and engaging to read',
    'Carl Rogers\' empathy principles ensure validating yet challenging AI responses',
    'James Clear\'s habit formation concepts inform actionable next steps',
    'Brené Brown\'s compassion framework guides supportive yet honest feedback',
    'Featured card design highlights key insights and summaries',
    'Connector lines create visual flow between numbered insights',
    'Quote marks add gravitas to affirmations and reflection questions',
    'The enhanced experience encourages users to deeply engage with their AI analysis',
    'All enhancements maintain performance with CSS-only animations and optimized rendering'
  ],
  compatibility: [
    'Claude Sonnet 3.5 API with enhanced system prompts',
    'React 18+ with hooks and component updates',
    'CSS animations: Chrome 43+, Firefox 16+, Safari 9+',
    'Backdrop-filter: Chrome 76+, Safari 9+, Firefox 103+',
    'Mobile-optimized: Tested on iOS Safari 14+ and Android Chrome 90+',
    'Touch interactions: 44px minimum touch targets maintained',
    'Accessibility: Enhanced ARIA labels and reduced motion support',
    'Theme support: Works seamlessly in both light and dark modes'
  ]
},

{
  version: '6.0.0_alpha',
  releaseDate: '2025-11-12',
  codename: 'NFC Smart Journal Integration & Subscription Activation',
  features: [
    'NFC Smart Journal integration - tap your phone to physical journal for instant upload',
    'Multi-step journal registration wizard with tier selection (Essential, Insight, Legacy)',
    'Automatic tier detection from NFC chips - skips manual selection when chip contains tier data',
    'Quick access workflow - tap registered journal to launch camera or view archive',
    'Android App Links deep linking for seamless NFC-to-app experience',
    'NFC Test Panel in Debug Page for comprehensive testing and troubleshooting',
    'Automatic journal ownership validation via Firestore',
    'Smart navigation based on journal access patterns',
    'My Journals list with tier badges, icons, and serial numbers',
    'Multi-journal support - register and manage multiple physical journals',
    'Hybrid subscription model: Journal bundle (3/6/12 months free) + Artisan subscription (€0.99/month)',
    'Automatic subscription activation on journal registration via Cloud Function',
    'Premium success screen with subscription activation details and expiration date',
    'Subscription source tracking for journal_bundle vs regular subscriptions'
  ],
  bugFixes: [
    'Fixed Firebase hosting configuration to serve assetlinks.json correctly',
    'Resolved Android intent filter configuration for NFC deep links',
    'Fixed NFC service initialization on web/iOS platforms (graceful degradation)',
    'Corrected domain URLs from kairos-journal.com to reflection-writer.web.app',
    'Fixed .well-known directory deployment blocking in firebase.json',
    'Fixed step numbering in registration flow (1→2→3→4 when tier auto-detected, 1→2→3→4→5 manual)',
    'Resolved NDEF message reading issues by migrating from @capgo to @exxili/capacitor-nfc',
    'Fixed NFC plugin initialization errors with proper cleanup patterns',
    'Corrected parseNFCTag to use new plugin\'s data.string() API instead of manual byte parsing'
  ],
  improvements: [
    'Migrated to @exxili/capacitor-nfc (v0.0.12) for superior NDEF reading capability',
    'Complete NFC service rewrite with modern cleanup function patterns',
    'Enhanced registration UI with gradient effects, smooth animations, and shimmer progress bar',
    'Optimized NFC data parsing - automatic Text record decoding with language code stripping',
    'Added comprehensive error handling for all NFC operations',
    'Platform-aware NFC availability checking (Android-only graceful degradation)',
    'Created production-ready workflows for NFC chip programming',
    'Enhanced modal designs with 28px border radius, layered shadows, and cubic-bezier animations',
    'Tier-specific colored badges and icons throughout the app',
    'Removed unnecessary journal URL field from success screen',
    'Loading states and spinners for async journal data fetching',
    'Better visual hierarchy with 800-weight fonts and gradient text fills',
    'Premium success screen CSS: hover effects, green subscription highlight card, accent bars',
    'Subscription activation flow integrated into registration with detailed feedback',
    'Cloud Function activateJournalSubscription deployed and tested successfully'
  ],
  subscriptionSystem: [
    'Essential tier: 3 months free Artisan subscription (€0.99/month after)',
    'Insight tier: 6 months free Artisan subscription (€0.99/month after)',
    'Legacy tier: 12 months free Artisan subscription (€0.99/month after)',
    'Multiple journals stack free months (Essential + Legacy = 15 months total)',
    'Cloud Function calculates subscription end date based on tier months',
    'Extends existing subscriptions if present rather than overwriting',
    'Updates user document with subscription object: {status: "active", tier: "artisan", source: "journal_bundle", currentPeriodEnd, autoRenew: false}',
    'Subscription cache cleared after activation for real-time UI updates',
    'Success screen shows: tier badge, journal ID, serial number, subscription months, expiration date',
    'Premium journeys become accessible during free period',
    'After expiration, upgrade prompt displays with Stripe checkout option'
  ],
  technicalUpdates: [
    'functions/index.js: Added activateJournalSubscription Cloud Function (lines 850-970)',
    'SubscriptionService.js: Added activateJournalSubscription wrapper calling Cloud Function',
    'JournalRegistration.jsx: Integrated subscription activation into handleRegister',
    'JournalRegistration.css: Premium success screen design with hover effects and gradients',
    'MyJournalsList.jsx: Tier display with Crown, Star, BookOpen icons and serial numbers',
    'journalService.js: Added getJournalDetails function fetching full journal data',
    'Firebase Functions deployed to us-central1 region successfully',
    'Build output: 2948.58 kB bundle, 748.73 kB gzipped, 382.99 kB CSS',
    'Capacitor sync: Found 9 plugins including @exxili/capacitor-nfc@0.0.12',
    'Deployed to Android device (realme RMX3701) with full subscription activation'
  ],
  notes: [
    'NFC functionality requires Android 4.4+ device with NFC hardware',
    'iOS and web versions gracefully degrade - NFC features hidden on unsupported platforms',
    'Physical journals require NTAG215 chips with NDEF Text records containing JSON payload',
    'Chip format: {"journalId":"KAIROS_YYYYMMDD_XXXXX","tier":"legacy|insight|essential","serialNumber":"KJ2025-XXXXXX",...}',
    'SHA-256 certificate fingerprint configured for debug builds - update for production release',
    'Comprehensive documentation added: NFC_CHIP_PROGRAMMING_GUIDE.md, NFC_WORKFLOW_GUIDE.md, NFC_TECHNICAL_DEEP_DIVE.md',
    'assetlinks.json deployed to /.well-known/ for Android App Links verification',
    'Test NFC functionality using Debug Page → NFC Test Panel before programming physical chips',
    '@exxili/capacitor-nfc provides automatic NDEF decoding via data.string(), data.uint8Array(), data.base64()',
    'Registration flow simplified to 5 steps (removed WRITE_NFC step, users write chips separately)',
    'My Journals modal fetches full journal details from Firestore including tier, serial number, and metadata',
    'Hybrid business model: Physical journal purchase includes bundled digital subscription',
    'Journal bundle subscriptions tracked separately from regular Stripe subscriptions via source field',
    'Cloud Function ensures secure subscription activation with proper authentication checks',
    'Success screen provides clear value communication: tier badge, free months, expiration date',
    'All premium journeys accessible during free period - seamless user experience',
    'Subscription system ready for Kickstarter campaign with proven activation flow',
    'Build successful with premium CSS enhancements and subscription integration',
    'Deployed to Android with beautiful subscription activation display'
  ]
},

{
  version: "6.1.0_alpha",
  releaseDate: "2025-11-13",
  features: [
    "Unified premium top bar with rounded corners and responsive design across all main screens",
    "Top bar color now matches the active tab color from the bottom navigation for Home, Paths, Analytics, and Profile screens",
    "Removed icons from top bar on Home, Profile, Paths, and Analytics for a cleaner look",
    "Improved theme toggle visibility and styling in the top bar",
    "Enhanced path selection with unlimited active journeys and better progress visualization",
    "Modernized analytics dashboard with matching top bar color and improved layout"
  ],
  bugFixes: [
    "Fixed duplicate icon rendering in top bar on Home and Profile screens",
    "Resolved top bar width and centering issues to match stats overview",
    "Improved color contrast and accessibility for top bar in both light and dark modes",
    "Fixed theme toggle color for better visibility in top bar context"
  ],
  improvements: [
    "Faster and more consistent UI transitions for top bar and navigation",
    "Cleaner, more minimal top bar design for all main screens",
    "Better alignment between navigation and top bar color scheme",
    "Improved code structure for easier future theming and customization"
  ],
  notes: [
    "This update brings a visually unified and brand-consistent experience across all main screens.",
    "Top bar color now always matches the active tab for instant context feedback.",
    "All changes are fully backward compatible with previous user data and navigation."
  ]
},

{
  version: '0.1-beta',
  releaseDate: '2026-06-25',
  codename: 'Polish & Motion (Public Beta)',
  features: [
    'Smooth sliding active indicator on the bottom navigation — the glass pill now glides between tabs on every device, including touch, instead of appearing instantly',
    'Cohesive loading skeletons that mirror the real layout on the Home and Insights screens, so content settles into place without flashing or jumping',
    'Redesigned Android voice journaling screen with clear, step-by-step recording instructions'
  ],
  bugFixes: [
    'Fixed the Home screen vitals (streak/entries/progress) appearing late and pushing the layout down while statistics loaded',
    'Insights tab no longer shows two different loaders back-to-back; a single skeleton now spans both the screen load and the statistics fetch',
    'Home hero card and the Journal tab now always show the same journey and prompt — the one you worked on most recently',
    'Fixed an internal issue where a journey\'s last-activity timestamp was not being read, so "most recent journey" is now accurate',
    'Profile screen "View All" under Active Journeys now opens the Paths screen instead of the Home screen',
    'Improved visibility of the "Ink & Essence: Black Ink Mastery" path on the Paths screen (its near-black color was hard to see on dark cards)'
  ],
  improvements: [
    'Home and Journal now share a single source of truth for the active journey, keeping them perfectly in sync',
    'Cleaner, friendlier copy throughout the Android voice recording flow',
    'Hid the unusable pause control on Android voice recording to avoid confusion',
    'Loading states now respect reduced-motion preferences',
    'Bottom navigation slider repositions correctly on screen resize and orientation change'
  ],
  notes: [
    'First public beta release of Καιρός.',
    'This release focuses on polish, smoother motion, and consistency across the Home, Insights, Journal, Profile, and Paths screens.',
    'Voice journaling on Android now reads as a simple, guided experience with no technical jargon.',
    'All changes are fully backward compatible with existing user data and progress.'
  ]
},

{
  version: '0.2-beta',
  releaseDate: '2026-07-04',
  codename: 'Voice, Streaks & Liquid Glass',
  features: [
    'Voice journal entries now appear in your day archive — play back the audio and read the transcription right alongside your written and painted days',
    'The analyzing screen now shows rotating reflections from great thinkers while your entry is processed, matching the Home screen',
    'The daily journey view now has a full light theme, with refined "liquid glass" cards, a rounded path badge, a pulsing current-day marker, and gentle entrance animations',
    'Sign-in and sign-up screens redesigned with an Apple-style liquid-glass card and soft sparks drifting behind it'
  ],
  bugFixes: [
    'Fixed journey progress not updating on the Paths and Profile screens after journaling — voice and written entries now show immediately, no reload needed',
    'Fixed the day streak showing too low a number — it now counts every consecutive day you journal across all paths, instead of tracking each path separately',
    'Fixed the final day of a journey offering to "Continue to Day 13" on a 12-day path — the last day now correctly reads "Complete Journey"',
    'Voice journeys now show a "Start Recording" button that opens the recorder, instead of a "Start Writing" camera button',
    'The navigation bar is now hidden on all loading and analyzing screens for a cleaner, distraction-free view'
  ],
  improvements: [
    'Start Journey now opens the sign-in screen first, with a one-tap switch to create a new account',
    'Your profile now refreshes automatically after each entry, so streaks, entry counts, and active journeys stay accurate in real time',
    'Streaks are now calculated from your actual entry history, so any previously incorrect number self-corrects',
    'The day archive merges written, painted, and voice entries so every completed day appears, whatever the format',
    'The daily journey screen reads its path and day from the same navigation context, preventing mismatched journey lengths'
  ],
  notes: [
    'This release focuses on voice journaling, accurate streaks, and a more polished, glassy look across sign-in, the daily view, and loading screens.',
    'The day-streak fix recalculates from your real journaling history, so a previously incorrect streak will correct itself automatically.',
    'Famous phrases are now shared from a single source across the Home and analyzing screens for a consistent voice.',
    'All changes are fully backward compatible with existing user data and progress.'
  ]
}



];

/**
 * Get current version information
 * @returns {Object} Current version details
 */
export const getCurrentVersionInfo = () => {
  return VERSION_HISTORY.find(v => v.version === APP_VERSION) || VERSION_HISTORY[0];
};

/**
 * Check if the current version is the latest
 * @returns {boolean} True if using the latest version
 */
export const isLatestVersion = () => {
  const latestVersion = VERSION_HISTORY[VERSION_HISTORY.length - 1].version;
  return APP_VERSION === latestVersion;
};

export default {
  APP_VERSION,
  VERSION_HISTORY,
  getCurrentVersionInfo,
  isLatestVersion
};