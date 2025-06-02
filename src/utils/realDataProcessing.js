// src/utils/realDataProcessing.js - Enhanced utilities for processing real journal data

/**
 * Enhanced text processing utilities for real journal data
 * Replaces mock data generation with actual analysis of user's journal entries
 */

/**
 * Extract themes from real journal entries using sophisticated text analysis
 * @param {Array} entries - Array of journal entry objects
 * @returns {Array} Array of theme objects with text and value properties
 */
export const extractThemesFromEntries = (entries) => {
  if (!entries || entries.length === 0) {
    return [];
  }

  // Comprehensive theme categories with weighted keywords
  const themeCategories = {
    'Self-reflection': {
      keywords: ['reflect', 'introspect', 'self', 'identity', 'authentic', 'values', 'beliefs', 'examine', 'consider', 'ponder', 'realize', 'understand', 'awareness'],
      weight: 1.2
    },
    'Growth': {
      keywords: ['grow', 'develop', 'evolve', 'progress', 'improve', 'advance', 'flourish', 'transform', 'expand', 'journey', 'change', 'becoming'],
      weight: 1.3
    },
    'Relationships': {
      keywords: ['relationship', 'connect', 'bond', 'friendship', 'family', 'love', 'partner', 'social', 'interact', 'together', 'community', 'support'],
      weight: 1.1
    },
    'Work': {
      keywords: ['work', 'job', 'career', 'professional', 'project', 'task', 'productivity', 'workplace', 'accomplish', 'achieve', 'goal', 'success'],
      weight: 1.0
    },
    'Creativity': {
      keywords: ['create', 'creative', 'imagination', 'innovative', 'artistic', 'express', 'design', 'craft', 'make', 'build', 'inspire', 'art'],
      weight: 1.1
    },
    'Health': {
      keywords: ['health', 'wellness', 'fitness', 'exercise', 'nutrition', 'sleep', 'rest', 'physical', 'mental', 'wellbeing', 'energy', 'healing'],
      weight: 1.2
    },
    'Learning': {
      keywords: ['learn', 'study', 'knowledge', 'skill', 'education', 'understand', 'comprehend', 'discover', 'insight', 'wisdom', 'curiosity'],
      weight: 1.1
    },
    'Goals': {
      keywords: ['goal', 'aim', 'target', 'objective', 'plan', 'intention', 'purpose', 'direction', 'aspiration', 'ambition', 'vision', 'dream'],
      weight: 1.2
    },
    'Gratitude': {
      keywords: ['grateful', 'thankful', 'appreciate', 'blessing', 'fortune', 'recognition', 'acknowledgment', 'value', 'gift', 'grace', 'blessed'],
      weight: 1.3
    },
    'Mindfulness': {
      keywords: ['mindful', 'aware', 'present', 'attentive', 'conscious', 'notice', 'observe', 'sense', 'moment', 'breath', 'meditation', 'peace'],
      weight: 1.2
    },
    'Challenge': {
      keywords: ['challenge', 'difficult', 'struggle', 'obstacle', 'hurdle', 'overcome', 'face', 'confront', 'tackle', 'endure', 'persevere', 'resilience'],
      weight: 1.1
    },
    'Balance': {
      keywords: ['balance', 'harmony', 'equilibrium', 'stability', 'center', 'proportion', 'moderate', 'integrate', 'blend', 'align'],
      weight: 1.0
    },
    'Purpose': {
      keywords: ['purpose', 'meaning', 'significance', 'mission', 'calling', 'vocation', 'contribution', 'legacy', 'impact', 'value', 'why'],
      weight: 1.3
    },
    'Emotions': {
      keywords: ['emotion', 'feel', 'sentiment', 'mood', 'affect', 'sensation', 'experience', 'heart', 'passion', 'intensity', 'feelings'],
      weight: 1.1
    }
  };

  // Combine all text from entries
  const allText = entries.map(entry => {
    const textSources = [
      entry.extractedText || '',
      entry.analysis?.summary || '',
      ...(entry.analysis?.insights || []),
      entry.theme || '',
      entry.prompt || ''
    ];
    return textSources.join(' ');
  }).join(' ').toLowerCase();

  // Remove common words and punctuation
  const stopWords = new Set([
    'the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'on', 'at', 'from', 'by', 'an', 'this', 'that', 'it',
    'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'not', 'no', 'yes', 'or', 'but', 'if', 'then', 'else',
    'when', 'where', 'who', 'what', 'how', 'why', 'which', 'whose', 'whom', 'very', 'really', 'quite', 'just',
    'only', 'also', 'even', 'still', 'now', 'here', 'there', 'all', 'any', 'some', 'many', 'much', 'more',
    'most', 'other', 'such', 'own', 'same', 'new', 'old', 'good', 'bad', 'big', 'small', 'long', 'short'
  ]);

  // Calculate theme scores
  const themeScores = {};

  Object.entries(themeCategories).forEach(([theme, config]) => {
    let score = 0;
    const { keywords, weight } = config;

    keywords.forEach(keyword => {
      // Use word boundaries to match whole words
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = allText.match(regex);
      if (matches) {
        // Apply weights and frequency
        score += matches.length * weight;
        
        // Bonus for longer keyword matches (more specific)
        if (keyword.length > 6) {
          score += matches.length * 0.5;
        }
      }
    });

    if (score > 0) {
      themeScores[theme] = score;
    }
  });

  // Convert to theme objects and sort by score
  const themes = Object.entries(themeScores)
    .map(([theme, score]) => ({
      text: theme,
      value: Math.min(Math.max(Math.round(score), 1), 10) // Normalize to 1-10 range
    }))
    .sort((a, b) => b.value - a.value);

  // Return top themes (limit to prevent clutter)
  return themes.slice(0, 15);
};

/**
 * Extract emotion data from real journal entries
 * @param {Array} entries - Array of journal entry objects
 * @returns {Object} Object containing emotions array and analysis
 */
export const extractEmotionData = (entries) => {
  if (!entries || entries.length === 0) {
    return { emotions: [], analysis: null };
  }

  // Enhanced emotion detection with intensity weights
  const emotionPatterns = {
    joy: {
      keywords: ['happy', 'joy', 'joyful', 'delighted', 'excited', 'pleased', 'thrilled', 'content', 'satisfied', 'glad', 'cheerful', 'elated', 'euphoric'],
      intensity: 1.2,
      category: 'positive'
    },
    gratitude: {
      keywords: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate', 'gracious', 'acknowledgment', 'recognition'],
      intensity: 1.3,
      category: 'positive'
    },
    love: {
      keywords: ['love', 'loving', 'adore', 'cherish', 'affection', 'care', 'tender', 'warmth', 'compassion'],
      intensity: 1.4,
      category: 'positive'
    },
    peace: {
      keywords: ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene', 'composed', 'collected', 'centered', 'balanced', 'steady'],
      intensity: 1.1,
      category: 'positive'
    },
    confidence: {
      keywords: ['confident', 'assured', 'certain', 'secure', 'self-assured', 'bold', 'empowered', 'strong', 'capable', 'competent'],
      intensity: 1.2,
      category: 'positive'
    },
    sadness: {
      keywords: ['sad', 'sadness', 'upset', 'depressed', 'down', 'unhappy', 'miserable', 'gloomy', 'heartbroken', 'disappointed', 'sorrow', 'grief'],
      intensity: 1.1,
      category: 'negative'
    },
    anger: {
      keywords: ['angry', 'anger', 'annoyed', 'irritated', 'furious', 'enraged', 'mad', 'bitter', 'frustrated', 'outraged', 'resentful'],
      intensity: 1.3,
      category: 'negative'
    },
    anxiety: {
      keywords: ['anxious', 'anxiety', 'worried', 'nervous', 'stress', 'stressed', 'overwhelmed', 'panic', 'fearful', 'uneasy', 'tense'],
      intensity: 1.2,
      category: 'negative'
    },
    fear: {
      keywords: ['afraid', 'scared', 'fear', 'terrified', 'panicked', 'frightened', 'alarmed', 'intimidated'],
      intensity: 1.1,
      category: 'negative'
    },
    confusion: {
      keywords: ['confused', 'bewildered', 'puzzled', 'uncertain', 'unclear', 'perplexed', 'lost', 'conflicted'],
      intensity: 0.9,
      category: 'neutral'
    },
    hope: {
      keywords: ['hope', 'hopeful', 'optimistic', 'positive', 'encouraged', 'inspired', 'motivated', 'determined'],
      intensity: 1.2,
      category: 'positive'
    },
    curiosity: {
      keywords: ['curious', 'wonder', 'wondering', 'interested', 'intrigued', 'fascinated', 'explore', 'discovery'],
      intensity: 1.0,
      category: 'positive'
    }
  };

  // Combine all text from entries
  const allText = entries.map(entry => {
    const textSources = [
      entry.extractedText || '',
      entry.analysis?.summary || '',
      ...(entry.analysis?.insights || [])
    ];
    return textSources.join(' ');
  }).join(' ').toLowerCase();

  // Calculate emotion scores
  const emotionScores = {};
  let totalMatches = 0;

  Object.entries(emotionPatterns).forEach(([emotion, config]) => {
    let score = 0;
    const { keywords, intensity } = config;

    keywords.forEach(keyword => {
      // Use word boundaries and consider word variations
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = allText.match(regex);
      if (matches) {
        score += matches.length * intensity;
        totalMatches += matches.length;
      }
    });

    if (score > 0) {
      emotionScores[emotion] = score;
    }
  });

  // Normalize scores and create emotion objects
  const emotions = Object.entries(emotionScores)
    .map(([emotion, score]) => ({
      name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: totalMatches > 0 ? Math.min(score / totalMatches, 1) : 0,
      category: emotionPatterns[emotion].category
    }))
    .filter(emotion => emotion.value > 0.01) // Filter out very low scores
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Limit to top 8 emotions

  // Calculate overall emotional tone
  const positiveScore = emotions
    .filter(e => e.category === 'positive')
    .reduce((sum, e) => sum + e.value, 0);
  
  const negativeScore = emotions
    .filter(e => e.category === 'negative')
    .reduce((sum, e) => sum + e.value, 0);

  const overallTone = positiveScore - negativeScore;

  return {
    emotions,
    analysis: {
      overallTone,
      dominantEmotion: emotions[0]?.name || 'Neutral',
      emotionalDiversity: emotions.length,
      positiveScore,
      negativeScore
    }
  };
};

/**
 * Analyze journaling consistency from real entries
 * @param {Array} entries - Array of journal entry objects
 * @returns {Object} Consistency analysis object
 */
export const analyzeConsistency = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      averageWordsPerEntry: 0,
      longestStreak: 0,
      currentStreak: 0,
      consistency: 0,
      weeklyPattern: {},
      insights: []
    };
  }

  // Sort entries by day
  const sortedEntries = [...entries].sort((a, b) => a.day - b.day);

  // Calculate basic metrics
  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, entry) => {
    const wordCount = (entry.extractedText || '').split(/\s+/).filter(Boolean).length;
    return sum + wordCount;
  }, 0);
  const averageWordsPerEntry = Math.round(totalWords / totalEntries);

  // Calculate streaks
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 1;
  let lastDay = sortedEntries[0]?.day || 0;

  for (let i = 1; i < sortedEntries.length; i++) {
    const currentDay = sortedEntries[i].day;
    if (currentDay === lastDay + 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
    lastDay = currentDay;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate current streak (from the end)
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  const expectedLastDay = Math.max(...sortedEntries.map(e => e.day));
  
  if (lastEntry && lastEntry.day === expectedLastDay) {
    currentStreak = 1;
    for (let i = sortedEntries.length - 2; i >= 0; i--) {
      if (sortedEntries[i].day === sortedEntries[i + 1].day - 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate consistency percentage
  const expectedDays = Math.max(...sortedEntries.map(e => e.day)) || 1;
  const consistency = Math.round((totalEntries / expectedDays) * 100);

  // Analyze weekly patterns (if timestamps available)
  const weeklyPattern = {};
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  entries.forEach(entry => {
    if (entry.timestamp) {
      const date = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
      const weekday = weekdays[date.getDay()];
      weeklyPattern[weekday] = (weeklyPattern[weekday] || 0) + 1;
    }
  });

  // Generate insights
  const insights = [];
  
  if (consistency >= 80) {
    insights.push("Excellent consistency! You're building a strong journaling habit.");
  } else if (consistency >= 60) {
    insights.push("Good consistency! Try to maintain your momentum.");
  } else if (consistency >= 40) {
    insights.push("You're making progress. Consider setting a daily reminder to journal.");
  } else {
    insights.push("There's room for improvement in consistency. Start with just 5 minutes daily.");
  }

  if (longestStreak >= 7) {
    insights.push(`Impressive! Your longest streak was ${longestStreak} days.`);
  }

  if (averageWordsPerEntry > 100) {
    insights.push("You write detailed entries, which is great for deeper reflection.");
  } else if (averageWordsPerEntry < 50) {
    insights.push("Consider writing a bit more to capture your thoughts fully.");
  }

  return {
    totalEntries,
    averageWordsPerEntry,
    longestStreak,
    currentStreak,
    consistency,
    weeklyPattern,
    insights
  };
};

/**
 * Generate calendar data from real journal entries
 * @param {Array} entries - Array of journal entry objects
 * @returns {Array} Calendar data array
 */
export const generateCalendarData = (entries) => {
  if (!entries || entries.length === 0) {
    return [];
  }

  const calendarData = [];
  const today = new Date();
  
  // Create a map of dates to entry counts
  const dateCounts = {};
  
  entries.forEach(entry => {
    let date;
    
    if (entry.timestamp) {
      // Use timestamp if available
      date = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
    } else {
      // Estimate date based on day number (assume recent entries)
      date = new Date();
      date.setDate(today.getDate() - (Math.max(...entries.map(e => e.day)) - entry.day));
    }
    
    const dateStr = date.toISOString().split('T')[0];
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  // Convert to calendar data format
  Object.entries(dateCounts).forEach(([dateStr, count]) => {
    calendarData.push({
      date: dateStr,
      count: count
    });
  });

  return calendarData.sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Generate insights summary from real journal data
 * @param {Array} entries - Array of journal entry objects
 * @returns {Object} Insights summary object
 */
export const generateInsightsSummary = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      completionRate: 0,
      commonThemes: [],
      emotionalInsight: "Continue journaling to track your emotional patterns.",
      growthAreas: ["Building a consistent journaling habit"],
      recommendation: "Start with 5 minutes of daily reflection to establish your practice.",
      nextSteps: ["Set a daily reminder", "Choose a consistent time to write"]
    };
  }

  const themes = extractThemesFromEntries(entries);
  const emotionData = extractEmotionData(entries);
  const consistency = analyzeConsistency(entries);

  // Calculate completion rate (assuming 10-day journey as default)
  const expectedDays = 10; // This could be dynamic based on path
  const completionRate = Math.round((entries.length / expectedDays) * 100);

  // Generate emotional insight
  let emotionalInsight = "Your journaling shows ";
  if (emotionData.emotions.length > 0) {
    const topEmotion = emotionData.emotions[0];
    emotionalInsight += `${topEmotion.name.toLowerCase()} as a prominent emotion. `;
    
    if (emotionData.analysis.overallTone > 0.1) {
      emotionalInsight += "Overall, your entries reflect a positive emotional tone.";
    } else if (emotionData.analysis.overallTone < -0.1) {
      emotionalInsight += "Your entries suggest you're working through some challenges, which is valuable for growth.";
    } else {
      emotionalInsight += "Your emotional expression shows balance and thoughtful reflection.";
    }
  } else {
    emotionalInsight += "developing emotional awareness through your writing practice.";
  }

  // Generate growth areas
  const growthAreas = [];
  if (consistency.consistency < 70) {
    growthAreas.push("Building more consistent journaling habits");
  }
  if (consistency.averageWordsPerEntry < 75) {
    growthAreas.push("Exploring thoughts in more detail");
  }
  if (themes.length < 3) {
    growthAreas.push("Expanding the range of topics you explore");
  }
  
  growthAreas.push(...consistency.insights.slice(0, 2));

  // Generate recommendation
  let recommendation;
  if (entries.length < 3) {
    recommendation = "Continue building your journaling practice. The insights will become richer as you write more regularly.";
  } else if (consistency.consistency >= 80) {
    recommendation = "You've established an excellent journaling rhythm! Consider exploring deeper questions or new themes.";
  } else {
    recommendation = "You're making good progress. Try to journal at the same time each day to strengthen your habit.";
  }

  // Generate next steps
  const nextSteps = [];
  if (consistency.currentStreak === 0) {
    nextSteps.push("Start a new writing streak today");
  }
  if (themes.some(theme => theme.text === 'Goals')) {
    nextSteps.push("Explore how your goals connect to your daily experiences");
  } else {
    nextSteps.push("Consider writing about your aspirations and goals");
  }
  if (!themes.some(theme => theme.text === 'Gratitude')) {
    nextSteps.push("Try incorporating gratitude into your reflections");
  }

  return {
    totalEntries: entries.length,
    completionRate,
    commonThemes: themes.slice(0, 5).map(theme => theme.text),
    emotionalInsight,
    growthAreas: growthAreas.slice(0, 3),
    recommendation,
    nextSteps: nextSteps.slice(0, 3)
  };
};

/**
 * Process real sentiment data from journal entries
 * @param {Array} entries - Array of journal entry objects
 * @returns {number} Sentiment score between -1 and 1
 */
export const calculateSentimentScore = (entries) => {
  if (!entries || entries.length === 0) {
    return 0;
  }

  const emotionData = extractEmotionData(entries);
  
  // Use the overall tone from emotion analysis
  return Math.max(-1, Math.min(1, emotionData.analysis.overallTone));
};

/**
 * Extract topic relevance data from real journal entries
 * @param {Array} entries - Array of journal entry objects
 * @returns {Array} Array of topic objects with name and relevance
 */
export const extractTopicRelevance = (entries) => {
  const themes = extractThemesFromEntries(entries);
  
  // Convert themes to topic format with relevance scores
  return themes.slice(0, 6).map(theme => ({
    name: theme.text,
    relevance: Math.min(theme.value / 10, 1) // Normalize to 0-1 range
  }));
};

export default {
  extractThemesFromEntries,
  extractEmotionData,
  analyzeConsistency,
  generateCalendarData,
  generateInsightsSummary,
  calculateSentimentScore,
  extractTopicRelevance
};