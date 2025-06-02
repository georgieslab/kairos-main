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
 * @param {boolean} isDarkMode - Whether the app is in dark mode
 */
const EmotionTrends = ({ 
  data = [], 
  simplified = false, 
  chartType = 'bar', 
  hideTitle = false,
  isDarkMode = true // Default to dark mode 
}) => {
  const [processedData, setProcessedData] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [isDataValid, setIsDataValid] = useState(true);
  
  // Process and validate data when it changes
  useEffect(() => {
    const validateAndProcessData = () => {
      // Check if data exists and has the right format
      if (!data || !Array.isArray(data)) {
        console.error("EmotionTrends: Invalid data format, expected array");
        setIsDataValid(false);
        return [];
      }
      
      // Filter out invalid entries and ensure values are numbers
      const validData = data.filter(item => (
        item && 
        typeof item === 'object' && 
        item.name && 
        typeof item.name === 'string' && 
        !isNaN(Number(item.value))
      )).map(item => ({
        name: item.name,
        value: Number(item.value)
      }));
      
      // Check if we have valid data after filtering
      if (validData.length === 0) {
        console.warn("EmotionTrends: No valid emotion data available");
        setIsDataValid(false);
        return [];
      }
      
      // Sort data by value for consistent display
      return [...validData].sort((a, b) => b.value - a.value);
    };
    
    const processed = validateAndProcessData();
    setProcessedData(processed);
    setIsDataValid(processed.length > 0);
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
    'Love': 'Love',
    'Peace': 'Peace',
    'Calm': 'Calm',
    'Hope': 'Hope',
    'Trust': 'Trust',
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
  const getEmotionAbbreviation = (name) => {
    const formattedName = formatEmotionName(name);
    return EMOTION_ABBREVIATIONS[formattedName] || formattedName.substring(0, 5);
  };
  
  // Enhanced custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{formatEmotionName(data.name)}</p>
          <p className="tooltip-value">{`${Math.round(data.value * 100)}%`}</p>
        </div>
      );
    }
    return null;
  };

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
              />
            )}
          </PieChart>
        </ResponsiveContainer>
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
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionTrends;