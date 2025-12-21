// src/components/voice/VoiceJournalUpload.jsx - Mobile Live Transcription Enabled
import React, { useState, useRef, useEffect } from 'react';
// Capacitor Permissions API for runtime permission requests
import { Capacitor } from '@capacitor/core';
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
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  
  // Mobile-specific states
  const [hasPermission, setHasPermission] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);

  // 🎤 NEW: Live transcription states for mobile
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
  const isRecordingRef = useRef(false);
  const manualStopRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  // Native Android speech recognition (Cordova/Capacitor) refs
  const nativeSpeechActiveRef = useRef(false);
  const nativeSpeechStopFnRef = useRef(null);

  // Helper: detect native Android runtime
  const isNativeAndroid = () => {
    try {
      // Capacitor v5+ exposes getPlatform on global Capacitor object
      return (
        typeof window !== 'undefined' &&
        window.Capacitor &&
        typeof window.Capacitor.getPlatform === 'function' &&
        window.Capacitor.getPlatform() === 'android'
      );
    } catch {
      return false;
    }
  };

  // Helper: get Cordova/Capacitor speech plugin if present
  const getNativeSpeechPlugin = () => {
    try {
      // cordova-plugin-speechrecognition exposes window.plugins.speechRecognition
      return window?.plugins?.speechRecognition || null;
    } catch {
      return null;
    }
  };
  // 🎤 Mobile detection and speech recognition check on mount
  useEffect(() => {
    const detectMobileAndSpeechSupport = async () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isFirefox = /Firefox/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
      
      // Check if speech recognition is available for post-recording transcription
      const hasWebkitSpeechRecognition = 'webkitSpeechRecognition' in window;
      const hasSpeechRecognition = 'SpeechRecognition' in window;
      const webSpeechSupported = hasWebkitSpeechRecognition || hasSpeechRecognition;
      
      console.log('🗣️ Speech Recognition Detection:');
      console.log('  - Browser:', isFirefox ? 'Firefox' : 'Other');
      console.log('  - webkitSpeechRecognition:', hasWebkitSpeechRecognition);
      console.log('  - SpeechRecognition:', hasSpeechRecognition);
      console.log('  - Web Speech API supported:', webSpeechSupported);
      
      // Firefox notification
      if (isFirefox && !webSpeechSupported) {
        console.log('  ℹ️ Firefox does not support Web Speech API');
        console.log('  💡 For live transcription, please use Chrome, Edge, or Safari');
      }

      // Also detect native plugin support on Android (Capacitor/Cordova)
      let nativeSpeechAvailable = false;
      if (isAndroid && isNativeAndroid()) {
        const plugin = getNativeSpeechPlugin();
        nativeSpeechAvailable = Boolean(plugin);
        console.log('  - Native plugin available:', nativeSpeechAvailable);
      }

      const speechSupported = Boolean(webSpeechSupported || nativeSpeechAvailable);
      console.log('  - Final speech support status:', speechSupported);
      setSpeechRecognitionSupported(speechSupported);
      
      // Auto-disable live transcription on Firefox
      if (isFirefox && !webSpeechSupported) {
        setLiveTranscriptionEnabled(false);
      }
      
      return { isMobile, speechSupported, isAndroid };
    };

    const checkInitialPermissions = async () => {
      detectMobileAndSpeechSupport();
      
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'microphone' });
          setPermissionStatus(permission.state);
          
          if (permission.state === 'granted') {
            setHasPermission(true);
          }
          
          // Listen for permission changes
          permission.onchange = () => {
            setPermissionStatus(permission.state);
            setHasPermission(permission.state === 'granted');
          };
        } catch (error) {
          console.log('⚠️ navigator.permissions.query not supported (common on Android)');
          // On Android Capacitor, permissions API often doesn't work
          // Try to directly check microphone access
          if (isMobileDevice) {
            console.log('🤖 Android/Mobile: Will request permission on first use');
            // Don't set hasPermission to false - keep it null so UI shows "request" button
            // But also try a silent permission check
            try {
              const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              testStream.getTracks().forEach(track => track.stop());
              console.log('✅ Microphone already permitted');
              setHasPermission(true);
              setPermissionStatus('granted');
            } catch (err) {
              console.log('🎤 Microphone permission needed, will request when user clicks button');
              // Keep hasPermission as null - don't set to false unless explicitly denied
            }
          }
        }
      } else {
        // Permissions API not available at all (Android Capacitor)
        console.log('⚠️ navigator.permissions not available');
        if (isMobileDevice) {
          // Try silent permission check
          try {
            const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            testStream.getTracks().forEach(track => track.stop());
            console.log('✅ Microphone already permitted');
            setHasPermission(true);
            setPermissionStatus('granted');
          } catch (err) {
            console.log('🎤 Microphone permission needed');
            // Keep as null to show permission button
          }
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
      audioContextRef.current.close().catch(() => {});
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

  // If we're on native Android with plugin available, we do NOT initialize Web Speech
  if (isNativeAndroid() && getNativeSpeechPlugin()) {
    console.log('🎙️ Using native Android speech plugin; skipping Web Speech init');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error('❌ SpeechRecognition API not available');
    return null;
  }

  // 🔥 FIX #1: Clean up existing recognition BEFORE creating new one
  if (recognitionRef.current) {
    try {
      console.log('🧹 Cleaning up existing recognition instance');
      recognitionRef.current.onstart = null;
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    } catch (e) {
      console.warn('⚠️ Error cleaning up old recognition:', e);
    }
    recognitionRef.current = null;
  }

  // 🔥 FIX #2: Create instance with unique ID for reliable tracking
  const recognitionId = Date.now();
  const recognition = new SpeechRecognition();
  recognition._instanceId = recognitionId;
  recognitionRef.current = recognition;

  console.log(`🆕 Creating NEW recognition instance: ${recognitionId}`);

  // Mobile-optimized settings
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  // Language detection
  const userLang = navigator.language || 'en-US';
  recognition.lang = userLang;
  console.log('🗣️ Language:', userLang);

  // Android-specific settings
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    console.log('🤖 Android optimizations enabled');
  }

  // 🔥 FIX #3: Improved instance checking with ID comparison
  const isCurrentRecognition = () => {
    const isCurrent = recognitionRef.current && recognitionRef.current._instanceId === recognitionId;
    if (!isCurrent) {
      console.log(`⚠️ Instance ${recognitionId} is stale (current: ${recognitionRef.current?._instanceId})`);
    }
    return isCurrent;
  };

  recognition.onstart = () => {
    if (!isCurrentRecognition()) {
      console.log(`⚠️ [${recognitionId}] Ignoring stale onstart`);
      return;
    }

    console.log(`✅ [${recognitionId}] Speech recognition STARTED!`);
    console.log(`📝 Accumulated transcript length: ${finalTranscriptRef.current.length}`);
    
    setIsListening(true);
    setSpeechRecognitionError('');
    manualStopRef.current = false;
    
    // 🔥 FIX #4: DON'T clear interim transcript on start
    // Let it accumulate across restarts
  };

  recognition.onresult = (event) => {
    if (!isCurrentRecognition()) {
      console.log(`⚠️ [${recognitionId}] Ignoring stale onresult`);
      return;
    }

    console.log(`🎉 [${recognitionId}] SPEECH RECOGNIZED!`);
    console.log(`📝 Results length: ${event.results.length}, resultIndex: ${event.resultIndex}`);

    let newInterimTranscript = '';
    let newFinalPart = '';

    // 🔥 FIX: Only process NEW results starting from resultIndex
    // This prevents re-processing old results and creating duplicates
    const startIndex = event.resultIndex || 0;
    console.log(`🔍 [${recognitionId}] Processing results from index ${startIndex} to ${event.results.length}`);

    for (let i = startIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      console.log(`🗣️ [${recognitionId}] Result [${i}]:`, {
        transcript: transcript.substring(0, 50) + (transcript.length > 50 ? '...' : ''),
        confidence,
        isFinal: result.isFinal
      });

      if (result.isFinal) {
        newFinalPart += transcript + ' ';
        console.log(`✅ [${recognitionId}] FINAL part: "${transcript.substring(0, 30)}..."`);
      } else {
        newInterimTranscript += transcript;
        console.log(`⏳ [${recognitionId}] INTERIM: "${transcript.substring(0, 30)}..."`);
      }
    }

    // Only update final transcript if we got NEW final results
    if (newFinalPart.trim()) {
      finalTranscriptRef.current += newFinalPart;
      console.log(`💾 [${recognitionId}] Accumulated final: ${finalTranscriptRef.current.length} chars`);
      console.log(`💾 [${recognitionId}] Last 50 chars: "...${finalTranscriptRef.current.slice(-50)}"`);
    } else {
      console.log(`⏸️ [${recognitionId}] No new final results this cycle`);
    }

    // Update interim
    interimTranscriptRef.current = newInterimTranscript;

    // Combine and update UI
    const cleanFinalTranscript = finalTranscriptRef.current.trim();
    const combinedTranscript = cleanFinalTranscript 
      ? `${cleanFinalTranscript} ${newInterimTranscript}`.trim()
      : newInterimTranscript;

    console.log(`📊 [${recognitionId}] Combined length: ${combinedTranscript.length} (${cleanFinalTranscript.length} final + ${newInterimTranscript.length} interim)`);

    setFinalTranscript(cleanFinalTranscript);
    setInterimTranscript(newInterimTranscript);
    setTranscription(combinedTranscript);

    if (!isEditingTranscription) {
      setEditedTranscription(combinedTranscript);
    }
  };

  recognition.onerror = (event) => {
    if (!isCurrentRecognition()) {
      console.log(`⚠️ [${recognitionId}] Ignoring stale onerror`);
      return;
    }

    console.error(`🗣️ [${recognitionId}] Error: ${event.error}`);
    setIsListening(false);

    const errorMessages = {
      'no-speech': 'No speech detected. Continue speaking...',
      'audio-capture': 'Audio capture failed. Check your microphone.',
      'not-allowed': 'Microphone permission denied.',
      'network': 'Network error. Check your connection.',
      'service-not-allowed': 'Speech service not available.',
      'aborted': 'Speech recognition aborted.',
      'bad-grammar': 'Speech recognition grammar error.',
      'language-not-supported': 'Language not supported.'
    };

    const errorMessage = errorMessages[event.error] || `Error: ${event.error}`;

    // Be lenient with common Android errors
    if (['no-speech', 'audio-capture'].includes(event.error)) {
      console.log(`⚠️ [${recognitionId}] Non-critical error, will auto-restart`);
    } else {
      setSpeechRecognitionError(errorMessage);

      if (['not-allowed', 'service-not-allowed', 'language-not-supported'].includes(event.error)) {
        setLiveTranscriptionEnabled(false);
        setError(`Speech recognition: ${errorMessage}`);
      }
    }

    // 🔥 FIX #7: More aggressive restart on common Android errors
    if (isAndroid && ['no-speech', 'audio-capture', 'network', 'aborted'].includes(event.error)) {
      console.log(`🔄 [${recognitionId}] Scheduling restart after error...`);
      scheduleSpeechRecognitionRestart(1000, `error:${event.error}`);
    }

    // 🔥 FIX #8: Clear stale instance reference
    if (recognitionRef.current && recognitionRef.current._instanceId === recognitionId) {
      recognitionRef.current = null;
    }
  };

  recognition.onend = () => {
    if (!isCurrentRecognition()) {
      console.log(`⚠️ [${recognitionId}] Ignoring stale onend`);
      return;
    }

    console.log(`🗣️ [${recognitionId}] Speech recognition ended`);

    const mediaRecorderState = mediaRecorderRef.current?.state;
    const shouldRestart = shouldAttemptSpeechRestart();

    console.log(`🔍 [${recognitionId}] MediaRecorder: ${mediaRecorderState}`);
    console.log(`🔍 [${recognitionId}] Should restart: ${shouldRestart}`);
    console.log(`🔍 [${recognitionId}] Manual stop: ${manualStopRef.current}`);

    setIsListening(false);
    
    // 🔥 FIX #9: DON'T clear interim transcript on end
    // It might contain valuable partial data
    
    // Save current accumulated transcript
    const cleanTranscript = finalTranscriptRef.current.trim();
    if (cleanTranscript) {
      console.log(`💾 [${recognitionId}] Saving accumulated: ${cleanTranscript.length} chars`);
      setFinalTranscript(cleanTranscript);
      setTranscription(cleanTranscript);
      if (!isEditingTranscription) {
        setEditedTranscription(cleanTranscript);
      }
    } else {
      console.log(`⚠️ [${recognitionId}] No transcript to save yet`);
    }

    if (shouldRestart) {
      // 🔥 FIX #10: Longer restart delay for Android
      const restartDelay = isAndroid ? 1000 : 300;

      console.log(`🔄 [${recognitionId}] Auto-restarting in ${restartDelay}ms...`);
      scheduleSpeechRecognitionRestart(restartDelay, 'automatic end');
    } else {
      console.log(`⏹️ [${recognitionId}] Not restarting (recording stopped or disabled)`);
    }
    
    // 🔥 FIX #11: Clear stale instance reference
    if (recognitionRef.current && recognitionRef.current._instanceId === recognitionId) {
      recognitionRef.current = null;
    }
  };

  return recognition;
};

  // ===== Native Android Speech (Cordova/Capacitor plugin) =====
  const startNativeSpeech = async () => {
    const plugin = getNativeSpeechPlugin();
    if (!plugin) {
      console.warn('Native speech plugin not available');
      return false;
    }

    try {
      // Permission flow
      await new Promise((resolve) => {
        try {
          plugin.requestPermission(() => resolve(true), () => resolve(false));
        } catch {
          resolve(true); // Some environments may not require explicit permission
        }
      });

      const userLang = navigator.language || 'en-US';
      console.log(`🎙️ Starting native STT with language: ${userLang}`);

      // Start listening with partial results
      // Success callback for speech results
      const onResults = (matches) => {
        try {
          // matches can be array or string
          const text = Array.isArray(matches) ? (matches[0] || '') : (matches?.value || matches || '');
          
          if (text && text.trim()) {
            console.log(`🎙️ Native STT result: "${text}"`);
            
            // Append to accumulated transcript
            if (finalTranscriptRef.current) {
              finalTranscriptRef.current += ' ' + text;
            } else {
              finalTranscriptRef.current = text;
            }
            
            const combined = finalTranscriptRef.current.trim();
            setFinalTranscript(combined);
            setTranscription(combined);
            if (!isEditingTranscription) setEditedTranscription(combined);
            setIsListening(true);
            
            console.log(`💾 Accumulated native transcript: ${combined.length} chars`);
          } else {
            console.log('🎙️ Native STT: Empty result received');
          }
        } catch (e) {
          console.error('🎙️ Error processing native speech result:', e);
        }
      };

      // Error callback - treat "No match" as non-fatal and restart
      const onError = (err) => {
        const errMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
        console.log(`🎙️ Native speech event: ${errMsg}`);
        
        // "No match" means plugin stopped listening - restart it if still recording
        if (errMsg === 'No match' || errMsg.includes('no-match') || errMsg.includes('NO_MATCH')) {
          console.log('⚠️ No speech detected - plugin auto-stopped');
          
          // If still recording, restart the listener after brief delay
          if (isRecordingRef.current && nativeSpeechActiveRef.current) {
            console.log('🔄 Restarting native STT to continue listening...');
            setTimeout(() => {
              if (isRecordingRef.current && nativeSpeechActiveRef.current) {
                try {
                  plugin.startListening(onResults, onError, {
                    language: userLang,
                    matches: 5,
                    showPopup: false,
                    partialResults: true,
                    prompt: '',
                  });
                  console.log('✅ Native STT restarted');
                } catch (restartErr) {
                  console.warn('⚠️ Failed to restart native STT:', restartErr);
                }
              }
            }, 300); // Short delay before restart
          }
          return; // Don't treat as error
        }
        
        // Other errors are more serious
        console.error(`❌ Native speech error: ${errMsg}`);
        setSpeechRecognitionError(`Speech recognition: ${errMsg}`);
        setIsListening(false);
        nativeSpeechActiveRef.current = false;
      };

      // Start the plugin
      plugin.startListening(
        onResults,
        onError,
        {
          language: userLang,
          matches: 5, // Get up to 5 alternatives
          showPopup: false,
          partialResults: true, // Request partial results
          prompt: '', // No popup prompt
        }
      );

      // Provide a stop function
      nativeSpeechStopFnRef.current = () => {
        try {
          console.log('🛑 Stopping native speech...');
          plugin.stopListening(
            () => console.log('✅ Native speech stopped'),
            (e) => console.warn('⚠️ Error stopping native speech:', e)
          );
        } catch (e) {
          console.warn('⚠️ Exception stopping native speech:', e);
        }
      };

      nativeSpeechActiveRef.current = true;
      setIsListening(true);
      console.log('✅ Native speech listener registered');
      
      return true;
    } catch (e) {
      console.error('❌ Failed to start native speech:', e);
      setSpeechRecognitionError('Live transcription unavailable on this device');
      nativeSpeechActiveRef.current = false;
      return false;
    }
  };

  const stopNativeSpeech = () => {
    try {
      if (nativeSpeechActiveRef.current && nativeSpeechStopFnRef.current) {
        nativeSpeechStopFnRef.current();
      } else {
        const plugin = getNativeSpeechPlugin();
        if (plugin) plugin.stopListening(() => {}, () => {});
      }
    } catch (e) {
      console.warn('Error stopping native speech:', e);
    } finally {
      nativeSpeechActiveRef.current = false;
      setIsListening(false);
    }
  };








  const shouldAttemptSpeechRestart = () => (
    Boolean(
      isRecordingRef.current &&
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording' &&
      liveTranscriptionEnabled &&
      !manualStopRef.current
    )
  );

  const scheduleSpeechRecognitionRestart = (delay = 500, reason = 'auto-restart') => {
  // Clear any pending restart
  if (recognitionRestartTimeoutRef.current) {
    clearTimeout(recognitionRestartTimeoutRef.current);
    console.log('🧹 Cleared previous restart timeout');
  }

  const delayMs = Math.max(0, delay || 0);
  console.log(`⏱️ Scheduling restart in ${delayMs}ms (reason: ${reason})`);
  
  // Check current state
  console.log('📊 Current state:', {
    isRecording: isRecordingRef.current,
    mediaRecorderState: mediaRecorderRef.current?.state,
    liveTranscriptionEnabled,
    manualStop: manualStopRef.current,
    currentTranscriptLength: finalTranscriptRef.current.length
  });

  const restartTimeout = setTimeout(() => {
    console.log(`⏰ Restart timeout fired (after ${delayMs}ms)`);
    
    // Double-check if we should still restart
    const shouldRestart = shouldAttemptSpeechRestart();
    
    if (shouldRestart) {
      console.log('▶️ Conditions met - creating new recognition instance...');
      
      // Create and start new instance
      const newRecognition = initializeSpeechRecognition();

      if (newRecognition) {
        try {
          newRecognition.start();
          console.log('✅ New recognition instance started successfully');
        } catch (restartError) {
          console.warn('⚠️ Failed to start new recognition:', restartError);
          
          // Handle specific errors
          if (restartError.name === 'InvalidStateError') {
            console.log('⚠️ Recognition already running - this is usually harmless');
          } else if (restartError.name === 'NotAllowedError') {
            console.error('❌ Permission denied - stopping transcription');
            setLiveTranscriptionEnabled(false);
            setSpeechRecognitionError('Microphone permission denied');
          } else {
            console.error('❌ Unexpected error:', restartError.name, restartError.message);
            
            // Try again with longer delay
            const isAndroid = /Android/i.test(navigator.userAgent);
            const retryDelay = isAndroid ? 2000 : 500;
            console.log(`🔄 Will retry restart in ${retryDelay}ms...`);
            scheduleSpeechRecognitionRestart(retryDelay, 'retry after error');
          }
        }
      } else {
        console.warn('⚠️ Unable to initialize speech recognition for restart');
      }
    } else {
      console.log('⏹️ Not restarting - conditions no longer met');
      console.log('📊 Final state:', {
        isRecording: isRecordingRef.current,
        mediaRecorderState: mediaRecorderRef.current?.state,
        transcriptionEnabled: liveTranscriptionEnabled,
        manualStop: manualStopRef.current
      });
    }
    
    recognitionRestartTimeoutRef.current = null;
  }, delayMs);

  recognitionRestartTimeoutRef.current = restartTimeout;
  console.log(`✅ Restart scheduled (timeout ID: ${restartTimeout})`);
};








  // Microphone permission check function
  const checkMicrophonePermission = async () => {
    console.log('🎤 checkMicrophonePermission called');
    console.log('📱 Capacitor.isNativePlatform():', Capacitor.isNativePlatform());
    console.log('📱 Capacitor.getPlatform():', Capacitor.getPlatform());
    console.log('📱 window.cordova:', !!window.cordova);
    console.log('📱 window.cordova.plugins:', !!window.cordova?.plugins);
    console.log('📱 window.cordova.plugins.permissions:', !!window.cordova?.plugins?.permissions);
    
    // For Android native, use Cordova permissions plugin
    if (
      Capacitor.isNativePlatform &&
      Capacitor.isNativePlatform() &&
      Capacitor.getPlatform &&
      Capacitor.getPlatform() === 'android'
    ) {
      console.log('🎤 Android native detected - checking RECORD_AUDIO permission');
      
      if (window.cordova?.plugins?.permissions) {
        try {
          const permissions = window.cordova.plugins.permissions;
          const permissionResult = await new Promise((resolve) => {
            permissions.checkPermission(permissions.RECORD_AUDIO, (status) => {
              resolve(status);
            }, (error) => {
              console.error('❌ Error checking permission:', error);
              resolve({ hasPermission: false });
            });
          });
          
          console.log('🎤 Permission check result:', permissionResult);
          
          if (permissionResult.hasPermission) {
            console.log('✅ RECORD_AUDIO permission already granted');
            setHasPermission(true);
            setPermissionStatus('granted');
            setError('');
            return true;
          } else {
            console.log('🎤 RECORD_AUDIO permission not granted, requesting...');
            const requestResult = await new Promise((resolve) => {
              permissions.requestPermission(permissions.RECORD_AUDIO, (status) => {
                resolve(status);
              }, (error) => {
                console.error('❌ Error requesting permission:', error);
                resolve({ hasPermission: false });
              });
            });
            
            console.log('🎤 Permission request result:', requestResult);
            
            if (requestResult.hasPermission) {
              console.log('✅ RECORD_AUDIO permission granted');
              setHasPermission(true);
              setPermissionStatus('granted');
              setError('');
              return true;
            } else {
              console.log('❌ RECORD_AUDIO permission denied');
              setHasPermission(false);
              setPermissionStatus('denied');
              setError('Microphone permission is required for voice recording. Please enable it in your device settings.');
              return false;
            }
          }
        } catch (permError) {
          console.error('❌ Permissions plugin error:', permError);
          setHasPermission(false);
          setPermissionStatus('error');
          setError('Unable to check microphone permissions. Please ensure the app has microphone access in settings.');
          return false;
        }
      } else {
        console.log('❌ Cordova permissions plugin not available');
        setHasPermission(false);
        setPermissionStatus('error');
        setError('Permissions plugin not available. Please check app installation.');
        return false;
      }
    }
    
    // For web browsers, use getUserMedia
    console.log('🎤 Using getUserMedia for web browser');
    try {
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
      manualStopRef.current = false;
      return true;
    } catch (err) {
      console.error('❌ getUserMedia failed:', err);
      setHasPermission(false);
      setPermissionStatus('denied');
      let errorMessage = 'Microphone access required. ';
      if (err.name === 'NotAllowedError') {
        if (isMobileDevice) {
          errorMessage += 'Please allow microphone permission when prompted. If you denied it, you may need to enable it in your device settings.';
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
      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      manualStopRef.current = false;
      
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      console.log('🎤 Starting recording process...');
      console.log('📱 Device type:', isMobileDevice ? 'Mobile' : 'Desktop');
      console.log('🤖 Is Android:', isAndroid);
      console.log('🗣️ Live transcription enabled:', liveTranscriptionEnabled);
      console.log('🗣️ Speech recognition supported:', speechRecognitionSupported);
      
      // 🎤 START LIVE TRANSCRIPTION FIRST (CRITICAL for mobile)
      // Speech recognition MUST be started synchronously from user gesture BEFORE any async operations
      let speechRecognitionStarted = false;
      if (liveTranscriptionEnabled) {
        console.log('🗣️ Attempting to start live transcription IMMEDIATELY...');
        console.log('🔍 Environment check:', {
          isAndroid,
          isNativeAndroid: isNativeAndroid(),
          hasNativePlugin: Boolean(getNativeSpeechPlugin()),
          speechRecognitionSupported
        });
        
        // 🔧 SKIP native Android plugin - use post-recording transcription instead
        // Only skip if we're on NATIVE Android app with plugin, not web browser
        if (isAndroid && isNativeAndroid() && getNativeSpeechPlugin()) {
          console.log('📱 Native Android App: Skipping live STT, will transcribe after recording');
          speechRecognitionStarted = false;
        } else if (speechRecognitionSupported) {
          console.log('🌐 Web/Desktop: Initializing Web Speech API for live transcription');
          const recognition = initializeSpeechRecognition();
          if (recognition) {
            try {
              // 🤖 CRITICAL: Start speech recognition IMMEDIATELY, before ANY await statements
              recognition.start();
              speechRecognitionStarted = true;
              console.log('✅ Web Speech start() called successfully');
            } catch (speechError) {
              console.error('❌ Web Speech failed to start:', speechError);
              let errorMsg = 'Live transcription unavailable. ';
              if (speechError.name === 'InvalidStateError') {
                errorMsg += 'Speech recognition already running or not ready.';
              } else if (speechError.name === 'NotAllowedError') {
                errorMsg += 'Please allow microphone permission.';
              } else {
                errorMsg += 'You can add transcription manually after recording.';
              }
              setSpeechRecognitionError(errorMsg);
              console.log('⚠️ Continuing without live transcription for this recording');
            }
          } else {
            console.warn('⚠️ initializeSpeechRecognition() returned null');
          }
        } else {
          console.log('📝 Live transcription disabled or not supported');
          console.log('   - liveTranscriptionEnabled:', liveTranscriptionEnabled);
          console.log('   - speechRecognitionSupported:', speechRecognitionSupported);
        }
      }
      
      // Set a timeout to check if speech recognition actually started
      if (speechRecognitionStarted) {
        setTimeout(() => {
          if (!isListening && (recognitionRef.current || nativeSpeechActiveRef.current)) {
            console.warn('⚠️ Speech recognition may not have started properly');
            console.warn('⚠️ Check browser console for permission errors');
            setSpeechRecognitionError('Live transcription may not be working. You can add transcription manually after recording.');
          } else if (isListening) {
            console.log('✅ Speech recognition confirmed running');
          }
        }, 2000);
      }
      
      // Check microphone permission first - CRITICAL for Android
      if (hasPermission !== true) {
        console.log('🎤 Requesting microphone permission...');
        const permitted = await checkMicrophonePermission();
        if (!permitted) {
          console.error('❌ Microphone permission denied');
          return;
        }
        
        // 🤖 ANDROID FIX: Add delay after permission grant
        if (isAndroid) {
          console.log('🤖 Android detected - waiting 500ms after permission grant...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Mobile-friendly audio constraints or Cordova Media setup
      let mediaRecorder;
      let cordovaMedia;
      let audioChunks = [];
      
      // Define audio constraints based on device type
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
      
      // Try getUserMedia first, even on Android
      console.log('🎤 Audio constraints:', audioConstraints);
      
      // Request microphone stream
      console.log('🎤 Requesting getUserMedia...');
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      console.log('✅ Microphone stream obtained, tracks:', stream.getTracks().length);
      
      // Verify stream is active
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks found in stream');
      }
      console.log('✅ Audio track status:', audioTracks[0].readyState, audioTracks[0].enabled);
      
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
        console.log('⚠️ Primary MIME type not supported, checking alternatives...');
        const alternatives = [
          'audio/webm',
          'audio/mp4',
          'audio/wav',
          'audio/ogg',
          'audio/3gpp',
          'audio/aac'
        ];
        
        for (const type of alternatives) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            console.log('📱 Using alternative MIME type:', type);
            break;
          }
        }
        
        if (mimeType === 'audio/webm;codecs=opus') {
          console.error('❌ No supported MIME type found!');
          throw new Error('No supported audio format found for recording');
        }
      }
      
      console.log('🎤 Final MIME type selected:', mimeType);

      // 🤖 ANDROID FIX: Create MediaRecorder with explicit options
      let recorderOptions = { mimeType };
      
      // Try with audio bits per second for better Android compatibility
      if (isAndroid) {
        try {
          recorderOptions.audioBitsPerSecond = 128000;
          console.log('🤖 Android: Setting audioBitsPerSecond to 128000');
        } catch (e) {
          console.warn('Could not set audioBitsPerSecond:', e);
        }
      }
      
      console.log('🎤 Creating MediaRecorder with options:', recorderOptions);
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorder = recorder;
      audioChunksRef.current = [];
      
      console.log('✅ MediaRecorder created, state:', recorder.state);

      recorder.ondataavailable = (event) => {
        console.log('📊 Data available:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📊 Total chunks:', audioChunksRef.current.length);
        }
      };

      recorder.onstop = async () => {
        console.log('🎤 Recording stopped, creating audio blob...');
        console.log('📊 Total audio chunks collected:', audioChunksRef.current.length);
        
        if (audioChunksRef.current.length === 0) {
          console.error('❌ No audio data recorded!');
          setError('No audio data was recorded. Please try again.');
          return;
        }
        
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('✅ Audio blob created:', blob.size, 'bytes, type:', blob.type);
        
        if (blob.size === 0) {
          console.error('❌ Audio blob is empty!');
          setError('Recording failed - no audio data captured. Please try again.');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStage('review');
        console.log('✅ Audio URL created, ready for review');

        // Auto-transcribe on Android (since live STT doesn't work reliably)
        if (isNativeAndroid() && blob.size > 0) {
          startTranscription(blob);
        }
      };

      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        console.error('Error details:', event.error);
        setError('Recording error: ' + (event.error?.message || 'Unknown error'));
      };
      
      recorder.onstart = () => {
        console.log('✅ MediaRecorder started, state:', recorder.state);
      };

      // Start recording
      const recordingInterval = isMobileDevice ? 1000 : 100;
      console.log('🎤 Starting MediaRecorder with', recordingInterval, 'ms intervals...');
      
      try {
        recorder.start(recordingInterval);
        console.log('✅ MediaRecorder.start() called');
      } catch (startError) {
        console.error('❌ Failed to start MediaRecorder:', startError);
        throw new Error('Failed to start recording: ' + startError.message);
      }
      
      // Set the mediaRecorder reference
      mediaRecorderRef.current = recorder;
      
      setIsRecording(true);
      isRecordingRef.current = true;
      setStage('record');
      console.log('✅ Recording state set to active');
      
      // Start audio level monitoring (desktop only)
      if (!isMobileDevice && analyserRef.current) {
        monitorAudioLevel();
      }

      console.log('✅ Recording started successfully');
      
      // 🤖 ANDROID: Verify recording is actually working
      if (isAndroid) {
        setTimeout(() => {
          if (mediaRecorderRef.current) {
            console.log('🤖 Android check - MediaRecorder state:', mediaRecorderRef.current.state);
            console.log('🤖 Android check - Audio chunks:', audioChunksRef.current.length);
            if (mediaRecorderRef.current.state !== 'recording') {
              console.error('❌ MediaRecorder not in recording state!');
              setError('Recording may not be working. Please try again.');
            }
          }
        }, 2000);
      }

    } catch (err) {
      console.error('❌ Error starting recording:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
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
      // Cordova Media doesn't support pause/resume, so this is disabled on Android
      if (mediaRecorderRef.current.cordovaMedia) {
        console.log('⚠️ Pause not supported with Cordova Media - stopping recording instead');
        setError('Pause not supported on Android. Recording will stop. You can restart recording.');
        stopRecording();
        return;
      }
      
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        // Stop native speech if active
        if (nativeSpeechActiveRef.current) {
          stopNativeSpeech();
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
          if (isNativeAndroid() && getNativeSpeechPlugin()) {
            startNativeSpeech();
          } else {
            const recognition = initializeSpeechRecognition();
            if (recognition) {
              recognition.start();
            }
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
      manualStopRef.current = true;
      
      // Handle Cordova Media recording (if we were using it)
      if (mediaRecorderRef.current.cordovaMedia) {
        console.log('🎤 Stopping Cordova Media recording...');
        mediaRecorderRef.current.stop().then((blob) => {
          if (blob) {
            console.log('✅ Cordova Media recording stopped, blob size:', blob.size);
            setAudioBlob(blob);
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            setStage('review');
            
            // Start transcription if on Android
            if (isNativeAndroid() && blob.size > 0) {
              startTranscription(blob);
            }
          } else {
            console.error('❌ No blob returned from Cordova Media');
            setError('Recording failed - no audio data captured.');
          }
        }).catch((error) => {
          console.error('❌ Error stopping Cordova Media recording:', error);
          setError('Error stopping recording: ' + error.message);
        });
      } else {
        // Handle MediaRecorder
        console.log('🎤 Stopping MediaRecorder...');
        try {
          mediaRecorderRef.current.stop();
          console.log('✅ MediaRecorder.stop() called');
        } catch (stopError) {
          console.error('❌ Error stopping MediaRecorder:', stopError);
          setError('Error stopping recording: ' + stopError.message);
        }
      }
      
      // Clean up common resources
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      // Stop native speech if active
      if (nativeSpeechActiveRef.current) {
        stopNativeSpeech();
      }
      
      if (recognitionRestartTimeoutRef.current) {
        clearTimeout(recognitionRestartTimeoutRef.current);
      }
      
      setIsRecording(false);
      isRecordingRef.current = false;
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

      // For MediaRecorder, the onstop handler will handle the rest
      if (!mediaRecorderRef.current.cordovaMedia) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // If no transcription was captured and live transcription was enabled, suggest manual entry
      if (liveTranscriptionEnabled && !finalTranscript.trim() && !transcription.trim()) {
        console.log('📝 No transcription captured, enabling manual mode');
        setIsEditingTranscription(true);
        setEditedTranscription('');
      }
    } else {
      console.warn('⚠️ stopRecording called but no active recording found');
      console.log('mediaRecorderRef.current:', mediaRecorderRef.current);
      console.log('isRecording:', isRecording);
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
    isRecordingRef.current = false;
    manualStopRef.current = false;
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
  };

  // Start transcription for Android recordings
  const startTranscription = async (blob) => {
    console.log('🎙️ Starting post-recording transcription...');
    setIsTranscribing(true);
    setTranscriptionProgress(10);
    
    let audioUrl = null;
    
    try {
      // Upload to Firebase Storage first
      const storage = (await import('firebase/storage')).default;
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      setTranscriptionProgress(30);
      
      const storageRef = ref(
        getStorage(),
        `transcriptions/${currentUser.uid}/${Date.now()}.webm`
      );
      
      console.log('📤 Uploading audio to Firebase Storage...');
      await uploadBytes(storageRef, blob);
      setTranscriptionProgress(50);
      
      audioUrl = await getDownloadURL(storageRef);
      console.log('✅ Audio uploaded, getting transcription...');
      console.log('🔗 Audio URL:', audioUrl);
      setTranscriptionProgress(70);
      
      // Call Firebase Function for transcription (use configured instance to avoid CORS/region issues)
      const { httpsCallable } = await import('firebase/functions');
      const { functions: appFunctions } = await import('../../config/firebase');
      const transcribeAudio = httpsCallable(appFunctions, 'transcribeAudio');
      
      const result = await transcribeAudio({ audioUrl });
      setTranscriptionProgress(90);

      if (result.data && result.data.transcription) {
        const text = result.data.transcription;
        console.log('✅ Transcription complete:', text.length, 'chars (callable)');
        setTranscription(text);
        setEditedTranscription(text);
        setFinalTranscript(text);
        finalTranscriptRef.current = text;
        setTranscriptionProgress(100);
      } else {
        throw new Error('No transcription returned');
      }
    } catch (transcribeError) {
      console.error('❌ Auto-transcription failed (callable):', transcribeError);
      // Fallback: call explicit HTTP endpoint with CORS and ID token
      try {
        if (!audioUrl) {
          throw new Error('No audio URL available for fallback');
        }
        
        setTranscriptionProgress(80);
        console.log('🌐 Trying HTTP fallback to transcribeAudioHttp...');
        console.log('🔗 Using audio URL:', audioUrl);
        
        const { getAuth } = await import('firebase/auth');
        const idToken = await getAuth().currentUser.getIdToken();
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        const httpUrl = `https://us-central1-${projectId}.cloudfunctions.net/transcribeAudioHttp`;

        console.log('📡 Calling:', httpUrl);
        console.log('📦 Body:', JSON.stringify({ audioUrl }));

        const resp = await fetch(httpUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ audioUrl })
          });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`HTTP ${resp.status}: ${txt}`);
        }

        const data = await resp.json();
        setTranscriptionProgress(90);
        if (data && data.transcription) {
          const text = data.transcription;
          console.log('✅ Transcription complete:', text.length, 'chars (HTTP fallback)');
          setTranscription(text);
          setEditedTranscription(text);
          setFinalTranscript(text);
          finalTranscriptRef.current = text;
          setTranscriptionProgress(100);
        } else {
          throw new Error('No transcription returned from HTTP endpoint');
        }
      } catch (httpErr) {
        console.error('❌ HTTP fallback transcription failed:', httpErr);
        setError('Auto-transcription failed. You can enter text manually.');
        setIsEditingTranscription(true);
      }
    } finally {
      setIsTranscribing(false);
      setTranscriptionProgress(0);
    }
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

  const startEditingTranscription = () => {
    setEditedTranscription(transcription);
    setIsEditingTranscription(true);
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
        {/* Permission Check - Show if explicitly false OR null (unknown) */}
        {(hasPermission === false || hasPermission === null) && (
          <div className="voice-permission-card">
            <div className="voice-permission-content">
              <Shield size={24} className="voice-permission-icon" />
              <h3>Microphone Access Required</h3>
              <p>
                {isMobileDevice 
                  ? 'This app needs microphone access to record your voice journal. Tap the button below to grant permission when prompted.'
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
              {isMobileDevice && hasPermission === false && (
                <p className="voice-permission-mobile-note">
                  📱 If permission was denied, you may need to enable microphone access in your device settings, then refresh this page.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 🎤 NEW: Live Transcription Toggle - Desktop only - ONLY show when permission granted */}
        {hasPermission === true && speechRecognitionSupported && !isNativeAndroid() && (
          <div className={`voice-transcription-toggle ${themeClass}`}>
            <div className="voice-transcription-toggle-content">
              <div className="voice-transcription-toggle-info">
                <Headphones size={16} />
                <span>Live Transcription</span>
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
        
        {/* 🦊 Firefox: Show browser compatibility notice */}
        {hasPermission === true && !speechRecognitionSupported && /Firefox/i.test(navigator.userAgent) && (
          <div className="voice-error-card" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <div className="voice-error-content">
              <AlertCircle size={16} style={{ color: '#3b82f6' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#3b82f6', display: 'block', marginBottom: '4px' }}>
                  🦊 Live Transcription Not Available in Firefox
                </strong>
                <span className="voice-error-text" style={{ color: '#cbd5e1' }}>
                  Firefox doesn't support the Web Speech API. You can still record your voice and add transcription manually, 
                  or use <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong> for automatic live transcription.
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* 🤖 Android: Show post-recording transcription notice */}
        {hasPermission === true && isNativeAndroid() && (
          <div className={`voice-transcription-toggle ${themeClass}`}>
            <div className="voice-transcription-toggle-content">
              <div className="voice-transcription-toggle-info">
                <Headphones size={16} />
                <span>AI Transcription</span>
                <span className="voice-mobile-badge">🤖 Powered by OpenAI Whisper</span>
              </div>
            </div>
            <p className="voice-transcription-toggle-description">
              ✨ Your recording will be automatically transcribed after you stop
            </p>
          </div>
        )}

        {/* Prompt Display */}
        {prompt && hasPermission === true && (
          <div className={`voice-prompt-card ${themeClass}`}>
            <h3 className={`voice-prompt-label ${themeClass}`}>Today's Voice Prompt</h3>
            <p className={`voice-prompt-text ${themeClass}`}>"{prompt}"</p>
          </div>
        )}

        {/* Live Transcription Status - Desktop only */}
        {isRecording && liveTranscriptionEnabled && !isNativeAndroid() && (
          <div className={`voice-recognition-status ${isListening ? 'listening' : 'not-listening'}`}>
            <div className="voice-recognition-status-content">
              <Volume2 size={16} />
              <span>
                {isListening ? 
                  '🗣️ Live transcription active - speak naturally' :
                  '⏸️ Transcription paused'
                }
              </span>
            </div>
          </div>
        )}
        
        {/* Android: Show processing notice */}
        {isRecording && isNativeAndroid() && (
          <div className="voice-recognition-status listening">
            <div className="voice-recognition-status-content">
              <Mic size={16} />
              <span>🎙️ Recording... (AI transcription after you stop)</span>
            </div>
          </div>
        )}

        {/* Recording Interface */}
        {hasPermission === true && (
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
                          disabled={isNativeAndroid()}
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
                          {isNativeAndroid() && ' (Pause not available on Android)'}
                        </span>
                        <Clock size={16} />
                        <span className="voice-duration">{formatTime(recordingTime)}</span>
                        {/* 🤖 Android recording indicator */}
                        {isMobileDevice && (
                          <span className="voice-mobile-recording-badge">
                            {/Android/i.test(navigator.userAgent) ? '🤖 Android' : '📱 Mobile'}
                          </span>
                        )}
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

        {/* Android: Show transcription progress */}
        {isTranscribing && isNativeAndroid() && (
          <div className={`voice-transcription-card ${themeClass}`}>
            <div className="voice-transcription-header">
              <div className="voice-transcription-status">
                <Volume2 size={16} className="text-blue-500" />
                <span>🤖 AI Transcription in Progress...</span>
              </div>
            </div>
            <div className={`voice-transcription-content ${themeClass}`}>
              <div className="voice-transcription-progress">
                <div 
                  className="voice-transcription-progress-bar"
                  style={{ width: `${transcriptionProgress}%` }}
                />
              </div>
              <p className={`voice-transcription-text ${themeClass}`}>
                {transcriptionProgress < 30 && '📤 Uploading audio...'}
                {transcriptionProgress >= 30 && transcriptionProgress < 70 && '☁️ Sending to OpenAI Whisper...'}
                {transcriptionProgress >= 70 && transcriptionProgress < 100 && '✨ Processing transcription...'}
                {transcriptionProgress === 100 && '✅ Complete!'}
              </p>
            </div>
          </div>
        )}

        {/* Real-time Transcription Display - Desktop or completed Android transcription */}
        {hasPermission === true && (transcription || (isRecording && !isNativeAndroid())) && (
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
        {audioBlob && hasPermission === true && (
          <button
            onClick={handleSubmit}
            disabled={!transcription.trim() || isEditingTranscription}
            className="voice-submit-button"
          >
            <Upload size={20} />
            {isEditingTranscription ? 'Save transcription first' : 'Submit Voice Journal'}
          </button>
        )}

      </div>
    </div>
  );
};

export default VoiceJournalUpload;