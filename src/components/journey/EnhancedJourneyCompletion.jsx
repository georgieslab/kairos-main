// src/components/journey/EnhancedJourneyCompletion.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getJourneyPath } from '../../data/JourneyData';
import { 
  generateJourneyCompletion, 
  getPreviousEntries, 
  getPreviousVoiceEntries 
} from '../../services/claudeService';
import { 
  exportJourneyToPDF,
} from '../../services/exportService';
import DynamicIcon from '../common/DynamicIcon';
import KairosLoader from '../common/KairosLoader';
import {
  Award,
  Calendar,
  CheckCircle,
  Star,
  Trophy,
  Share2,
  Download,
  Copy,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  Sparkles,
  Heart,
  Eye,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Target,
  Crown,
  Zap,
  Quote,
  ExternalLink,
  ChevronRight,
  Gift,
  Lightbulb,
  Compass,
  MessageCircle,
  Link2,
  FileText,
  Loader2,
  AlertCircle,
  CheckSquare
} from 'lucide-react';

// Import components
import PathRecommendations from '../paths/PathRecommendations';
import { getNextDayForPath } from '../../utils/pathUtils';

// Import styles
import '../../styles/components/journeyCompletion.css';
import '../../styles/components/aiSummary.css';
import '../../styles/components/shareButtons.css';

