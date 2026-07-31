import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  Heart, 
  Brain, 
  Target, 
  Compass,
  Star,
  Palette,
  Shield,
  Mountain,
  Clock,
  CheckCircle,
  Loader,
  AlertCircle,
  Zap
} from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { callClaudeApi, safeJsonParse } from '../../utils/apiUtils';
// This component builds its own prompt rather than calling
// claudeService.generatePersonalityDescription (which is exported but unused).
// Until that duplication is resolved, it must pull in the same two directives so
// the honesty rules and the AI output language apply here too.
import { HONESTY_DIRECTIVE, getLanguageDirective } from '../../services/claudeService';

const AIPersonDescription = ({ entries, totalEntries, progressStats }) => {
  const { t, i18n } = useTranslation('analytics');
  const { currentUser, userProfile } = useAuth();
  const autoRegenLangRef = useRef(null);
  const [personDescription, setPersonDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExistingDescription();
  }, [currentUser]);

  const loadExistingDescription = async () => {
    if (!currentUser) return;

    try {
      const descriptionRef = doc(db, 'users', currentUser.uid, 'ai_insights', 'person_description');
      const descriptionDoc = await getDoc(descriptionRef);

      if (descriptionDoc.exists()) {
        const data = descriptionDoc.data();
        setPersonDescription(data);
        setLastGenerated(data.generatedAt?.toDate() || new Date(data.timestamp));
      }
    } catch (error) {
      console.error('Error loading person description:', error);
    }
  };

  // ✅ NEW: Check if regeneration is recommended
  const shouldSuggestRegeneration = () => {
    if (!personDescription || !totalEntries) return false;
    
    const cachedEntryCount = personDescription.basedOnEntries || 0;
    const currentEntryCount = totalEntries;
    
    // Suggest regeneration if there are 3+ new entries or 25%+ more entries
    const newEntries = currentEntryCount - cachedEntryCount;
    const percentageIncrease = cachedEntryCount > 0 ? (newEntries / cachedEntryCount) * 100 : 0;
    
    return newEntries >= 3 || percentageIncrease >= 25;
  };

  // ✅ NEW: Check if regeneration is needed based on time
  const shouldSuggestTimeBasedRegeneration = () => {
    if (!lastGenerated) return false;
    
    const daysSinceGenerated = (new Date() - lastGenerated) / (1000 * 60 * 60 * 24);
    return daysSinceGenerated >= 7; // Weekly regeneration
  };

  const generatePersonDescription = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Prepare comprehensive journal data for analysis
      const journalData = {
        totalEntries: totalEntries,
        entriesAnalyzed: entries.length,
        currentStreak: progressStats?.currentStreak || 0,
        activePaths: progressStats?.activePaths || [],
        user: {
          name: userProfile?.displayName || 'User',
          age: userProfile?.age,
          joinedDate: userProfile?.createdAt
        },
        entries: entries.slice(0, 25).map(entry => ({
          day: entry.day,
          pathId: entry.pathId || 'self-discovery',
          theme: entry.theme || '',
          summary: entry.analysis?.summary || '',
          insights: entry.analysis?.insights || [],
          extractedText: entry.extractedText ? entry.extractedText.substring(0, 400) : '',
          affirmation: entry.analysis?.affirmation || '',
          practicalAction: entry.analysis?.practicalAction || ''
        }))
      };

      const systemPrompt = `
        You are an AI personality analyst for the Καιρός journaling app. Your task is to create a comprehensive, insightful personality description based on the user's journaling journey.
        
        User Information:
        - Name: ${userProfile?.displayName || 'User'}
        - Total journal entries: ${totalEntries}
        - Current journaling streak: ${progressStats?.currentStreak || 0} days
        - Journaling since: ${userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'Recently'}
        
        Journal Data:
        ${JSON.stringify(journalData, null, 2)}
        
        Create a comprehensive personality analysis that includes:
        
        1. **Core Personality**: 2-3 sentence overview of their fundamental character
        2. **Strengths**: 4-5 key personal strengths evidenced in their writing
        3. **Values & Motivations**: What truly matters to them based on recurring themes
        4. **Communication Style**: How they express themselves and process thoughts
        5. **Growth Mindset**: Their approach to challenges and personal development  
        6. **Emotional Intelligence**: How they handle and express emotions
        7. **Life Philosophy**: Their worldview and guiding principles that emerge from their writing
        8. **Unique Qualities**: What makes them distinctive as a person
        
        Important guidelines:
        - Write in third person, level and observant — a portrait, not a tribute
        - Base every sentence on evidence from their actual entries, and cite it
        - A portrait made only of strengths is a portrait of nobody. Include the
          tensions, the recurring blind spot, the thing they do that costs them
        - Do not euphemize. If their entries show avoidance, call it avoidance;
          do not relabel it as "seeking clarity"
        - Describe patterns in what they wrote, not fixed verdicts about who they are
        - No astrological register, no LinkedIn-summary register, no flattery
        - The test: would they recognize themselves, including the parts they'd
          wince at? If not, rewrite it
        - This is drawn from journal entries, not a clinical assessment. Do not diagnose

        Format as JSON with these exact keys:
        {
          "corePersonality": "Their essential nature as the entries actually show it, including the contradiction that runs through them",
          "strengths": ["a strength with the specific evidence for it", "another", "a third", "a fourth", "a fifth — drop items rather than inventing them"],
          "valuesAndMotivations": "What actually drives them, judged by what they return to and protect — which may differ from what they say they value. If it does, say so",
          "communicationStyle": "How they express themselves, including their characteristic evasions: where they go abstract, intellectualize, joke, or trail off",
          "growthMindset": "How they actually meet challenges, based on what they describe doing rather than what they resolve to do",
          "emotionalIntelligence": "Which emotions they name easily, which they route around, which they only reach through other subjects",
          "lifePhilosophy": "Beliefs and worldview visible in their entries, stated plainly",
          "uniqueQualities": "What genuinely distinguishes them. If a trait would apply to most people, it does not belong here",
          "overallSummary": "2-3 sentences. Accurate before flattering — they should finish it thinking 'that's right', not 'that's nice'"
        }
      ${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

      const requestBody = {
        model: 'claude-sonnet-4-6', // was the deprecated claude-sonnet-4-20250514 (silently remapped by apiUtils)
        messages: [
          {
            role: 'user',
            content: 'Please create a comprehensive personality description based on my journal entries.'
          }
        ],
        system: systemPrompt,
        max_tokens: 2000
      };

      const data = await callClaudeApi({
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const content = data.content[0].text;
      const result = safeJsonParse(content, {
        // Fallback for a failed JSON parse. The old version here described a
        // generic "thoughtful individual committed to growth" — text that fits
        // any human alive, which is precisely the failure mode we're removing.
        // If we can't describe this person, we say we can't.
        corePersonality: "Your description couldn't be generated this time. This is a technical failure on our side — nothing in your entries was affected.",
        strengths: [],
        valuesAndMotivations: "Not available — generation failed.",
        communicationStyle: "Not available — generation failed.",
        growthMindset: "Not available — generation failed.",
        emotionalIntelligence: "Not available — generation failed.",
        lifePhilosophy: "Not available — generation failed.",
        uniqueQualities: "Not available — generation failed.",
        overallSummary: "No description available for this run. Try regenerating in a moment; if it keeps failing, report it from Settings."
      });

      // ✅ FIXED: Save with current entry count and timestamp
      const descriptionData = {
        ...result,
        generatedAt: serverTimestamp(),
        basedOnEntries: totalEntries, // ✅ Use current total entries
        totalEntriesAtTime: totalEntries,
        currentStreakAtTime: progressStats?.currentStreak || 0,
        pathsAnalyzed: [...new Set(entries.map(e => e.pathId).filter(Boolean))],
        language: i18n.language, // language this description was generated in
        timestamp: Date.now()
      };

      const descriptionRef = doc(db, 'users', currentUser.uid, 'ai_insights', 'person_description');
      await setDoc(descriptionRef, descriptionData);

      setPersonDescription(descriptionData);
      setLastGenerated(new Date());

      // Log analytics
      if (typeof window !== 'undefined' && window.analyticsService) {
        window.analyticsService.logEvent('ai_person_description_generated', {
          entriesAnalyzed: entries.length,
          totalEntries: totalEntries,
          streak: progressStats?.currentStreak || 0,
          isRegeneration: !!personDescription // Track if this was a refresh
        });
      }

    } catch (error) {
      console.error('Error generating person description:', error);
      setError(t('aiPersonDescription.generateError', 'Failed to generate personality description. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate the personality description in the current app language when the
  // stored one was generated in a different language (e.g. user switched to
  // German). Older descriptions have no `language` field — treat them as English.
  useEffect(() => {
    if (!personDescription || isLoading) return;
    const generatedLang = personDescription.language || 'en';
    if (generatedLang === i18n.language) return;
    if (autoRegenLangRef.current === i18n.language) return; // already handled this switch
    autoRegenLangRef.current = i18n.language;
    generatePersonDescription();
  }, [personDescription, i18n.language, isLoading]);

  // Don't show if user has less than 5 entries
  if (totalEntries < 5) {
    return null;
  }

  // ✅ NEW: Smart regeneration logic
  const suggestRegeneration = shouldSuggestRegeneration();
  const suggestTimeRegeneration = shouldSuggestTimeBasedRegeneration();
  const canRegenerate = suggestRegeneration || suggestTimeRegeneration || !personDescription;

  // ✅ NEW: Calculate entry difference for display
  const entryDifference = personDescription ? totalEntries - (personDescription.basedOnEntries || 0) : 0;

  return (
    <div className="ai-person-description-container">
      <div className="ai-person-description-card">
        {/* Header */}
        <div className="person-description-header">
          <div className="person-icon-container">
            <User className="person-main-icon" />
            <Sparkles className="person-sparkle-icon" />
          </div>
          <div className="person-header-content">
            <h3 className="person-title">{t('aiPersonDescription.title', 'AI Personality Insight')}</h3>
            <p className="person-subtitle">
              {t('aiPersonDescription.subtitle', 'Comprehensive personality analysis based on your journaling journey')}
            </p>
          </div>
          <div className="person-actions">
            {/* ✅ NEW: Always show refresh button with smart states */}
            <button
              onClick={generatePersonDescription}
              disabled={isLoading}
              className={`regenerate-button ${suggestRegeneration ? 'suggest-update' : ''}`}
              title={
                suggestRegeneration
                  ? t('aiPersonDescription.newEntriesAvailable', '{{count}} new entries available - click to update analysis', { count: entryDifference })
                  : suggestTimeRegeneration
                  ? t('aiPersonDescription.weeklyRefreshAvailable', 'Weekly refresh available')
                  : t('aiPersonDescription.regenerateTitle', 'Regenerate personality analysis')
              }
            >
              {suggestRegeneration && <Zap size={14} />}
              <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
              {suggestRegeneration && <span className="update-badge">{entryDifference}</span>}
            </button>
          </div>
        </div>

        {/* ✅ NEW: Update notification */}
        {suggestRegeneration && personDescription && (
          <div className="update-notification">
            <div className="update-notification-content">
              <Zap size={16} className="update-icon" />
              <span className="update-text">
                <strong>{t('aiPersonDescription.newEntriesCount', '{{count}} new entries', { count: entryDifference })}</strong> {t('aiPersonDescription.availableSinceLastAnalysis', 'available since your last personality analysis. Click refresh for updated insights!')}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {!personDescription && !isLoading && !error && (
          <div className="generate-prompt">
            <div className="prompt-content">
              <div className="prompt-icon">
                <Brain size={32} />
              </div>
              <h4 className="prompt-title">{t('aiPersonDescription.discoverTitle', 'Discover Your Personality Profile')}</h4>
              <p className="prompt-description">
                {t('aiPersonDescription.discoverDescription', 'Get a comprehensive AI analysis of your personality based on {{count}} journal entries. This insight reveals your strengths, values, communication style, and unique qualities.', { count: totalEntries })}
              </p>
              <button
                onClick={generatePersonDescription}
                disabled={isLoading}
                className="generate-button"
              >
                <Sparkles size={18} />
                {t('aiPersonDescription.generateButton', 'Generate My Profile')}
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-state">
            <div className="loading-content">
              <Loader className="loading-spinner-large" />
              <h4 className="loading-title">{t('aiPersonDescription.analyzingTitle', 'Analyzing Your Personality')}</h4>
              <p className="loading-description">
                {t('aiPersonDescription.analyzingDescription', 'Reading through your {{count}} journal entries to understand who you are...', { count: totalEntries })}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={generatePersonDescription} className="retry-button">
              {t('aiPersonDescription.tryAgain', 'Try Again')}
            </button>
          </div>
        )}

        {personDescription && !isLoading && (
          <div className="person-description-content">
            {/* Overall Summary */}
            <div className="summary-section">
              <div className="section-icon">
                <Star size={20} />
              </div>
              <div className="summary-content">
                <h4 className="section-title">{t('aiPersonDescription.whoYouAre', 'Who You Are')}</h4>
                <p className="summary-text">{personDescription.overallSummary}</p>
              </div>
            </div>

            {/* Core Personality */}
            <div className="personality-section">
              <div className="section-icon">
                <Heart size={20} />
              </div>
              <div className="section-content">
                <h4 className="section-title">{t('aiPersonDescription.corePersonality', 'Core Personality')}</h4>
                <p className="section-text">{personDescription.corePersonality}</p>
              </div>
            </div>

            {/* Strengths Grid */}
            <div className="strengths-section">
              <div className="section-icon">
                <Shield size={20} />
              </div>
              <div className="section-content">
                <h4 className="section-title">{t('aiPersonDescription.keyStrengths', 'Your Key Strengths')}</h4>
                <div className="strengths-grid">
                  {personDescription.strengths?.map((strength, index) => (
                    <div key={index} className="strength-item">
                      <CheckCircle size={16} className="strength-icon" />
                      <span className="strength-text">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expandable Additional Sections */}
            <div className="expandable-sections">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="expand-toggle"
              >
                <Eye size={18} />
                {isExpanded ? t('aiPersonDescription.showLess', 'Show Less') : t('aiPersonDescription.showFullAnalysis', 'Show Full Analysis')}
              </button>

              {isExpanded && (
                <div className="expanded-content">
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <div className="analysis-header">
                        <Target size={18} />
                        <h5>{t('aiPersonDescription.valuesAndMotivations', 'Values & Motivations')}</h5>
                      </div>
                      <p>{personDescription.valuesAndMotivations}</p>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-header">
                        <Palette size={18} />
                        <h5>{t('aiPersonDescription.communicationStyle', 'Communication Style')}</h5>
                      </div>
                      <p>{personDescription.communicationStyle}</p>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-header">
                        <Mountain size={18} />
                        <h5>{t('aiPersonDescription.growthMindset', 'Growth Mindset')}</h5>
                      </div>
                      <p>{personDescription.growthMindset}</p>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-header">
                        <Heart size={18} />
                        <h5>{t('aiPersonDescription.emotionalIntelligence', 'Emotional Intelligence')}</h5>
                      </div>
                      <p>{personDescription.emotionalIntelligence}</p>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-header">
                        <Compass size={18} />
                        <h5>{t('aiPersonDescription.lifePhilosophy', 'Life Philosophy')}</h5>
                      </div>
                      <p>{personDescription.lifePhilosophy}</p>
                    </div>

                    <div className="analysis-item">
                      <div className="analysis-header">
                        <Star size={18} />
                        <h5>{t('aiPersonDescription.uniqueQualities', 'Unique Qualities')}</h5>
                      </div>
                      <p>{personDescription.uniqueQualities}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ UPDATED: Metadata section with smart entry count display */}
            <div className="metadata-section">
              <div className="metadata-item">
                <Clock size={14} />
                <span>
                  {/* ✅ NEW: Show current vs cached entry count intelligently */}
                  {suggestRegeneration ? (
                    <>
                      {t('aiPersonDescription.basedOnEntries', 'Based on {{count}} entries', { count: personDescription.basedOnEntries || 0 })}
                      <span className="entries-update-available">
                        {t('aiPersonDescription.totalAndNew', '({{total}} total • {{new}} new)', { total: totalEntries, new: entryDifference })}
                      </span>
                    </>
                  ) : (
                    <>{t('aiPersonDescription.basedOnEntries', 'Based on {{count}} entries', { count: totalEntries })}</>
                  )}
                  {lastGenerated && ` • ${t('aiPersonDescription.generatedOn', 'Generated {{date}}', { date: lastGenerated.toLocaleDateString() })}`}
                </span>
              </div>
              
              {/* ✅ NEW: Smart regeneration hints */}
              {suggestRegeneration && (
                <div className="metadata-item regenerate-hint active">
                  <Zap size={14} />
                  <span>
                    <strong>{t('aiPersonDescription.updateRecommended', 'Update recommended:')}</strong> {t('aiPersonDescription.newEntriesSinceLastAnalysis', '{{count}} new entries since last analysis', { count: entryDifference })}
                  </span>
                </div>
              )}
              
              {suggestTimeRegeneration && !suggestRegeneration && (
                <div className="metadata-item regenerate-hint">
                  <RefreshCw size={14} />
                  <span>{t('aiPersonDescription.weeklyRefreshHint', 'Weekly refresh available for updated insights')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPersonDescription;