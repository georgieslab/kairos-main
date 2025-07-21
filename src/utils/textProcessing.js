// src/utils/textProcessing.js

/**
 * Extended stopwords list for text analysis
 * This comprehensive list helps filter out common words that don't provide meaningful insights
 */
export const EXTENDED_STOPWORDS = [
    // Common English stopwords
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
    'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
    'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot', 'could',
    'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down',
    'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
    'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s',
    'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll',
    'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
    'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not',
    'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
    'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
    'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the',
    'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
    'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through',
    'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
    'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
    'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why',
    'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
    'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
    
    // Additional common words that don't provide insights
    'just', 'like', 'get', 'got', 'getting', 'make', 'makes', 'made', 'making',
    'take', 'takes', 'took', 'taking', 'going', 'went', 'goes', 'come', 'comes',
    'came', 'coming', 'think', 'thinks', 'thought', 'thinking', 'know', 'knows',
    'knew', 'knowing', 'want', 'wants', 'wanted', 'wanting', 'need', 'needs',
    'needed', 'needing', 'see', 'sees', 'saw', 'seeing', 'look', 'looks', 'looked',
    'looking', 'use', 'uses', 'used', 'using', 'try', 'tries', 'tried', 'trying',
    'feel', 'feels', 'felt', 'feeling', 'seem', 'seems', 'seemed', 'seeming',
    'tell', 'tells', 'told', 'telling', 'say', 'says', 'said', 'saying', 'now',
    'today', 'yesterday', 'tomorrow', 'day', 'week', 'month', 'year', 'time',
    'thing', 'things', 'stuff', 'way', 'something', 'anything', 'nothing', 
    'everything', 'someone', 'anyone', 'everyone', 'somebody', 'anybody', 
    'nobody', 'everybody', 'somewhere', 'anywhere', 'nowhere', 'everywhere',
    'ever', 'never', 'always', 'sometimes', 'often', 'really', 'actually',
    'basically', 'totally', 'completely', 'absolutely', 'definitely', 'probably',
    'maybe', 'perhaps', 'possibly', 'certainly', 'surely', 'obviously',
    'clearly', 'simply', 'just', 'even', 'still', 'yet', 'also', 'too', 'very',
    'quite', 'rather', 'pretty', 'somewhat', 'slightly', 'little', 'bit',
    'lot', 'much', 'many', 'few', 'several', 'some', 'most', 'all', 'none',
    'one', 'two', 'three', 'four', 'five', 'first', 'second', 'third', 'last',
    'next', 'previous', 'will', 'would', 'shall', 'should', 'may', 'might',
    'must', 'can', 'could', 'since', 'ago', 'before', 'after', 'during', 'while',
    'until', 'till', 'unless', 'although', 'though', 'even', 'if', 'only', 'just',
    'well', 'however', 'anyway', 'actually', 'instead', 'still', 'rather',
    'good', 'great', 'nice', 'better', 'best', 'bad', 'worse', 'worst',
    'high', 'low', 'long', 'short', 'big', 'small', 'large', 'little',
    'new', 'old', 'young', 'right', 'wrong', 'different', 'same', 'similar',
    'other', 'another', 'else', 'otherwise', 'instead',
    'able', 'unable', 'start', 'stop', 'end', 'began', 'begun', 'finished',
    'done', 'yeah', 'yes', 'yep', 'nope', 'no', 'hi', 'hello', 'hey',
    'oh', 'hmm', 'umm', 'huh', 'wow', 'ah', 'ok', 'okay', 'etc',
    
    // Journal-specific common words that don't add insight value
    'journal', 'entry', 'wrote', 'write', 'writing', 'thought', 'think', 'reflect',
    'reflection', 'today', 'yesterday', 'tomorrow', 'week', 'day', 'night',
    'morning', 'evening', 'afternoon', 'prompt', 'theme', 'question', 'answer',
    'page', 'note', 'notes', 'idea', 'ideas', 'paragraph', 'sentence', 'point',
    'points', 'section', 'sections', 'part', 'parts'
];

/**
 * Process text to extract meaningful words and their frequencies
 * @param {string} text - Text to process
 * @param {Object} options - Processing options
 * @returns {Array} - Array of words with their frequencies
 */
export const processText = (text, options = {}) => {
  if (!text) return [];
  
  const {
    minWordLength = 3,
    maxWords = 100,
    minFrequency = 1,
    customStopwords = [],
    includeStopwords = false
  } = options;
  
  // Combine standard stopwords with custom ones
  const stopwordsList = includeStopwords ? customStopwords : [...EXTENDED_STOPWORDS, ...customStopwords];
  
  // Convert to lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words
  const words = cleanText.split(/\s+/);
  
  // Filter out stopwords and short words
  const filteredWords = words.filter(word => 
    word.length > minWordLength && !stopwordsList.includes(word)
  );
  
  // Count word frequencies
  const wordCount = {};
  filteredWords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Convert to array format for visualization
  return Object.entries(wordCount)
    .filter(([_, count]) => count >= minFrequency)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxWords);
};

/**
 * Process journal entries to find meaningful themes and topics
 * @param {Array} entries - Array of journal entries
 * @param {number} limit - Maximum number of themes to return
 * @returns {Array} - Array of themes with their relevance scores
 */
export const extractThemesFromEntries = (entries, limit = 15) => {
  if (!entries || entries.length === 0) return [];
  
  // Enhanced theme categories with weighted keywords
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
  return themes.slice(0, limit);
};

/**
 * Extract emotional patterns from journal entries
 * @param {Array} entries - Array of journal entries
 * @returns {Object} - Emotional patterns data
 */
export const extractEmotionData = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      emotions: [],
      sentimentScore: 0,
      dominantEmotion: null,
      analysis: {
        overallTone: 0,
        dominantEmotion: 'Neutral',
        emotionalDiversity: 0,
        positiveScore: 0,
        negativeScore: 0
      }
    };
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
    sentimentScore: Math.max(-1, Math.min(1, overallTone)), // Legacy compatibility
    dominantEmotion: emotions[0]?.name || 'Neutral', // Legacy compatibility
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

export default {
  EXTENDED_STOPWORDS,
  processText,
  extractThemesFromEntries,
  extractEmotionData,
  analyzeConsistency
};