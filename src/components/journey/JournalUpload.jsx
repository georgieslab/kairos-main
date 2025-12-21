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
  Info,
  Image as ImageIcon,
  GripVertical,
  RotateCw,
  Eye,
  ImagePlus
} from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
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
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Get path-specific configurations
  const isVisualJourney = isVisualPath(pathId);
  const needsTextExtraction = requiresTextExtraction(pathId);
  const uploadInstructions = getUploadInstructions(pathId);
  const maxPages = Math.min(getMaxPages(pathId), 5); // Cap at 5 images
  const acceptedFileTypes = getAcceptedFileTypes(pathId);
  const analysisApproach = getAnalysisApproach(pathId);
  
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

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
    setIsCapturing(false);
  };

  // Enhanced camera capture with proper permissions
  const handleCameraCapture = async () => {
    if (files.length >= maxPages) {
      setError(`You can only upload up to ${maxPages} ${isVisualJourney ? 'images' : 'pages'} at once.`);
      return;
    }

    setIsCapturing(true);
    setError(''); // Clear any previous errors
    
    try {
      console.log('📸 Checking camera permissions...');
      
      // Check and request camera permissions
      const permissions = await CapacitorCamera.checkPermissions();
      console.log('📸 Current permissions:', permissions);
      
      let finalPermissions = permissions;
      
      // If permissions are denied or not determined, request them
      if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
        console.log('📸 Requesting camera and photo permissions...');
        finalPermissions = await CapacitorCamera.requestPermissions();
        console.log('📸 Permission result:', finalPermissions);
      }
      
      // Check if permissions were granted
      if (finalPermissions.camera === 'denied' || finalPermissions.photos === 'denied') {
        console.error('❌ Camera or photos permission denied');
        setError('Camera and photo access is required. Please enable permissions in your device settings.');
        setIsCapturing(false);
        return;
      }
      
      console.log('✅ Permissions granted, opening camera/gallery...');
      
      // Now capture the image
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt, // Show dialog to choose camera or gallery
        promptLabelHeader: 'Select Photo Source',
        promptLabelPhoto: 'From Gallery',
        promptLabelPicture: 'Take Photo',
      });

      console.log('✅ Image captured successfully');
      console.log('📸 Format:', image.format);
      console.log('📸 Base64 length:', image.base64String?.length || 0);

      // Convert base64 to File object with proper sequencing
      const fileName = `journal_${Date.now()}_${files.length + 1}.${image.format}`;
      const file = base64ToFile(`data:image/${image.format};base64,${image.base64String}`, fileName);
      
      console.log('✅ Processing captured image...');
      // Process the captured image
      addCapturedImage(file);
    } catch (error) {
      console.error('❌ Camera capture error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      
      // Don't show error if user cancelled
      if (error.message && error.message.includes('cancel')) {
        console.log('ℹ️ User cancelled photo selection');
      } else if (error.message && error.message.includes('permission')) {
        setError('Camera/photo permission denied. Please enable it in device settings.');
      } else if (error.message) {
        setError(`Failed to capture image: ${error.message}`);
      } else {
        setError('Failed to capture image. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Specific method to open camera directly
  const handleTakePhoto = async () => {
    if (files.length >= maxPages) {
      setError(`You can only upload up to ${maxPages} ${isVisualJourney ? 'images' : 'pages'} at once.`);
      return;
    }

    setIsCapturing(true);
    setError('');
    
    try {
      console.log('📷 Opening camera...');
      
      const permissions = await CapacitorCamera.checkPermissions();
      if (permissions.camera !== 'granted') {
        const result = await CapacitorCamera.requestPermissions();
        if (result.camera !== 'granted') {
          setError('Camera permission is required to take photos.');
          setIsCapturing(false);
          return;
        }
      }
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera, // Force camera
      });

      const fileName = `journal_${Date.now()}_${files.length + 1}.${image.format}`;
      const file = base64ToFile(`data:image/${image.format};base64,${image.base64String}`, fileName);
      addCapturedImage(file);
    } catch (error) {
      console.error('❌ Camera error:', error);
      if (!error.message?.includes('cancel')) {
        setError('Failed to take photo. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Specific method to open gallery directly
  const handleChooseFromGallery = async () => {
    if (files.length >= maxPages) {
      setError(`You can only upload up to ${maxPages} ${isVisualJourney ? 'images' : 'pages'} at once.`);
      return;
    }

    setIsCapturing(true);
    setError('');
    
    try {
      console.log('🖼️ Opening gallery...');
      
      const permissions = await CapacitorCamera.checkPermissions();
      if (permissions.photos !== 'granted') {
        const result = await CapacitorCamera.requestPermissions();
        if (result.photos !== 'granted') {
          setError('Photo library permission is required to select photos.');
          setIsCapturing(false);
          return;
        }
      }
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos, // Force gallery
      });

      const fileName = `journal_${Date.now()}_${files.length + 1}.${image.format}`;
      const file = base64ToFile(`data:image/${image.format};base64,${image.base64String}`, fileName);
      addCapturedImage(file);
    } catch (error) {
      console.error('❌ Gallery error:', error);
      if (!error.message?.includes('cancel')) {
        setError('Failed to select photo. Please try again.');
      }
    } finally {
      setIsCapturing(false);
    }
  };

  // Process captured image from camera with proper sequencing
  const addCapturedImage = (file) => {
    // Check if adding this file would exceed the limit
    if (files.length >= maxPages) {
      setError(`You can only upload up to ${maxPages} ${isVisualJourney ? 'images' : 'pages'} at once.`);
      return;
    }

    // Resize the image and add to state with preserved order
    resizeImage(file, (resizedFile, imageUrl) => {
      setFiles(prevFiles => {
        const newFiles = [...prevFiles, resizedFile];
        return newFiles;
      });
      setImages(prevImages => {
        const newImages = [...prevImages, imageUrl];
        // Set current page to the new image
        setCurrentPage(newImages.length - 1);
        return newImages;
      });
      
      setError('');
    });
  };

  // Process newly added files with preserved order
  const addNewFiles = (newFiles) => {
    // Check if adding these files would exceed the limit
    if (files.length + newFiles.length > maxPages) {
      setError(`You can only upload up to ${maxPages} ${isVisualJourney ? 'images' : 'pages'} at once.`);
      return;
    }

    // Filter for image files and maintain order
    const imageFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select image files (JPG, PNG, etc.)');
      return;
    }

    // Process each image file to resize it while preserving order
    const processFilesSequentially = async () => {
      const newResizedFiles = [];
      const newImageUrls = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        await new Promise((resolve) => {
          resizeImage(file, (resizedFile, imageUrl) => {
            newResizedFiles.push(resizedFile);
            newImageUrls.push(imageUrl);
            resolve();
          });
        });
      }

      // Update state with all new files at once to preserve order
      setFiles(prevFiles => [...prevFiles, ...newResizedFiles]);
      setImages(prevImages => {
        const updatedImages = [...prevImages, ...newImageUrls];
        // Set current page to the first new image if this is the first upload
        if (prevImages.length === 0) {
          setCurrentPage(0);
        }
        return updatedImages;
      });

      setError('');
    };

    processFilesSequentially();
  };

  // Handle file selection (for web fallback)
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    addNewFiles(selectedFiles);
    // Reset the input to allow selecting the same files again if needed
    event.target.value = '';
  };

  // Enhanced drag and drop for file upload
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

  // Drag and drop reordering functions
  const handleImageDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleImageDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      const newImages = [...images];
      const newFiles = [...files];
      
      // Remove items from drag position
      const [draggedImage] = newImages.splice(dragIndex, 1);
      const [draggedFile] = newFiles.splice(dragIndex, 1);
      
      // Insert items at drop position
      newImages.splice(dropIndex, 0, draggedImage);
      newFiles.splice(dropIndex, 0, draggedFile);
      
      setImages(newImages);
      setFiles(newFiles);
      
      // Update current page if needed
      if (currentPage === dragIndex) {
        setCurrentPage(dropIndex);
      } else if (currentPage === dropIndex) {
        setCurrentPage(dragIndex);
      }
    }
    
    setDragOverIndex(null);
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

  // Navigate to specific page
  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
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
              <div className="upload-options">
                {/* Enhanced Camera/Gallery buttons for mobile with separate options */}
                {isMobile && (
                  <div className="mobile-upload-buttons">
                    <button 
                      className={`action-button primary camera-button ${isCapturing ? 'loading' : ''}`}
                      onClick={handleTakePhoto}
                      disabled={isCapturing || files.length >= maxPages}
                    >
                      {isCapturing ? (
                        <>
                          <div className="loading-spinner-small"></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          <Camera className="camera-icon" />
                          Take Photo
                        </>
                      )}
                    </button>
                    
                    <button 
                      className={`action-button primary gallery-button ${isCapturing ? 'loading' : ''}`}
                      onClick={handleChooseFromGallery}
                      disabled={isCapturing || files.length >= maxPages}
                    >
                      {isCapturing ? (
                        <>
                          <div className="loading-spinner-small"></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          <ImagePlus className="camera-icon" />
                          Choose from Gallery
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {/* Enhanced Drag and drop area */}
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
                    {isMobile ? 'Or select files manually' : uploadInstructions.dropText}
                  </p>
                  <p className="drop-subtext">
                    Upload up to {maxPages} {isVisualJourney ? 'images' : 'pages'} • JPG, PNG accepted
                  </p>
                  <button 
                    className="action-button secondary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <ImageIcon size={16} style={{ marginRight: '4px' }} />
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
              </div>
            ) : (
              <>
                {/* Enhanced Image Gallery with Thumbnails */}
                <div className="image-gallery-container">
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

                  {/* Thumbnail strip with drag-and-drop reordering */}
                  {images.length > 1 && (
                    <div className="thumbnail-strip">
                      <p className="thumbnail-strip-title">
                        <GripVertical size={16} />
                        Drag to reorder your {isVisualJourney ? 'images' : 'pages'}
                      </p>
                      <div className="thumbnail-container">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className={`thumbnail-item ${index === currentPage ? 'active' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
                            draggable
                            onDragStart={(e) => handleImageDragStart(e, index)}
                            onDragOver={(e) => handleImageDragOver(e, index)}
                            onDragLeave={handleImageDragLeave}
                            onDrop={(e) => handleImageDrop(e, index)}
                            onClick={() => goToPage(index)}
                          >
                            <img src={image} alt={`Thumbnail ${index + 1}`} className="thumbnail-image" />
                            <div className="thumbnail-number">{index + 1}</div>
                            <button 
                              className="thumbnail-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="image-preview-actions">
                  <button 
                    className="image-action-button remove"
                    onClick={() => removeImage(currentPage)}
                  >
                    <Trash className="image-action-icon" />
                    Remove {isVisualJourney ? 'Image' : 'Page'}
                  </button>
                  
                  {files.length < maxPages && (
                    <>
                      {isMobile && (
                        <>
                          <button 
                            className={`action-button secondary ${isCapturing ? 'loading' : ''}`}
                            onClick={handleTakePhoto}
                            disabled={isCapturing}
                          >
                            {isCapturing ? (
                              <>
                                <div className="loading-spinner-small"></div>
                                Opening...
                              </>
                            ) : (
                              <>
                                <Camera size={16} style={{ marginRight: '4px' }} />
                                Take Photo
                              </>
                            )}
                          </button>
                          <button 
                            className={`action-button secondary ${isCapturing ? 'loading' : ''}`}
                            onClick={handleChooseFromGallery}
                            disabled={isCapturing}
                          >
                            {isCapturing ? (
                              <>
                                <div className="loading-spinner-small"></div>
                                Opening...
                              </>
                            ) : (
                              <>
                                <ImagePlus size={16} style={{ marginRight: '4px' }} />
                                From Gallery
                              </>
                            )}
                          </button>
                        </>
                      )}
                      <button 
                        className="action-button secondary"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Plus size={16} style={{ marginRight: '4px' }} />
                        {isMobile ? 'Select Files' : `Add More ${isVisualJourney ? 'Images' : 'Pages'}`}
                      </button>
                    </>
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
          
          {/* Enhanced Upload Information */}
          {images.length > 0 && (
            <div className="upload-info animate-fade-up">
              <div className="upload-info-stats">
                <div className="upload-stat">
                  <span className="stat-number">{files.length}</span>
                  <span className="stat-label">of {maxPages} {isVisualJourney ? 'images' : 'pages'}</span>
                </div>
                {files.length > 1 && (
                  <div className="upload-stat">
                    <Eye size={16} />
                    <span className="stat-label">Viewing page {currentPage + 1}</span>
                  </div>
                )}
              </div>
              
              <div className="upload-progress-visual">
                <div className="progress-dots">
                  {Array.from({ length: maxPages }, (_, index) => (
                    <div 
                      key={index}
                      className={`progress-dot ${index < files.length ? 'filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
              
              {files.length === maxPages && (
                <p className="upload-complete-message">
                  <Check size={16} />
                  Maximum {isVisualJourney ? 'images' : 'pages'} uploaded - Ready to analyze!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalUpload;