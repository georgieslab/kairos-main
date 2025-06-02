// src/components/mockups/AICoachingMockup.jsx

import React, { useState, useEffect } from 'react';
import '../../styles/components/mockups/AICoachingMockup.css';

const AICoachingMockup = () => {
  // States for animations and interactions
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Sample conversation
  const conversation = [
    { 
      type: 'system', 
      content: 'Conversation with your Καιρός AI Coach',
      timestamp: '12:30 PM'
    },
    {
      type: 'ai',
      content: 'I noticed in your recent entries that you mentioned feeling anxious about your upcoming presentation. Would you like to explore some strategies that might help?',
      timestamp: '12:31 PM'
    },
    {
      type: 'user',
      content: 'Yes, I think that would be helpful. I\'ve been struggling with preparing for it.',
      timestamp: '12:32 PM'
    },
    {
      type: 'ai',
      content: 'I understand. From your entries, I can see that you tend to focus on what could go wrong rather than your strengths. Let\'s try a different approach - what specific aspects of your presentation do you feel most confident about?',
      timestamp: '12:33 PM'
    }
  ];
  
  // Typing animation effect
  useEffect(() => {
    if (messageIndex < conversation.length) {
      const currentMsg = conversation[messageIndex];
      
      if (currentMsg.type === 'ai') {
        setIsTyping(true);
        
        let i = 0;
        const typingInterval = setInterval(() => {
          if (i <= currentMsg.content.length) {
            setCurrentMessage(currentMsg.content.substring(0, i));
            i++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            
            // Add delay before showing next message
            setTimeout(() => {
              setMessageIndex(prevIndex => prevIndex + 1);
            }, 1000);
          }
        }, 30);
        
        return () => clearInterval(typingInterval);
      } else {
        // For non-AI messages, just show them immediately
        setCurrentMessage('');
        setIsTyping(false);
        
        setTimeout(() => {
          setMessageIndex(prevIndex => prevIndex + 1);
        }, 800);
      }
    }
  }, [messageIndex]);
  
  return (
    <div className="coaching-mockup-container">
      <div className="coaching-mockup-phone">
        <div className="coaching-mockup-screen">
          {/* App Header */}
          <div className="coaching-header">
            <div className="coaching-back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="coaching-title">AI Coach</div>
            <div className="coaching-call-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Conversation Area */}
          <div className="coaching-conversation">
            {conversation.slice(0, messageIndex).map((message, index) => (
              <div 
                key={index} 
                className={`coaching-message ${message.type}-message`}
              >
                {message.type === 'ai' && (
                  <div className="coaching-avatar">
                    <div className="avatar-inner">K</div>
                  </div>
                )}
                
                <div className="message-content">
                  {message.type === 'system' ? (
                    <div className="system-message-inner">{message.content}</div>
                  ) : (
                    <>
                      <div className="message-bubble">
                        {index === messageIndex - 1 && message.type === 'ai' && isTyping 
                          ? currentMessage 
                          : message.content
                        }
                        {index === messageIndex - 1 && message.type === 'ai' && isTyping && (
                          <span className="typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </span>
                        )}
                      </div>
                      <div className="message-time">{message.timestamp}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="coaching-input-area">
            <div className="coaching-input-container">
              <button className="coaching-mic-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <input 
                type="text" 
                className="coaching-text-input" 
                placeholder="Message your AI coach..." 
              />
              
              <button className="coaching-send-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="coaching-suggestion-chips">
              <button className="coaching-chip">Tell me more</button>
              <button className="coaching-chip">Preparation tips</button>
              <button className="coaching-chip">How to reduce anxiety</button>
            </div>
          </div>
          
          {/* Bottom Navigation Hint */}
          <div className="coaching-bottom-nav-hint">
            <div className="coaching-nav-pill"></div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements for Decoration */}
      <div className="coaching-floating-element bubble-1"></div>
      <div className="coaching-floating-element bubble-2"></div>
      <div className="coaching-floating-element bubble-3"></div>
    </div>
  );
};

export default AICoachingMockup;