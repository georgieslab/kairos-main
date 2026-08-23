import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, Send, Sparkles, Clock, CheckCircle, AlertCircle, Brain, Lightbulb, TrendingUp } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { callClaudeApi, safeJsonParse } from '../../utils/apiUtils';
// This component builds its own prompt rather than calling
// claudeService.answerDailyQuestion (which is exported but unused). Until that
// duplication is resolved, it must pull in the same two directives so the
// honesty rules and the AI output language apply here too.
import { HONESTY_DIRECTIVE, getLanguageDirective } from '../../services/claudeService';

const DailyAIQuestion = ({ entries, totalEntries, progressStats }) => {
  const { t } = useTranslation('analytics');
  const { currentUser, userProfile } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAskedToday, setHasAskedToday] = useState(false);
  const [todaysQuestion, setTodaysQuestion] = useState(null);
  const [todaysInsights, setTodaysInsights] = useState([]);
  const [todaysObservation, setTodaysObservation] = useState('');
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Enhanced question suggestions based on journaling themes and total entries
  const getQuestionSuggestions = () => {
    const baseQuestions = [
      t('dailyAIQuestion.suggestions.emotionPattern', 'What pattern in my emotions do you notice across my recent entries?'),
      t('dailyAIQuestion.suggestions.biggestStrength', 'Based on my writing, what do you think my biggest strength is right now?'),
      t('dailyAIQuestion.suggestions.growthOpportunity', 'What growth opportunity do you see for me based on my journal entries?'),
      t('dailyAIQuestion.suggestions.mindsetEvolution', 'How has my mindset or perspective evolved over my journaling journey?'),
      t('dailyAIQuestion.suggestions.recurringTheme', 'What recurring theme in my life deserves more attention?'),
      t('dailyAIQuestion.suggestions.adviceOnChallenges', "What advice would you give me based on the challenges I've written about?")
    ];

    const advancedQuestions = [
      t('dailyAIQuestion.suggestions.positiveChanges', 'What positive changes do you notice in my recent entries compared to earlier ones?'),
      t('dailyAIQuestion.suggestions.kindOfPerson', 'Based on my writing style and content, what kind of person do you think I am?'),
      t('dailyAIQuestion.suggestions.clearGoal', 'What goal or aspiration comes through most clearly in my journal entries?'),
      t('dailyAIQuestion.suggestions.trulyMatters', 'What do my entries suggest about what truly matters to me?'),
      t('dailyAIQuestion.suggestions.pathsComplement', 'How do my different journal paths complement each other in my growth?'),
      t('dailyAIQuestion.suggestions.blindSpots', 'What blind spots or areas for exploration do you see in my journaling?')
    ];

    // Return more sophisticated questions for users with more entries
    return totalEntries >= 10 ? [...baseQuestions, ...advancedQuestions] : baseQuestions;
  };

  // Check if user has already asked a question today
  useEffect(() => {
    checkTodaysQuestionStatus();
    updateTimeUntilReset();
  }, [currentUser]);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      updateTimeUntilReset();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    updateTimeUntilReset();
    const accurateTimer = setInterval(() => {
      updateTimeUntilReset();
    }, 30000);

    return () => clearInterval(accurateTimer);
  }, [hasAskedToday]);

  const checkTodaysQuestionStatus = async () => {
    if (!currentUser) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const questionRef = doc(db, 'users', currentUser.uid, 'daily_questions', today);
      const questionDoc = await getDoc(questionRef);

      if (questionDoc.exists()) {
        const data = questionDoc.data();
        setHasAskedToday(true);
        setTodaysQuestion(data.question);
        setAnswer(data.answer);
        setTodaysInsights(data.keyInsights || []);
        setTodaysObservation(data.personalObservation || '');
      } else {
        setHasAskedToday(false);
        setTodaysQuestion(null);
        setAnswer('');
        setTodaysInsights([]);
        setTodaysObservation('');
      }
    } catch (error) {
      console.error('Error checking daily question status:', error);
    }
  };

  const updateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeDiff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeUntilReset(`${hours}h ${minutes}m`);
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim() || isLoading || hasAskedToday) return;

    setIsLoading(true);

    try {
      // ✅ ENHANCED: Prepare more comprehensive journal entries context
      const entriesContext = entries.slice(0, 20).map(entry => ({
        day: entry.day,
        pathId: entry.pathId || 'self-discovery',
        theme: entry.theme || '',
        summary: entry.analysis?.summary || '',
        insights: entry.analysis?.insights || [],
        // Voice entries keep their words in `transcription` (see
        // saveAnalysisResult), so reading only extractedText dropped them.
        extractedText: (entry.extractedText || entry.transcription || '').substring(0, 300)
      }));

      // ✅ ENHANCED: More detailed system prompt with user context
      const systemPrompt = `
        You are an AI journaling assistant for the Καιρός app. The user has asked you a personal question based on their journaling journey.
        
        Context about the user:
        - Name: ${userProfile?.displayName || 'User'}
        - Total journal entries: ${totalEntries}
        - Journal entries being analyzed: ${entries.length}
        - Current journaling streak: ${progressStats?.currentStreak || 0} days
        - Time journaling: ${userProfile?.createdAt ? 'Since ' + new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'Recently started'}
        
        Here are their recent journal entries for analysis:
        ${JSON.stringify(entriesContext, null, 2)}
        
        The user's question is: "${question}"
        
        Provide a response that:
        1. Answers the specific question they asked, in the first sentence, using evidence from their entries
        2. Cites specific entries by day — anything you can't ground in their writing, don't say
        3. Gives the honest answer even when it isn't the one they're hoping for. If their
           entries contradict the premise of the question, say so directly
        4. Says plainly when their entries simply don't contain enough to answer, rather than
           improvising something that merely sounds insightful
        5. Does NOT praise their streak, their entry count, or their commitment to journaling.
           They can see those numbers. Praise that arrives regardless of the question is noise
        6. Addresses them directly as "you", in plain language — no inspirational register
        7. Ends with something they can actually act on

        Keep your response between 150-300 words. If it would read the same under any other
        user's question, rewrite it.

        Format your response as a JSON object with:
        {
          "answer": "Direct answer first, then the evidence from specific entries. No preamble, no compliment before the substance.",
          "keyInsights": ["insight grounded in a specific entry", "a pattern — including an unwelcome one if that's what's there", "the thing relevant to their question they haven't said out loud"],
          "personalObservation": "An observation about their journaling patterns they'd be unlikely to make themselves. Accurate over flattering — this field is worthless if it's a compliment."
        }
      ${HONESTY_DIRECTIVE}${getLanguageDirective()}`;

      const requestBody = {
        model: 'claude-sonnet-4-6', // was the deprecated claude-sonnet-4-20250514 (silently remapped by apiUtils)
        messages: [
          {
            role: 'user',
            content: `Please answer my question based on my ${totalEntries} journal entries: ${question}`
          }
        ],
        system: systemPrompt,
        max_tokens: 1000
      };

      const data = await callClaudeApi({
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      const content = data.content[0].text;
      const result = safeJsonParse(content, {
        // Fallback for a failed JSON parse — it has no access to their entries,
        // so it says so rather than answering with generic encouragement.
        answer: `Your question was saved, but the answer didn't generate this time — that's a failure on our side, not a reflection of what you asked. Nothing in your journal was affected. Try asking again in a moment; if it fails twice, report it from Settings.`,
        keyInsights: [
          "No analysis available — the response failed to generate",
          "Your entries and your question are stored and unchanged",
          "Worth reporting as a bug if it happens repeatedly"
        ],
        personalObservation: `Not available for this question.`
      });

      // ✅ ENHANCED: Save with more comprehensive metadata
      const today = new Date().toISOString().split('T')[0];
      const questionRef = doc(db, 'users', currentUser.uid, 'daily_questions', today);
      
      await setDoc(questionRef, {
        question: question.trim(),
        answer: result.answer,
        keyInsights: result.keyInsights,
        personalObservation: result.personalObservation,
        timestamp: serverTimestamp(),
        entriesAnalyzed: entries.length, // Entries sent to AI for analysis
        totalEntriesAtTime: totalEntries, // Total entries when question was asked
        userStreak: progressStats?.currentStreak || 0,
        userJoinDate: userProfile?.createdAt || null
      });

      setAnswer(result.answer);
      setTodaysQuestion(question.trim());
      setTodaysInsights(result.keyInsights);
      setTodaysObservation(result.personalObservation);
      setHasAskedToday(true);
      setQuestion('');
      setShowSuggestions(false);

      // ✅ ENHANCED: More detailed analytics
      if (typeof window !== 'undefined' && window.analyticsService) {
        window.analyticsService.logEvent('daily_ai_question_asked', {
          questionLength: question.length,
          entriesAnalyzed: entries.length, // What was sent to AI
          totalEntries: totalEntries, // User's total entry count
          userStreak: progressStats?.currentStreak || 0,
          questionCategory: categorizeQuestion(question),
          feature: 'daily_ai_insights'
        });
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      alert('Sorry, there was an error processing your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Helper function to categorize questions for analytics
  const categorizeQuestion = (questionText) => {
    const lowerQuestion = questionText.toLowerCase();
    if (lowerQuestion.includes('emotion') || lowerQuestion.includes('feeling')) return 'emotional';
    if (lowerQuestion.includes('strength') || lowerQuestion.includes('good at')) return 'strengths';
    if (lowerQuestion.includes('growth') || lowerQuestion.includes('improve')) return 'growth';
    if (lowerQuestion.includes('pattern') || lowerQuestion.includes('notice')) return 'patterns';
    if (lowerQuestion.includes('advice') || lowerQuestion.includes('recommend')) return 'advice';
    return 'general';
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion);
    setShowSuggestions(false);
  };

  // Don't show if user has less than 2 entries
  if (totalEntries < 2) {
    return null;
  }

  const questionSuggestions = getQuestionSuggestions();

  return (
    <div className="daily-ai-question-container">
      <div className="daily-ai-question-card">
        {/* Header */}
        <div className="daily-ai-question-header">
          <div className="question-icon-container">
            <Sparkles className="question-main-icon" />
            <Brain className="question-accent-icon" />
          </div>
          <div className="question-header-content">
            <h3 className="question-title">{t('dailyAIQuestion.title', 'Daily AI Insight')}</h3>
            <p className="question-subtitle">
              {t('dailyAIQuestion.subtitle', 'Ask me one personalized question about your journaling journey')}
            </p>
          </div>
          <div className="question-status">
            {hasAskedToday ? (
              <div className="status-used">
                <CheckCircle size={16} />
                <span>{t('dailyAIQuestion.usedToday', 'Used Today')}</span>
              </div>
            ) : (
              <div className="status-available">
                <Clock size={16} />
                <span>{t('dailyAIQuestion.available', 'Available')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Input or Previous Question */}
        {hasAskedToday ? (
          <div className="previous-question-section">
            <div className="previous-question">
              <h4 className="previous-question-title">{t('dailyAIQuestion.todaysQuestion', "Today's Question:")}</h4>
              <p className="previous-question-text">"{todaysQuestion}"</p>
            </div>

            <div className="ai-answer">
              <div className="answer-header">
                <Lightbulb className="answer-icon" />
                <span>{t('dailyAIQuestion.aiResponse', 'AI Response')}</span>
              </div>
              <div className="answer-content">
                {answer}
              </div>
            </div>

            {/* ✅ ENHANCED: Show key insights if available */}
            {todaysInsights.length > 0 && (
              <div className="insights-section">
                <div className="insights-header">
                  <TrendingUp className="insights-icon" />
                  <span>{t('dailyAIQuestion.keyInsights', 'Key Insights')}</span>
                </div>
                <div className="insights-list">
                  {todaysInsights.map((insight, index) => (
                    <div key={index} className="insight-item">
                      <CheckCircle size={14} className="insight-bullet" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ ENHANCED: Show personal observation if available */}
            {todaysObservation && (
              <div className="personal-observation">
                <div className="observation-header">
                  <Brain className="observation-icon" />
                  <span>{t('dailyAIQuestion.personalObservation', 'Personal Observation')}</span>
                </div>
                <p className="observation-text">{todaysObservation}</p>
              </div>
            )}

            <div className="reset-timer">
              <Clock size={14} />
              <span>{t('dailyAIQuestion.nextQuestionIn', 'Next question available in {{time}}', { time: timeUntilReset })}</span>
            </div>
          </div>
        ) : (
          <div className="question-input-section">
            <div className="question-input-container">
              <div className="input-wrapper">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t('dailyAIQuestion.inputPlaceholder', 'What would you like to know about your {{count}}-entry journaling journey? Be specific for the best insights...', { count: totalEntries })}
                  className="question-input"
                  maxLength={300}
                  rows={3}
                  disabled={isLoading}
                />
                <div className="input-footer">
                  <span className="character-count">
                    {question.length}/300
                  </span>
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="suggestions-button"
                    type="button"
                  >
                    <Lightbulb size={16} />
                    {totalEntries >= 10 ? t('dailyAIQuestion.advancedIdeas', 'Advanced Ideas') : t('dailyAIQuestion.suggestionsLabel', 'Suggestions')}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() || isLoading}
                className="submit-question-button"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner" />
                    <span>{t('dailyAIQuestion.analyzingEntries', 'Analyzing {{count}} entries...', { count: totalEntries })}</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{t('dailyAIQuestion.askAI', 'Ask Kairos')}</span>
                  </>
                )}
              </button>
            </div>

            {/* ✅ ENHANCED: Question Suggestions with better categorization */}
            {showSuggestions && (
              <div className="question-suggestions">
                <h4 className="suggestions-title">
                  {totalEntries >= 10 ? t('dailyAIQuestion.advancedQuestionIdeas', 'Advanced Question Ideas:') : t('dailyAIQuestion.questionIdeas', 'Question Ideas:')}
                </h4>
                <div className="suggestions-grid">
                  {questionSuggestions.slice(0, totalEntries >= 10 ? 8 : 6).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-item"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                {totalEntries >= 10 && (
                  <p className="suggestions-note">
                    {t('dailyAIQuestion.sophisticatedQuestionsNote', 'With {{count}} entries, you can ask more sophisticated questions about patterns and growth!', { count: totalEntries })}
                  </p>
                )}
              </div>
            )}

            {/* ✅ ENHANCED: Context Info with more details */}
            <div className="context-info">
              <MessageCircle size={14} />
              <span>
                {t('dailyAIQuestion.contextInfo', 'AI will analyze your {{count}} journal entries', { count: totalEntries })}
                {progressStats?.currentStreak > 0 && ` (${t('dailyAIQuestion.dayStreak', '{{count}}-day streak!', { count: progressStats.currentStreak })})`}
                {' '}{t('dailyAIQuestion.toProvideInsights', 'to provide personalized insights')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyAIQuestion;