// src/components/journey/AnalysisLoading.jsx - Enhanced version

import React, { useEffect, useState, useRef } from 'react';
import '../../styles/components/analysisLoading.css';

/**
 * Enhanced AnalysisLoading component with particles and dynamic messages
 * @param {Object} props Component props
 * @param {number} props.progress Loading progress percentage (0-100)
 */
const AnalysisLoading = ({ progress = 0 }) => {
  const [currentState, setCurrentState] = useState(0);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const particleCount = 12;
  
  // Enhanced loading messages for a more engaging experience
  const states = [
    'Processing your journal entry...',
    'Identifying key themes and emotional patterns...',
    'Analyzing your writing style and content...',
    'Generating personalized insights just for you...',
    'Creating meaningful reflections based on your writing...',
    'Connecting your thoughts to your journey themes...',
    'Almost there! Finalizing your analysis...'
  ];
  
  // Initialize particles
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create particles on mount
    createParticles();
    
    // Cleanup on unmount
    return () => {
      particlesRef.current.forEach(particle => {
        if (particle.element && particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      particlesRef.current = [];
    };
  }, []);
  
  // Create animated particles
  const createParticles = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    // Remove any existing particles
    particlesRef.current.forEach(particle => {
      if (particle.element && particle.element.parentNode) {
        particle.element.parentNode.removeChild(particle.element);
      }
    });
    
    particlesRef.current = [];
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      // Create particle element
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 3px and 6px
      const size = Math.random() * 3 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position within the container
      const x = Math.random() * containerRect.width;
      const y = Math.random() * containerRect.height;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random opacity
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      
      // Random animation duration between 10s and 20s
      const duration = Math.random() * 10 + 10;
      particle.style.animation = `floatParticle ${duration}s infinite ease-in-out`;
      
      // Add animation delay
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      // Add to container
      container.appendChild(particle);
      
      // Store reference to particle
      particlesRef.current.push({
        element: particle,
        x,
        y,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      });
    }
    
    // Add keyframe animation to the document if it doesn't exist
    if (!document.getElementById('particle-animation')) {
      const style = document.createElement('style');
      style.id = 'particle-animation';
      style.innerHTML = `
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px);
          }
          50% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px);
          }
          75% {
            transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px);
          }
        }
      `;
      document.head.appendChild(style);
    }
  };
  
  // Animate particles
  useEffect(() => {
    const animateInterval = setInterval(() => {
      particlesRef.current.forEach(particle => {
        if (!particle.element) return;
        
        // Smooth random movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Change direction occasionally
        if (Math.random() < 0.05) {
          particle.speedX = Math.random() * 0.5 - 0.25;
          particle.speedY = Math.random() * 0.5 - 0.25;
        }
        
        particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      });
    }, 50);
    
    return () => clearInterval(animateInterval);
  }, []);
  
  // Change state every 4 seconds for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % states.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate a more realistic loading progress
  const calculatedProgress = progress > 0 ? progress : Math.min(70 + Math.random() * 10, 95);
  
  // Get appropriate status message based on progress
  const getProcessingStatus = () => {
    if (calculatedProgress < 30) return 'Initializing analysis...';
    if (calculatedProgress < 60) return 'Processing text and extracting patterns...';
    if (calculatedProgress < 85) return 'Generating insights and recommendations...';
    return 'Almost complete, finalizing your results...';
  };
  
  return (
    <div className="analysis-loading-container" ref={containerRef}>
      <div className="analysis-loading-content">
        <div className="loader-wrapper">
          {/* Kairos Loader Elements */}
          <div className="kairos-loader-mini">
            <div className="orb-wrapper">
              <div className="center">
                <div className="ball"></div>
                <div className="blubb-1"></div>
                <div className="blubb-2"></div>
                <div className="blubb-3"></div>
                <div className="blubb-4"></div>
                <div className="blubb-5"></div>
                <div className="blubb-6"></div>
                <div className="sparkle-1"></div>
                <div className="sparkle-2"></div>
                <div className="sparkle-3"></div>
                <div className="sparkle-4"></div>
                <div className="sparkle-5"></div>
                <div className="sparkle-6"></div>
                <div className="sparkle-7"></div>
                <div className="sparkle-8"></div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="analysis-loading-title">Generating Personalized Insights</h2>
        <p className="analysis-loading-message">{states[currentState]}</p>
        
        <div className="progress-container progress-active">
          <div 
            className="progress-bar" 
            style={{ width: `${calculatedProgress}%` }}
          ></div>
        </div>
        
        <div className="processing-status">
          {getProcessingStatus()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;