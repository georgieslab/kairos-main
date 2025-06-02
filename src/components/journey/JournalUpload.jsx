import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  X, 
  AlertCircle, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash, 
  FileText,
  Palette,
  Info
} from 'lucide-react';
import { uploadJournalImage, extractTextFromImage, uploadMultipleJournalImages } from '../../services/claudeService';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  isVisualPath, 
  requiresTextExtraction, 
  getUploadInstructions, 
  getMaxPages,
  getAcceptedFileTypes,
  getAnalysisApproach 
} from '../../utils/pathTypeUtils';
import '../../styles/components/JournalUpload.css';

const JournalUpload = ({ 
  onBack, 
  onUploadComplete, 
  dayNumber, 
  pathId,
  unifiedUpload = false
}) => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Get path-specific configurations
  const isVisualJourney = isVisualPath(pathId);
  const needsTextExtraction = requiresTextExtraction(pathId);
  const uploadInstructions = getUploadInstructions(pathId);
  const maxPages = getMaxPages(pathId);
  const acceptedFileTypes = getAcceptedFileTypes(pathId);
  const analysisApproach = getAnalysisApproach(pathId);
  
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Helper function to resize an image by 50%
  const resizeImage = (file, callback) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (50% of original)
        const newWidth = img.width * 0.5;
        const newHeight = img.height * 0.5;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert canvas to a new File object
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          callback(resizedFile, URL.createObjectURL(resizedFile));
        }, file.type, 0.8); // Use 0.8 quality for JPEG
      };
    };
    
    reader.readAsDataURL(file);
  };

  // Reset component state
  const resetState = () => {
    setImages([]);
    setFiles([]);
    setExtractedText('');
    setError('');
    setExtractionProgress(0);
    setUploadProgress(0);
    setIsExtracting(false);
    setIsUploading(false);
    setIsButtonClicked(false);
    setCurrentPage(0);
  };

  // Process newly added files
  const addNewFiles = (newFiles) => {
    // Check if adding these files would exceed the limit
    if (files.length + newFiles.length > maxPages) {
      setError(`You can only upload up to ${maxPages} ${isVisualJourney ? 'images' : 'pages'} at once.`);
      return;
    }

    // Filter for image files
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select image files (JPG, PNG, etc.)');
      return;
    }

    // Process each image file to resize it
    const resizedImages = [];
    const resizedFiles = [];
    let processedCount = 0;

    imageFiles.forEach((file) => {
      resizeImage(file, (resizedFile, imageUrl) => {
        resizedFiles.push(resizedFile);
        resizedImages.push(imageUrl);
        processedCount++;

        // When all files are processed, update state
        if (processedCount === imageFiles.length) {
          setFiles(prevFiles => [...prevFiles, ...resizedFiles]);
          setImages(prevImages => [...prevImages, ...resizedImages]);
          
          // Set current page to the first new image if this is the first upload
          if (images.length === 0) {
            setCurrentPage(0);
          }

          setError('');
        }
      });
    });
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    addNewFiles(selectedFiles);
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
    URL.revokeObjectURL(images[index]);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
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
      let combinedText = '';
      for (let i = 0; i < files.length; i++) {
        setExtractionProgress(Math.round(((i) / files.length) * 100));
        const result = await extractTextFromImage(files[i]);
        
        if (i > 0) {
          combinedText += `\n\n--- Page ${i + 1} ---\n\n`;
        } else if (files.length > 1) {
          combinedText += `--- Page 1 ---\n\n`;
        }
        
        combinedText += result.text;
        await new Promise(r => setTimeout(r, 300));
      }
      
      setExtractionProgress(100);
      setExtractedText(combinedText);
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

  // Handle the upload process
  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image first.');
      return;
    }
    
    // For visual journeys, we don't require text extraction
    if (isVisualJourney && !extractedText) {
      console.log('Visual journey detected - proceeding without text extraction');
    } else if (!isVisualJourney && !extractedText) {
      setError('Please extract text from your journal entry first.');
      return;
    }
    
    setIsButtonClicked(true);
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 5);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      let result;
      const isMultiPage = files.length > 1;
      
      if (isMultiPage) {
        const imageUrls = await uploadMultipleJournalImages(
          files,
          pathId,
          dayNumber,
          extractedText
        );
        
        result = {
          primaryImageUrl: imageUrls[0],
          additionalImages: imageUrls,
          imageFiles: isVisualJourney ? files : null
        };
      } else {
        const imageUrl = await uploadJournalImage(
          files[0],
          currentUser.uid,
          dayNumber,
          extractedText,
          pathId
        );
        
        result = {
          primaryImageUrl: imageUrl,
          additionalImages: [imageUrl],
          imageFiles: isVisualJourney ? [files[0]] : null
        };
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadComplete(
          result.primaryImageUrl, 
          extractedText, 
          pathId, 
          false, // Never textOnly anymore
          isMultiPage, 
          result.additionalImages,
          result.imageFiles
        );
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Failed to upload ${isVisualJourney ? 'artwork' : 'journal'}: ${error.message}`);
      setIsUploading(false);
      setIsButtonClicked(false);
    }
  };

  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  return (
    <div className={`upload-container ${themeClass}`}>
      <div className="upload-header">
        <button className="back-button" onClick={onBack} disabled={isUploading || isExtracting || isButtonClicked}>
          <ArrowLeft className="icon-small" />
          <span>Back</span>
        </button>
      </div>

      <div className="upload-card animate-fade-up">
        <h1 className="upload-title">
          {uploadInstructions.title}
        </h1>
        
        <div className="upload-stages">
          <div className={`upload-stage ${images.length === 0 ? 'active' : 'completed'}`}>
            <div className="stage-header">
              <div className="stage-number">1</div>
              <div className="stage-title">
                {uploadInstructions.stageTitle}
              </div>
              {images.length > 0 && <Check className="stage-check" />}
            </div>
            
            {images.length === 0 ? (
              <div 
                ref={dropAreaRef}
                className={`drop-area ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="drop-icon" />
                <p className="drop-text">
                  {uploadInstructions.dropText}
                </p>
                <button 
                  className="action-button secondary"
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploadInstructions.selectButtonText}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  style={{ display: 'none' }} 
                  accept={acceptedFileTypes}
                  multiple={maxPages > 1}
                />
              </div>
            ) : (
              <>
                <div className="image-carousel">
                  <img 
                    src={images[currentPage]} 
                    alt={`${isVisualJourney ? 'Artwork' : 'Journal'} page ${currentPage + 1}`} 
                    className="image-preview" 
                  />
                  
                  <div className="page-indicator">
                    {isVisualJourney ? 'Image' : 'Page'} {currentPage + 1} of {images.length}
                  </div>
                  
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
                
                <div className="image-preview-actions">
                  <button 
                    className="image-action-button"
                    onClick={() => removeImage(currentPage)}
                  >
                    <Trash className="image-action-icon" />
                    Remove {isVisualJourney ? 'Image' : 'Page'}
                  </button>
                  
                  {files.length < maxPages && maxPages > 1 && (
                    <button 
                      className="action-button secondary"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Plus size={16} style={{ marginRight: '4px' }} />
                      Add More {isVisualJourney ? 'Images' : 'Pages'} ({files.length}/{maxPages})
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className={`upload-stage ${images.length > 0 ? 'active' : ''}`}>
            <div className="stage-header">
              <div className="stage-number">2</div>
              <div className="stage-title">
                {isVisualJourney ? 'Review and Analyze Visual Entry' : 'Review and Submit'}
              </div>
              {(extractedText || isVisualJourney) && !isExtracting && <Check className="stage-check" />}
            </div>
            
            {images.length > 0 && (
              <>
                {isVisualJourney ? (
                  <div className="visual-journey-ready">
                    <div className="visual-ready-icon">
                      <Palette className="icon" />
                    </div>
                    <p className="visual-ready-text">
                      {uploadInstructions.analysisText} 
                      Claude will examine the artistic elements, colors, composition, 
                      and emotional expression in your {images.length > 1 ? 'images' : 'image'}.
                    </p>
                    {!extractedText && (
                      <div className="visual-note">
                        <Info className="note-icon" />
                        <p>No text extraction needed for visual journaling paths.</p>
                      </div>
                    )}
                    
                    <div className="visual-notes-section">
                      <h4 className="visual-notes-title">
                        {uploadInstructions.notesTitle}
                      </h4>
                      <textarea
                        className="visual-notes-textarea"
                        value={extractedText}
                        onChange={handleTextChange}
                        placeholder={uploadInstructions.notesPlaceholder}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {isExtracting ? (
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
                    ) : extractedText ? (
                      <div className="extracted-text-container">
                        <div className="extracted-text-header">
                          <h4 className="extracted-text-title">
                            <FileText className="text-icon" />
                            Extracted Text
                          </h4>
                          <p className="extracted-text-help">Review and edit if needed before submitting</p>
                        </div>
                        <textarea
                          className="extracted-text-editor"
                          value={extractedText}
                          onChange={handleTextChange}
                          placeholder="You can edit the extracted text here or add your own notes..."
                        />
                      </div>
                    ) : (
                      <div className="upload-analyze-container">
                        <p className="upload-analyze-text">
                          {uploadInstructions.analysisDescription}
                        </p>
                        <button 
                          className="action-button primary upload-analyze-button"
                          onClick={handleExtractText}
                          disabled={isExtracting || files.length === 0}
                        >
                          <Camera className="upload-analyze-icon" />
                          Upload and Analyze
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}
          
          {images.length > 0 && (extractedText || isVisualJourney) && !isExtracting && (
            <button 
              className={`submit-button ${isButtonClicked ? 'clicked' : ''} ${isUploading ? 'loading' : ''}`}
              onClick={handleUpload}
              disabled={isUploading || isExtracting || isButtonClicked}
            >
              {isUploading ? (
                <>
                  <svg className="loading-spinner" viewBox="0 0 24 24" width="16" height="16">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path fill="none" stroke="white" strokeWidth="4" d="M12 2a10 10 0 0 1 10 10"></path>
                  </svg>
                  Uploading ({uploadProgress}%)
                </>
              ) : isButtonClicked ? (
                <>
                  <div className="pulse-dot"></div>
                  Preparing Upload...
                </>
              ) : (
                <>{uploadInstructions.submitButtonText}</>
              )}
            </button>
          )}
          
          {images.length > 0 && (
            <div className="upload-info animate-fade-up">
              <p>You've uploaded {files.length} of {maxPages} possible {isVisualJourney ? 'images' : 'pages'}</p>
              {files.length === maxPages && (
                <p className="page-limit-warning">Maximum number of {isVisualJourney ? 'images' : 'pages'} reached</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalUpload;