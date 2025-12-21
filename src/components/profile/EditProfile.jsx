// src/components/profile/EditProfile.jsx

import React, { useState } from 'react';
import { X, Save, User, MapPin, Camera, Mail, AlertCircle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { AvatarPicker } from '../common/Avatar';
import '../../styles/components/editProfile.css';

const EditProfile = ({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    displayName: currentProfile?.displayName || '',
    city: currentProfile?.city || '',
    avatarStyle: currentProfile?.avatarStyle || 'forest',
    avatarPattern: currentProfile?.avatarPattern || 'dots',
    avatarFont: currentProfile?.avatarFont || 'sans'
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const initials = formData.displayName
    ? formData.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'K';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAvatarSelect = ({ style, pattern, font }) => {
    setFormData(prev => ({
      ...prev,
      avatarStyle: style,
      avatarPattern: pattern,
      avatarFont: font
    }));
    setShowAvatarPicker(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    } else if (formData.displayName.trim().length > 50) {
      newErrors.displayName = 'Name must be less than 50 characters';
    }

    if (formData.city && formData.city.length > 100) {
      newErrors.city = 'City name is too long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ep-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ep-header">
          <div className="ep-header-content">
            <h2 className="ep-title">Edit Profile</h2>
            <p className="ep-subtitle">Update your personal information</p>
          </div>
          <button 
            className="ep-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="ep-content">
          {/* Avatar Section */}
          <div className="ep-section">
            <label className="ep-section-label">
              <Camera size={16} />
              Profile Avatar
            </label>
            <div className="ep-avatar-container">
              <Avatar 
                style={formData.avatarStyle}
                pattern={formData.avatarPattern}
                font={formData.avatarFont}
                initials={initials}
                size={100}
              />
              <button 
                className="ep-avatar-change-btn"
                onClick={() => setShowAvatarPicker(true)}
              >
                <Camera size={16} />
                Change Avatar
              </button>
            </div>
            <p className="ep-avatar-hint">
              Click to customize your avatar style, pattern, and font
            </p>
          </div>

          {/* Name Field */}
          <div className="ep-section">
            <label className="ep-label" htmlFor="displayName">
              <User size={16} />
              Display Name *
            </label>
            <input
              id="displayName"
              type="text"
              className={`ep-input ${errors.displayName ? 'ep-input-error' : ''}`}
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              maxLength={50}
              autoFocus
            />
            {errors.displayName && (
              <div className="ep-error">
                <AlertCircle size={14} />
                {errors.displayName}
              </div>
            )}
            <p className="ep-hint">
              This is how you'll be addressed throughout the app
            </p>
          </div>

          {/* Email Field (Read-only) */}
          <div className="ep-section">
            <label className="ep-label">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              className="ep-input ep-input-readonly"
              value={currentProfile?.email || ''}
              readOnly
              disabled
            />
            <p className="ep-hint">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>

          {/* City Field */}
          <div className="ep-section">
            <label className="ep-label" htmlFor="city">
              <MapPin size={16} />
              City / Location
            </label>
            <input
              id="city"
              type="text"
              className={`ep-input ${errors.city ? 'ep-input-error' : ''}`}
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., San Francisco, CA"
              maxLength={100}
            />
            {errors.city && (
              <div className="ep-error">
                <AlertCircle size={14} />
                {errors.city}
              </div>
            )}
            <p className="ep-hint">
              Used for weather information and personalization
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="ep-error ep-error-general">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ep-footer">
          <button 
            className="ep-btn ep-btn-cancel"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            className="ep-btn ep-btn-save"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Avatar Picker Sub-Modal */}
        {showAvatarPicker && (
          <div className="ep-submodal-overlay" onClick={() => setShowAvatarPicker(false)}>
            <div className="ep-submodal" onClick={(e) => e.stopPropagation()}>
              <AvatarPicker 
                currentStyle={formData.avatarStyle}
                currentPattern={formData.avatarPattern}
                currentFont={formData.avatarFont}
                initials={initials}
                onSelect={handleAvatarSelect}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
