// src/components/journal/JournalUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Camera, ImagePlus, X, Plus } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { uploadJournalImage, uploadMultipleJournalImages } from '../../services/claudeService';
import { useAuth } from '../../contexts/AuthContext';
import { isVisualPath, getUploadInstructions, getMaxPages } from '../../utils/pathTypeUtils';
import KairosLoader from '../common/KairosLoader';
import '../../styles/components/JournalUpload.css';

// ===================== GLASS UPLOAD SVG ICON =====================
const GlassUploadIcon = ({ pathColorRgb = '85,139,110' }) => {
  const c = pathColorRgb;
  return (
    <div className="glass-upload-icon-wrapper" style={{ '--c': c }}>
      <svg
        className="glass-upload-svg"
        viewBox="0 0 80 80"
        fill="none"
      >
        {/* ── Outer glow ring ── */}
        <circle
          cx="40" cy="40" r="37"
          fill="rgba(255,255,255,0.03)"
          stroke={`rgba(${c}, 0.2)`}
          strokeWidth="1.5"
          className="glass-icon-circle"
        />

        {/* ── Inner subtle ring ── */}
        <circle
          cx="40" cy="40" r="33"
          fill="none"
          stroke={`rgba(${c}, 0.07)`}
          strokeWidth="0.75"
          className="glass-icon-ring-inner"
        />

        {/* ── Upload arrow shaft ── */}
        <line
          x1="40" y1="25" x2="40" y2="12"
          stroke={`rgba(${c}, 0.85)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="glass-upload-shaft"
        />

        {/* ── Upload arrow head ── */}
        <path
          d="M35.5 16.5L40 12L44.5 16.5"
          stroke={`rgba(${c}, 0.85)`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="glass-upload-head"
        />

        {/* ── Camera body + top bump (single path) ── */}
        <path
          d="M27 33H33.5L36 28.5C36.2 28 36.6 27.5 37.2 27.5H42.8C43.4 27.5 43.8 28 44 28.5L46.5 33H53C54.1 33 55 33.9 55 35V53C55 54.1 54.1 55 53 55H27C25.9 55 25 54.1 25 53V35C25 33.9 25.9 33 27 33Z"
          stroke={`rgba(${c}, 0.65)`}
          strokeWidth="2"
          fill="none"
          className="glass-camera-body"
        />

        {/* ── Camera flash indicator ── */}
        <circle
          cx="50" cy="36.5" r="1.5"
          fill={`rgba(${c}, 0.35)`}
          className="glass-camera-flash"
        />

        {/* ── Lens glow (behind ring) ── */}
        <circle
          cx="40" cy="45" r="9"
          fill={`rgba(${c}, 0.06)`}
          className="glass-lens-glow"
        />

        {/* ── Lens outer ring ── */}
        <circle
          cx="40" cy="45" r="7.5"
          stroke={`rgba(${c}, 0.55)`}
          strokeWidth="2"
          fill="none"
          className="glass-camera-lens-ring"
        />

        {/* ── Lens center ── */}
        <circle
          cx="40" cy="45" r="3.5"
          fill={`rgba(${c}, 0.3)`}
          className="glass-camera-lens"
        />

        {/* ── Lens reflection highlight ── */}
        <circle
          cx="38" cy="43" r="1.5"
          fill="rgba(255,255,255,0.2)"
          className="glass-lens-highlight"
        />

        {/* ── Sparkle 1 — top right (diamond) ── */}
        <path
          d="M49 9L49.8 11L49 13L48.2 11Z"
          fill={`rgba(${c}, 0.6)`}
          className="glass-sparkle glass-sparkle-1"
        />

        {/* ── Sparkle 2 — top left (diamond) ── */}
        <path
          d="M29 14L29.6 15.5L29 17L28.4 15.5Z"
          fill={`rgba(${c}, 0.4)`}
          className="glass-sparkle glass-sparkle-2"
        />

        {/* ── Sparkle 3 — right (diamond) ── */}
        <path
          d="M53 19L53.5 20.5L53 22L52.5 20.5Z"
          fill={`rgba(${c}, 0.3)`}
          className="glass-sparkle glass-sparkle-3"
        />
      </svg>
    </div>
  );
};
// ================================================================

// Extracted: Glass Image Preview Carousel
const GlassImagePreview = ({ images, currentIndex, onRemove, onIndexChange }) => {
  const touchStartX = useRef(0);
  
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        onIndexChange(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      }
    }
  };

  return (
    <div className="glass-preview-container">
      <div 
        className="glass-preview-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div key={i} className="glass-preview-slide">
            <img src={img} alt={`Page ${i + 1}`} className="glass-preview-image" />
            <button 
              className="glass-preview-remove"
              onClick={() => onRemove(i)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <div className="glass-preview-indicator">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="glass-preview-dots">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`glass-dot ${i === currentIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Extracted: Glass Action Buttons
const GlassActionButtons = ({ onCamera, onGallery, onAddMore, fileCount, maxPages, isCapturing }) => {
  const { t } = useTranslation('journey');
  return (
  <div className="glass-actions">
    <button
      className="glass-btn glass-btn-camera"
      onClick={onCamera}
      disabled={isCapturing || fileCount >= maxPages}
    >
      <Camera size={20} />
      <span>{t('journalUpload.takePhoto', 'Take Photo')}</span>
    </button>

    <button
      className="glass-btn glass-btn-gallery"
      onClick={onGallery}
      disabled={isCapturing || fileCount >= maxPages}
    >
      <ImagePlus size={20} />
      <span>{t('journalUpload.fromGallery', 'From Gallery')}</span>
    </button>

    {fileCount > 0 && fileCount < maxPages && (
      <button
        className="glass-btn glass-btn-add"
        onClick={onAddMore}
        disabled={isCapturing}
      >
        <Plus size={18} />
        <span>{t('journalUpload.addMore', 'Add More')}</span>
      </button>
    )}
  </div>
  );
};

// Extracted: Glass Notes Field
const GlassNotesField = ({ value, onChange, placeholder }) => (
  <div className="glass-notes">
    <textarea
      className="glass-notes-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
    />
  </div>
);

const JournalUpload = ({ 
  onBack, 
  onUploadComplete, 
  dayNumber, 
  pathId,
  pathColor = '85, 139, 110' // Default to self-discovery green
}) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation('journey');

  // State (no localStorage persistence)
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const isMobile = Capacitor.isNativePlatform();
  const isVisualJourney = isVisualPath(pathId);
  const maxPages = Math.min(getMaxPages(pathId), 5);
  const instructions = getUploadInstructions(pathId);

  // Convert base64 to Blob
  const base64ToBlob = (base64String, mimeType = 'image/jpeg') => {
    const arr = base64String.split(',');
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mimeType });
  };

  // Resize image to 50% for performance
  const resizeImage = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width * 0.5;
          canvas.height = img.height * 0.5;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((resizedBlob) => {
            if (!resizedBlob) {
              reject(new Error('Failed to resize image'));
              return;
            }
            // Create data URL for preview
            const reader2 = new FileReader();
            reader2.onload = (e2) => resolve({ blob: resizedBlob, url: e2.target.result });
            reader2.onerror = reject;
            reader2.readAsDataURL(resizedBlob);
          }, blob.type, 0.85);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Add image to state
  const addImage = async (blob) => {
    if (files.length >= maxPages) {
      setError(t('journalUpload.errorMaxImages', 'Maximum {{count}} images allowed', { count: maxPages }));
      return;
    }

    try {
      const { blob: resizedBlob, url } = await resizeImage(blob);
      setFiles(prev => [...prev, resizedBlob]);
      setImages(prev => {
        const newImages = [...prev, url];
        setCurrentIndex(newImages.length - 1);
        return newImages;
      });
      setError('');
    } catch (err) {
      setError(t('journalUpload.errorProcessImage', 'Failed to process image'));
    }
  };

  // Camera capture
  const handleCamera = async () => {
    setIsCapturing(true);
    setError('');
    
    try {
      const permissions = await CapacitorCamera.checkPermissions();
      if (permissions.camera !== 'granted') {
        const result = await CapacitorCamera.requestPermissions();
        if (result.camera !== 'granted') {
          setError(t('journalUpload.errorCameraPermission', 'Camera permission required'));
          return;
        }
      }
      
      const image = await CapacitorCamera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      
      const blob = base64ToBlob(`data:image/${image.format};base64,${image.base64String}`);
      await addImage(blob);
    } catch (err) {
      if (!err.message?.includes('cancel')) {
        setError(t('journalUpload.errorCapturePhoto', 'Failed to capture photo'));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Gallery selection
  const handleGallery = async () => {
    setIsCapturing(true);
    setError('');
    
    try {
      const permissions = await CapacitorCamera.checkPermissions();
      if (permissions.photos !== 'granted') {
        const result = await CapacitorCamera.requestPermissions();
        if (result.photos !== 'granted') {
          setError(t('journalUpload.errorPhotoPermission', 'Photo library permission required'));
          return;
        }
      }
      
      const image = await CapacitorCamera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });
      
      const blob = base64ToBlob(`data:image/${image.format};base64,${image.base64String}`);
      await addImage(blob);
    } catch (err) {
      if (!err.message?.includes('cancel')) {
        setError(t('journalUpload.errorSelectPhoto', 'Failed to select photo'));
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // File input (web fallback)
  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (selectedFiles.length === 0) return;
    
    for (const file of selectedFiles) {
      if (files.length >= maxPages) break;
      await addImage(file);
    }
    e.target.value = '';
  };

  // Remove image
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (currentIndex >= newImages.length) {
        setCurrentIndex(Math.max(0, newImages.length - 1));
      }
      return newImages;
    });
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit and analyze
  const handleSubmit = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setShowLoader(true);
    setError('');
    
    try {
      let result;
      const isMultiPage = files.length > 1;
      
      if (isMultiPage) {
        const imageUrls = await uploadMultipleJournalImages(files, pathId, dayNumber, notes);
        result = {
          primaryImageUrl: imageUrls[0],
          additionalImages: imageUrls,
          // Always pass the local File objects through so analysis reads the
          // image directly instead of re-fetching the Storage download URL —
          // that fetch() fails with a CORS error (Storage URLs work fine in
          // <img> tags, but need CORS headers for fetch(), which this bucket
          // doesn't have configured).
          imageFiles: files
        };
      } else {
        const imageUrl = await uploadJournalImage(files[0], currentUser.uid, dayNumber, notes, pathId);
        result = {
          primaryImageUrl: imageUrl,
          additionalImages: [imageUrl],
          imageFiles: [files[0]]
        };
      }
      
      // Brief delay for satisfying transition
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onUploadComplete(
        result.primaryImageUrl,
        notes, // Pass notes instead of extracted text
        pathId,
        false,
        isMultiPage,
        result.additionalImages,
        result.imageFiles
      );
    } catch (err) {
      setError(t('journalUpload.errorUploadFailed', 'Upload failed: {{message}}', { message: err.message }));
      setIsUploading(false);
      setShowLoader(false);
    }
  };

  // Show loader during upload
  if (showLoader) {
    return (
      <KairosLoader
        size="large"
        fullScreen={true}
        message={t('journalUpload.loaderMessage', 'Analyzing Your Entry')}
        subMessage={t('journalUpload.loaderSubMessage', 'Claude is examining your images and crafting insights...')}
        variant="default"
      />
    );
  }

  return (
    <div className="upload-glass-container" style={{ '--c': pathColor }}>
      {/* Header */}
      <div className="upload-glass-header">
        <button className="upload-glass-back" onClick={onBack} disabled={isUploading}>
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Main Card */}
      <div className="upload-glass-card">
        <h1 className="upload-glass-title">{instructions.title}</h1>
        <p className="upload-glass-subtitle">
          {isVisualJourney
            ? t('journalUpload.subtitleVisual', 'Share your visual creation for artistic analysis')
            : t('journalUpload.subtitleText', 'Capture your journal pages for deep reflection')
          }
        </p>

        {images.length === 0 ? (
          /* Empty State: Show Glass Upload Icon + Action Buttons */
          <div className="upload-glass-empty">
            <GlassUploadIcon pathColorRgb={pathColor} />
            <div className="upload-glass-empty-text">
              <p>{t('journalUpload.noImages', 'No images added yet')}</p>
              <span>{t('journalUpload.useButtons', 'Use the buttons below to upload')}</span>
            </div>
            {isMobile ? (
              <GlassActionButtons
                onCamera={handleCamera}
                onGallery={handleGallery}
                fileCount={0}
                maxPages={maxPages}
                isCapturing={isCapturing}
              />
            ) : (
              <>
                <button 
                  className="glass-btn glass-btn-primary"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isCapturing}
                >
                  <ImagePlus size={20} />
                  <span>{t('journalUpload.selectImages', 'Select Images')}</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
              </>
            )}
            <p className="upload-glass-hint">
              {t('journalUpload.hint', 'Up to {{count}} images • JPG, PNG', { count: maxPages })}
            </p>
          </div>
        ) : (
          /* Has Images: Preview + Actions */
          <div className="upload-glass-content">
            <GlassImagePreview
              images={images}
              currentIndex={currentIndex}
              onRemove={removeImage}
              onIndexChange={setCurrentIndex}
            />

            <GlassActionButtons
              onCamera={handleCamera}
              onGallery={handleGallery}
              onAddMore={() => fileInputRef.current?.click()}
              fileCount={files.length}
              maxPages={maxPages}
              isCapturing={isCapturing}
            />
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />

            {/* Optional Notes for Visual Journeys */}
            {isVisualJourney && (
              <GlassNotesField
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('journalUpload.notesPlaceholder', 'Add any context about your creation (optional)...')}
              />
            )}

            {/* Submit Button */}
            <button 
              className="glass-btn glass-btn-submit"
              onClick={handleSubmit}
              disabled={isUploading || isCapturing}
            >
              <span>{t('journalUpload.submitAnalyze', 'Submit & Analyze')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="upload-glass-error">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default JournalUpload;