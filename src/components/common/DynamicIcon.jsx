// src/components/common/DynamicIcon.jsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Dynamic icon component that loads Lucide icons by name
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Name of the Lucide icon
 * @param {string} props.className - CSS class to apply to the icon
 * @param {Object} props.style - Inline styles to apply to the icon
 * @param {Object} props.rest - Any other props to pass to the icon component
 * @returns {React.Component} - The rendered icon
 */
const DynamicIcon = ({ name, className, style, ...rest }) => {
  // Handle the case where no name is provided
  if (!name) {
    // Use Book as default icon
    return <LucideIcons.Book className={className} style={style} {...rest} />;
  }
  
  // Get the icon component from Lucide
  const IconComponent = LucideIcons[name];
  
  // If the icon doesn't exist, provide a fallback
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons. Using Book as fallback.`);
    return <LucideIcons.Book className={className} style={style} {...rest} />;
  }
  
  // Render the icon component
  return <IconComponent className={className} style={style} {...rest} />;
};

export default DynamicIcon;