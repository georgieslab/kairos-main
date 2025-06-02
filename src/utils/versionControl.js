// src/utils/versionControl.js

export const APP_VERSION = '0.9.0';

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