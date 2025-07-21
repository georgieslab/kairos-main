// src/components/paths/VirtualPathGrid.jsx
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';

const VirtualPathGrid = ({ 
  paths, 
  renderPathCard, 
  viewMode,
  isMobile 
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
  
  // Calculate grid dimensions
  const CARD_WIDTH = isMobile ? 340 : 280;
  const CARD_HEIGHT = viewMode === 'list' ? 120 : 320;
  const GAP = 16;
  
  // Calculate columns based on container width
  const columnCount = Math.max(1, Math.floor((dimensions.width + GAP) / (CARD_WIDTH + GAP)));
  const rowCount = Math.ceil(paths.length / columnCount);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.min(height, window.innerHeight - 200) });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Cell renderer
  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= paths.length) return null;
    
    const path = paths[index];
    
    return (
      <div 
        style={{
          ...style,
          padding: GAP / 2,
        }}
      >
        {renderPathCard(path)}
      </div>
    );
  }, [paths, columnCount, renderPathCard]);
  
  if (paths.length === 0) return null;
  
  return (
    <div ref={containerRef} style={{ width: '100%', height: '600px' }}>
      {dimensions.width > 0 && (
        <Grid
          columnCount={columnCount}
          columnWidth={CARD_WIDTH + GAP}
          height={dimensions.height}
          rowCount={rowCount}
          rowHeight={CARD_HEIGHT + GAP}
          width={dimensions.width}
          overscanRowCount={2}
          overscanColumnCount={1}
        >
          {Cell}
        </Grid>
      )}
    </div>
  );
};

export default VirtualPathGrid;