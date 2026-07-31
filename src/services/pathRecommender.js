// src/services/pathRecommender.js - AI-Powered Path Recommendation Engine
import { JOURNEY_PATHS } from '../data/JourneyData';
import { callClaudeApi, safeJsonParse } from '../utils/apiUtils';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Claude API configuration for recommendations
// Was the deprecated 'claude-sonnet-4-20250514', which apiUtils was silently
// remapping to this anyway — naming it directly, no behaviour change.
const CLAUDE_RECOMMENDATION_MODEL = 'claude-sonnet-4-6';

/**
 * Get AI-powered personalized path recommendations
 * @param {Object} userProfile - User profile with interests, goals, completed paths
 * @param {Array} journalEntries - Recent journal entries for pattern analysis
 * @param {Object} options - Recommendation options
 * @returns {Promise<Array>} Array of 3 recommended paths with explanations
 */
export const getAiRecommendations = async (userProfile, journalEntries = [], options = {}) => {
  try {
    const {
      count = 3,
      includeCompleted = false,
      forceRefresh = false
    } = options;

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedRecommendations = await getCachedRecommendations(userProfile.uid);
      if (cachedRecommendations && cachedRecommendations.length > 0) {
        console.log('✨ Using cached path recommendations');
        return cachedRecommendations.slice(0, count);
      }
    }

    // Prepare user context for AI analysis
    const userContext = buildUserContext(userProfile, journalEntries);
    
    // Get available paths (excluding completed if requested)
    const availablePaths = getAvailablePaths(userProfile, includeCompleted);
    
    // Build AI recommendation prompt
    const prompt = buildRecommendationPrompt(userContext, availablePaths, count);
    
    console.log('🤖 Requesting AI-powered path recommendations...');
    
    // Call Claude API with proper format
    const requestBody = {
      model: CLAUDE_RECOMMENDATION_MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };
    
    const response = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    
    // Parse recommendations from Claude's response
    const content = response.content?.[0]?.text || response.content;
    const recommendations = parseRecommendations(content, availablePaths);
    
    // Cache recommendations for 7 days
    await cacheRecommendations(userProfile.uid, recommendations);
    
    console.log(`✅ Generated ${recommendations.length} personalized recommendations`);
    return recommendations.slice(0, count);
    
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    console.error('Error details:', error.message, error.stack);
    
    // Fallback to algorithm-based recommendations
    console.log('📊 Falling back to algorithm-based recommendations');
    return getAlgorithmicRecommendations(userProfile, journalEntries, options);
  }
};

/**
 * Build comprehensive user context for AI analysis
 */
const buildUserContext = (userProfile, journalEntries) => {
  // Extract interests and goals
  const interests = userProfile.interests || [];
  const goals = userProfile.journalingGoals || [];
  
  // Get completed paths
  const completedPaths = Object.keys(userProfile.pathProgress || {})
    .filter(pathId => {
      const progress = userProfile.pathProgress[pathId];
      const path = JOURNEY_PATHS[pathId];
      return path && progress && progress.completedDays >= path.days.length;
    });
  
  // Calculate journaling statistics
  const stats = {
    totalEntries: journalEntries.length,
    currentStreak: userProfile.currentStreak || 0,
    totalPaths: completedPaths.length,
    avgEntryLength: calculateAvgEntryLength(journalEntries),
    mostActiveTime: getMostActiveTime(journalEntries),
    emotionTrends: extractEmotionTrends(journalEntries),
    recentThemes: extractRecentThemes(journalEntries)
  };
  
  return {
    interests,
    goals,
    completedPaths,
    stats,
    age: userProfile.age,
    experienceLevel: determineExperienceLevel(userProfile)
  };
};

/**
 * Get available paths for recommendation
 */
const getAvailablePaths = (userProfile, includeCompleted) => {
  const allPaths = Object.values(JOURNEY_PATHS);
  
  if (includeCompleted) {
    return allPaths;
  }
  
  // Filter out completed paths
  const completedPathIds = Object.keys(userProfile.pathProgress || {})
    .filter(pathId => {
      const progress = userProfile.pathProgress[pathId];
      const path = JOURNEY_PATHS[pathId];
      return path && progress && progress.completedDays >= path.days.length;
    });
  
  return allPaths.filter(path => !completedPathIds.includes(path.id));
};

/**
 * Build AI recommendation prompt
 */
const buildRecommendationPrompt = (userContext, availablePaths, count) => {
  const pathSummaries = availablePaths.map(path => ({
    id: path.id,
    title: path.title,
    subtitle: path.subtitle,
    days: path.days.length,
    difficulty: path.difficulty || 'intermediate',
    tags: path.tags || [],
    description: path.description
  }));

  return `You are a wise journaling coach helping users find their perfect next journaling path in Καιρός, a multi-modal journaling app.

USER PROFILE:
- Interests: ${userContext.interests.join(', ') || 'Not specified'}
- Goals: ${userContext.goals.join(', ') || 'Not specified'}
- Completed Paths: ${userContext.completedPaths.join(', ') || 'None yet (new user!)'}
- Total Journal Entries: ${userContext.stats.totalEntries}
- Current Streak: ${userContext.stats.currentStreak} days
- Experience Level: ${userContext.experienceLevel}
- Average Entry Length: ${userContext.stats.avgEntryLength} words
- Most Active Journaling Time: ${userContext.stats.mostActiveTime}
- Recent Emotional Themes: ${userContext.stats.emotionTrends.join(', ') || 'Not enough data'}
- Recent Topics: ${userContext.stats.recentThemes.join(', ') || 'Getting started'}

AVAILABLE PATHS:
${JSON.stringify(pathSummaries, null, 2)}

TASK:
Recommend ${count} personalized journaling paths for this user. Consider:

1. **Growth Path**: What builds naturally on their completed journeys and current interests?
2. **Exploration Path**: What opens a new dimension they haven't explored yet?
3. **Challenge Path**: What stretches them appropriately for their experience level?

For EACH recommendation, provide:
- **pathId**: The exact path ID from the available paths
- **matchScore**: 0-100 score indicating how well this path matches the user
- **reason**: 2-3 sentences explaining WHY this path is perfect for them right now
- **benefit**: What specific transformation or insight they'll gain
- **timing**: Why NOW is the right time for this journey
- **category**: One of: "growth" (builds on progress), "exploration" (new territory), "challenge" (stretch goal)

IMPORTANT GUIDELINES:
- For new users (0 completed paths), recommend beginner-friendly 10-day paths
- For experienced users (3+ completed), suggest longer or more advanced paths
- Match path themes to their stated interests and goals
- Consider their emotional trends and recent topics
- If they've completed similar paths, suggest complementary themes
- Balance familiarity with novelty
- Ensure difficulty matches their experience level
- Be authentic and encouraging in your explanations

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "pathId": "path-id-here",
      "matchScore": 85,
      "reason": "Based on your completion of X and interest in Y...",
      "benefit": "You'll develop...",
      "timing": "Right now is perfect because...",
      "category": "growth"
    }
  ]
}`;
};

/**
 * Parse recommendations from Claude's response
 */
const parseRecommendations = (content, availablePaths) => {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = safeJsonParse(jsonMatch[0]);
    
    if (!parsed || !parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      throw new Error('Invalid recommendation format');
    }
    
    // Enrich recommendations with full path data
    return parsed.recommendations.map(rec => {
      const path = JOURNEY_PATHS[rec.pathId];
      if (!path) {
        console.warn(`Path not found: ${rec.pathId}`);
        return null;
      }
      
      return {
        ...rec,
        path: {
          id: path.id,
          title: path.title,
          subtitle: path.subtitle,
          description: path.description,
          days: path.days.length,
          difficulty: path.difficulty,
          tags: path.tags,
          iconName: path.iconName,
          color: path.color
        }
      };
    }).filter(Boolean);
    
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    throw error;
  }
};

/**
 * Cache recommendations in Firestore
 */
const cacheRecommendations = async (userId, recommendations) => {
  try {
    const cacheRef = doc(db, 'users', userId, 'cache', 'pathRecommendations');
    await setDoc(cacheRef, {
      recommendations,
      generatedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    });
  } catch (error) {
    console.error('Error caching recommendations:', error);
  }
};

/**
 * Get cached recommendations
 */
const getCachedRecommendations = async (userId) => {
  try {
    const cacheRef = doc(db, 'users', userId, 'cache', 'pathRecommendations');
    const cacheDoc = await getDoc(cacheRef);
    
    if (!cacheDoc.exists()) {
      return null;
    }
    
    const data = cacheDoc.data();
    const expiresAt = new Date(data.expiresAt);
    
    // Check if cache is expired
    if (expiresAt < new Date()) {
      console.log('Cache expired, will generate fresh recommendations');
      return null;
    }
    
    return data.recommendations || null;
  } catch (error) {
    console.error('Error getting cached recommendations:', error);
    return null;
  }
};

/**
 * Fallback algorithm-based recommendations (simpler scoring)
 */
const getAlgorithmicRecommendations = (userProfile, journalEntries, options) => {
  const { count = 3, includeCompleted = false } = options;
  const availablePaths = getAvailablePaths(userProfile, includeCompleted);
  
  // Score each path
  const scoredPaths = availablePaths.map(path => ({
    path,
    score: scorePathRelevance(path, userProfile)
  }));
  
  // Sort by score and get top recommendations
  const topPaths = scoredPaths
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
  
  // Format as recommendations
  return topPaths.map((item, index) => {
    const category = index === 0 ? 'growth' : index === 1 ? 'exploration' : 'challenge';
    return {
      pathId: item.path.id,
      matchScore: item.score,
      reason: generateAlgorithmicReason(item.path, userProfile),
      benefit: `Explore ${item.path.title.toLowerCase()} through ${item.path.days.length} days of guided reflection`,
      timing: 'A great next step in your journaling journey',
      category,
      path: {
        id: item.path.id,
        title: item.path.title,
        subtitle: item.path.subtitle,
        description: item.path.description,
        days: item.path.days.length,
        difficulty: item.path.difficulty,
        tags: item.path.tags,
        iconName: item.path.iconName,
        color: item.path.color
      }
    };
  });
};

/**
 * Score path relevance (algorithm-based)
 */
const scorePathRelevance = (path, userProfile) => {
  let score = 0;
  
  // Interest matching (0-30 points)
  const userInterests = userProfile.interests || [];
  const pathTags = path.tags || [];
  const interestMatches = pathTags.filter(tag => 
    userInterests.some(interest => 
      tag.includes(interest) || interest.includes(tag)
    )
  ).length;
  score += Math.min(interestMatches * 10, 30);
  
  // Goal alignment (0-30 points)
  const userGoals = userProfile.journalingGoals || [];
  const goalMatches = pathTags.filter(tag => 
    userGoals.some(goal => 
      tag.includes(goal) || goal.includes(tag)
    )
  ).length;
  score += Math.min(goalMatches * 10, 30);
  
  // Experience level fit (0-20 points)
  const userLevel = determineExperienceLevel(userProfile);
  const difficultyFit = calculateDifficultyFit(path.difficulty || 'intermediate', userLevel);
  score += difficultyFit;
  
  // Novelty bonus (0-10 points)
  const completedPaths = Object.keys(userProfile.pathProgress || {});
  if (!completedPaths.includes(path.id)) {
    score += 10;
  }
  
  // Length preference (0-10 points)
  const preferredLength = userProfile.currentStreak > 7 ? 'long' : 'short';
  if (preferredLength === 'long' && path.days.length > 14) {
    score += 10;
  } else if (preferredLength === 'short' && path.days.length <= 14) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

/**
 * Calculate difficulty fit score
 */
const calculateDifficultyFit = (pathDifficulty, userLevel) => {
  const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
  const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
  
  const pathLevel = difficultyMap[pathDifficulty] || 2;
  const userLevelNum = levelMap[userLevel] || 2;
  
  const diff = Math.abs(pathLevel - userLevelNum);
  
  if (diff === 0) return 20; // Perfect match
  if (diff === 1) return 10; // Slight stretch or easier
  return 5; // Too easy or too hard
};

/**
 * Determine user experience level
 */
const determineExperienceLevel = (userProfile) => {
  const completedCount = Object.keys(userProfile.pathProgress || {})
    .filter(pathId => {
      const progress = userProfile.pathProgress[pathId];
      const path = JOURNEY_PATHS[pathId];
      return path && progress && progress.completedDays >= path.days.length;
    }).length;
  
  if (completedCount === 0) return 'beginner';
  if (completedCount < 3) return 'intermediate';
  return 'advanced';
};

/**
 * Generate algorithmic recommendation reason
 */
const generateAlgorithmicReason = (path, userProfile) => {
  const interests = userProfile.interests || [];
  const completedCount = Object.keys(userProfile.pathProgress || {}).length;
  
  if (completedCount === 0) {
    return `A perfect starting point for your journaling journey. This ${path.days.length}-day path will help you build a strong foundation.`;
  }
  
  if (interests.length > 0 && path.tags) {
    const matchingInterest = path.tags.find(tag => 
      interests.some(interest => tag.includes(interest) || interest.includes(tag))
    );
    if (matchingInterest) {
      return `This path aligns with your interest in ${matchingInterest} and offers ${path.days.length} days of focused exploration.`;
    }
  }
  
  return `Based on your journaling history, this ${path.days.length}-day journey offers valuable insights and personal growth.`;
};

/**
 * Helper: Calculate average entry length
 */
const calculateAvgEntryLength = (entries) => {
  if (!entries || entries.length === 0) return 0;
  
  const totalWords = entries.reduce((sum, entry) => {
    const text = entry.extractedText || entry.transcription || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    return sum + words;
  }, 0);
  
  return Math.round(totalWords / entries.length);
};

/**
 * Helper: Get most active journaling time
 */
const getMostActiveTime = (entries) => {
  if (!entries || entries.length === 0) return 'Not enough data';
  
  const hours = entries.map(entry => {
    const date = entry.timestamp?.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
    return date.getHours();
  });
  
  const avgHour = Math.round(hours.reduce((sum, h) => sum + h, 0) / hours.length);
  
  if (avgHour >= 5 && avgHour < 12) return 'Morning';
  if (avgHour >= 12 && avgHour < 17) return 'Afternoon';
  if (avgHour >= 17 && avgHour < 22) return 'Evening';
  return 'Night';
};

/**
 * Helper: Extract emotion trends from recent entries
 */
const extractEmotionTrends = (entries) => {
  if (!entries || entries.length === 0) return [];
  
  const emotions = new Set();
  const recentEntries = entries.slice(-10); // Last 10 entries
  
  recentEntries.forEach(entry => {
    if (entry.analysis?.emotions) {
      entry.analysis.emotions.forEach(emotion => emotions.add(emotion));
    }
  });
  
  return Array.from(emotions).slice(0, 5);
};

/**
 * Helper: Extract recent themes
 */
const extractRecentThemes = (entries) => {
  if (!entries || entries.length === 0) return [];
  
  const themes = new Set();
  const recentEntries = entries.slice(-10);
  
  recentEntries.forEach(entry => {
    if (entry.analysis?.themes) {
      entry.analysis.themes.forEach(theme => themes.add(theme));
    }
  });
  
  return Array.from(themes).slice(0, 5);
};

/**
 * Get quick onboarding-based starter recommendations
 */
export const getStarterRecommendations = (interests, goals) => {
  const starterPaths = [
    'self-discovery',
    'gratitude-practice',
    'mindfulness-awareness',
    'emotional-intelligence',
    'creative-expression',
    'nature-connection',
    'anxiety-alchemy',
    'digital-detox'
  ];
  
  const allStarterPaths = starterPaths
    .map(id => JOURNEY_PATHS[id])
    .filter(Boolean);
  
  // Score based on interests and goals
  const scoredPaths = allStarterPaths.map(path => {
    let score = 0;
    const tags = path.tags || [];
    
    // Match interests
    tags.forEach(tag => {
      if (interests.some(int => tag.includes(int) || int.includes(tag))) {
        score += 15;
      }
    });
    
    // Match goals
    tags.forEach(tag => {
      if (goals.some(goal => tag.includes(goal) || goal.includes(tag))) {
        score += 15;
      }
    });
    
    // Prefer 10-day paths for beginners
    if (path.days.length === 10) {
      score += 10;
    }
    
    return { path, score };
  });
  
  // Return top 3
  return scoredPaths
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => ({
      pathId: item.path.id,
      matchScore: item.score,
      reason: `Perfect for beginners interested in ${interests.join(' and ')}`,
      benefit: item.path.description,
      timing: 'Great starting point for your journaling journey',
      category: 'growth',
      path: {
        id: item.path.id,
        title: item.path.title,
        subtitle: item.path.subtitle,
        description: item.path.description,
        days: item.path.days.length,
        difficulty: item.path.difficulty,
        tags: item.path.tags,
        iconName: item.path.iconName,
        color: item.path.color
      }
    }));
};

/**
 * Get single perfect path recommendation based on questionnaire answers
 * @param {Object} userProfile - User profile
 * @param {Object} answers - Questionnaire answers
 * @returns {Promise<Object>} Single recommended path with detailed explanation
 */
export const getQuestionnaireRecommendation = async (userProfile, answers) => {
  try {
    const {
      mood,        // How user is feeling right now
      needs,       // What they need most today
      timeAvailable, // How much time they have
      experience,  // Their experience level
      focus        // Current life focus area
    } = answers;

    // Get available paths (exclude completed)
    const availablePaths = getAvailablePaths(userProfile, false);

    // Build context from questionnaire
    const questionnaireContext = `
User Profile:
- Current Mood: ${mood}
- Primary Need: ${needs}
- Available Time: ${timeAvailable}
- Experience Level: ${experience}
- Life Focus: ${focus}
- Age: ${userProfile.age || 'Not specified'}
- Interests: ${(userProfile.interests || []).join(', ') || 'Not specified'}
- Goals: ${(userProfile.journalingGoals || []).join(', ') || 'Not specified'}

Based on this immediate state and needs, recommend ONE perfect journaling path for RIGHT NOW.
    `.trim();

    // Prepare paths for AI
    const pathSummaries = availablePaths.map(path => ({
      id: path.id,
      title: path.title,
      subtitle: path.subtitle,
      days: path.days.length,
      difficulty: path.difficulty || 'intermediate',
      tags: path.tags || [],
      description: path.description
    }));

    // Build AI prompt for single recommendation
    const prompt = `You are a compassionate journaling guide helping someone find their perfect journaling path RIGHT NOW.

${questionnaireContext}

Available Paths:
${JSON.stringify(pathSummaries, null, 2)}

Please recommend ONE PERFECT path that matches their current state and needs.

Respond with JSON:
{
  "recommendation": {
    "pathId": "path-id",
    "matchScore": 95,
    "headline": "One powerful sentence why this is perfect for them right now",
    "reason": "2-3 sentences explaining why this path matches their current mood, needs, and situation",
    "benefit": "What they'll gain from this journey",
    "timing": "Why NOW is the right time for this path",
    "personalNote": "A warm, encouraging personal message from you as their guide"
  }
}`;

    console.log('🎯 Requesting single perfect path recommendation...');

    const requestBody = {
      model: CLAUDE_RECOMMENDATION_MODEL,
      max_tokens: 1500,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }]
    };

    const response = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    const content = response.content?.[0]?.text || response.content;
    const parsed = safeJsonParse(content);

    if (parsed && parsed.recommendation) {
      const rec = parsed.recommendation;
      const path = JOURNEY_PATHS[rec.pathId];

      if (!path) {
        throw new Error('Recommended path not found');
      }

      return {
        pathId: rec.pathId,
        matchScore: rec.matchScore,
        headline: rec.headline,
        reason: rec.reason,
        benefit: rec.benefit,
        timing: rec.timing,
        personalNote: rec.personalNote,
        path: {
          id: path.id,
          title: path.title,
          subtitle: path.subtitle,
          description: path.description,
          days: path.days.length,
          difficulty: path.difficulty,
          tags: path.tags,
          iconName: path.iconName,
          color: path.color
        }
      };
    }

    // Fallback to algorithmic selection
    throw new Error('Could not parse AI recommendation');

  } catch (error) {
    console.error('Error getting questionnaire recommendation:', error);
    
    // Algorithmic fallback - find best match based on questionnaire
    return getAlgorithmicQuestionnaireMatch(userProfile, answers);
  }
};

/**
 * Algorithmic fallback for questionnaire recommendations
 */
const getAlgorithmicQuestionnaireMatch = (userProfile, answers) => {
  const availablePaths = getAvailablePaths(userProfile, false);
  
  // Score paths based on questionnaire answers
  const scoredPaths = availablePaths.map(path => {
    let score = 0;

    // Match difficulty to experience level
    if (answers.experience === 'first-time' && path.difficulty === 'beginner') score += 30;
    if (answers.experience === 'beginner' && path.difficulty === 'beginner') score += 25;
    if (answers.experience === 'experienced' && path.difficulty === 'intermediate') score += 25;
    
    // Match time availability to path length
    if (answers.timeAvailable === '5-mins' && path.days.length <= 7) score += 20;
    if (answers.timeAvailable === '15-mins' && path.days.length <= 14) score += 20;
    if (answers.timeAvailable === '30-mins') score += 10;

    // Match mood to path themes
    const moodKeywords = {
      'calm': ['mindfulness', 'peace', 'gratitude', 'nature'],
      'anxious': ['stress', 'worry', 'calm', 'breathing'],
      'excited': ['adventure', 'exploration', 'creativity', 'new'],
      'confused': ['clarity', 'decision', 'purpose', 'direction'],
      'sad': ['healing', 'emotion', 'compassion', 'support'],
      'motivated': ['goals', 'achievement', 'growth', 'challenge']
    };

    const keywords = moodKeywords[answers.mood] || [];
    keywords.forEach(keyword => {
      if (path.tags?.some(tag => tag.toLowerCase().includes(keyword))) score += 5;
      if (path.title.toLowerCase().includes(keyword)) score += 5;
    });

    // Match needs to path benefits
    const needsKeywords = {
      'clarity': ['direction', 'purpose', 'decision', 'clarity'],
      'growth': ['grow', 'develop', 'learn', 'improve'],
      'healing': ['heal', 'emotion', 'compassion', 'process'],
      'adventure': ['explore', 'discover', 'new', 'journey'],
      'peace': ['calm', 'peace', 'mindful', 'relax']
    };

    const needKeywords = needsKeywords[answers.needs] || [];
    needKeywords.forEach(keyword => {
      if (path.description?.toLowerCase().includes(keyword)) score += 10;
    });

    return { path, score };
  });

  // Get top match
  const topMatch = scoredPaths.sort((a, b) => b.score - a.score)[0];
  
  return {
    pathId: topMatch.path.id,
    matchScore: Math.min(95, topMatch.score),
    headline: `Perfect for your ${answers.mood} mood and ${answers.needs} needs`,
    reason: `This path aligns with your current state and what you need most right now.`,
    benefit: topMatch.path.description,
    timing: `With ${answers.timeAvailable} available, this is an ideal match.`,
    personalNote: `Trust your instincts - this path feels right for where you are today.`,
    path: {
      id: topMatch.path.id,
      title: topMatch.path.title,
      subtitle: topMatch.path.subtitle,
      description: topMatch.path.description,
      days: topMatch.path.days.length,
      difficulty: topMatch.path.difficulty,
      tags: topMatch.path.tags,
      iconName: topMatch.path.iconName,
      color: topMatch.path.color
    }
  };
};

export default {
  getAiRecommendations,
  getStarterRecommendations,
  getCachedRecommendations,
  getQuestionnaireRecommendation
};
