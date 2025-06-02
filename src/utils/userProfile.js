// src/components/auth/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigation } from '../../contexts/NavigationContext';
import { ChevronRight, Award, Book, Calendar, Clock, User, Edit2, Image, Download, MapPin } from 'lucide-react';
import DynamicIcon from '../common/DynamicIcon';
import { exportJourneyToPDF, downloadFile } from '../../services/exportService';

const UserProfile = ({ onNext, navigateToScreen }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [updatedProfile, setUpdatedProfile] = useState({
    displayName: '',
    age: '',
    journalingGoals: '',
    city: '', // Add city field
    profileImage: null
  });
  const [loading, setLoading] = useState(false);
  const [journeyStats, setJourneyStats] = useState({
    completedJourneys: [],
    totalEntries: 0,
    longestStreak: 0
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [cityInputRef] = useState(React.createRef());
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  
  const navigation = useNavigation ? useNavigation() : null;
  
  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (cityInputRef.current && !autocompleteInitialized && window.google && window.google.maps) {
      const autocomplete = new window.google.maps.places.Autocomplete(cityInputRef.current, {
        types: ['(cities)'],
        fields: ['address_components', 'formatted_address', 'geometry', 'name']
      });
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          // Find the city from the address components
          const cityComponent = place.address_components.find(
            component => component.types.includes('locality')
          );
          
          if (cityComponent) {
            setUpdatedProfile(prev => ({
              ...prev,
              city: cityComponent.long_name
            }));
          } else {
            // If locality not found, use the formatted address as fallback
            setUpdatedProfile(prev => ({
              ...prev,
              city: place.formatted_address || place.name
            }));
          }
        }
      });
      
      setAutocompleteInitialized(true);
    }
  }, [cityInputRef, autocompleteInitialized]);
  
  // Initialize form with existing user profile data if available
  useEffect(() => {
    if (userProfile) {
      setUpdatedProfile({
        displayName: userProfile.displayName || '',
        age: userProfile.age || '',
        journalingGoals: userProfile.journalingGoals || '',
        city: userProfile.city || '', // Add city from profile
        profileImage: userProfile.profileImage || null
      });
    }
  }, [userProfile]);
  
  // Load completed journeys
  useEffect(() => {
    const fetchJourneyStats = async () => {
      if (!currentUser) return;
      
      try {
        // Get user's journey progress
        const journeyStats = {
          completedJourneys: [],
          totalEntries: 0,
          longestStreak: 0
        };
        
        // Get all completed journeys
        if (userProfile?.journeyProgress) {
          // Check each path for completion status
          const pathStatuses = [];
          
          // Self-Discovery
          if (userProfile.journeyProgress.selfDiscoveryProgress?.completedDays?.length >= 10) {
            pathStatuses.push({
              pathId: 'self-discovery',
              name: 'Self-Discovery Journey',
              icon: 'Map',
              color: 'rgb(85, 139, 110)',
              completedDays: userProfile.journeyProgress.selfDiscoveryProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.selfDiscoveryProgress.lastActive,
              streak: userProfile.journeyProgress.selfDiscoveryProgress.streak || 0
            });
          }
          
          // Emotional Intelligence
          if (userProfile.journeyProgress.emotionalIntelligenceProgress?.completedDays?.length >= 10) {
            pathStatuses.push({
              pathId: 'emotional-intelligence',
              name: 'Emotional Intelligence Expedition',
              icon: 'Heart',
              color: 'rgb(170, 98, 158)',
              completedDays: userProfile.journeyProgress.emotionalIntelligenceProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.emotionalIntelligenceProgress.lastActive,
              streak: userProfile.journeyProgress.emotionalIntelligenceProgress.streak || 0
            });
          }
          
          // Mindfulness Awareness
          if (userProfile.journeyProgress.mindfulnessAwarenessProgress?.completedDays?.length >= 10) {
            pathStatuses.push({
              pathId: 'mindfulness-awareness',
              name: 'Mindfulness & Present Awareness',
              icon: 'Leaf',
              color: 'rgb(89, 140, 206)',
              completedDays: userProfile.journeyProgress.mindfulnessAwarenessProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.mindfulnessAwarenessProgress.lastActive,
              streak: userProfile.journeyProgress.mindfulnessAwarenessProgress.streak || 0
            });
          }
          
          // Transformation Journey
          if (userProfile.journeyProgress.transformationJourneyProgress?.completedDays?.length >= 21) {
            pathStatuses.push({
              pathId: 'transformation-journey',
              name: 'Transformation Journey',
              icon: 'Repeat',
              color: 'rgb(0, 128, 128)',
              completedDays: userProfile.journeyProgress.transformationJourneyProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.transformationJourneyProgress.lastActive,
              streak: userProfile.journeyProgress.transformationJourneyProgress.streak || 0
            });
          }
          
          // Creative Expression
          if (userProfile.journeyProgress.creativeExpressionProgress?.completedDays?.length >= 14) {
            pathStatuses.push({
              pathId: 'creative-expression',
              name: 'Creative Expression',
              icon: 'Palette',
              color: 'rgb(221, 105, 140)',
              completedDays: userProfile.journeyProgress.creativeExpressionProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.creativeExpressionProgress.lastActive,
              streak: userProfile.journeyProgress.creativeExpressionProgress.streak || 0
            });
          }
          
          // Habit Formation
          if (userProfile.journeyProgress.habitFormationProgress?.completedDays?.length >= 30) {
            pathStatuses.push({
              pathId: 'habit-formation',
              name: 'Habit Formation',
              icon: 'Calendar',
              color: 'rgb(230, 126, 34)',
              completedDays: userProfile.journeyProgress.habitFormationProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.habitFormationProgress.lastActive,
              streak: userProfile.journeyProgress.habitFormationProgress.streak || 0
            });
          }
          
          // Life Vision
          if (userProfile.journeyProgress.lifeVisionProgress?.completedDays?.length >= 100) {
            pathStatuses.push({
              pathId: 'life-vision',
              name: 'Life Vision & Purpose',
              icon: 'Compass',
              color: 'rgb(88, 86, 214)',
              completedDays: userProfile.journeyProgress.lifeVisionProgress.completedDays.length,
              lastActive: userProfile.journeyProgress.lifeVisionProgress.lastActive,
              streak: userProfile.journeyProgress.lifeVisionProgress.streak || 0
            });
          }
          
          // Sort by most recently active
          pathStatuses.sort((a, b) => {
            if (!a.lastActive) return 1;
            if (!b.lastActive) return -1;
            return b.lastActive.toDate() - a.lastActive.toDate();
          });
          
          journeyStats.completedJourneys = pathStatuses;
          
          // Calculate total entries (sum of all completedDays counts)
          journeyStats.totalEntries = pathStatuses.reduce((total, path) => total + path.completedDays, 0);
          
          // Find longest streak
          journeyStats.longestStreak = Math.max(
            0,
            ...pathStatuses.map(path => path.streak || 0)
          );
        }
        
        setJourneyStats(journeyStats);
      } catch (error) {
        console.error('Error fetching journey stats:', error);
      }
    };
    
    fetchJourneyStats();
  }, [currentUser, userProfile]);
  
  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      // Validate form data
      if (!updatedProfile.displayName) {
        throw new Error('Please enter your name');
      }
      
      // Update user profile in Firestore
      await updateUserProfile({
        ...updatedProfile,
        updatedAt: serverTimestamp()
      });
      
      // Navigate to next screen if provided
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get journey badge description
  const getJourneyBadgeDescription = (pathId) => {
    const descriptions = {
      'self-discovery': 'Completed the Self-Discovery Journey and gained insights into your authentic self.',
      'emotional-intelligence': 'Mastered emotional awareness and regulation through the Emotional Intelligence Expedition.',
      'mindfulness-awareness': 'Cultivated present moment awareness in the Mindfulness Journey.',
      'transformation-journey': 'Broke limiting patterns in the 21-day Transformation Journey.',
      'creative-expression': 'Nurtured your creative side through the Creative Expression Journey.',
      'habit-formation': 'Established lasting positive habits in the 30-day Habit Formation path.',
      'life-vision': 'Created a comprehensive life plan in the 100-day Life Vision & Purpose journey.'
    };
    
    return descriptions[pathId] || 'Completed a Καιρός journaling path.';
  };
  
  // Handle the export of a completed journey
  const handleExportJourney = async (pathId) => {
    if (!currentUser) return;
    
    setExportLoading(true);
    
    try {
      // Get journey name for filename
      const pathNames = {
        'self-discovery': 'Self-Discovery Journey',
        'emotional-intelligence': 'Emotional Intelligence Expedition',
        'mindfulness-awareness': 'Mindfulness & Present Awareness',
        'transformation-journey': 'Transformation Journey',
        'creative-expression': 'Creative Expression',
        'habit-formation': 'Habit Formation',
        'life-vision': 'Life Vision & Purpose'
      };
      
      const pathName = pathNames[pathId] || 'Καιρός Journey';
      
      // Generate PDF
      const pdfBlob = await exportJourneyToPDF(
        currentUser.uid, 
        pathId, 
        userProfile,
        {
          includeImages: false,
          includeFullText: true,
          includeAnalysis: true
        }
      );
      
      // Download file
      downloadFile(
        pdfBlob, 
        `Kairos_${pathName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`, 
        'application/pdf'
      );
    } catch (error) {
      console.error('Error exporting journey:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };
  
  // If user already has profile data from authState, just show read-only profile
  // with option to edit
  if (userProfile && userProfile.displayName && !onNext) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Your Profile</h1>
        
        {/* Profile card */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center mb-6">
            {/* Profile image or placeholder */}
            <div className="w-16 h-16 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xl font-bold">
              {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">{userProfile.displayName}</h2>
              <p className="text-gray-400">Joined {userProfile.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'recently'}</p>
            </div>
            
            {/* Edit button */}
            <button 
              className="ml-auto p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => navigation?.navigateToScreen('settings', { activeSection: 'profile' })}
            >
              <Edit2 className="w-5 h-5 text-gray-300" />
            </button>
          </div>
          
          {/* Profile details */}
          <div className="space-y-4">
            {userProfile.age && (
              <div className="flex items-center text-gray-300">
                <User className="w-5 h-5 mr-3 text-emerald-500" />
                <span>Age: {userProfile.age}</span>
              </div>
            )}
            
            {/* Location information - NEW */}
            {userProfile.city && (
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-3 text-emerald-500" />
                <span>Location: {userProfile.city}</span>
              </div>
            )}
            
            {userProfile.journalingGoals && (
              <div className="text-gray-300 mt-4">
                <h3 className="font-semibold mb-2 text-emerald-400">Journaling Goals:</h3>
                <p>{userProfile.journalingGoals}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Journey stats */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-white">Your Journey Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total journeys completed */}
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{journeyStats.completedJourneys.length}</p>
              <p className="text-gray-400">Journeys Completed</p>
            </div>
            
            {/* Total entries */}
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Book className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{journeyStats.totalEntries}</p>
              <p className="text-gray-400">Total Entries</p>
            </div>
            
            {/* Longest streak */}
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{journeyStats.longestStreak}</p>
              <p className="text-gray-400">Longest Streak</p>
            </div>
          </div>
        </div>
        
        {/* Completed journeys */}
        {journeyStats.completedJourneys.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-white">Completed Journeys</h2>
            
            <div className="space-y-4">
              {journeyStats.completedJourneys.map((journey) => (
                <div 
                  key={journey.pathId}
                  className="bg-gray-800 rounded-lg p-4 flex items-center"
                >
                  {/* Journey icon */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: journey.color }}
                  >
                    <DynamicIcon name={journey.icon} className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Journey details */}
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-white">{journey.name}</h3>
                    <p className="text-sm text-gray-400">{getJourneyBadgeDescription(journey.pathId)}</p>
                    
                    {journey.lastActive && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Completed on {journey.lastActive.toDate().toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    {/* Export button */}
                    <button 
                      className="p-2 rounded-full bg-emerald-800 hover:bg-emerald-700 transition-colors"
                      onClick={() => handleExportJourney(journey.pathId)}
                      disabled={exportLoading}
                    >
                      <Download className="w-5 h-5 text-emerald-100" />
                    </button>
                    
                    {/* View journey button */}
                    <button 
                      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                      onClick={() => navigation?.navigateToScreen('journey-complete', { pathId: journey.pathId })}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Start new journey button */}
        <div className="text-center">
          <button
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors text-white font-semibold"
            onClick={() => navigation?.navigateToScreen('path-selection')}
          >
            Start a New Journey
          </button>
        </div>
      </div>
    );
  }
  
  // Show editable profile form for new users or when explicitly editing
  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        {userProfile?.displayName ? 'Edit Your Profile' : 'Complete Your Profile'}
      </h1>
      
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <div className="mb-6">
          <label className="block text-white mb-2" htmlFor="displayName">
            Your Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={updatedProfile.displayName}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-white mb-2" htmlFor="age">
            Your Age (optional)
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={updatedProfile.age}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            placeholder="Enter your age"
            min="13"
            max="120"
          />
        </div>
        
        {/* City Field - NEW */}
        <div className="mb-6">
          <label className="block text-white mb-2" htmlFor="city">
            Your City (for weather)
          </label>
          <input
            type="text"
            id="city"
            name="city"
            ref={cityInputRef}
            value={updatedProfile.city}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            placeholder="Enter your city"
          />
          <p className="text-gray-500 text-sm mt-2">
            This helps us show you local weather on your dashboard.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-white mb-2" htmlFor="journalingGoals">
            Your Journaling Goals (optional)
          </label>
          <textarea
            id="journalingGoals"
            name="journalingGoals"
            value={updatedProfile.journalingGoals}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            placeholder="What do you hope to achieve through journaling?"
            rows="4"
          ></textarea>
        </div>
        
        <div className="mb-8">
          <label className="block text-white mb-2">
            Profile Image (coming soon)
          </label>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xl font-bold mr-4">
              {updatedProfile.displayName ? updatedProfile.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={true}
            >
              <Image className="w-5 h-5 mr-2" />
              Upload Image
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">Profile image uploads will be available in a future update.</p>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors text-white font-semibold flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;