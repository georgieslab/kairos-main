// src/components/journey/JourneyPreview.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Heart, Brain, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { getJourneyPath } from '../../data/JourneyData';
import JourneyDisclaimerModal from '../paths/components/JourneyDisclaimerModal';
import {
  PATHS,
  getUserPathProgress,
  getNextDayForPath
} from '../../utils/userProgress';

const JourneyPreview = ({ pathId = 'self-discovery', onStart }) => {
  const { t } = useTranslation('journey');
  const { userProfile } = useAuth();
  const { navigateToScreen } = useNavigation();
  const { canAccessPremiumPath } = useSubscription();
  const [pathProgress, setPathProgress] = useState(null);
  const [nextDay, setNextDay] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pathData, setPathData] = useState(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  
  // TEST MODAL STATE
  const [showTestModal, setShowTestModal] = useState(false);

  useEffect(() => {
    const loadPathData = async () => {
      try {
        const path = getJourneyPath(pathId);
        console.log('JourneyPreview: Path loaded', { pathId, isPremium: path.isPremium, title: path.title });
        setPathData(path);

        if (path.isPremium) {
          const access = await canAccessPremiumPath(pathId);
          console.log('JourneyPreview: Premium access check', { pathId, access });
          setHasAccess(access);
        } else {
          console.log('JourneyPreview: Non-premium path, granting access');
          setHasAccess(true);
        }
      } catch (error) {
        console.error(`JourneyPreview: Error loading path ${pathId}:`, error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    loadPathData();
  }, [pathId, canAccessPremiumPath]);

  const handleStartJourney = () => {
    console.log('JourneyPreview: handleStartJourney', {
      pathId,
      isChecking,
      isPremium: pathData?.isPremium,
      hasAccess,
      pathTitle: pathData?.title
    });

    if (isChecking) {
      console.log('JourneyPreview: Still checking access, exiting');
      return;
    }

    if (pathData?.isPremium) {
      console.log('JourneyPreview: Found premium path', {
        isPremium: pathData.isPremium,
        hasAccess
      });
      
      if (!hasAccess) {
        console.log('JourneyPreview: Access denied, showing subscription modal', {
          pathId,
          pathName: pathData.title
        });
        
        // TEST: Just show our test modal directly
        setShowTestModal(true);
        return;
        
        // Original code - commented out for testing
        // navigateToScreen('subscription', {
        //   pathId: pathId,
        //   pathName: pathData.title
        // });
        // return;
      } else {
        console.log('JourneyPreview: Access granted for premium path');
      }
    }

    console.log('JourneyPreview: Proceeding with journey');
    if (pathId === 'transformation-journey') {
      console.log('JourneyPreview: Showing confirmation for transformation-journey');
      setShowConfirmation(true);
    } else {
      console.log('JourneyPreview: Calling onStart');
      if (typeof onStart === 'function') {
        onStart();
      } else {
        console.error('JourneyPreview: onStart is not a function', onStart);
      }
    }
  };

  const getPathInfo = () => {
    const path = getJourneyPath(pathId);
    const defaultInfo = {
      name: path.title || t('journeyPreview.selfDiscovery.name', 'Self-Discovery Journey'),
      description: path.description || t('journeyPreview.selfDiscovery.description', 'Explore your core values, beliefs, and aspirations through guided reflection prompts designed to deepen your self-understanding.'),
      icon: Compass,
      benefits: [
        t('journeyPreview.selfDiscovery.benefit1', 'Gain clarity on personal values and priorities'),
        t('journeyPreview.selfDiscovery.benefit2', 'Develop greater self-awareness'),
        t('journeyPreview.selfDiscovery.benefit3', 'Identify patterns in your thoughts and behaviors'),
        t('journeyPreview.selfDiscovery.benefit4', 'Build a consistent journaling practice')
      ],
      days: path.duration || 10
    };

    switch (pathId) {
      case 'transformation-journey':
        return {
          ...defaultInfo,
          name: t('journeyPreview.transformation.name', 'Transformation Journey: Breaking Patterns'),
          description: t('journeyPreview.transformation.description', 'This extended journey helps you understand, address, and transform challenging patterns in your life through awareness, strategy-building, and sustainable change practices.'),
          icon: Brain,
          benefits: [
            t('journeyPreview.transformation.benefit1', 'Identify and understand deep-rooted patterns'),
            t('journeyPreview.transformation.benefit2', 'Develop strategies for lasting change'),
            t('journeyPreview.transformation.benefit3', 'Create healthier habits and responses'),
            t('journeyPreview.transformation.benefit4', 'Transform limiting beliefs and behaviors')
          ],
          days: 21
        };
      case 'emotional-intelligence':
        return {
          ...defaultInfo,
          name: t('journeyPreview.emotionalIntelligence.name', 'Emotional Intelligence Expedition'),
          description: t('journeyPreview.emotionalIntelligence.description', 'Develop greater awareness and mastery of your emotional landscape through structured journaling exercises.'),
          icon: Heart,
          benefits: [
            t('journeyPreview.emotionalIntelligence.benefit1', 'Recognize and name complex emotions'),
            t('journeyPreview.emotionalIntelligence.benefit2', 'Understand emotional triggers and patterns'),
            t('journeyPreview.emotionalIntelligence.benefit3', 'Develop healthier emotional responses'),
            t('journeyPreview.emotionalIntelligence.benefit4', 'Improve relationships through emotional awareness')
          ],
          days: 10
        };
      case 'mindfulness-awareness':
        return {
          ...defaultInfo,
          name: t('journeyPreview.mindfulness.name', 'Mindfulness & Present Awareness'),
          description: t('journeyPreview.mindfulness.description', 'Learn to be more present and mindful through daily journaling practices focused on sensory awareness and thought observation.'),
          icon: Brain,
          benefits: [
            t('journeyPreview.mindfulness.benefit1', 'Reduce anxiety about the past and future'),
            t('journeyPreview.mindfulness.benefit2', 'Enhance sensory awareness'),
            t('journeyPreview.mindfulness.benefit3', 'Develop focused attention'),
            t('journeyPreview.mindfulness.benefit4', 'Find peace in the present moment')
          ],
          days: 10
        };
      case 'life-vision':
        return {
          ...defaultInfo,
          name: t('journeyPreview.lifeVision.name', 'Life Vision'),
          description: t('journeyPreview.lifeVision.description', 'Craft a clear vision for your future through guided reflections on your goals, values, and aspirations.'),
          icon: Compass,
          benefits: [
            t('journeyPreview.lifeVision.benefit1', 'Define long-term goals and aspirations'),
            t('journeyPreview.lifeVision.benefit2', 'Align actions with core values'),
            t('journeyPreview.lifeVision.benefit3', 'Create a roadmap for personal growth'),
            t('journeyPreview.lifeVision.benefit4', 'Enhance motivation and purpose')
          ],
          days: 100
        };
      default:
        return defaultInfo;
    }
  };

  const getIconComponent = () => {
    const pathInfo = getPathInfo();
    const IconComponent = pathInfo.icon;
    return <IconComponent className="journey-icon" />;
  };

  useEffect(() => {
    if (userProfile) {
      const progress = getUserPathProgress(userProfile, pathId);
      setPathProgress(progress);

      const calculatedNextDay = getNextDayForPath(userProfile, pathId);
      setNextDay(calculatedNextDay);

      console.log('JourneyPreview: Path progress', { pathId, nextDay: calculatedNextDay, progress });
    }
  }, [userProfile, pathId]);

  const handleConfirmation = () => {
    console.log('JourneyPreview: Confirmation accepted for transformation-journey');
    setShowConfirmation(false);
    setTimeout(() => {
      console.log('JourneyPreview: Calling onStart after confirmation');
      if (typeof onStart === 'function') {
        onStart();
      } else {
        console.error('JourneyPreview: onStart is not a function', onStart);
      }
    }, 100);
  };

  const handleCancelConfirmation = () => {
    console.log('JourneyPreview: Confirmation cancelled');
    setShowConfirmation(false);
  };

  const hasStarted = pathProgress?.completedDays?.length > 0;
  const pathInfo = getPathInfo();
  const totalDays = pathInfo.days || 10;

  if (isChecking) {
    return <div>{t('journeyPreview.loading', 'Loading...')}</div>;
  }

  return (
    <div className="journey-preview-container">
      {/* TEST BUTTON FOR SUBSCRIPTION MODAL */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <button 
          onClick={() => setShowTestModal(true)}
          style={{ 
            background: 'red', 
            color: 'white', 
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          TEST MODAL
        </button>
      </div>

      <div className="journey-header">
        <div className="journey-icon-container">
          {getIconComponent()}
        </div>
        <h1 className="journey-title">{pathInfo.name}</h1>
        <p className="journey-subtitle">{t('journeyPreview.dayExperience', '{{days}}-day guided journaling experience', { days: totalDays })}</p>
      </div>

      <div className="journey-description">
        <h2 className="section-title">{t('journeyPreview.whatToExpect', 'What to Expect')}</h2>
        <p className="description-text">{pathInfo.description}</p>
      </div>

      <div className="journey-benefits">
        <h2 className="section-title">{t('journeyPreview.benefits', 'Benefits')}</h2>
        <ul className="benefits-list">
          {pathInfo.benefits.map((benefit, index) => (
            <li key={index} className="benefit-item">
              <Check className="benefit-check" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="journey-days">
        <h2 className="section-title">{t('journeyPreview.yourDayJourney', 'Your {{days}}-Day Journey', { days: totalDays })}</h2>
        <div className="days-preview">
          {[...Array(Math.min(totalDays, 10))].map((_, i) => {
            const day = i + 1;
            return (
              <div
                key={day}
                className={`day-circle ${pathProgress?.completedDays?.includes(day) ? 'completed' : ''} ${day === nextDay ? 'next' : ''}`}
              >
                {day}
              </div>
            );
          })}
          {totalDays > 10 && <div className="day-ellipsis">...</div>}
        </div>
        <p className="days-explanation">
          {hasStarted
            ? t('journeyPreview.onDayContinue', "You're on day {{day}} of your {{name}}. Continue your journey!", { day: nextDay, name: pathInfo.name })
            : t('journeyPreview.eachDayBuilds', 'Each day builds upon the previous, guiding you through a structured {{days}}-day reflection experience.', { days: totalDays })}
        </p>
      </div>

      <button className="start-button" onClick={handleStartJourney}>
        {hasStarted ? t('journeyPreview.continueToDay', 'Continue to Day {{day}}', { day: nextDay }) : t('journeyPreview.beginYourJourney', 'Begin Your Journey')}
        <ArrowRight className="start-icon" />
      </button>

      {/* The Transformation Journey is explicitly about substance and
          behavioural patterns. This used to show a generic commitment dialog
          ("are you ready to commit to 21 days?") while JourneyDisclaimerModal
          — which carries the actual safety language and the SAMHSA, AA and
          SMART Recovery contacts — existed, was translated into all three
          languages, and was rendered by nothing. The disclaimer is the gate
          now; it already asks for the same commitment via its
          "I Understand & Want to Begin" action. */}
      {showConfirmation && (
        <JourneyDisclaimerModal
          onAccept={handleConfirmation}
          onCancel={handleCancelConfirmation}
        />
      )}

      {/* TEST MODAL (SIMPLE VERSION) */}
      {showTestModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-white">
            <h2 className="text-xl font-bold mb-4">Premium Subscription Required</h2>
            <p className="mb-4">The {pathData?.title || 'Premium Journey'} requires a subscription.</p>
            
            <div className="border border-gray-700 rounded-lg p-4 my-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Monthly</h3>
                <span className="text-xl font-bold">€11.99</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Billed monthly</p>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4 my-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Yearly</h3>
                <span className="text-xl font-bold">€111.99</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Save 17%</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPreview;