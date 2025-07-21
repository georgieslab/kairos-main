import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { ArrowLeft, Camera, Upload, X, AlertCircle, Check, ChevronLeft, ChevronRight, Plus, Trash, Image as ImageIcon } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
=======
import { ArrowLeft, Camera, Upload, X, AlertCircle, Check, ChevronLeft, ChevronRight, Plus, Trash } from 'lucide-react';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import { extractTextFromImages } from '../../services/claudeService';

const MultiImageJournalUpload = ({ 
  onBack, 
  onSubmit, 
  dayNumber, 
  pathId,
  maxPages = 5, // Increased from 2 to 5 pages maximum
  prompt,
  theme 
}) => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  // Add these missing state variables
  const [isUploading, setIsUploading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // For drag-and-drop functionality
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef(null);

<<<<<<< HEAD
  // Check if we're running on a mobile device
  const isMobile = Capacitor.isNativePlatform();

  // Helper function to convert base64 to File object
  const base64ToFile = (base64String, fileName) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  // Clear any errors when images change
  useEffect(() => {
    if (images.length > 0) {
      setError('');
    }
  }, [images]);

<<<<<<< HEAD
  // Handle camera capture using Capacitor Camera plugin
  const handleCameraCapture = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt, // This will show the camera/gallery selection dialog
      });

      // Convert base64 to File object
      const fileName = `journal_${Date.now()}.${image.format}`;
      const file = base64ToFile(`data:image/${image.format};base64,${image.base64String}`, fileName);
      
      // Process the captured image
      addCapturedImage(file);
    } catch (error) {
      console.error('Camera capture error:', error);
      if (error.message !== 'User cancelled photos app') {
        setError('Failed to capture image. Please try again.');
      }
    }
  };

  // Process captured image from camera
  const addCapturedImage = (file) => {
    // Check if adding this file would exceed the limit
    if (files.length >= maxPages) {
      setError(`You can only upload up to ${maxPages} pages at once.`);
      return;
    }

    // Create URL for preview and add to state
    const imageUrl = URL.createObjectURL(file);
    setFiles(prevFiles => [...prevFiles, file]);
    setImages(prevImages => [...prevImages, imageUrl]);
    
    // Set current page to the new image if this is the first upload
    if (images.length === 0) {
      setCurrentPage(0);
    }

    setError('');
  };

=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    addNewFiles(selectedFiles);
  };

  // Process newly added files
  const addNewFiles = (newFiles) => {
    // Check if adding these files would exceed the limit
    if (files.length + newFiles.length > maxPages) {
      setError(`You can only upload up to ${maxPages} pages at once.`);
      return;
    }

    // Filter for image files
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select image files (JPG, PNG, etc.)');
      return;
    }

    // Create URLs for preview
    const newImageURLs = imageFiles.map(file => URL.createObjectURL(file));
    
    // Update state
    setFiles(prevFiles => [...prevFiles, ...imageFiles]);
    setImages(prevImages => [...prevImages, ...newImageURLs]);
    
    // Set current page to the first new image if this is the first upload
    if (images.length === 0) {
      setCurrentPage(0);
    }
<<<<<<< HEAD

    setError('');
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropAreaRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Navigation between pages
  const goToNextPage = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Remove a specific image
  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(images[index]);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Adjust current page if necessary
    if (index === currentPage && newImages.length > 0) {
      setCurrentPage(Math.min(currentPage, newImages.length - 1));
    } else if (newImages.length === 0) {
      setCurrentPage(0);
    }
  };

  // Extract text from images
  const handleExtractText = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image first.');
      return;
    }

    setIsExtracting(true);
    setExtractionProgress(0);
    setError('');

    try {
      // Process images sequentially and show progress
      let combinedText = '';
      for (let i = 0; i < files.length; i++) {
        // Update progress
        setExtractionProgress(Math.round(((i) / files.length) * 100));
        
        // Extract text from this image
        const result = await extractTextFromImages(files[i]);
        
        // Add page separator if this isn't the first page
        if (i > 0) {
          combinedText += `\n\n--- Page ${i + 1} ---\n\n`;
        } else {
          combinedText += `--- Page 1 ---\n\n`;
        }
        
        // Add extracted text
        combinedText += result[0].text;
        
        // Small delay for UX
        await new Promise(r => setTimeout(r, 300));
      }
      
      // Final progress update
      setExtractionProgress(100);
      
      // Set the combined text
      setExtractedText(combinedText);
      
      // Short delay before completing to show 100%
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error('Text extraction error:', error);
      setError(`Failed to extract text: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle text changes
  const handleTextChange = (e) => {
    setExtractedText(e.target.value);
  };

  // Submit the journal entry - Updated
  const handleSubmit = () => {
    if (files.length === 0) {
      setError('Please upload at least one image first.');
      return;
    }
    
    console.log('MultiImageJournalUpload submitting:', {
      fileCount: files.length,
      extractedTextLength: extractedText.length,
      pathId
    });
    
    setIsButtonClicked(true);
    
    setTimeout(() => {
      setIsUploading(true);
      onSubmit(files, extractedText, pathId);
    }, 100);
  };

  return (
    <div className="upload-container">
      <button className="back-button" onClick={onBack} disabled={isExtracting || isUploading || isButtonClicked}>
        <ArrowLeft className="icon-small" />
        <span>Back</span>
      </button>

      <div className="upload-card">
        <h1 className="upload-title">Upload Journal Pages</h1>
        
        {/* Prompt display */}
        <div className="prompt-container">
          <div className="prompt-label">Today's Prompt:</div>
          <p className="prompt-text">{prompt || "Reflect on your day..."}</p>
          {theme && <p className="theme-text">Theme: {theme}</p>}
        </div>

        {/* Main upload area */}
        <div className="upload-stages">
          {/* Stage 1: Image Upload */}
          <div className={`upload-stage ${images.length === 0 ? 'active' : 'completed'}`}>
            <div className="stage-header">
              <div className="stage-number">1</div>
              <div className="stage-title">Upload Journal Pages</div>
              {images.length > 0 && <Check className="stage-check" />}
            </div>
            
            {images.length === 0 ? (
<<<<<<< HEAD
              <div className="upload-options">
                {/* Camera/Gallery button for mobile */}
                {isMobile && (
                  <button 
                    className="action-button primary camera-button"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="camera-icon" />
                    Take Photo or Choose from Gallery
                  </button>
                )}
                
                {/* Drag and drop area for web or as fallback */}
                <div 
                  ref={dropAreaRef}
                  className={`drop-area ${isDragging ? 'dragging' : ''} ${isMobile ? 'mobile-fallback' : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="drop-icon" />
                  <p className="drop-text">
                    {isMobile ? 'Or select files manually' : 'Drag and drop your journal pages here, or click to select files'}
                  </p>
                  <button 
                    className="action-button secondary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <ImageIcon size={16} style={{ marginRight: '4px' }} />
                    Select Files
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    multiple
                  />
                </div>
=======
              <div 
                ref={dropAreaRef}
                className={`drop-area ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="drop-icon" />
                <p className="drop-text">Drag and drop your journal pages here, or click to select files</p>
                <button 
                  className="action-button secondary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Select Files
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  multiple
                />
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
              </div>
            ) : (
              <>
                {/* Image carousel */}
                <div className="image-carousel">
                  <img 
                    src={images[currentPage]} 
                    alt={`Journal page ${currentPage + 1}`} 
                    className="image-preview" 
                  />
                  
                  {/* Page indicator */}
                  <div className="page-indicator">
                    Page {currentPage + 1} of {images.length}
                  </div>
                  
                  {/* Navigation controls */}
                  {images.length > 1 && (
                    <div className="carousel-controls">
                      <button 
                        className="carousel-button"
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        className="carousel-button"
                        onClick={goToNextPage}
                        disabled={currentPage === images.length - 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Image actions */}
                <div className="image-preview-actions">
                  <button 
                    className="image-action-button"
                    onClick={() => removeImage(currentPage)}
                  >
                    <Trash className="image-action-icon" />
                    Remove Page
                  </button>
                  
                  {files.length < maxPages && (
<<<<<<< HEAD
                    <>
                      {isMobile && (
                        <button 
                          className="action-button secondary"
                          onClick={handleCameraCapture}
                        >
                          <Camera size={16} style={{ marginRight: '4px' }} />
                          Add More ({files.length}/{maxPages})
                        </button>
                      )}
                      <button 
                        className="action-button secondary"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Plus size={16} style={{ marginRight: '4px' }} />
                        {isMobile ? 'Select Files' : 'Add More Pages'} ({files.length}/{maxPages})
                      </button>
                    </>
=======
                    <button 
                      className="action-button secondary"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Plus size={16} style={{ marginRight: '4px' }} />
                      Add More Pages ({files.length}/{maxPages})
                    </button>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Stage 2: Extract Text */}
          <div className={`upload-stage ${images.length > 0 && !extractedText ? 'active' : (extractedText ? 'completed' : '')}`}>
            <div className="stage-header">
              <div className="stage-number">2</div>
              <div className="stage-title">Extract Text</div>
              {extractedText && <Check className="stage-check" />}
            </div>
            
            {images.length > 0 && (
              <>
                {!extractedText && !isExtracting ? (
                  <div className="extract-prompt">
                    <AlertCircle className="extract-icon" />
                    <p className="extract-text">
                      Do you want to extract text from the {images.length > 1 ? `${images.length} pages` : 'image'}?
                    </p>
                    <div className="extract-actions">
                      <button 
                        className="action-button primary"
                        onClick={handleExtractText}
                      >
                        Extract Text
                      </button>
                      <button 
                        className="action-button secondary"
                        onClick={() => setExtractedText(' ')} // Set minimal text to move to next stage
                      >
                        Skip (Image Only)
                      </button>
                    </div>
                  </div>
                ) : isExtracting ? (
                  <div className="scanning-container">
                    <div className="scanning-info">
                      <Camera className="scanning-icon" />
                      <p className="scanning-text">
                        Analyzing journal {images.length > 1 ? 'pages' : 'page'}...
                      </p>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${extractionProgress}%` }}
                        ></div>
                      </div>
                      <p className="progress-text">
                        {extractionProgress < 100 
                          ? `Extracting text (${extractionProgress}%)`
                          : 'Extraction complete!'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="extracted-text-container">
                    <textarea
                      className="extracted-text-editor"
                      value={extractedText}
                      onChange={handleTextChange}
                      placeholder="You can edit the extracted text here or add your own notes..."
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Submit button - Updated with feedback states */}
          <div className="button-container">
            <button 
              className={`submit-button ${isButtonClicked ? 'clicked' : ''} ${isUploading ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={files.length === 0 || isExtracting || isUploading || isButtonClicked}
            >
              {isUploading ? (
                <>
                  <svg className="loading-spinner" viewBox="0 0 24 24" width="16" height="16">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path fill="none" stroke="white" strokeWidth="4" d="M12 2a10 10 0 0 1 10 10"></path>
                  </svg>
                  Processing...
                </>
              ) : isButtonClicked ? (
                <>
                  <div className="pulse-dot"></div>
                  Preparing Upload...
                </>
              ) : (
                <>Upload Journal</>
              )}
            </button>
          </div>
          
          {/* Upload info */}
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>You've uploaded {files.length} of {maxPages} possible pages</p>
            {files.length === maxPages && (
              <p className="text-amber-400 mt-1">Maximum number of pages reached</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiImageJournalUpload;