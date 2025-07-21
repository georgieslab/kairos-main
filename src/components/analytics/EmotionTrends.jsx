<<<<<<< HEAD
// src/components/analytics/EmotionTrends.jsx - Enhanced Pie Chart Only Version

import React, { useState, useEffect } from 'react';
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
=======
// src/components/analytics/EmotionTrends.jsx - Improved version with better labels

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

/**
 * Visualizes emotional patterns in journal entries
 * @param {Array} data - Array of emotion objects with name and value properties
 * @param {boolean} simplified - Whether to show simplified view
 * @param {string} chartType - Type of chart to display (bar, pie, radar)
 * @param {boolean} hideTitle - Whether to hide the explanation title (to prevent duplication)
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
 * @param {boolean} isDarkMode - Whether the app is in dark mode
 */
const EmotionTrends = ({ 
  data = [], 
  simplified = false, 
<<<<<<< HEAD
  hideTitle = false,
  isDarkMode = true 
}) => {
  const [processedData, setProcessedData] = useState([]);
  const [isDataValid, setIsDataValid] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
=======
  chartType = 'bar', 
  hideTitle = false,
  isDarkMode = true // Default to dark mode 
}) => {
  const [processedData, setProcessedData] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [isDataValid, setIsDataValid] = useState(true);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  
  // Process and validate data when it changes
  useEffect(() => {
    const validateAndProcessData = () => {
<<<<<<< HEAD
=======
      // Check if data exists and has the right format
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      if (!data || !Array.isArray(data)) {
        console.error("EmotionTrends: Invalid data format, expected array");
        setIsDataValid(false);
        return [];
      }
      
<<<<<<< HEAD
      // Filter and process valid data
=======
      // Filter out invalid entries and ensure values are numbers
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      const validData = data.filter(item => (
        item && 
        typeof item === 'object' && 
        item.name && 
        typeof item.name === 'string' && 
        !isNaN(Number(item.value))
      )).map(item => ({
        name: item.name,
<<<<<<< HEAD
        value: Number(item.value),
        originalName: item.name
      }));
      
=======
        value: Number(item.value)
      }));
      
      // Check if we have valid data after filtering
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      if (validData.length === 0) {
        console.warn("EmotionTrends: No valid emotion data available");
        setIsDataValid(false);
        return [];
      }
      
<<<<<<< HEAD
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
=======
      // Sort data by value for consistent display
      return [...validData].sort((a, b) => b.value - a.value);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    };
    
    const processed = validateAndProcessData();
    setProcessedData(processed);
    setIsDataValid(processed.length > 0);
<<<<<<< HEAD
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
=======
  }, [data]);
  
  // If no data or invalid data, show a message
  if (!isDataValid || processedData.length === 0) {
    return (
      <div className="emotion-trends-no-data">
        <p>Not enough emotional data to visualize</p>
      </div>
    );
  }
  
  // Define emotion colors with semantic meaning
  const EMOTION_COLORS = {
    // Primary emotions - distinctive colors
    joy: '#4CAF50',      // Green - positive
    happiness: '#4CAF50', // Green - positive
    sadness: '#5C6BC0',  // Blue - calm sadness
    anger: '#F44336',    // Red - strong negative
    fear: '#FFC107',     // Yellow - alert
    disgust: '#9C27B0',  // Purple - aversion
    surprise: '#00BCD4', // Cyan - neutral alertness
    
    // Positive emotions - greens and blues
    calm: '#03A9F4',     // Light blue
    peace: '#03A9F4',    // Light blue
    trust: '#8BC34A',    // Light green
    anticipation: '#FF9800', // Orange
    content: '#26A69A',   // Teal
    grateful: '#66BB6A',  // Medium green
    gratitude: '#66BB6A', // Medium green
    love: '#E91E63',     // Pink
    confidence: '#4CAF50', // Green
    hope: '#00BCD4',     // Cyan
    curiosity: '#9C27B0', // Purple
    
    // Negative emotions - reds and yellows
    anxiety: '#FFB300',   // Amber
    frustrated: '#FF7043', // Deep orange
    worry: '#FFA726',     // Orange
    disappointing: '#7986CB', // Indigo
    stressed: '#FF5252',  // Red accent
    confusion: '#9E9E9E', // Grey
    
    // Default colors for any other emotions
    default: ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ffc658']
  };
  
  // Smart abbreviation mapping for emotions
  const EMOTION_ABBREVIATIONS = {
    'Joy': 'Joy',
    'Happiness': 'Happy',
    'Sadness': 'Sad',
    'Anger': 'Angry',
    'Fear': 'Fear',
    'Anxiety': 'Anxious',
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    'Love': 'Love',
    'Peace': 'Peace',
    'Calm': 'Calm',
    'Hope': 'Hope',
    'Trust': 'Trust',
<<<<<<< HEAD
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
=======
    'Gratitude': 'Grateful',
    'Grateful': 'Grateful',
    'Confidence': 'Confident',
    'Curiosity': 'Curious',
    'Surprise': 'Surprise',
    'Disgust': 'Disgust',
    'Anticipation': 'Eager',
    'Content': 'Content',
    'Frustration': 'Frustrated',
    'Stressed': 'Stressed',
    'Worry': 'Worried',
    'Confusion': 'Confused',
    'Overwhelmed': 'Overwhelm'
  };
  
  // Get color for an emotion
  const getEmotionColor = (emotion) => {
    const emotionKey = emotion.toLowerCase();
    return EMOTION_COLORS[emotionKey] || EMOTION_COLORS.default[0];
  };
  
  // Format the emotion name for display
  const formatEmotionName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // Get smart abbreviation for simplified view
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const getEmotionAbbreviation = (name) => {
    const formattedName = formatEmotionName(name);
    return EMOTION_ABBREVIATIONS[formattedName] || formattedName.substring(0, 5);
  };
  
<<<<<<< HEAD
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
            {percentage}% intensity
          </div>
          {data.isOthers && (
            <div className="emotion-tooltip-note">
              Combined smaller emotions
            </div>
          )}
=======
  // Enhanced custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{formatEmotionName(data.name)}</p>
          <p className="tooltip-value">{`${Math.round(data.value * 100)}%`}</p>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        </div>
      );
    }
    return null;
  };

<<<<<<< HEAD
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
            <div className="empty-icon">📊</div>
          </div>
          <p className="empty-message">Not enough emotional data to visualize</p>
          <p className="empty-submessage">Complete more journal entries to see your emotional patterns</p>
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
=======
  // Chart type selector component
  const ChartTypeSelector = () => {
    if (simplified) return null;
    
    return (
      <div className="chart-type-selector">
        <button 
          onClick={() => setSelectedChartType('bar')}
          className={`chart-type-button ${selectedChartType === 'bar' ? 'active' : ''}`}
        >
          Bar
        </button>
        <button 
          onClick={() => setSelectedChartType('pie')}
          className={`chart-type-button ${selectedChartType === 'pie' ? 'active' : ''}`}
        >
          Pie
        </button>
        <button 
          onClick={() => setSelectedChartType('radar')}
          className={`chart-type-button ${selectedChartType === 'radar' ? 'active' : ''}`}
        >
          Radar
        </button>
      </div>
    );
  };

  // Determine which visualization to render
  const renderChart = () => {
    // For simplified view, always use pie chart
    if (simplified) {
      return renderPieChart();
    }
    
    // Otherwise, render based on selected type
    switch(selectedChartType) {
      case 'pie':
        return renderPieChart();
      case 'radar':
        return renderRadarChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };
  
  // Bar chart rendering - limited to 6 emotions for clarity
  const renderBarChart = () => {
    // Limit to top 6 emotions for readability
    const chartData = processedData.slice(0, 6);
    
    return (
      <div className="emotion-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            barSize={30}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              opacity={0.2} 
              stroke={isDarkMode ? "#558b6e30" : "#558b6e20"} 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#9CAF88' : '#558b6e' }}
              tickFormatter={formatEmotionName}
              angle={-35}
              textAnchor="end"
              height={80}
              tickMargin={15}
            />
            <YAxis 
              tick={{ fill: isDarkMode ? '#9CAF88' : '#558b6e' }}
              domain={[0, 1]}
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              label={{ 
                value: 'Intensity', 
                angle: -90, 
                position: 'insideLeft', 
                fill: isDarkMode ? '#9CAF88' : '#558b6e',
                offset: -5
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationBegin={300}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getEmotionColor(entry.name)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Pie chart rendering - with improved labels for simplified view
  const renderPieChart = () => {
    // Limit to top 5 emotions to avoid clutter
    const chartData = processedData.slice(0, 5);
    
    // Custom label function for better readability
    const renderCustomLabel = ({ name, percent, value }) => {
      const percentage = (percent * 100).toFixed(0);
      
      if (simplified) {
        // For simplified view, show abbreviation with percentage
        const abbreviation = getEmotionAbbreviation(name);
        return `${abbreviation} ${percentage}%`;
      } else {
        // For full view, show full name
        return `${formatEmotionName(name)}`;
      }
    };
    
    return (
      <div className="emotion-chart-container">
        <ResponsiveContainer width="100%" height={simplified ? 200 : 300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={simplified ? 25 : 40}
              outerRadius={simplified ? 50 : 80}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              label={renderCustomLabel}
              labelLine={!simplified}
              animationDuration={1500}
              animationBegin={300}
              fontSize={simplified ? 10 : 12}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getEmotionColor(entry.name)} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {!simplified && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => formatEmotionName(value)}
                wrapperStyle={{ color: isDarkMode ? '#9CAF88' : '#558b6e' }}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
              />
            )}
          </PieChart>
        </ResponsiveContainer>
<<<<<<< HEAD
        
        {/* Animated center text for simplified view */}
        {simplified && animationComplete && (
          <div className="chart-center-text">
            <div className="center-label">Emotions</div>
            <div className="center-count">{processedData.length}</div>
          </div>
        )}
      </div>
      
      {/* Enhanced explanation section */}
      {!simplified && !hideTitle && (
        <div className="emotion-explainer">
          <div className="explainer-header">
            <h4 className="explainer-title">Understanding Your Emotional Patterns</h4>
            <div className="explainer-stats">
              <span className="stat-item">
                <strong>{processedData.length}</strong> emotions tracked
              </span>
              <span className="stat-divider">•</span>
              <span className="stat-item">
                <strong>{Math.round(processedData.reduce((sum, item) => sum + item.value, 0) * 100)}%</strong> intensity
              </span>
            </div>
          </div>
          <p className="explainer-text">
            This visualization shows the intensity of emotions detected in your journal entries.
            The size of each segment represents how strongly that emotion appears in your writing.
=======
      </div>
    );
  };
  
  // Radar chart rendering - limited to 6 emotions for clarity
  const renderRadarChart = () => {
    // Limit to top 6 emotions for readability
    const chartData = processedData.slice(0, 6);
    
    return (
      <div className="emotion-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke={isDarkMode ? "#558b6e30" : "#558b6e20"} />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#9CAF88' : '#558b6e' }}
              tickFormatter={formatEmotionName}
              fontSize={12}
            />
            <PolarRadiusAxis 
              angle={90}
              domain={[0, 1]} 
              tick={{ fill: isDarkMode ? '#9CAF88' : '#558b6e', fontSize: 10 }}
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              tickCount={5}
              axisLine={false}
            />
            <Radar 
              name="Emotions" 
              dataKey="value" 
              stroke="#558b6e" 
              fill="#558b6e" 
              fillOpacity={isDarkMode ? 0.5 : 0.3} 
              animationDuration={1500}
              animationBegin={300}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Main component render
  return (
    <div className="emotion-trends-container">
      <ChartTypeSelector />
      {renderChart()}
      
      {/* Only show explanation if hideTitle is false - this prevents duplication */}
      {!simplified && !hideTitle && (
        <div className="emotion-explainer">
          <h4 className="explainer-title">Understanding Your Emotional Patterns</h4>
          <p className="explainer-text">
            This visualization shows the intensity of emotions detected in your journal entries.
            Higher values indicate stronger presence of that emotion in your writing.
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionTrends;