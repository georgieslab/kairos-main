// src/components/voice/VoiceJournalUpload.jsx - Mobile Live Transcription Enabled
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft,
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  Volume2,
  Edit3,
  Smartphone,
  Shield,
  ToggleLeft,
  ToggleRight,
  Headphones
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { uploadVoiceJournal } from '../../services/claudeService';
import '../../styles/VoiceJournalUpload.css';

const VoiceJournalUpload = ({ 
  pathId, 
  dayNumber, 
  onUploadComplete, 
  onBack,
  prompt 
}) => {
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [stage, setStage] = useState('record'); // 'record', 'review', 'transcribe', 'edit'
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState('');
  
  // Mobile-specific states
  const [hasPermission, setHasPermission] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  
  // 🎤 NEW: Live transcription states for mobile
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  const [liveTranscriptionEnabled, setLiveTranscriptionEnabled] = useState(true);
  const [speechRecognitionError, setSpeechRecognitionError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionRestartTimeoutRef = useRef(null);

  // 🎤 Mobile detection and speech recognition check on mount
  useEffect(() => {
    const detectMobileAndSpeechSupport = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
      
      // 🎤 Check speech recognition support on ALL devices (including mobile)
      const speechSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
      setSpeechRecognitionSupported(speechSupported);
      
      console.log('📱 Device detection:', isMobile ? 'Mobile' : 'Desktop');
      console.log('🗣️ Speech recognition supported:', speechSupported);
      
      // Auto-enable live transcription if supported
      if (speechSupported) {
        setLiveTranscriptionEnabled(true);
      }
      
      return { isMobile, speechSupported };
    };

    const checkInitialPermissions = async () => {
      const { isMobile, speechSupported } = detectMobileAndSpeechSupport();
      
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' });
          setPermissionStatus(permission.state);
          console.log('🎤 Initial permission status:', permission.state);
          
          if (permission.state === 'granted') {
            setHasPermission(true);
          }
          
          // Listen for permission changes
          permission.onchange = () => {
            setPermissionStatus(permission.state);
            setHasPermission(permission.state === 'granted');
          };
        } catch (error) {
          console.warn('Permission query not supported:', error);
          setPermissionStatus('unknown');
        }
      }
    };

    checkInitialPermissions();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(error => {
        console.warn('Error closing AudioContext:', error);
      });
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn('Error stopping recognition:', error);
      }
    }
    if (recognitionRestartTimeoutRef.current) {
      clearTimeout(recognitionRestartTimeoutRef.current);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Audio level monitoring (desktop only)
  const monitorAudioLevel = () => {
    if (analyserRef.current && !isMobileDevice) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      if (isRecording && !isPaused) {
        animationRef.current = requestAnimationFrame(monitorAudioLevel);
      }
    }
  };

  // 🎤 ENHANCED: Mobile-optimized speech recognition with auto-restart
  const initializeSpeechRecognition = () => {
    if (!speechRecognitionSupported || !liveTranscriptionEnabled) {
      console.log('🗣️ Speech recognition disabled or not supported');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // 🎤 Mobile-optimized settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    
    // 🎤 Enhanced language detection
    const userLang = navigator.language || 'en-US';
    recognition.lang = userLang;
    console.log('🗣️ Using language:', userLang);
    
    // 🎤 Mobile-specific settings
    if (isMobileDevice) {
      // More aggressive settings for mobile
      recognition.continuous = true;
      recognition.interimResults = true;
    }

    let currentFinalTranscript = '';
    let currentInterimTranscript = '';

    recognition.onstart = () => {
      console.log('🗣️ Speech recognition started');
      setIsListening(true);
      setSpeechRecognitionError('');
    };

    recognition.onresult = (event) => {
      let newInterimTranscript = '';
      let newFinalTranscript = currentFinalTranscript;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        console.log('🗣️ Speech result:', {
          transcript,
          confidence,
          isFinal: event.results[i].isFinal,
          index: i
        });
        
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript + ' ';
          currentFinalTranscript = newFinalTranscript;
        } else {
          newInterimTranscript += transcript;
        }
      }
      
      // Update state
      setFinalTranscript(newFinalTranscript);
      setInterimTranscript(newInterimTranscript);
      
      // Combined transcript for display
      const fullTranscript = newFinalTranscript + newInterimTranscript;
      setTranscription(fullTranscript);
      
      if (!isEditingTranscription) {
        setEditedTranscription(fullTranscript);
      }
      
      currentInterimTranscript = newInterimTranscript;
    };

    recognition.onerror = (event) => {
      console.error('🗣️ Speech recognition error:', event.error);
      setIsListening(false);
      
      const errorMessages = {
        'no-speech': 'No speech detected. Continue speaking...',
        'audio-capture': 'Audio capture failed. Check your microphone.',
        'not-allowed': 'Microphone permission denied.',
        'network': 'Network error. Check your connection.',
        'service-not-allowed': 'Speech service not available.',
        'bad-grammar': 'Speech recognition grammar error.',
        'language-not-supported': 'Language not supported for speech recognition.'
      };
      
      const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
      
      // Don't show error for common issues that auto-recover
      if (!['no-speech', 'audio-capture'].includes(event.error)) {
        setSpeechRecognitionError(errorMessage);
        
        // For critical errors, disable live transcription
        if (['not-allowed', 'service-not-allowed', 'language-not-supported'].includes(event.error)) {
          setLiveTranscriptionEnabled(false);
          setError(`Speech recognition: ${errorMessage}`);
        }
      }
      
      // Auto-restart for recoverable errors on mobile
      if (isRecording && isMobileDevice && ['no-speech', 'audio-capture', 'network'].includes(event.error)) {
        console.log('🔄 Auto-restarting speech recognition on mobile...');
        recognitionRestartTimeoutRef.current = setTimeout(() => {
          if (isRecording && liveTranscriptionEnabled) {
            try {
              recognition.start();
            } catch (restartError) {
              console.warn('Failed to restart speech recognition:', restartError);
            }
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      console.log('🗣️ Speech recognition ended');
      setIsListening(false);
      
      // Save final transcript
      if (currentFinalTranscript.trim()) {
        const cleanTranscript = currentFinalTranscript.trim();
        setFinalTranscript(cleanTranscript);
        setTranscription(cleanTranscript);
        if (!isEditingTranscription) {
          setEditedTranscription(cleanTranscript);
        }
      }
      
      // Auto-restart if still recording (important for mobile)
      if (isRecording && !isPaused && liveTranscriptionEnabled) {
        console.log('🔄 Auto-restarting speech recognition...');
        recognitionRestartTimeoutRef.current = setTimeout(() => {
          if (isRecording && liveTranscriptionEnabled) {
            try {
              recognition.start();
            } catch (restartError) {
              console.warn('Failed to restart speech recognition:', restartError);
            }
          }
        }, 100);
      }
    };

    return recognition;
  };

  // Microphone permission check function
  const checkMicrophonePermission = async () => {
    try {
      console.log('🎤 Checking microphone permission...');
      
      const testStream = await navigator.mediaDevices.getUserMedia({ 
        audio: isMobileDevice ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      
      testStream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      setPermissionStatus('granted');
      setError('');
      console.log('✅ Microphone permission granted');
      
      return true;
    } catch (err) {
      console.error('❌ Microphone permission denied:', err);
      setHasPermission(false);
      setPermissionStatus('denied');
      
      let errorMessage = 'Microphone access required. ';
      
      if (err.name === 'NotAllowedError') {
        if (isMobileDevice) {
          errorMessage += 'Please allow microphone permission in your browser settings. On mobile, you may need to refresh the page after granting permission.';
        } else {
          errorMessage += 'Please allow microphone permission and try again.';
        }
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No microphone found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += isMobileDevice ? 
          'Voice recording not supported on this mobile browser. Try using Chrome or Safari.' :
          'Microphone not supported on this browser.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Microphone is being used by another application. Please close other apps using the microphone.';
      } else if (err.message && err.message.includes('https')) {
        errorMessage += 'Voice recording requires a secure connection (HTTPS). Please use a secure URL.';
      } else {
        errorMessage += err.message || 'Please check your browser settings and try again.';
      }
      
      setError(errorMessage);
      return false;
    }
  };

  // 🎤 ENHANCED: Mobile-optimized recording with live transcription
  const startRecording = async () => {
    try {
      setError('');
      setSpeechRecognitionError('');
      setRecordingTime(0);
      setTranscription('');
      setEditedTranscription('');
      setFinalTranscript('');
      setInterimTranscript('');
      
      console.log('🎤 Starting recording process...');
      console.log('📱 Device type:', isMobileDevice ? 'Mobile' : 'Desktop');
      console.log('🗣️ Live transcription enabled:', liveTranscriptionEnabled);
      
      // Check microphone permission first
      if (hasPermission !== true) {
        const permitted = await checkMicrophonePermission();
        if (!permitted) {
          return;
        }
      }
      
      // Mobile-friendly audio constraints
      const audioConstraints = isMobileDevice ? {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      } : {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      };
      
      console.log('🎤 Audio constraints:', audioConstraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      console.log('✅ Microphone stream obtained');
      
      streamRef.current = stream;

      // AudioContext setup (desktop only)
      if (!isMobileDevice) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            audioContextRef.current = new AudioContext();
            
            if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
            }
            
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;
            console.log('✅ Audio analysis setup complete');
          }
        } catch (audioContextError) {
          console.warn('AudioContext setup failed (non-critical):', audioContextError);
        }
      }

      // MediaRecorder setup with mobile-friendly formats
      let mimeType = 'audio/webm;codecs=opus';
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        const alternatives = [
          'audio/webm',
          'audio/mp4',
          'audio/wav',
          'audio/ogg',
          'audio/3gpp'
        ];
        
        for (const type of alternatives) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            console.log('📱 Using fallback MIME type:', type);
            break;
          }
        }
      }
      
      console.log('🎤 Using MIME type:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('🎤 Recording stopped, creating audio blob...');
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStage('review');
        console.log('✅ Audio blob created:', blob.size, 'bytes');
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording error: ' + event.error);
      };

      // 🎤 START LIVE TRANSCRIPTION (mobile and desktop)
      if (liveTranscriptionEnabled && speechRecognitionSupported) {
        console.log('🗣️ Starting live transcription...');
        const recognition = initializeSpeechRecognition();
        if (recognition) {
          recognitionRef.current = recognition;
          try {
            recognition.start();
            console.log('✅ Live transcription started successfully');
          } catch (speechError) {
            console.warn('Speech recognition failed to start:', speechError);
            setSpeechRecognitionError('Live transcription failed to start. You can still add transcription manually.');
            setLiveTranscriptionEnabled(false);
          }
        }
      } else {
        console.log('📝 Live transcription disabled - manual transcription mode');
      }

      // Start recording
      const recordingInterval = isMobileDevice ? 1000 : 100;
      mediaRecorder.start(recordingInterval);
      
      setIsRecording(true);
      setStage('record');
      
      // Start audio level monitoring (desktop only)
      if (!isMobileDevice && analyserRef.current) {
        monitorAudioLevel();
      }

      console.log('✅ Recording started successfully');

    } catch (err) {
      console.error('❌ Error starting recording:', err);
      
      let errorMessage = 'Unable to access microphone. ';
      
      if (err.name === 'NotAllowedError') {
        if (isMobileDevice) {
          errorMessage += 'Please allow microphone permission in your browser settings. On mobile, you may need to refresh the page after granting permission.';
        } else {
          errorMessage += 'Please allow microphone permission and try again.';
        }
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No microphone found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += isMobileDevice ? 
          'Voice recording not supported on this mobile browser. Try using Chrome or Safari.' :
          'Microphone not supported on this browser.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Microphone is being used by another application. Please close other apps using the microphone.';
      } else if (err.message && err.message.includes('https')) {
        errorMessage += 'Voice recording requires a secure connection (HTTPS). Please use a secure URL.';
      } else {
        errorMessage += err.message || 'Please check your browser settings and try again.';
      }
      
      setError(errorMessage);
      setHasPermission(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (recognitionRestartTimeoutRef.current) {
          clearTimeout(recognitionRestartTimeoutRef.current);
        }
        setIsPaused(true);
        setIsListening(false);
        clearInterval(timerRef.current);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        mediaRecorderRef.current.resume();
        // Restart speech recognition
        if (liveTranscriptionEnabled && speechRecognitionSupported) {
          const recognition = initializeSpeechRecognition();
          if (recognition) {
            recognitionRef.current = recognition;
            recognition.start();
          }
        }
        setIsPaused(false);
        if (!isMobileDevice) {
          monitorAudioLevel();
        }
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (recognitionRestartTimeoutRef.current) {
        clearTimeout(recognitionRestartTimeoutRef.current);
      }
      
      setIsRecording(false);
      setIsPaused(false);
      setIsListening(false);
      clearInterval(timerRef.current);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      
      setAudioLevel(0);

      // If no transcription was captured and live transcription was enabled, suggest manual entry
      if (liveTranscriptionEnabled && !finalTranscript.trim() && !transcription.trim()) {
        console.log('📝 No transcription captured, enabling manual mode');
        setIsEditingTranscription(true);
        setEditedTranscription('');
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscription('');
    setEditedTranscription('');
    setFinalTranscript('');
    setInterimTranscript('');
    setRecordingTime(0);
    setIsPlaying(false);
    setError('');
    setSpeechRecognitionError('');
    setStage('record');
    setIsEditingTranscription(false);
  };

  // Handle transcription editing
  const startEditingTranscription = () => {
    setIsEditingTranscription(true);
    setEditedTranscription(transcription || '');
  };

  const saveTranscriptionEdit = () => {
    if (editedTranscription.trim()) {
      setTranscription(editedTranscription);
      setFinalTranscript(editedTranscription);
      setIsEditingTranscription(false);
    } else {
      setError('Please enter a transcription before saving.');
    }
  };

  const cancelTranscriptionEdit = () => {
    setEditedTranscription(transcription);
    setIsEditingTranscription(false);
  };

  // 🎤 NEW: Toggle live transcription
  const toggleLiveTranscription = () => {
    if (isRecording) {
      setError('Cannot change transcription mode while recording');
      return;
    }
    
    setLiveTranscriptionEnabled(!liveTranscriptionEnabled);
    setSpeechRecognitionError('');
    
    if (!liveTranscriptionEnabled && !speechRecognitionSupported) {
      setError('Speech recognition not supported on this browser/device');
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || !currentUser) return;
    
    const finalTranscription = isEditingTranscription ? editedTranscription : transcription;
    
    if (!finalTranscription.trim()) {
      setError('Please ensure your voice was transcribed or add transcription manually.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log('🎤 Starting voice journal upload process...');
      
      const audioUrl = await uploadVoiceJournal(
        audioBlob,
        finalTranscription,
        currentUser.uid,
        dayNumber,
        pathId,
        {
          keepAudio: true,
          duration: recordingTime
        }
      );

      console.log('🎤 Voice uploaded to Firebase:', audioUrl);

      const voiceData = {
        audioUrl: audioUrl,
        audioBlob: audioBlob,
        transcription: finalTranscription,
        duration: recordingTime,
        pathId: pathId,
        day: dayNumber,
        type: 'voice',
        wordCount: finalTranscription.split(/\s+/).filter(Boolean).length,
        uploadedAt: new Date().toISOString(),
        userId: currentUser.uid,
        deviceType: isMobileDevice ? 'mobile' : 'desktop',
        transcriptionMethod: liveTranscriptionEnabled ? 'live' : 'manual'
      };

      console.log('🎤 Voice data prepared:', voiceData);
      onUploadComplete(voiceData);
      
    } catch (error) {
      console.error('Voice upload error:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const themeClass = isDarkMode ? 'dark-theme' : 'light-theme';

  if (isUploading) {
    return (
      <div className={`voice-loading-screen ${themeClass}`}>
        <div className="voice-loading-content">
          <div className="voice-loading-spinner"></div>
          <h3 className="voice-loading-title">Processing Voice Entry</h3>
          <p className="voice-loading-text">Uploading and analyzing your voice journal...</p>
          <div className="voice-loading-stats">
            <p className="voice-loading-stat">✨ Your voice is being processed by Claude AI</p>
            <p className="voice-loading-stat">📊 Transcription: {transcription.split(/\s+/).filter(Boolean).length} words</p>
            <p className="voice-loading-stat">⏱️ Duration: {formatTime(recordingTime)}</p>
            {isMobileDevice && <p className="voice-loading-stat">📱 Mobile recording processed</p>}
            {liveTranscriptionEnabled && <p className="voice-loading-stat">🗣️ Live transcription used</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`voice-journal-container ${themeClass}`}>
      {/* Header */}
      <div className={`voice-header ${themeClass}`}>
        <div className="voice-header-content">
          <button
            onClick={onBack}
            className={`voice-back-button ${themeClass}`}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="voice-header-title">
            Voice Journal
            {isMobileDevice && <Smartphone size={20} className="ml-2" />}
          </h1>
          <div className="voice-header-spacer"></div>
        </div>
      </div>

      <div className="voice-content">
        {/* Permission Check */}
        {hasPermission === false && (
          <div className="voice-permission-card">
            <div className="voice-permission-content">
              <Shield size={24} className="voice-permission-icon" />
              <h3>Microphone Access Required</h3>
              <p>
                {isMobileDevice 
                  ? 'This app needs microphone access to record your voice journal. On mobile devices, please allow microphone permission when prompted.'
                  : 'This app needs microphone access to record your voice journal.'
                }
              </p>
              <button
                onClick={checkMicrophonePermission}
                className="voice-permission-button"
              >
                <Mic size={16} />
                Allow Microphone Access
              </button>
              {isMobileDevice && (
                <p className="voice-permission-mobile-note">
                  📱 If permission is denied, you may need to refresh the page after enabling microphone access in your browser settings.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 🎤 NEW: Live Transcription Toggle */}
        {hasPermission !== false && speechRecognitionSupported && (
          <div className={`voice-transcription-toggle ${themeClass}`}>
            <div className="voice-transcription-toggle-content">
              <div className="voice-transcription-toggle-info">
                <Headphones size={16} />
                <span>Live Transcription</span>
                {isMobileDevice && <span className="voice-mobile-badge">📱 Mobile Supported!</span>}
              </div>
              <button
                onClick={toggleLiveTranscription}
                className="voice-transcription-toggle-button"
                disabled={isRecording}
              >
                {liveTranscriptionEnabled ? 
                  <ToggleRight size={20} className="text-green-500" /> : 
                  <ToggleLeft size={20} className="text-gray-400" />
                }
              </button>
            </div>
            <p className="voice-transcription-toggle-description">
              {liveTranscriptionEnabled ? 
                '✅ Your speech will be transcribed automatically as you speak' :
                '📝 You can add transcription manually after recording'
              }
            </p>
          </div>
        )}

        {/* Prompt Display */}
        {prompt && hasPermission !== false && (
          <div className={`voice-prompt-card ${themeClass}`}>
            <h3 className={`voice-prompt-label ${themeClass}`}>Today's Voice Prompt</h3>
            <p className={`voice-prompt-text ${themeClass}`}>"{prompt}"</p>
          </div>
        )}

        {/* Live Transcription Status */}
        {isRecording && liveTranscriptionEnabled && (
          <div className={`voice-recognition-status ${isListening ? 'listening' : 'not-listening'}`}>
            <div className="voice-recognition-status-content">
              <Volume2 size={16} />
              <span>
                {isListening ? 
                  '🗣️ Live transcription active - speak naturally' :
                  '⏸️ Transcription paused'
                }
              </span>
              {isMobileDevice && <span className="voice-mobile-indicator">📱</span>}
            </div>
          </div>
        )}

        {/* Recording Interface */}
        {hasPermission !== false && (
          <div className={`voice-recording-card ${themeClass}`}>
            <div className="voice-recording-content">
              {stage === 'record' && !audioUrl && (
                <>
                  <h3 className="voice-recording-title">Record Your Voice Journal</h3>
                  <p className={`voice-recording-subtitle ${themeClass}`}>
                    Speak your thoughts and reflections
                    {liveTranscriptionEnabled && ' - automatic transcription enabled'}
                  </p>
                  
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="voice-record-button"
                      disabled={hasPermission === false}
                    >
                      <Mic size={32} />
                    </button>
                  ) : (
                    <div className="voice-status">
                      <div className="voice-controls">
                        <button
                          onClick={pauseRecording}
                          className="voice-control-button pause"
                        >
                          {isPaused ? <Play size={24} /> : <Pause size={24} />}
                        </button>
                        
                        <button
                          onClick={stopRecording}
                          className="voice-control-button stop"
                        >
                          <Square size={24} />
                        </button>
                      </div>
                      
                      {/* Recording Status */}
                      <div className="voice-status-info">
                        <div className={`voice-status-indicator ${isPaused ? 'paused' : 'recording'}`} />
                        <span className="voice-status-text">
                          {isPaused ? 'Paused' : 'Recording'}
                        </span>
                        <Clock size={16} />
                        <span className="voice-duration">{formatTime(recordingTime)}</span>
                      </div>
                      
                      {/* Audio Level Indicator - Desktop only */}
                      {!isMobileDevice && (
                        <div className="voice-level-container">
                          <div 
                            className="voice-level-bar"
                            style={{ width: `${audioLevel * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {stage === 'review' && audioUrl && (
                <>
                  <h3 className="voice-recording-title">Review Your Recording</h3>
                  
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <div className="voice-status">
                    <div className="voice-controls">
                      <button
                        onClick={playRecording}
                        className="voice-control-button play"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      
                      <button
                        onClick={resetRecording}
                        className="voice-control-button reset"
                      >
                        <RotateCcw size={24} />
                      </button>
                    </div>
                    
                    <div className="voice-duration">
                      <Clock size={14} />
                      Duration: {formatTime(recordingTime)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Real-time Transcription Display */}
        {hasPermission !== false && (transcription || isRecording) && (
          <div className={`voice-transcription-card ${themeClass}`}>
            <div className="voice-transcription-header">
              <div className="voice-transcription-status">
                <CheckCircle size={16} className={transcription ? "text-green-500" : "text-gray-400"} />
                <span>
                  {isRecording ? 
                    (liveTranscriptionEnabled ? 
                      (isListening ? 'Live Transcription Active' : 'Transcription Ready') :
                      'Manual Transcription Mode'
                    ) : 
                    'Transcription Complete'
                  }
                </span>
              </div>
              
              {/* Edit transcription button */}
              {!isRecording && !isEditingTranscription && (
                <button
                  onClick={startEditingTranscription}
                  className="voice-transcription-edit-button"
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              )}
            </div>
            
            {/* Transcription editing interface */}
            {isEditingTranscription ? (
              <div className="voice-transcription-editor">
                <textarea
                  value={editedTranscription}
                  onChange={(e) => setEditedTranscription(e.target.value)}
                  className={`voice-transcription-textarea ${themeClass}`}
                  rows="6"
                  placeholder="Type your transcription here..."
                />
                <div className="voice-transcription-actions">
                  <button
                    onClick={saveTranscriptionEdit}
                    className="voice-transcription-save"
                  >
                    <CheckCircle size={14} />
                    Save
                  </button>
                  <button
                    onClick={cancelTranscriptionEdit}
                    className="voice-transcription-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className={`voice-transcription-content ${themeClass}`}>
                <p className={`voice-transcription-text ${themeClass}`}>
                  {transcription || (isRecording && liveTranscriptionEnabled ? 'Start speaking to see transcription...' : 'No transcription yet')}
                  {interimTranscript && (
                    <span className="voice-interim-transcript">{interimTranscript}</span>
                  )}
                </p>
              </div>
            )}
            
            {/* Word count and transcription stats */}
            <div className="voice-transcription-stats">
              <span>
                Words: {transcription ? transcription.split(/\s+/).filter(Boolean).length : 0}
              </span>
              {isListening && (
                <span className="voice-transcription-live-status">
                  ✨ Listening... 
                  {isMobileDevice && ' (Mobile)'}
                </span>
              )}
              {speechRecognitionError && (
                <span className="voice-transcription-error">
                  ⚠️ {speechRecognitionError}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="voice-error-card">
            <div className="voice-error-content">
              <AlertCircle size={16} className="text-red-500" />
              <span className="voice-error-text">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {audioBlob && hasPermission !== false && (
          <button
            onClick={handleSubmit}
            disabled={!transcription.trim() || isEditingTranscription}
            className="voice-submit-button"
          >
            <Upload size={20} />
            {isEditingTranscription ? 'Save transcription first' : 'Submit Voice Journal'}
          </button>
        )}

        {/* Enhanced Tips for Voice Journaling */}
        <div className="voice-tips-section">
          <h4 className={`voice-tips-title ${themeClass}`}>
            Voice Journaling Tips
            {isMobileDevice && <span className="voice-tips-mobile-badge">📱 Mobile</span>}
          </h4>
          <ul className="voice-tips-list">
            <li className={`voice-tips-item ${themeClass}`}>• Find a quiet space for the best recording quality</li>
            <li className={`voice-tips-item ${themeClass}`}>• Speak naturally and let emotions come through your voice</li>
            {liveTranscriptionEnabled ? (
              <li className={`voice-tips-item ${themeClass}`}>• 🗣️ Live transcription works on both mobile and desktop</li>
            ) : (
              <li className={`voice-tips-item ${themeClass}`}>• You can add transcription manually after recording</li>
            )}
            <li className={`voice-tips-item ${themeClass}`}>• Take pauses when you need time to think - silence is okay</li>
            <li className={`voice-tips-item ${themeClass}`}>• You can edit the transcription before submitting</li>
            <li className={`voice-tips-item ${themeClass}`}>• 🎤 AI will analyze both your words and vocal expressions</li>
            {isMobileDevice && (
              <li className={`voice-tips-item ${themeClass}`}>• 📱 Works best on secure connections (HTTPS)</li>
            )}
          </ul>
        </div>

        {/* Voice analysis preview */}
        {transcription && !isRecording && transcription.trim() && (
          <div className={`voice-analysis-preview ${themeClass}`}>
            <h4 className="voice-analysis-title">What Claude AI will analyze:</h4>
            <ul className="voice-analysis-list">
              <li className={`voice-analysis-item ${themeClass}`}>• Emotional tone and authenticity in your spoken words</li>
              <li className={`voice-analysis-item ${themeClass}`}>• Natural flow and spontaneity of your voice reflection</li>
              <li className={`voice-analysis-item ${themeClass}`}>• Courage and vulnerability in vocal self-expression</li>
              <li className={`voice-analysis-item ${themeClass}`}>• Personal growth insights from your spoken thoughts</li>
              <li className={`voice-analysis-item ${themeClass}`}>• Patterns and themes in your voice journaling journey</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceJournalUpload;