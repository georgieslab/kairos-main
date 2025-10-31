// src/utils/versionControl.js

export const APP_VERSION = '6.0_alpha';

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