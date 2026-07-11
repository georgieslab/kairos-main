import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lock, 
  Briefcase, 
  Paintbrush, 
  Leaf, 
  Coins, 
  Moon, 
  Sparkles, 
  Scale, 
  Zap, 
  Calendar, 
  Heart,
  Star,
} from 'lucide-react';

const PremiumPathsSection = () => {
  const { t } = useTranslation('paths');
  const premiumPaths = [
    {
      id: 'relationship-mastery',
      title: 'Relationship Mastery',
      subtitle: '30-day interpersonal journey',
      description: "Develop deeper connections through communication, empathy, and boundary-setting practices for healthier, more fulfilling relationships.",
      color: '220, 38, 38', // Red
      icon: Heart,
      difficulty: 'Advanced',
      duration: 30
    },
    {
      id: 'career-vision',
      title: 'Career Vision & Purpose',
      subtitle: '21-day professional path',
      description: "Align your work with your values, identify your unique professional gifts, and design a career path with both meaning and impact.",
      color: '79, 70, 229', // Indigo
      icon: Briefcase,
      difficulty: 'Intermediate',
      duration: 21
    },
    {
      id: 'creative-awakening',
      title: 'Creative Awakening',
      subtitle: '14-day artistic exploration',
      description: "Reconnect with your creative spirit, overcome blocks, and establish a sustainable creative practice that brings joy and expression.",
      color: '217, 70, 239', // Fuchsia
      icon: Paintbrush,
      difficulty: 'Beginner',
      duration: 14
    },
    {
      id: 'spiritual-discovery',
      title: 'Spiritual Discovery',
      subtitle: '28-day contemplative journey',
      description: "Explore life's deeper questions, connect with your sense of purpose, and develop practices for greater presence and meaning.",
      color: '14, 165, 233', // Sky blue
      icon: Leaf,
      difficulty: 'Intermediate',
      duration: 28
    },
    {
      id: 'financial-mindfulness',
      title: 'Financial Mindfulness',
      subtitle: '21-day money relationship journey',
      description: "Transform your relationship with money by examining beliefs, patterns, and developing a mindful approach to resources and wealth.",
      color: '234, 179, 8', // Yellow
      icon: Coins,
      difficulty: 'Intermediate',
      duration: 21
    },
    {
      id: 'deep-sleep',
      title: 'Deep Sleep & Rest',
      subtitle: '14-day sleep restoration',
      description: "Improve your sleep quality through reflection on habits, environment, and mental patterns that affect your rest and recovery.",
      color: '55, 48, 163', // Indigo
      icon: Moon,
      difficulty: 'Beginner',
      duration: 14
    },
    {
      id: 'shadow-integration',
      title: 'Shadow Integration',
      subtitle: '30-day psychological journey',
      description: "Explore and integrate the hidden aspects of yourself for greater wholeness, authenticity, and freedom from limiting patterns.",
      color: '168, 85, 247', // Purple
      icon: Sparkles,
      difficulty: 'Advanced',
      duration: 30
    },
    {
      id: 'decision-mastery',
      title: 'Decision Mastery',
      subtitle: '21-day clarity framework',
      description: "Develop a personal framework for making more confident, aligned decisions through value clarification and mental models.",
      color: '5, 150, 105', // Emerald
      icon: Scale,
      difficulty: 'Intermediate',
      duration: 21
    }
  ];

  // Get difficulty icon
  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return <Zap size={16} />;
      case 'Intermediate':
        return <Zap size={16} />;
      case 'Advanced':
        return <Star size={16} />;
      default:
        return <Zap size={16} />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'rgb(14, 165, 233)'; // Sky blue
      case 'Intermediate':
        return 'rgb(168, 85, 247)'; // Purple
      case 'Advanced':
        return 'rgb(220, 38, 38)'; // Red
      default:
        return 'rgb(14, 165, 233)';
    }
  };

  return (
    <div className="path-section">
      <h2 className="section-title upcoming">
        {t('premiumSection.title', 'Premium Journeys')}
        <span className="text-sm text-gray-400 ml-2 font-normal">{t('premiumSection.comingSoon', '(Coming Soon)')}</span>
      </h2>
      
      <div className="path-grid">
        {premiumPaths.map(path => (
          <div
            key={path.id}
            className="path-card premium"
            style={{
              borderLeft: `4px solid rgb(${path.color})`
            }}
          >
            {/* Single Premium Badge */}
            <div 
              className="premium-badge"
              style={{
                backgroundColor: `rgba(${path.color}, 0.15)`,
                color: `rgb(${path.color})`
              }}
            >
              {t('premiumSection.premiumBadge', 'Premium')}
            </div>
            
            <div className="path-card-header">
              <div
                className="path-icon-wrapper"
                style={{
                  backgroundColor: `rgba(${path.color}, 0.2)`,
                  color: `rgb(${path.color})`
                }}
              >
                <path.icon className="path-icon" />
              </div>
              
              <div className="path-title-container">
                <h3 className="path-card-title">{path.title}</h3>
                <p className="path-card-subtitle">{path.subtitle}</p>
              </div>
            </div>
            
            <p className="path-card-description">{path.description}</p>
            
            <div className="path-card-metadata">
              <div className="flex items-center text-sm"
                style={{ color: getDifficultyColor(path.difficulty) }}>
                {getDifficultyIcon(path.difficulty)}
                <span className="ml-1">{path.difficulty}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {t('premiumSection.durationDays', '{{count}} days', { count: path.duration })}
              </div>
            </div>
            
            <div 
              className="locked-indicator"
              style={{
                backgroundColor: `rgba(${path.color}, 0.1)`,
                color: `rgb(${path.color})`,
                border: `1px solid rgba(${path.color}, 0.2)`
              }}
            >
              <Lock className="lock-icon" />
              <span>{t('premiumSection.lockedText', 'Available with premium subscription')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumPathsSection;