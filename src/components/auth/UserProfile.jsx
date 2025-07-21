<<<<<<< HEAD
// src/pages/ProfileScreen.jsx - MINIMAL TEST VERSION

import React from 'react';

const ProfileScreen = ({ handleSignOut }) => {
  return (
    <div style={{
      padding: '20px',
      background: 'red',
      color: 'white',
      minHeight: '100vh',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>🚨 MINIMAL PROFILE TEST 🚨</h1>
      <p>If you see this, the ProfileScreen file is working!</p>
      <p>File location: src/pages/ProfileScreen.jsx</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      
      <button 
        onClick={handleSignOut}
        style={{
          background: 'white',
          color: 'red',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Sign Out (Test)
      </button>
=======
// src/components/auth/UserProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  Settings, HelpCircle, LogOut, BookOpen, Award, 
  Book, Calendar, Clock, User, Edit2, Download, 
  ChevronRight, Camera, CameraOff, UploadCloud, Trash2,
  Calendar as CalendarIcon, BookOpen as BookOpenIcon,
  Smile, Star, Heart, Bookmark, Archive, X, 
  Bell, Shield, ArrowRight
} from 'lucide-react';
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../config/firebase';
import DynamicIcon from '../common/DynamicIcon';
import VersionDisplay from '../common/VersionDisplay';
import { exportJourneyToPDF, downloadFile } from '../../services/exportService';
import { getProgressFieldForPath, getAllActiveJourneys, getUserPathProgress } from '../../utils/pathUtils';
import { getAllJourneyPaths, getJourneyPath } from '../../data/JourneyData';
import '../../styles/components/profile.css';

// Journey descriptions - consider moving these to JourneyData.js
const JOURNEY_DESCRIPTIONS = {
  'self-discovery': 'Completed the Self-Discovery Journey and gained insights into your authentic self.',
  'emotional-intelligence': 'Mastered emotional awareness and regulation through the Emotional Intelligence Expedition.',
  'mindfulness-awareness': 'Cultivated present moment awareness in the Mindfulness Journey.',
  'transformation-journey': 'Broke limiting patterns in the 21-day Transformation Journey.',
  'creative-expression': 'Nurtured your creative side through the Creative Expression Journey.',
  'habit-formation': 'Established lasting positive habits in the 30-day Habit Formation path.',
  'life-vision': 'Created a comprehensive life plan in the 100-day Life Vision & Purpose journey.'
};

/**
 * Enhanced User Profile Component
 * Displays user information, journey progress, and profile management
 */
const UserProfile = ({ onNext }) => {
  // Core States and Hooks
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const navigation = useNavigation();
  const fileInputRef = useRef(null);
  
  // UI States
  const [isEditing, setIsEditing] = useState(!userProfile?.displayName || !!onNext);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [profileStats, setProfileStats] = useState({
    totalEntries: 0,
    totalJourneys: 0,
    longestStreak: 0,
    completedJourneys: []
  });

  // Form data
  const [formData, setFormData] = useState({
    displayName: '',
    age: '',
    journalingGoals: '',
    profileImage: null
  });

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Initialize form with existing user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        age: userProfile.age || '',
        journalingGoals: userProfile.journalingGoals || '',
        profileImage: userProfile.profileImage || null
      });
      
      // Set editing mode based on whether profile is complete
      if (!onNext) {
        setIsEditing(!userProfile.displayName);
      }
    }
  }, [userProfile, onNext]);

  // Load journey stats when profile loads
  useEffect(() => {
    if (userProfile && !isEditing) {
      fetchJourneyStats();
    }
  }, [userProfile, isEditing]);

  /**
   * Fetch all journey stats for the user
   * Includes completed journeys, total entries, and streaks
   */
  const fetchJourneyStats = async () => {
    if (!userProfile || !userProfile.journeyProgress) return;

    try {
      // Get all available paths
      const allPaths = Object.values(getAllJourneyPaths());
      
      let completedJourneys = [];
      let totalEntries = 0;
      let longestStreak = 0;
      
      // Check each path for completion
      allPaths.forEach(path => {
        const progressField = getProgressFieldForPath(path.id);
        const progress = userProfile.journeyProgress[progressField];
        
        // If path has progress
        if (progress && progress.completedDays && progress.completedDays.length > 0) {
          // Add to total entries
          totalEntries += progress.completedDays.length;
          
          // Update longest streak
          if (progress.bestStreak && progress.bestStreak > longestStreak) {
            longestStreak = progress.bestStreak;
          } else if (progress.currentStreak && progress.currentStreak > longestStreak) {
            longestStreak = progress.currentStreak;
          }
          
          // Check if path is completed
          if (progress.completedDays.length >= path.duration) {
            completedJourneys.push({
              pathId: path.id,
              name: path.title,
              icon: path.iconName,
              color: `rgb(${path.color})`,
              completedDays: progress.completedDays.length,
              lastActive: progress.lastActive,
              streak: progress.bestStreak || progress.currentStreak || 0
            });
          }
        }
      });
      
      // Sort by most recently completed
      completedJourneys.sort((a, b) => {
        if (!a.lastActive) return 1;
        if (!b.lastActive) return -1;
        const dateA = a.lastActive.toDate ? a.lastActive.toDate() : new Date(a.lastActive);
        const dateB = b.lastActive.toDate ? b.lastActive.toDate() : new Date(b.lastActive);
        return dateB - dateA;
      });
      
      setProfileStats({
        totalEntries,
        totalJourneys: completedJourneys.length,
        longestStreak,
        completedJourneys
      });
    } catch (error) {
      console.error("Error fetching journey stats:", error);
      setErrorMessage("Could not load journey statistics. Please try again later.");
    }
  };

  /**
   * Get the active journey for the user
   * Returns the most recently active journey
   */
  const getActiveJourney = () => {
    if (!userProfile?.journeyProgress) return null;
    
    try {
      // Get all active journeys
      const activeJourneys = getAllActiveJourneys(userProfile);
      if (!activeJourneys || activeJourneys.length === 0) return null;
      
      // Get the most recent active journey
      const mostRecent = activeJourneys[0];
      const pathData = getJourneyPath(mostRecent.pathId);
      
      if (!pathData) return null;
      
      return {
        id: mostRecent.pathId,
        name: pathData.title,
        iconName: pathData.iconName,
        color: pathData.color,
        nextDay: mostRecent.nextDay,
        totalDays: pathData.duration,
        completedDays: mostRecent.progress?.completedDays || [],
        streak: mostRecent.progress?.currentStreak || 0
      };
    } catch (error) {
      console.error("Error getting active journey:", error);
      // Return a default journey as fallback
      return null;
    }
  };

  const applyTheme = (selectedTheme) => {
    // Update the state
    setTheme(selectedTheme);
    
    // Apply theme to document
    if (selectedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
    
    // Store theme preference in localStorage for persistence
    localStorage.setItem('theme', selectedTheme);
  };

  /**
   * Get the description for a journey badge
   */
  const getJourneyBadgeDescription = (pathId) => {
    return JOURNEY_DESCRIPTIONS[pathId] || 'Completed a Καιρός journaling path.';
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle profile form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setLoading(true);
    setErrorMessage(null);
    
    try {
      // Validate form data
      if (!formData.displayName.trim()) {
        throw new Error('Please enter your name');
      }
      
      // Update user profile in Firestore
      await updateUserProfile({
        ...formData,
        updatedAt: serverTimestamp()
      });
      
      // Exit editing mode
      setIsEditing(false);
      
      // Navigate to next screen if provided
      if (onNext) {
        onNext();
      } else {
        // Show success message
        await navigation.showLoader({ 
          duration: 1000, 
          message: "Profile updated successfully!" 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || "Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle canceling profile edit
   */
  const handleCancelEdit = () => {
    // Reset form to original values
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        age: userProfile.age || '',
        journalingGoals: userProfile.journalingGoals || '',
        profileImage: userProfile.profileImage || null
      });
    }
    
    // Exit editing mode if we have a display name
    if (userProfile?.displayName) {
      setIsEditing(false);
    }
  };

  /**
   * Handle profile image upload
   */
  const handleImageUpload = async (e) => {
    if (!currentUser || !e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Check file size
    if (file.size > maxSize) {
      setErrorMessage("File is too large. Maximum size is 5MB.");
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      setErrorMessage("Only image files are allowed.");
      return;
    }
    
    setImageLoading(true);
    setUploadProgress(0);
    setShowImageOptions(false);
    setErrorMessage(null);
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      
      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Listen for upload events
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress monitoring
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Error handling
          console.error('Error uploading image:', error);
          setErrorMessage("Error uploading image. Please try again.");
          setImageLoading(false);
          setUploadProgress(0);
        },
        async () => {
          // Upload complete
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Update user profile
            await updateUserProfile({
              ...formData,
              profileImage: downloadURL,
              updatedAt: serverTimestamp()
            });
            
            // Update local state
            setFormData(prev => ({
              ...prev,
              profileImage: downloadURL
            }));
            
            console.log('Profile image updated successfully');
          } catch (error) {
            console.error('Error updating profile with image URL:', error);
            setErrorMessage("Error updating profile. Please try again.");
          } finally {
            setImageLoading(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (error) {
      console.error('Error starting image upload:', error);
      setErrorMessage("Error uploading image. Please try again.");
      setImageLoading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Handle profile image removal
   */
  const handleRemoveImage = async () => {
    if (!currentUser || !formData.profileImage) return;
    
    setImageLoading(true);
    setShowImageOptions(false);
    setErrorMessage(null);
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
      
      // Delete image from storage
      await deleteObject(storageRef);
      
      // Update user profile
      await updateUserProfile({
        ...formData,
        profileImage: null,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        profileImage: null
      }));
      
      console.log('Profile image removed successfully');
    } catch (error) {
      console.error('Error removing profile image:', error);
      setErrorMessage("Error removing profile image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * Handle export of a completed journey
   */
  const handleExportJourney = async (pathId) => {
    if (!currentUser) return;
    
    setExportLoading(true);
    setErrorMessage(null);
    
    try {
      const pathData = getJourneyPath(pathId);
      const pathName = pathData ? pathData.title : 'Καιρός Journey';
      
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
      setErrorMessage(`Export failed: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  /**
   * Handle sign out
   */
  const handleSignOut = async () => {
    try {
      await navigation.showLoader({ size: 'medium', duration: 1000 });
      await logout();
      navigation.navigateToScreen('welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      setErrorMessage('Error signing out. Please try again.');
      navigation.hideLoader();
    }
  };

  // Get active journey
  const activeJourney = getActiveJourney();

  /**
   * Render profile edit form
   */
  const renderProfileForm = () => {
    return (
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-header">
          <h2 className="form-title">{userProfile?.displayName ? 'Edit Your Profile' : 'Complete Your Profile'}</h2>
        </div>
        
        {/* Profile Image Upload */}
        <div className="image-upload-section">
          <div className={`profile-image-upload ${imageLoading ? 'loading' : ''}`} onClick={() => fileInputRef.current.click()}>
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="preview-image" />
            ) : (
              <div className="image-placeholder">
                {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="upload-overlay">
              <Camera className="upload-icon" />
              <span className="upload-text">Upload Photo</span>
            </div>
            
            {/* Upload progress indicator */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress-overlay">
                <div className="upload-progress-bar">
                  <div 
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="upload-progress-text">{Math.round(uploadProgress)}%</span>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden-input"
          />
          
          {formData.profileImage && (
            <button 
              type="button"
              className="remove-image-button"
              onClick={handleRemoveImage}
              disabled={imageLoading}
            >
              Remove Photo
            </button>
          )}
        </div>
        
        {/* Form Fields */}
        <div className="form-group">
          <label htmlFor="displayName" className="form-label">Your Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your name"
            required
            aria-required="true"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="age" className="form-label">Your Age (optional)</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your age"
            min="13"
            max="120"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="journalingGoals" className="form-label">Your Journaling Goals (optional)</label>
          <textarea
            id="journalingGoals"
            name="journalingGoals"
            value={formData.journalingGoals}
            onChange={handleChange}
            className="form-textarea"
            placeholder="What do you hope to achieve through journaling?"
            rows="4"
          ></textarea>
        </div>
        
        {/* Error message display */}
        {errorMessage && (
          <div className="error-message">
            <X className="error-icon" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="form-actions">
          {!onNext && userProfile?.displayName && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading || imageLoading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>
    );
  };

  /**
   * Render profile view with stats and journeys
   */
  const renderProfileView = () => {
    return (
      <>
        {/* Profile header */}
        <div className="profile-header-container">
          <div className="profile-header">
            {/* Profile avatar */}
            <div 
              className={`profile-avatar ${imageLoading ? 'loading' : ''}`}
              onClick={() => setShowImageOptions(true)}
              role="button"
              aria-label="Change profile picture"
              tabIndex="0"
            >
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="avatar-image" />
              ) : (
                <span>{formData.displayName.charAt(0).toUpperCase()}</span>
              )}
              <div className="avatar-overlay">
                <Camera className="camera-icon" />
              </div>
            </div>
            
            <div className="profile-info">
              <h2 className="profile-name">{formData.displayName}</h2>
              <p className="profile-email">{currentUser.email}</p>
              
              <div className="profile-actions">
                <button 
                  className="edit-profile-button"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit profile"
                >
                  <Edit2 className="edit-icon" />
                  Edit Profile
                </button>
                
                <button 
                  className="progress-button"
                  onClick={() => setShowProgressModal(true)}
                  aria-label="View progress report"
                  disabled={profileStats.totalEntries === 0}
                >
                  <Award className="progress-icon" />
                  View Progress
                </button>
              </div>
            </div>
          </div>
          
          {/* Image options dropdown */}
          {showImageOptions && (
            <div className="image-options">
              <button 
                className="image-option-button"
                onClick={() => {
                  fileInputRef.current.click();
                  setShowImageOptions(false);
                }}
              >
                <UploadCloud className="option-icon" />
                Upload Photo
              </button>
              
              {formData.profileImage && (
                <button 
                  className="image-option-button remove"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="option-icon" />
                  Remove Photo
                </button>
              )}
              
              <button 
                className="image-option-button"
                onClick={() => setShowImageOptions(false)}
              >
                <CameraOff className="option-icon" />
                Cancel
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden-input"
                aria-label="Upload profile picture"
              />
            </div>
          )}
        </div>
        
        {/* Membership info */}
        <div className="membership-info">
          <p className="member-since">
            Member since {userProfile.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 'recently'}
          </p>
        </div>

        {/* Active Journey Progress */}
        {activeJourney && (
          <div className="journey-progress">
            <div className="journey-progress-header">
              <h3 className="journey-progress-title">
                <DynamicIcon name={activeJourney.iconName} style={{ marginRight: '8px', display: 'inline' }} />
                {activeJourney.name}
              </h3>
              <span className="journey-progress-percentage">
                {Math.round((activeJourney.completedDays.length / activeJourney.totalDays) * 100)}%
              </span>
            </div>
            
            <div className="journey-progress-bar">
              <div 
                className="journey-progress-fill"
                style={{ width: `${(activeJourney.completedDays.length / activeJourney.totalDays) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">
                Day {activeJourney.nextDay} of {activeJourney.totalDays}
              </span>
              <button 
                className="text-green-500 text-sm font-medium"
                onClick={() => navigation.navigateToScreen('daily', { pathId: activeJourney.id, day: activeJourney.nextDay })}
              >
                Continue
              </button>
            </div>
            
            {activeJourney.streak > 0 && (
              <div className="streak-badge">
                <Bookmark className="streak-icon" />
                <span className="streak-text">{activeJourney.streak} day streak!</span>
              </div>
            )}
          </div>
        )}
        
        {/* Error message */}
        {errorMessage && (
          <div className="error-message">
            <X className="error-icon" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <Book className="stat-icon" />
            <div className="stat-content">
              <div className="stat-label">Total Entries</div>
              <div className="stat-value">{profileStats.totalEntries}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <Award className="stat-icon" />
            <div className="stat-content">
              <div className="stat-label">Journeys Completed</div>
              <div className="stat-value">{profileStats.totalJourneys}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <div className="stat-content">
              <div className="stat-label">Longest Streak</div>
              <div className="stat-value">{profileStats.longestStreak}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <Clock className="stat-icon" />
            <div className="stat-content">
              <div className="stat-label">Days Active</div>
              <div className="stat-value">{profileStats.totalEntries}</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="quick-action-button"
            onClick={() => navigation.navigateToScreen('path-selection')}
            aria-label="Explore journaling paths"
          >
            <BookOpenIcon className="quick-action-icon" />
            Explore Paths
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigation.navigateToScreen('journal-archive')}
            aria-label="View journal archive"
          >
            <Archive className="quick-action-icon" />
            Journal Archive
          </button>
          
          <button 
            className="quick-action-button"
            onClick={() => navigation.navigateToScreen('analytics-dashboard')}
            aria-label="View insights dashboard"
          >
            <Star className="quick-action-icon" />
            My Insights
          </button>
        </div>
        
        {/* Completed Journeys Section */}
        {profileStats.completedJourneys.length > 0 && (
          <div className="completed-journeys-section">
            <h3 className="section-title">Completed Journeys</h3>
            
            <div className="space-y-4">
              {profileStats.completedJourneys.map((journey) => (
                <div 
                  key={journey.pathId}
                  className="completed-journey-card"
                >
                  {/* Journey icon */}
                  <div 
                    className="journey-icon"
                    style={{ backgroundColor: journey.color }}
                  >
                    <DynamicIcon name={journey.icon} />
                  </div>
                  
                  {/* Journey details */}
                  <div className="journey-details">
                    <h4 className="journey-title">{journey.name}</h4>
                    <p className="journey-description">{getJourneyBadgeDescription(journey.pathId)}</p>
                    
                    {journey.lastActive && (
                      <div className="journey-completion-date">
                        <Clock className="completion-icon" />
                        <span>
                          Completed on {journey.lastActive.toDate ? 
                            journey.lastActive.toDate().toLocaleDateString() : 
                            new Date(journey.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="journey-actions">
                    <button 
                      className="journey-action-button export"
                      onClick={() => handleExportJourney(journey.pathId)}
                      disabled={exportLoading}
                      aria-label={`Export ${journey.name} to PDF`}
                    >
                      <Download className="action-icon" />
                    </button>
                    
                    <button 
                      className="journey-action-button view"
                      onClick={() => navigation.navigateToScreen('journey-complete', { pathId: journey.pathId })}
                      aria-label={`View ${journey.name} completion`}
                    >
                      <ChevronRight className="action-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Settings Menu */}
        <div className="settings-menu">
  <div 
    className="menu-item"
    onClick={() => navigation.navigateToScreen('settings', { activeSection: 'appearance' })}
    role="button"
    tabIndex="0"
  >
    <div className="menu-item-content">
      <Smile className="menu-icon primary" />
      <span className="menu-item-text">Settings</span>
    </div>
    <ChevronRight className="menu-chevron" />
  </div>
  
  <div className="menu-divider"></div>
  
  <div 
    className="menu-item"
    onClick={() => navigation.navigateToScreen('settings', { activeSection: 'notifications' })}
    role="button"
    tabIndex="0"
  >
    <div className="menu-item-content">
      <Bell className="menu-icon primary" />
      <span className="menu-item-text">Notifications</span>
    </div>
    <ChevronRight className="menu-chevron" />
  </div>
  
  <div className="menu-divider"></div>
  
  <div 
    className="menu-item"
    onClick={() => navigation.navigateToScreen('settings', { activeSection: 'privacy' })}
    role="button"
    tabIndex="0"
  >
    <div className="menu-item-content">
      <Shield className="menu-icon warning" />
      <span className="menu-item-text">Privacy & Data</span>
    </div>
    <ChevronRight className="menu-chevron" />
  </div>
  
  <div className="menu-divider"></div>
  
  <div 
    className="menu-item"
    onClick={() => window.open('https://kairos-journal.com', '_blank')}
    role="button"
    tabIndex="0"
  >
    <div className="menu-item-content">
      <HelpCircle className="menu-icon info" />
      <span className="menu-item-text">About Καιρός</span>
    </div>
    <ChevronRight className="menu-chevron" />
  </div>
  
  <div className="menu-divider"></div>
  
  <div 
    className="sign-out-button"
    onClick={handleSignOut}
    role="button"
    tabIndex="0"
    aria-label="Sign out"
  >
    <LogOut className="logout-icon" />
    Sign Out
  </div>
</div>
        
        {/* Version Info */}
        <div className="version-info">
          <VersionDisplay />
        </div>
        
        {/* Progress Report Modal */}
        {showProgressModal && (
          <div 
            className="progress-report-overlay" 
            onClick={() => setShowProgressModal(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Progress Report"
          >
            <div 
              className="progress-report-modal" 
              onClick={e => e.stopPropagation()}
              role="document"
            >
              <button 
                className="close-report-button"
                onClick={() => setShowProgressModal(false)}
                aria-label="Close progress report"
              >
                <X className="close-report-icon" />
              </button>
              
              <div className="progress-report-header">
                <h2 className="progress-report-title">Your Journey Progress</h2>
              </div>
              
              <div className="progress-report-content">
                <div className="progress-report-stat">
                  <div className="progress-stat-value">{profileStats.totalEntries}</div>
                  <div className="progress-stat-label">Total Journal Entries</div>
                </div>
                
                <div className="progress-report-section">
                  <h3 className="progress-section-title">Common Themes</h3>
                  <div className="themes-grid">
                    {['Gratitude', 'Reflection', 'Growth', 'Mindfulness', 'Learning', 'Creativity'].map(theme => (
                      <div key={theme} className="theme-tag">{theme}</div>
                    ))}
                  </div>
                </div>
                
                <div className="progress-report-section">
                  <h3 className="progress-section-title">Growth Areas</h3>
                  <ul className="growth-areas-list">
                    <li className="growth-area-item">Self-awareness</li>
                    <li className="growth-area-item">Emotional regulation</li>
                    <li className="growth-area-item">Present moment awareness</li>
                  </ul>
                </div>
                
                <div className="progress-report-section">
                  <h3 className="progress-section-title">Next Recommendation</h3>
                  <p className="recommendation-text">
                    Based on your journaling patterns, you might enjoy exploring our 
                    "Creative Expression" journey next to nurture your creative thinking.
                  </p>
                </div>
              </div>
              
              <div className="progress-report-actions">
                <button 
                  className="progress-report-button secondary"
                  onClick={() => setShowProgressModal(false)}
                >
                  Close
                </button>
                
                <button 
                  className="progress-report-button primary"
                  onClick={() => {
                    setShowProgressModal(false);
                    navigation.navigateToScreen('analytics-dashboard');
                  }}
                >
                  View Full Analytics
                  <ArrowRight className="button-icon-right" />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="profile-container">
      {isEditing ? renderProfileForm() : renderProfileView()}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    </div>
  );
};

<<<<<<< HEAD
export default ProfileScreen;
=======
// PropTypes
UserProfile.propTypes = {
  onNext: PropTypes.func
};

export default UserProfile;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
