// src/components/analytics/ThemeCloud.jsx – Apple Spatial Glass with forced variation
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, TrendingUp, Brain } from 'lucide-react';
import './ThemeCloud.css';

const ThemeCloud = ({
  data = [],
  simplified = false,
  isDarkMode = true,
  pathColor = '85, 139, 110'
}) => {
  const { t } = useTranslation('analytics');
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [processedWords, setProcessedWords] = useState([]);
  const [isCalculating, setIsCalculating] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Update dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.max(rect.width, 280),
        height: simplified ? 200 : 320
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [simplified]);

  // Enhanced colour & size scaling with guaranteed variation
  const getIntensity = (value, minVal, maxVal) => {
    if (maxVal === minVal) {
      // If all values equal, create pseudo intensity based on index or value string
      return 0.3 + (value % 7) / 10; // gives range 0.3-0.9
    }
    return (value - minVal) / (maxVal - minVal);
  };

  const getThemeColor = (value, minVal, maxVal) => {
    let intensity = getIntensity(value, minVal, maxVal);
    if (intensity > 0.75) return `rgba(var(--path-color, ${pathColor}), 0.95)`;
    if (intensity > 0.5) return `rgba(var(--path-color, ${pathColor}), 0.75)`;
    if (intensity > 0.25) return `rgba(var(--path-color, ${pathColor}), 0.55)`;
    return `rgba(var(--path-color, ${pathColor}), 0.35)`;
  };

  const getFontWeight = (value, minVal, maxVal) => {
    let intensity = getIntensity(value, minVal, maxVal);
    if (intensity > 0.75) return 800;
    if (intensity > 0.5) return 700;
    if (intensity > 0.25) return 600;
    return 500;
  };

  // Position calculation
  const calculatePositions = useMemo(() => {
    if (!data.length || !dimensions.width || !dimensions.height) return [];
    setIsCalculating(true);

    const limited = simplified ? data.slice(0, 16) : data.slice(0, 30);
    const values = limited.map(d => d.value);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    const containerSize = Math.min(dimensions.width, dimensions.height);
    const minFont = Math.max(simplified ? 12 : 14, containerSize * 0.03);
    const maxFont = Math.min(simplified ? 26 : 36, containerSize * 0.09);

    // Prepare words with estimated sizes
    const words = limited.map(item => {
      const intensity = getIntensity(item.value, minVal, maxVal);
      const fontSize = minFont + intensity * (maxFont - minFont);
      const avgCharWidth = fontSize * 0.55;
      return {
        text: item.text,
        value: item.value,
        fontSize: Math.round(fontSize),
        width: Math.ceil(item.text.length * avgCharWidth),
        height: Math.ceil(fontSize * 1.2),
        intensity,
      };
    }).sort((a,b) => b.value - a.value);

    const placed = [];
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const padding = 8;

    if (words.length) {
      placed.push({ ...words[0], x: centerX, y: centerY, rotation: 0 });
    }

    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      let angle = 0;
      let radius = w.height;
      let placedObj = null;
      let attempts = 0;
      const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.45;

      while (!placedObj && attempts < 800) {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const within = x - w.width/2 > padding && x + w.width/2 < dimensions.width - padding &&
                       y - w.height/2 > padding && y + w.height/2 < dimensions.height - padding;
        if (within) {
          const collides = placed.some(p => {
            const dx = Math.abs(p.x - x);
            const dy = Math.abs(p.y - y);
            const minDx = (w.width + p.width)/2 + padding;
            const minDy = (w.height + p.height)/2 + padding;
            return dx < minDx && dy < minDy;
          });
          if (!collides) {
            placedObj = { ...w, x, y, rotation: (Math.random() - 0.5) * (w.intensity > 0.6 ? 8 : 20) };
          }
        }
        angle += 0.2;
        radius += 0.8;
        if (radius > maxRadius) break;
        attempts++;
      }
      if (placedObj) placed.push(placedObj);
      else {
        // fallback to edge
        const edgeX = padding + w.width/2;
        const edgeY = padding + (i * (w.height + padding));
        if (edgeY < dimensions.height - padding) {
          placed.push({ ...w, x: edgeX, y: edgeY, rotation: 0 });
        }
      }
    }
    setTimeout(() => setIsCalculating(false), 80);
    return placed;
  }, [data, dimensions, simplified]);

  useEffect(() => {
    setProcessedWords(calculatePositions);
  }, [calculatePositions]);

  const handleWordClick = (word, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedWord(word);
    setTooltipPos({ x: rect.left + rect.width/2, y: rect.top - 10 });
    setTimeout(() => setSelectedWord(null), 3000);
  };

  if (!data.length) {
    return (
      <div className="glass-card empty-cloud">
        <AlertCircle size={32} />
        <p>{t('themeCloud.emptyState', 'Write more entries to see your themes')}</p>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  return (
    <div 
      className="theme-cloud-glass" 
      ref={containerRef}
      style={{ '--path-color': pathColor }}
    >
      {isCalculating && (
        <div className="glass-loading-overlay">
          <div className="glass-spinner" />
          <span>{t('themeCloud.organising', 'Organising themes...')}</span>
        </div>
      )}
      <svg width="100%" height="100%" className="cloud-svg" style={{ opacity: isCalculating ? 0.3 : 1 }}>
        {processedWords.map((word, idx) => (
          <g
            key={idx}
            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotation})`}
            className="cloud-word"
            onClick={(e) => handleWordClick(word, e)}
            style={{ cursor: 'pointer' }}
          >
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={word.fontSize}
              fontWeight={getFontWeight(word.value, minVal, maxVal)}
              fill={getThemeColor(word.value, minVal, maxVal)}
              className="cloud-word-text"
            >
              {word.text}
            </text>
          </g>
        ))}
      </svg>

      {!simplified && (
        <div className="glass-card legend-card">
          <div className="legend-header">
            <TrendingUp size={16} />
            <span>{t('themeCloud.frequency', 'Theme frequency')}</span>
          </div>
          <div className="legend-swatches">
            <div className="legend-swatch">
              <span className="swatch" style={{ backgroundColor: getThemeColor(maxVal, minVal, maxVal) }} />
              <span>{t('themeCloud.mostFrequent', 'Most frequent')}</span>
            </div>
            <div className="legend-swatch">
              <span className="swatch" style={{ backgroundColor: getThemeColor((maxVal+minVal)/2, minVal, maxVal) }} />
              <span>{t('themeCloud.moderate', 'Moderate')}</span>
            </div>
            <div className="legend-swatch">
              <span className="swatch" style={{ backgroundColor: getThemeColor(minVal, minVal, maxVal) }} />
              <span>{t('themeCloud.lessFrequent', 'Less frequent')}</span>
            </div>
          </div>
        </div>
      )}

      {!simplified && (
        <div className="glass-card explanation-card">
          <Brain size={16} />
          <div>
            <strong>{t('themeCloud.explanationTitle', 'Your journal themes')}</strong>
            <p>{t('themeCloud.explanationText', 'Larger, bolder words appear more often in your entries – they reveal what matters most.')}</p>
          </div>
        </div>
      )}

      {selectedWord && (
        <div className="glass-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          <strong>{selectedWord.text}</strong>
          <span>{t('themeCloud.appearsTimes', 'Appears {{count}} times', { count: selectedWord.value })}</span>
        </div>
      )}
    </div>
  );
};

export default ThemeCloud;