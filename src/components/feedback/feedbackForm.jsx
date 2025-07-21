// src/components/feedback/FeedbackForm.jsx

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bug, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Camera,
  Trash,
  PlusCircle,
  Info
} from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { submitFeedback, submitBugReport } from '../../services/feedbackService';
import { OFFLINE_OPERATIONS, queueOfflineOperation } from '../../utils/offlineManager';
import useErrorHandler from '../../hooks/useErrorHandler';
import '../../styles/components/feedback.css';

const FeedbackForm = ({ 
  type = 'feedback', // 'feedback' or 'bug'
  onBack,
  onSubmitSuccess
}) => {
  const { currentUser, userProfile } = useAuth();
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('');
  const [email, setEmail] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(false);
  
  const { error, handleError, clearError } = useErrorHandler();
  const fileInputRef = useRef(null);
  
  const isBugReport = type === 'bug';
  
  // Pre-fill email from user profile if available
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);
  
  // Get feedback categories based on type
  const getCategories = () => {
    if (isBugReport) {
      return [
        { id: 'crash', label: 'App Crashes' },
        { id: 'ui', label: 'UI Problems' },
        { id: 'upload', label: 'Upload Issues' },
        { id: 'analysis', label: 'Analysis Problems' },
        { id: 'journal', label: 'Journal Display Issues' },
        { id: 'other', label: 'Other' }
      ];
    } else {
      return [
        { id: 'usability', label: 'Usability Suggestions' },
        { id: 'features', label: 'Feature Requests' },
        { id: 'journal', label: 'Journaling Experience' },
        { id: 'analysis', label: 'Analysis Quality' },
        { id: 'content', label: 'Journey Content' },
        { id: 'general', label: 'General Feedback' }
      ];
    }
  };
  
  // Handle file selection
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Limit to max 3 attachments
    if (attachments.length + files.length > 3) {
      handleError('Maximum 3 attachments allowed', 'validation');
      return;
    }
    
    // Check file size (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      handleError('Files must be under 5MB each', 'validation');
      return;
    }
    
    // Create preview URLs for images
    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };
  
  // Remove attachment
  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newAttachments[index].preview);
    
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!feedbackText.trim()) {
      handleError('Please enter your feedback', 'validation');
      return;
    }
    
    if (!category) {
      handleError('Please select a category', 'validation');
      return;
    }
    
    if (!email.trim()) {
      handleError('Please provide your email for follow-up', 'validation');
      return;
    }
    
    try {
      setIsSubmitting(true);
      clearError();
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      // Prepare submission data
      const submissionData = {
        text: feedbackText,
        category,
        email,
        userId: user?.uid || 'anonymous',
        userName: userProfile?.firstName || 'Anonymous User',
        attachments,
        timestamp: new Date(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
          platform: navigator.platform,
          language: navigator.language
        }
      };
      
      // Handle offline submission
      if (!navigator.onLine) {
        const operationType = isBugReport ? 
          OFFLINE_OPERATIONS.SUBMIT_BUG : 
          OFFLINE_OPERATIONS.SUBMIT_FEEDBACK;
        
        queueOfflineOperation(operationType, submissionData);
        
        setSubmitSuccess(true);
        
        // Show success message briefly before navigating back
        setTimeout(() => {
          if (onSubmitSuccess) {
            onSubmitSuccess({
              type,
              queued: true
            });
          }
        }, 2000);
        
        return;
      }
      
      // Submit based on type
      let result;
      if (isBugReport) {
        result = await submitBugReport(submissionData);
      } else {
        result = await submitFeedback(submissionData);
      }
      
      setSubmitSuccess(true);
      
      // Show success message briefly before navigating back
      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess({
            type,
            id: result.id
          });
        }
      }, 2000);
      
    } catch (error) {
      handleError(error, isBugReport ? 'bug-report' : 'feedback', { 
        category 
      });
      setIsSubmitting(false);
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        URL.revokeObjectURL(attachment.preview);
      });
    };
  }, [attachments]);
  
  return (
    <div className="feedback-container">
      <button
        onClick={onBack}
        className="back-button"
        disabled={isSubmitting}
      >
        <ArrowLeft className="icon-small" />
        Back
      </button>
      
      <div className="feedback-card">
        <h2 className="feedback-title">
          {isBugReport ? (
            <>
              <Bug className="feedback-title-icon" />
              Report a Bug
            </>
          ) : (
            <>
              <MessageSquare className="feedback-title-icon" />
              Share Your Feedback
            </>
          )}
        </h2>
        
        {!submitSuccess ? (
          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Category Selection */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
                <span className="required-indicator">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                {getCategories().map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Feedback/Bug Description */}
            <div className="form-group">
              <label htmlFor="feedback-text" className="form-label">
                {isBugReport ? 'Bug Description' : 'Your Feedback'}
                <span className="required-indicator">*</span>
              </label>
              <div className="textarea-wrapper">
                <textarea
                  id="feedback-text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    isBugReport
                      ? "Please describe the bug in detail. What were you doing when it happened? What did you expect to happen? What actually happened?"
                      : "We'd love to hear your thoughts, suggestions, or ideas for improvement."
                  }
                  className="form-textarea"
                  rows={6}
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email for follow-up
                <span className="required-indicator">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="form-input"
                required
              />
            </div>
            
            {/* Attachments */}
            <div className="form-group">
              <label className="form-label">
                Attachments
                <button 
                  type="button" 
                  className="info-button"
                  onClick={() => setShowInfoBox(!showInfoBox)}
                  aria-label="Show attachment information"
                >
                  <Info size={16} />
                </button>
              </label>
              
              {showInfoBox && (
                <div className="info-box">
                  <p>
                    {isBugReport
                      ? "Upload screenshots or files that help explain the bug (max 3 files, 5MB each)."
                      : "Upload images or files related to your feedback (max 3 files, 5MB each)."}
                  </p>
                </div>
              )}
              
              <div className="attachments-container">
                {/* Existing attachments */}
                {attachments.map((attachment, index) => (
                  <div key={index} className="attachment-preview">
                    {attachment.type.startsWith('image/') ? (
                      <img 
                        src={attachment.preview} 
                        alt="Attachment preview" 
                        className="attachment-image"
                      />
                    ) : (
                      <div className="file-icon">
                        {attachment.name.substring(attachment.name.lastIndexOf('.') + 1).toUpperCase()}
                      </div>
                    )}
                    <div className="attachment-info">
                      <span className="attachment-name">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="remove-attachment-button"
                        aria-label="Remove attachment"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add attachment button */}
                {attachments.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="add-attachment-button"
                  >
                    <PlusCircle size={20} />
                    <span>Add {attachments.length > 0 ? 'More' : ''}</span>
                  </button>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelection}
                accept="image/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                multiple
              />
            </div>
            
            {/* Error message */}
            {error && (
              <div className="error-message">
                <AlertCircle className="error-icon" size={16} />
                <span>{error.message || error}</span>
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loader-spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="button-icon" size={16} />
                  {isBugReport ? 'Submit Bug Report' : 'Send Feedback'}
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-container">
            <CheckCircle className="success-icon" />
            <h3 className="success-title">
              {navigator.onLine 
                ? 'Thank you for your submission!' 
                : 'Your submission has been queued!'}
            </h3>
            <p className="success-message">
              {navigator.onLine 
                ? `We've received your ${isBugReport ? 'bug report' : 'feedback'} and will review it soon.` 
                : `Your ${isBugReport ? 'bug report' : 'feedback'} will be submitted when you're back online.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;