const EnhancedJourneyCompletion = ({ 
  pathId, 
  navigateToScreen, 
  onRestart, 
  onViewDay 
}) => {
  const { t } = useTranslation('journey');
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode } = useTheme();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [pathData, setPathData] = useState(null);
  const [error, setError] = useState(null);
  
  // Celebration and interaction states
  const [copySuccess, setCopySuccess] = useState(false);
  
  // PDF export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState(null);

  // Get path information
  useEffect(() => {
    try {
      const path = getJourneyPath(pathId);
      if (path) {
        setPathData(path);
      } else {
        setError(`Path ${pathId} not found`);
      }
    } catch (err) {
      setError(`Error loading path data: ${err.message}`);
    }
  }, [pathId]);

  // Load completion data and generate AI summary
  useEffect(() => {
    const loadCompletionData = async () => {
      if (!currentUser || !pathId) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log('🔄 Loading completion data for:', pathId);

        // Get all entries for this path
        const [regularEntries, voiceEntries] = await Promise.all([
          getPreviousEntries(currentUser.uid, pathId),
          getPreviousVoiceEntries(currentUser.uid, pathId)
        ]);

        console.log('📊 Entries loaded:', {
          regular: regularEntries.length,
          voice: voiceEntries.length
        });

        // Combine and sort entries
        const combinedEntries = [
          ...regularEntries,
          ...voiceEntries.map(entry => ({ ...entry, isVoiceEntry: true }))
        ].sort((a, b) => a.day - b.day);

        setAllEntries(combinedEntries);

        if (combinedEntries.length === 0) {
          setError('No journal entries found for this journey');
          return;
        }

        // Generate AI completion summary using your existing service
        console.log('🤖 Generating AI completion summary...');
        const completion = await generateJourneyCompletion(
          currentUser.uid,
          combinedEntries,
          pathId
        );

        console.log('✅ AI summary generated:', completion);
        setAiSummary(completion);

      } catch (error) {
        console.error('❌ Error loading completion data:', error);
        setError(error.message || 'Failed to load completion data');
        
        // Set fallback summary for better UX
        setAiSummary({
          journeyOverview: t('enhancedCompletion.fallbackOverview', "You've completed an incredible journey of self-discovery and growth!"),
          celebrationMessage: t('enhancedCompletion.fallbackCelebration', 'Your dedication to personal growth is truly inspiring.'),
          keyThemes: [
            t('enhancedCompletion.fallbackTheme1', 'Self-awareness'),
            t('enhancedCompletion.fallbackTheme2', 'Personal growth'),
            t('enhancedCompletion.fallbackTheme3', 'Resilience'),
            t('enhancedCompletion.fallbackTheme4', 'Authenticity')
          ],
          personalStrengths: [
            t('enhancedCompletion.fallbackStrength1', 'Commitment to growth'),
            t('enhancedCompletion.fallbackStrength2', 'Honest self-reflection'),
            t('enhancedCompletion.fallbackStrength3', 'Courage to explore')
          ],
          nextSteps: t('enhancedCompletion.fallbackNextSteps', 'Continue your journey with another path or revisit your insights regularly.')
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletionData();
  }, [currentUser, pathId]);

  // PDF Export functionality
  const handleExportPDF = async () => {
    if (!currentUser || !pathData || !aiSummary) {
      alert(t('enhancedCompletion.exportMissingData', 'Cannot export: Missing required data'));
      return;
    }

    try {
      setIsExporting(true);
      setExportProgress(0);
      setExportError(null);

      console.log('📄 Starting PDF export...');

      // Progress callback
      const onProgress = ({ stage, progress }) => {
        setExportProgress(progress);
        console.log(`PDF Export: ${stage} - ${progress}%`);
      };

      // Export options
      const exportOptions = {
        includeImages: false,
        includeFullText: true,
        includeAnalysis: true,
        quality: 'high',
        colorMode: 'color'
      };

      // Generate PDF using your existing service
      const pdfBlob = await exportJourneyToPDF(
        currentUser.uid,
        pathId,
        userProfile,
        exportOptions,
        onProgress,
        aiSummary
      );

      // Generate filename
      const pathName = pathData.title.replace(/[^a-zA-Z0-9]/g, '_');
      const userName = userProfile?.displayName?.replace(/[^a-zA-Z0-9]/g, '_') || 'User';
      const date = new Date().toISOString().split('T')[0];
      const filename = `Kairos_${pathName}_${userName}_${date}.pdf`;

      console.log('📥 Downloading PDF:', filename);

      // Download the PDF using your existing service
      await downloadFile(pdfBlob, filename, 'application/pdf');

      console.log('✅ PDF export completed successfully');

    } catch (error) {
      console.error('❌ PDF export failed:', error);
      setExportError(error.message || 'Failed to export PDF');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Share functionality
  const shareOptions = {
    twitter: {
      icon: Twitter,
      label: 'Twitter',
      url: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=journaling,selfgrowth,Kairos`
    },
    facebook: {
      icon: Facebook,
      label: 'Facebook',
      url: (text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`
    },
    linkedin: {
      icon: Linkedin,
      label: 'LinkedIn',
      url: (text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`
    }
  };

  const generateShareText = () => {
    const pathName = pathData?.title || t('enhancedCompletion.defaultPathName', 'Personal Growth Journey');
    const userName = userProfile?.displayName || t('enhancedCompletion.defaultUserName', 'I');
    const dayCount = allEntries.length;

    return t('enhancedCompletion.shareText', '🎉 {{userName}} just completed the {{pathName}}! {{dayCount}} days of self-reflection and growth. Ready to start your own journey of discovery? #JournalingJourney #PersonalGrowth #Kairos', { userName, pathName, dayCount });
  };

  const handleShare = (platform) => {
    const shareText = generateShareText();
    const option = shareOptions[platform];
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      return;
    }

    window.open(option.url(shareText), '_blank', 'width=600,height=400');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`journey-completion-container ${isDarkMode ? 'dark' : 'light'}`}>
        <KairosLoader
          size="medium"
          fullScreen={false}
          message={t('enhancedCompletion.analyzingJourney', 'Analyzing your transformation journey...')}
          subMessage={t('enhancedCompletion.creatingInsights', 'Creating your personalized insights')}
        />
      </div>
    );
  }

  // Error state
  if (error && !pathData) {
    return (
      <div className={`journey-completion-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="glass-card error-card">
          <AlertCircle size={48} className="error-icon" />
          <h3>{t('enhancedCompletion.unableToLoad', 'Unable to Load Journey')}</h3>
          <p>{error}</p>
          <button
            onClick={() => navigateToScreen('home')}
            className="action-button glass primary"
          >
            {t('enhancedCompletion.returnHome', 'Return Home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`journey-completion-container ${isDarkMode ? 'dark' : 'light'}`}
      style={{
        '--path-color-rgb': pathData?.color || '64, 224, 208'
      }}
    >
      <div className="completion-content">
        {/* Header Section */}
        <div className="glass-card completion-header">
          <div className="icon-glow">
            <DynamicIcon name={pathData?.iconName || 'Trophy'} className="completion-icon" />
          </div>
          
          <h1 className="completion-title">{t('enhancedCompletion.journeyComplete', 'Journey Complete!')}</h1>
          <h2 className="path-title">{pathData?.title || t('enhancedCompletion.journeyFallback', 'Journey')}</h2>
          <p className="completion-subtitle">
            {t('enhancedCompletion.daysOfTransformation', '{{count}} days of transformation', { count: allEntries.length })}
          </p>

          <div className="completion-stats">
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <span className="stat-value">{allEntries.length}</span>
              <span className="stat-label">{t('enhancedCompletion.days', 'Days')}</span>
            </div>
            <div className="stat-item">
              <Target className="stat-icon" />
              <span className="stat-value">100%</span>
              <span className="stat-label">{t('enhancedCompletion.complete', 'Complete')}</span>
            </div>
            <div className="stat-item">
              <Heart className="stat-icon" />
              <span className="stat-value">
                {allEntries.filter(e => e.isVoiceEntry).length > 0 ? t('enhancedCompletion.multi', 'Multi') : t('enhancedCompletion.written', 'Written')}
              </span>
              <span className="stat-label">{t('enhancedCompletion.mode', 'Mode')}</span>
            </div>
          </div>
        </div>

        {/* AI-Generated Summary */}
        {aiSummary && (
          <>
            {/* Journey Overview */}
            <div className="glass-card ai-overview-card">
              <h3 className="glass-card-header">
                <Sparkles className="header-icon" />
                {t('enhancedCompletion.yourJourneyStory', 'Your Journey Story')}
              </h3>
              <p className="overview-text">{aiSummary.journeyOverview}</p>
            </div>

            {/* Key Themes */}
            {aiSummary.keyThemes && aiSummary.keyThemes.length > 0 && (
              <div className="ai-insight-card glass">
                <h4 className="insight-header">
                  <Star className="insight-icon" />
                  {t('enhancedCompletion.keyThemes', 'Key Themes')}
                </h4>
                <div className="themes-container">
                  {aiSummary.keyThemes.map((theme, index) => (
                    <span key={index} className="theme-tag glass">
                      ✨ {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Strengths */}
            {aiSummary.personalStrengths && aiSummary.personalStrengths.length > 0 && (
              <div className="ai-insight-card glass">
                <h4 className="insight-header">
                  <Trophy className="insight-icon" />
                  {t('enhancedCompletion.yourStrengths', 'Your Strengths')}
                </h4>
                <div className="strengths-list">
                  {aiSummary.personalStrengths.map((strength, index) => (
                    <div key={index} className="strength-item">
                      <CheckCircle className="check-icon" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transformation Highlight */}
            {aiSummary.transformationHighlight && (
              <div className="ai-insight-card glass highlight-card">
                <h4 className="insight-header">
                  <TrendingUp className="insight-icon" />
                  {t('enhancedCompletion.biggestTransformation', 'Biggest Transformation')}
                </h4>
                <p className="transformation-text">{aiSummary.transformationHighlight}</p>
              </div>
            )}

            {/* Next Steps */}
            {aiSummary.nextSteps && (
              <div className="ai-insight-card glass wisdom-card">
                <h4 className="insight-header">
                  <Compass className="insight-icon" />
                  {t('enhancedCompletion.movingForward', 'Moving Forward')}
                </h4>
                <p className="wisdom-text">{aiSummary.nextSteps}</p>
              </div>
            )}

            {/* Celebration Message */}
            {aiSummary.celebrationMessage && (
              <div className="glass-card celebration-message">
                <Gift className="celebration-icon" />
                <p>{aiSummary.celebrationMessage}</p>
              </div>
            )}
          </>
        )}

        {/* Export & Share Section */}
        <div className="glass-card actions-section">
          <h3 className="glass-card-header">
            <Share2 className="header-icon" />
            Share Your Achievement
          </h3>
          
          <div className="share-buttons-container">
            {/* PDF Export Button */}
            <button
              className={`action-button glass export ${isExporting ? 'loading' : ''}`}
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="button-icon spinning" />
                  <div className="button-content">
                    <span className="button-title">Exporting...</span>
                    <span className="button-subtitle">{exportProgress}%</span>
                  </div>
                </>
              ) : (
                <>
                  <Download className="button-icon" />
                  <div className="button-content">
                    <span className="button-title">Export PDF</span>
                    <span className="button-subtitle">Save your journey</span>
                  </div>
                </>
              )}
            </button>

            {/* Social Share Buttons */}
            <div className="social-share-row">
              {Object.entries(shareOptions).map(([platform, option]) => (
                <button
                  key={platform}
                  className={`share-button glass ${platform}`}
                  onClick={() => handleShare(platform)}
                >
                  <option.icon size={20} />
                </button>
              ))}
              
              <button
                className={`share-button glass copy ${copySuccess ? 'success' : ''}`}
                onClick={() => handleShare('copy')}
              >
                {copySuccess ? <CheckCircle size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* Export Error */}
          {exportError && (
            <div className="export-error glass">
              <AlertCircle size={16} />
              <span>{exportError}</span>
            </div>
          )}
        </div>

        {/* What's Next Actions */}
        <div className="glass-card actions-section">
          <h3 className="glass-card-header">
            <Sparkles className="header-icon" />
            Ready for Your Next Journey?
          </h3>
          
          {/* AI-Powered Path Recommendations */}
          <div className="completion-recommendations">
            <PathRecommendations 
              onPathSelect={(path) => {
                console.log('Selected recommended path from completion screen:', path.id);
                const nextDay = getNextDayForPath(userProfile, path.id);
                navigateToScreen('write', { pathId: path.id, day: nextDay });
              }}
              maxRecommendations={3}
            />
          </div>

          <div className="additional-actions">
            <h4 className="actions-subheader">Or explore on your own:</h4>
          
            <button 
              className="action-button glass primary"
              onClick={() => navigateToScreen('path-selection')}
            >
              <Compass className="button-icon" />
            <div className="button-content">
              <span className="button-title">Start New Journey</span>
              <span className="button-subtitle">Explore another path</span>
            </div>
            <ArrowRight className="arrow-icon" />
          </button>

          <button 
            className="action-button glass"
            onClick={() => navigateToScreen('journal-archive')}
          >
            <Eye className="button-icon" />
            <div className="button-content">
              <span className="button-title">Review Your Journey</span>
              <span className="button-subtitle">Revisit your entries</span>
            </div>
            <ArrowRight className="arrow-icon" />
          </button>

          <button 
            className="action-button glass"
            onClick={onRestart}
          >
            <RotateCcw className="button-icon" />
            <div className="button-content">
              <span className="button-title">Restart This Journey</span>
              <span className="button-subtitle">Fresh perspective</span>
            </div>
            <ArrowRight className="arrow-icon" />
          </button>

          <button 
            className="action-button glass"
            onClick={() => navigateToScreen('analytics-dashboard')}
          >
            <TrendingUp className="button-icon" />
            <div className="button-content">
              <span className="button-title">View Analytics</span>
              <span className="button-subtitle">Discover patterns</span>
            </div>
            <ArrowRight className="arrow-icon" />
          </button>
          </div> {/* Close additional-actions */}
        </div>
      </div>
    </div>
  );
};

export default EnhancedJourneyCompletion;