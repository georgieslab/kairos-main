// src/components/analytics/EmotionTrends.jsx - Enhanced Pie Chart Only Version

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

/**
 * Enhanced Emotion Trends visualization with pie chart only
 * Optimized for mobile, tablet, and desktop with beautiful animations
 * @param {Array} data - Array of emotion objects with name and value properties
 * @param {boolean} simplified - Whether to show simplified view
 * @param {boolean} hideTitle - Whether to hide the explanation title
 * @param {boolean} isDarkMode - Whether the app is in dark mode
 */
const EmotionTrends = ({ 
  data = [], 
  simplified = false, 
  hideTitle = false,
  isDarkMode = true
}) => {
  const { t } = useTranslation('analytics');
  const [processedData, setProcessedData] = useState([]);
  const [isDataValid, setIsDataValid] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Process and validate data when it changes
  useEffect(() => {
    const validateAndProcessData = () => {
      if (!data || !Array.isArray(data)) {
        console.error("EmotionTrends: Invalid data format, expected array");
        setIsDataValid(false);
        return [];
      }
      
      // Filter and process valid data
      const validData = data.filter(item => (
        item && 
        typeof item === 'object' && 
        item.name && 
        typeof item.name === 'string' && 
        !isNaN(Number(item.value))
      )).map(item => ({
        name: item.name,
        value: Number(item.value),
        originalName: item.name
      }));
      
      if (validData.length === 0) {
        console.warn("EmotionTrends: No valid emotion data available");
        setIsDataValid(false);
        return [];
      }
      
      // Sort by value and limit to top emotions based on view
      const maxEmotions = simplified ? 4 : 6;
      const sortedData = [...validData].sort((a, b) => b.value - a.value);
      
      // Group smaller emotions into "Others" if we have more than maxEmotions
      if (sortedData.length > maxEmotions) {
        const topEmotions = sortedData.slice(0, maxEmotions - 1);
        const otherEmotions = sortedData.slice(maxEmotions - 1);
        const othersValue = otherEmotions.reduce((sum, emotion) => sum + emotion.value, 0);
        
        if (othersValue > 0) {
          topEmotions.push({
            name: 'Others',
            value: othersValue,
            originalName: 'Others',
            isOthers: true
          });
        }
        
        return topEmotions;
      }
      
      return sortedData;
    };
    
    const processed = validateAndProcessData();
    setProcessedData(processed);
    setIsDataValid(processed.length > 0);
  }, [data, simplified]);
  
  // Enhanced emotion colors with better contrast and semantic meaning
  const EMOTION_COLORS = {
    // Positive emotions - warm and vibrant
    joy: '#4CAF50',
    happiness: '#66BB6A', 
    love: '#E91E63',
    gratitude: '#8BC34A',
    grateful: '#8BC34A',
    peace: '#26C6DA',
    calm: '#29B6F6',
    hope: '#42A5F5',
    confidence: '#66BB6A',
    content: '#26A69A',
    trust: '#81C784',
    curiosity: '#AB47BC',
    anticipation: '#FFA726',
    
    // Negative emotions - cooler tones but still vibrant
    sadness: '#5C6BC0',
    anger: '#EF5350',
    fear: '#FFCA28',
    anxiety: '#FFB74D',
    worry: '#FFA726',
    stress: '#FF7043',
    frustrated: '#FF8A65',
    confusion: '#90A4AE',
    overwhelmed: '#8E24AA',
    disappointment: '#7986CB',
    
    // Neutral emotions
    surprise: '#26C6DA',
    disgust: '#9C27B0',
    
    // Others category
    others: '#78909C',
    
    // Default gradient colors for unknown emotions
    default: [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', 
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ]
  };
  
  // Smart abbreviation mapping optimized for different screen sizes
  const EMOTION_ABBREVIATIONS = {
    'Joy': 'Joy',
    'Happiness': 'Happy',
    'Sadness': 'Sad', 
    'Anger': 'Angry',
    'Fear': 'Fear',
    'Anxiety': 'Worry',
    'Love': 'Love',
    'Peace': 'Peace',
    'Calm': 'Calm',
    'Hope': 'Hope',
    'Trust': 'Trust',
    'Gratitude': 'Thanks',
    'Grateful': 'Thanks',
    'Confidence': 'Confident',
    'Curiosity': 'Curious',
    'Surprise': 'Surprise',
    'Content': 'Content',
    'Frustration': 'Upset',
    'Stressed': 'Stress',
    'Worry': 'Worry',
    'Confusion': 'Confused',
    'Overwhelmed': 'Overwhelm',
    'Others': 'Others'
  };
  
  // Get color for an emotion with fallback
  const getEmotionColor = (emotion, index) => {
    const emotionKey = emotion.toLowerCase();
    if (EMOTION_COLORS[emotionKey]) {
      return EMOTION_COLORS[emotionKey];
    }
    return EMOTION_COLORS.default[index % EMOTION_COLORS.default.length];
  };
  
  // Format emotion name with proper capitalization
  const formatEmotionName = (name) => {
    if (name === 'Others') return 'Others';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  
  // Get smart abbreviation based on screen size
  const getEmotionAbbreviation = (name) => {
    const formattedName = formatEmotionName(name);
    return EMOTION_ABBREVIATIONS[formattedName] || formattedName.substring(0, 5);
  };
  
  // Enhanced tooltip with better styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = (data.value * 100).toFixed(1);
      
      return (
        <div className="emotion-tooltip">
          <div className="emotion-tooltip-header">
            <div 
              className="emotion-color-dot"
              style={{ backgroundColor: getEmotionColor(data.name, payload[0].index) }}
            />
            <span className="emotion-tooltip-name">
              {formatEmotionName(data.name)}
            </span>
          </div>
          <div className="emotion-tooltip-value">
            {t('emotionTrends.intensityPercent', '{{percent}}% intensity', { percent: percentage })}
          </div>
          {data.isOthers && (
            <div className="emotion-tooltip-note">
              {t('emotionTrends.combinedSmallerEmotions', 'Combined smaller emotions')}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom label renderer with responsive text sizing
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent, index }) => {
    if (percent < 0.05) return null; // Hide labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = (percent * 100).toFixed(0);
    
    // Choose label based on view and screen size
    let labelText;
    if (simplified) {
      labelText = `${getEmotionAbbreviation(name)} ${percentage}%`;
    } else {
      labelText = percentage > 10 ? `${getEmotionAbbreviation(name)} ${percentage}%` : `${percentage}%`;
    }
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={isDarkMode ? '#f5f5f0' : '#283c34'}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={simplified ? 11 : 12}
        fontWeight="600"
        className="pie-chart-label"
      >
        {labelText}
      </text>
    );
  };

  // Handle mouse events for enhanced interactivity
  const handleMouseEnter = (data, index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Animation completion handler
  const handleAnimationEnd = () => {
    setAnimationComplete(true);
  };

  // Show empty state if no valid data
  if (!isDataValid || processedData.length === 0) {
    return (
      <div className="emotion-trends-container">
        <div className="emotion-trends-empty">
          <div className="empty-chart-placeholder">
            <div className="empty-circle"></div>
            <div className="empty-icon"><BarChart3 size={28} strokeWidth={1.6} aria-hidden="true" /></div>
          </div>
          <p className="empty-message">{t('emotionTrends.emptyMessage', 'Not enough emotional data to visualize')}</p>
          <p className="empty-submessage">{t('emotionTrends.emptySubmessage', 'Complete more journal entries to see your emotional patterns')}</p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions based on view type
  const getChartDimensions = () => {
    if (simplified) {
      return {
        height: 180,
        innerRadius: 30,
        outerRadius: 65,
        paddingAngle: 2
      };
    }
    
    // Responsive dimensions for different screen sizes
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      return {
        height: 250,
        innerRadius: 40,
        outerRadius: 85,
        paddingAngle: 3
      };
    } else if (isTablet) {
      return {
        height: 320,
        innerRadius: 60,
        outerRadius: 120,
        paddingAngle: 4
      };
    } else {
      return {
        height: 300,
        innerRadius: 50,
        outerRadius: 100,
        paddingAngle: 4
      };
    }
  };

  const chartDimensions = getChartDimensions();

  return (
    <div className="emotion-trends-container">
      <div className="emotion-chart-wrapper">
        <ResponsiveContainer width="100%" height={chartDimensions.height}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={chartDimensions.innerRadius}
              outerRadius={chartDimensions.outerRadius}
              paddingAngle={chartDimensions.paddingAngle}
              dataKey="value"
              nameKey="name"
              label={renderCustomLabel}
              labelLine={false}
              animationDuration={1800}
              animationBegin={200}
              animationEasing="ease-out"
              onAnimationEnd={handleAnimationEnd}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getEmotionColor(entry.name, index)}
                  stroke={isDarkMode ? '#1a1a1a' : '#ffffff'}
                  strokeWidth={2}
                  style={{
                    filter: hoveredIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                    transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
            {!simplified && (
              <Legend 
                verticalAlign="bottom" 
                height={40}
                formatter={(value) => formatEmotionName(value)}
                wrapperStyle={{ 
                  color: isDarkMode ? '#9CAF88' : '#558b6e',
                  fontSize: '14px',
                  paddingTop: '10px'
                }}
                iconType="circle"
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        
        {/* Animated center text for simplified view */}
        {simplified && animationComplete && (
          <div className="chart-center-text">
            <div className="center-label">{t('emotionTrends.centerLabel', 'Emotions')}</div>
            <div className="center-count">{processedData.length}</div>
          </div>
        )}
      </div>
      
      {/* Enhanced explanation section */}
      {!simplified && !hideTitle && (
        <div className="emotion-explainer">
          <div className="explainer-header">
            <h4 className="explainer-title">{t('emotionTrends.explainerTitle', 'Understanding Your Emotional Patterns')}</h4>
            <div className="explainer-stats">
              <span className="stat-item">
                <strong>{processedData.length}</strong> {t('emotionTrends.emotionsTracked', 'emotions tracked')}
              </span>
              <span className="stat-divider">•</span>
              <span className="stat-item">
                <strong>{Math.round(processedData.reduce((sum, item) => sum + item.value, 0) * 100)}%</strong> {t('emotionTrends.intensity', 'intensity')}
              </span>
            </div>
          </div>
          <p className="explainer-text">
            {t('emotionTrends.explainerText', 'This visualization shows the intensity of emotions detected in your journal entries. The size of each segment represents how strongly that emotion appears in your writing.')}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionTrends;