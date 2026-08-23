// src/components/voice/VoiceJournalUpload.jsx
// Apple Spatial Glass design – full logic preserved, only UI upgraded

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Volume2,
  Edit3,
  Smartphone,
  Shield,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { uploadVoiceJournal } from '../../services/claudeService';
import '../../styles/VoiceJournalUpload.css'; // glass version

const VoiceJournalUpload = ({
  pathId,
  dayNumber,
  onUploadComplete,
  onBack,
  prompt,
  pathColor,
}) => {
  const { t } = useTranslation('voice');
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode } = useTheme();

  // ========== STATE (unchanged) ==========
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
  const [stage, setStage] = useState('record'); // 'record', 'review'
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);
  const [editedTranscription, setEditedTranscription] = useState('');
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);

  const [hasPermission, setHasPermission] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  // Whisper transcribes after recording on all platforms — live recognition disabled.
  const [liveTranscriptionEnabled, setLiveTranscriptionEnabled] = useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  // ========== REFS (unchanged) ==========
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
  // The level loop runs outside React, so it cannot read state: a closure made
  // in startRecording captures isRecording as false (setIsRecording had not
  // committed yet), which is why the old meter never drew a single frame.
  const isPausedRef = useRef(false);
  const waveCanvasRef = useRef(null);
  const recorderShellRef = useRef(null);
  const levelsRef = useRef([]);
  const manualStopRef = useRef(false);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const nativeSpeechActiveRef = useRef(false);
  const nativeSpeechStopFnRef = useRef(null);

  // ========== HELPER FUNCTIONS (copied verbatim from original) ==========
  const isNativeAndroid = () => {
    try {
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

  const getNativeSpeechPlugin = () => {
    try {
      return window?.plugins?.speechRecognition || null;
    } catch {
      return null;
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
    if (recognitionRestartTimeoutRef.current) {
      clearTimeout(recognitionRestartTimeoutRef.current);
    }
    const delayMs = Math.max(0, delay || 0);
    const restartTimeout = setTimeout(() => {
      if (shouldAttemptSpeechRestart()) {
        const newRecognition = initializeSpeechRecognition();
        if (newRecognition) {
          try {
            newRecognition.start();
          } catch (restartError) {
            console.warn('Failed to restart recognition:', restartError);
          }
        }
      }
      recognitionRestartTimeoutRef.current = null;
    }, delayMs);
    recognitionRestartTimeoutRef.current = restartTimeout;
  };

  const initializeSpeechRecognition = () => {
    if (!speechRecognitionSupported || !liveTranscriptionEnabled) return null;
    if (isNativeAndroid() && getNativeSpeechPlugin()) return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    const recognitionId = Date.now();
    const recognition = new SpeechRecognition();
    recognition._instanceId = recognitionId;
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = navigator.language || 'en-US';

    const isCurrentRecognition = () =>
      recognitionRef.current && recognitionRef.current._instanceId === recognitionId;

    recognition.onstart = () => {
      if (!isCurrentRecognition()) return;
      setIsListening(true);
      setSpeechRecognitionError('');
      manualStopRef.current = false;
    };

    recognition.onresult = (event) => {
      if (!isCurrentRecognition()) return;
      let newInterim = '';
      let newFinal = '';
      const startIdx = event.resultIndex || 0;
      for (let i = startIdx; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          newFinal += transcript + ' ';
        } else {
          newInterim += transcript;
        }
      }
      if (newFinal.trim()) {
        finalTranscriptRef.current += newFinal;
      }
      interimTranscriptRef.current = newInterim;
      const cleanFinal = finalTranscriptRef.current.trim();
      const combined = cleanFinal ? `${cleanFinal} ${newInterim}`.trim() : newInterim;
      setFinalTranscript(cleanFinal);
      setInterimTranscript(newInterim);
      setTranscription(combined);
      if (!isEditingTranscription) setEditedTranscription(combined);
    };

    recognition.onerror = (event) => {
      if (!isCurrentRecognition()) return;
      setIsListening(false);
      const errorMessages = {
        'no-speech': 'No speech detected.',
        'audio-capture': 'Audio capture failed.',
        'not-allowed': 'Microphone permission denied.',
        'network': 'Network error.',
      };
      setSpeechRecognitionError(errorMessages[event.error] || `Error: ${event.error}`);
      if (['no-speech', 'audio-capture'].includes(event.error) && isNativeAndroid()) {
        scheduleSpeechRecognitionRestart(1000, 'error');
      }
    };

    recognition.onend = () => {
      if (!isCurrentRecognition()) return;
      setIsListening(false);
      const shouldRestart = shouldAttemptSpeechRestart();
      if (shouldRestart) {
        scheduleSpeechRecognitionRestart(isNativeAndroid() ? 1000 : 300, 'auto-end');
      }
      if (recognitionRef.current && recognitionRef.current._instanceId === recognitionId) {
        recognitionRef.current = null;
      }
    };

    return recognition;
  };

  const startNativeSpeech = async () => {
    const plugin = getNativeSpeechPlugin();
    if (!plugin) return false;
    try {
      await new Promise((resolve) => {
        plugin.requestPermission(() => resolve(true), () => resolve(false));
      });
      const userLang = navigator.language || 'en-US';
      const onResults = (matches) => {
        const text = Array.isArray(matches) ? (matches[0] || '') : (matches?.value || matches || '');
        if (text && text.trim()) {
          finalTranscriptRef.current = finalTranscriptRef.current
            ? finalTranscriptRef.current + ' ' + text
            : text;
          const combined = finalTranscriptRef.current.trim();
          setFinalTranscript(combined);
          setTranscription(combined);
          if (!isEditingTranscription) setEditedTranscription(combined);
          setIsListening(true);
        }
      };
      const onError = (err) => {
        const errMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
        if (errMsg === 'No match' || errMsg.includes('no-match')) {
          if (isRecordingRef.current && nativeSpeechActiveRef.current) {
            setTimeout(() => {
              if (isRecordingRef.current && nativeSpeechActiveRef.current) {
                plugin.startListening(onResults, onError, {
                  language: userLang,
                  matches: 5,
                  showPopup: false,
                  partialResults: true,
                  prompt: '',
                });
              }
            }, 300);
          }
          return;
        }
        setSpeechRecognitionError(`Speech: ${errMsg}`);
        setIsListening(false);
        nativeSpeechActiveRef.current = false;
      };
      plugin.startListening(onResults, onError, {
        language: userLang,
        matches: 5,
        showPopup: false,
        partialResults: true,
        prompt: '',
      });
      nativeSpeechStopFnRef.current = () => {
        plugin.stopListening(() => {}, () => {});
      };
      nativeSpeechActiveRef.current = true;
      setIsListening(true);
      return true;
    } catch (e) {
      setSpeechRecognitionError('Live transcription unavailable');
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
    } catch (e) {}
    nativeSpeechActiveRef.current = false;
    setIsListening(false);
  };

  const checkMicrophonePermission = async () => {
    if (Capacitor.isNativePlatform && Capacitor.getPlatform() === 'android') {
      if (window.cordova?.plugins?.permissions) {
        try {
          const permissions = window.cordova.plugins.permissions;
          const has = await new Promise((resolve) => {
            permissions.checkPermission(permissions.RECORD_AUDIO, (status) => resolve(status.hasPermission), () => resolve(false));
          });
          if (!has) {
            const granted = await new Promise((resolve) => {
              permissions.requestPermission(permissions.RECORD_AUDIO, (status) => resolve(status.hasPermission), () => resolve(false));
            });
            if (granted) {
              setHasPermission(true);
              return true;
            } else {
              setHasPermission(false);
              setError(t('voiceUpload.errorPermissionDenied', 'Microphone permission denied. Enable in settings.'));
              return false;
            }
          } else {
            setHasPermission(true);
            return true;
          }
        } catch (err) {
          setHasPermission(false);
          setError(t('voiceUpload.errorPermissionCheckFailed', 'Permission check failed.'));
          return false;
        }
      } else {
        setHasPermission(false);
        setError(t('voiceUpload.errorPermissionsPluginUnavailable', 'Permissions plugin not available.'));
        return false;
      }
    }
    // Web
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      setHasPermission(false);
      setError(t('voiceUpload.errorMicrophoneRequired', 'Microphone access required.'));
      return false;
    }
  };

  const startRecording = async () => {
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
    // Transcription runs after recording via Whisper on every platform — no live recognition.

    if (hasPermission !== true) {
      const ok = await checkMicrophonePermission();
      if (!ok) return;
      if (isAndroid) await new Promise(r => setTimeout(r, 500));
    }

    const audioConstraints = isMobileDevice ? {
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    } : {
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 44100 }
    };
    const stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
    streamRef.current = stream;

    if (!isMobileDevice) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
          if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;
        }
      } catch (e) {}
    }

    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      const alts = ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/ogg'];
      for (const t of alts) {
        if (MediaRecorder.isTypeSupported(t)) {
          mimeType = t;
          break;
        }
      }
    }
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStage('review');
      if (blob.size > 0) {
        startTranscription(blob);
      }
    };
    recorder.start(isMobileDevice ? 1000 : 100);
    setIsRecording(true);
    isRecordingRef.current = true;
    setStage('record');
    // Every platform, not just desktop. The waveform is the whole feedback
    // loop of speaking into a screen, and a phone is where most of this
    // recording actually happens.
    isPausedRef.current = false;
    runLevelLoop();
  };

  /**
   * Drives everything that reacts to the sound of your voice: the bars, and
   * the glow around the record button.
   *
   * Deliberately outside React. At 60fps a setState per frame would re-render
   * a 900-line component sixty times a second; the canvas is drawn to directly
   * and the button's intensity is written as a CSS variable, so this loop
   * causes no renders at all.
   *
   * It reads refs rather than state for the same reason the refs exist: the
   * previous version tested `isRecording`, captured false in the closure that
   * started it, so the condition failed on frame one and the meter never ran.
   */
  const runLevelLoop = () => {
    const draw = () => {
      const analyser = analyserRef.current;
      if (!analyser || !isRecordingRef.current) return;

      let level = 0;
      if (!isPausedRef.current) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        // The raw average sits low and flat for speech. A gentle curve lifts
        // ordinary talking into the visible range without pinning shouts.
        level = Math.min(1, Math.pow(avg / 255, 0.62) * 1.35);
      }

      // Reported to the shell as a variable, so the glow is pure CSS.
      if (recorderShellRef.current) {
        recorderShellRef.current.style.setProperty('--level', level.toFixed(3));
      }

      // A rolling history, newest last. Paused pushes silence, so the trace
      // shows the gap rather than freezing mid-word.
      const bars = levelsRef.current;
      bars.push(level);
      if (bars.length > 64) bars.shift();

      const canvas = waveCanvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
        }
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const gap = 2;
        const barW = Math.max(2, (w - gap * (bars.length - 1)) / bars.length);
        const mid = h / 2;
        const accent = getComputedStyle(canvas).getPropertyValue('--c').trim() || '85,139,110';

        bars.forEach((v, i) => {
          // Symmetrical about the centre line, with a floor so silence is a
          // visible thread rather than nothing at all.
          const barH = Math.max(2, v * (h - 4));
          const x = i * (barW + gap);
          // Older bars fade, so the trace reads as time moving left.
          const age = i / bars.length;
          ctx.fillStyle = `rgba(${accent}, ${(0.25 + age * 0.75).toFixed(2)})`;
          ctx.beginPath();
          ctx.roundRect(x, mid - barH / 2, barW, barH, barW / 2);
          ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(draw);
    };
    cancelAnimationFrame(animationRef.current);
    draw();
  };

  const stopLevelLoop = () => {
    cancelAnimationFrame(animationRef.current);
    levelsRef.current = [];
    if (recorderShellRef.current) {
      recorderShellRef.current.style.setProperty('--level', '0');
    }
    const canvas = waveCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        if (recognitionRef.current) recognitionRef.current.stop();
        if (nativeSpeechActiveRef.current) stopNativeSpeech();
        if (recognitionRestartTimeoutRef.current) clearTimeout(recognitionRestartTimeoutRef.current);
        setIsPaused(true);
        isPausedRef.current = true;
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
        // The loop keeps running while paused — it pushes silence, so the
        // trace shows the gap instead of freezing mid-word.
      } else {
        mediaRecorderRef.current.resume();
        if (liveTranscriptionEnabled && speechRecognitionSupported) {
          if (isNativeAndroid() && getNativeSpeechPlugin()) startNativeSpeech();
          else { const r = initializeSpeechRecognition(); if (r) r.start(); }
        }
        setIsPaused(false);
        isPausedRef.current = false;
        runLevelLoop();
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      manualStopRef.current = true;
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) recognitionRef.current.stop();
      if (nativeSpeechActiveRef.current) stopNativeSpeech();
      if (recognitionRestartTimeoutRef.current) clearTimeout(recognitionRestartTimeoutRef.current);
      setIsRecording(false);
      isRecordingRef.current = false;
      setIsPaused(false);
      setIsListening(false);
      if (timerRef.current) clearInterval(timerRef.current);
      stopLevelLoop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
      streamRef.current?.getTracks().forEach(track => track.stop());
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
    if (audioUrl) URL.revokeObjectURL(audioUrl);
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

  const startTranscription = async (blob) => {
    setIsTranscribing(true);
    setTranscriptionProgress(10);
    let audioUrlStorage = null;
    try {
      const storage = await import('firebase/storage');
      const { getStorage, ref, uploadBytes, getDownloadURL } = storage;
      setTranscriptionProgress(30);
      const storageRef = ref(getStorage(), `transcriptions/${currentUser.uid}/${Date.now()}.webm`);
      await uploadBytes(storageRef, blob);
      setTranscriptionProgress(50);
      audioUrlStorage = await getDownloadURL(storageRef);
      setTranscriptionProgress(70);
      const { httpsCallable } = await import('firebase/functions');
      const { functions: appFunctions } = await import('../../config/firebase');
      const transcribeAudio = httpsCallable(appFunctions, 'transcribeAudio');
      const result = await transcribeAudio({ audioUrl: audioUrlStorage });
      setTranscriptionProgress(90);
      if (result.data?.transcription) {
        const text = result.data.transcription;
        setTranscription(text);
        setEditedTranscription(text);
        setFinalTranscript(text);
        finalTranscriptRef.current = text;
        setTranscriptionProgress(100);
      } else throw new Error('No transcription');
    } catch (err) {
      console.error('❌ Auto-transcription failed (callable):', err);
      // Try HTTP fallback to the explicit endpoint if available (helps when callable fails due to config/env)
      try {
        if (!audioUrlStorage) throw err;
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
        if (!projectId) throw new Error('Project ID not available for HTTP fallback');
        const idToken = currentUser && typeof currentUser.getIdToken === 'function'
          ? await currentUser.getIdToken()
          : null;
        setTranscriptionProgress(80);
        const httpUrl = `https://us-central1-${projectId}.cloudfunctions.net/transcribeAudioHttp`;
        console.log('🌐 Trying HTTP fallback to transcribeAudioHttp...', httpUrl, { audioUrl: audioUrlStorage });
        const resp = await fetch(httpUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: JSON.stringify({ audioUrl: audioUrlStorage }),
        });
        if (!resp.ok) {
          const bodyText = await resp.text().catch(() => '');
          throw new Error(`HTTP ${resp.status}: ${bodyText || resp.statusText}`);
        }
        const json = await resp.json();
        setTranscriptionProgress(90);
        if (json?.transcription) {
          const text = json.transcription;
          setTranscription(text);
          setEditedTranscription(text);
          setFinalTranscript(text);
          finalTranscriptRef.current = text;
          setTranscriptionProgress(100);
          return;
        }
        throw new Error('No transcription returned from HTTP fallback');
      } catch (fallbackErr) {
        console.error('❌ Auto-transcription failed (HTTP fallback):', fallbackErr);
        const msg = fallbackErr?.message || err?.message || 'Auto-transcription failed';
        setError(t('voiceUpload.errorAutoTranscriptionFailed', 'Auto-transcription failed: {{msg}}. You can enter text manually.', { msg }));
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
    } else setError(t('voiceUpload.errorEnterTranscription', 'Please enter a transcription.'));
  };

  const cancelTranscriptionEdit = () => {
    setEditedTranscription(transcription);
    setIsEditingTranscription(false);
  };

  const startEditingTranscription = () => {
    setEditedTranscription(transcription);
    setIsEditingTranscription(true);
  };

  const toggleLiveTranscription = () => {
    if (isRecording) {
      setError(t('voiceUpload.errorCannotChangeModeWhileRecording', 'Cannot change mode while recording'));
      return;
    }
    setLiveTranscriptionEnabled(!liveTranscriptionEnabled);
    setSpeechRecognitionError('');
  };

  const handleSubmit = async () => {
    if (!audioBlob || !currentUser) return;
    const finalText = isEditingTranscription ? editedTranscription : transcription;
    if (!finalText.trim()) {
      setError(t('voiceUpload.errorTranscriptionIncomplete', 'Please ensure transcription is complete.'));
      return;
    }
    setIsUploading(true);
    try {
      const audioUrlResult = await uploadVoiceJournal(
        audioBlob, finalText, currentUser.uid, dayNumber, pathId,
        { keepAudio: true, duration: recordingTime }
      );
      const voiceData = {
        audioUrl: audioUrlResult,
        audioBlob,
        transcription: finalText,
        duration: recordingTime,
        pathId,
        day: dayNumber,
        type: 'voice',
        wordCount: finalText.split(/\s+/).filter(Boolean).length,
        uploadedAt: new Date().toISOString(),
        userId: currentUser.uid,
        deviceType: isMobileDevice ? 'mobile' : 'desktop',
        transcriptionMethod: 'auto'
      };
      onUploadComplete(voiceData);
    } catch (error) {
      setError(t('voiceUpload.errorUploadFailed', 'Upload failed: {{msg}}', { msg: error.message }));
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, isPaused]);

  // Mobile detection on mount
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(isMobile);
    const hasWebkit = 'webkitSpeechRecognition' in window;
    const hasSpeech = 'SpeechRecognition' in window;
    const webSupported = hasWebkit || hasSpeech;
    const nativeAvailable = isMobile && isNativeAndroid() && !!getNativeSpeechPlugin();
    setSpeechRecognitionSupported(webSupported || nativeAvailable);
    if (!webSupported && /Firefox/i.test(navigator.userAgent)) setLiveTranscriptionEnabled(false);
    checkMicrophonePermission();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const themeClass = isDarkMode ? 'dark' : 'light';
  // Accepted from the caller rather than derived here: path colours live on
  // the user's in-progress path objects, not in a static registry this
  // component can reach. The default is the app green, which is what the
  // hardcoded value was anyway.
  const pathColorRgb = pathColor || '85, 139, 110';

  // ========== RENDER (Glass UI) ==========
  if (isUploading) {
    return (
      <div className={`spatial-surface glass-voice-container ${themeClass}`}>
        <div className="glass-loading-state">
          <div className="glass-spinner" />
          <h3>{t('voiceUpload.processingTitle', 'Processing Voice Entry')}</h3>
          <p>{t('voiceUpload.processingSubtitle', 'Uploading and analyzing your voice journal...')}</p>
          {/* Icons are lucide SVGs rather than emoji: emoji render as a
              different typeface per platform, carry their own colour, and sit
              off the text baseline — which is most of what makes them look
              cheap. These inherit currentColor and the stroke weight. */}
          <div className="glass-stats">
            <span><Sparkles size={13} strokeWidth={1.8} />{t('voiceUpload.claudeAnalysis', 'Claude AI analysis')}</span>
            <span><FileText size={13} strokeWidth={1.8} />{t('voiceUpload.wordsStat', '{{count}} words', { count: transcription.split(/\s+/).filter(Boolean).length })}</span>
            <span><Clock size={13} strokeWidth={1.8} />{t('voiceUpload.timeStat', '{{time}}', { time: formatTime(recordingTime) })}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    // is-recording tints the ambient aurora red and gives it a slow breath, so
    // the room itself reports the state. Paused deliberately doesn't qualify —
    // a still room reads as stopped, which is what paused means.
    <div
      className={`spatial-surface glass-voice-container ${themeClass}${isRecording && !isPaused ? ' is-recording' : ''}`}
      style={{ '--c': pathColorRgb }}
    >
      {/* Header */}
      <div className="glass-header-row">
        <button className="glass-icon-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="glass-title">{t('voiceUpload.title', 'Voice Journal')}</h1>
        {isMobileDevice && <Smartphone size={20} className="mobile-icon" />}
        <div className="spacer" />
      </div>

      {/* Permission Card */}
      {(hasPermission === false || hasPermission === null) && (
        <div className="glass-card permission-card">
          <Shield size={24} />
          <h3>{t('voiceUpload.permissionRequiredTitle', 'Microphone Access Required')}</h3>
          <p>
            {isMobileDevice
              ? t('voiceUpload.permissionRequiredMobile', 'Tap below to grant microphone permission for voice journaling.')
              : t('voiceUpload.permissionRequiredDesktop', 'Allow microphone access to record your voice.')}
          </p>
          <button className="glass-button primary" onClick={checkMicrophonePermission}>
            <Mic size={16} /> {t('voiceUpload.allowMicrophone', 'Allow Microphone')}
          </button>
        </div>
      )}

      {/* Today's Prompt */}
      {prompt && hasPermission === true && (
        <div className="glass-card prompt-card">
          <h3>{t('voiceUpload.todaysPromptTitle', "Today's Voice Prompt")}</h3>
          <p className="prompt-text">"{prompt}"</p>
        </div>
      )}

      {/* Recording Status Indicator */}
      {isRecording && (
        <div className="glass-status active">
          <Mic size={16} />
          <span>{t('voiceUpload.recordingStatus', "Recording — speak naturally. We'll write it down when you stop.")}</span>
        </div>
      )}

      {/* Main Recording Card */}
      {hasPermission === true && (
        <div className="glass-card recording-card">
          {stage === 'record' && !audioUrl ? (
            <div className="vj-stage" ref={recorderShellRef}>
              {/* The timer is the largest thing on the screen while recording.
                  It is the one number you actually look for, and reading it
                  should not mean hunting through a status line. */}
              <div className={`vj-timer${isRecording ? ' is-live' : ''}`}>
                {formatTime(recordingTime)}
              </div>

              <p className="vj-hint">
                {!isRecording
                  ? t('voiceUpload.recordSubtitle', 'Tap the mic and speak freely — your entry is written down for you.')
                  : isPaused
                    ? t('voiceUpload.paused', 'Paused')
                    : t('voiceUpload.recording', 'Recording')}
              </p>

              {/* The trace. Rendered at all times so the layout does not jump
                  when recording starts; it simply has nothing to draw yet. */}
              <canvas
                ref={waveCanvasRef}
                className={`vj-wave${isRecording && !isPaused ? ' is-live' : ''}`}
                aria-hidden="true"
              />

              <div className="vj-controls">
                {!isRecording ? (
                  <button
                    className="vj-record"
                    onClick={startRecording}
                    aria-label={t('voiceUpload.startRecording', 'Start recording')}
                  >
                    <span className="vj-record-ring" aria-hidden="true" />
                    <Mic size={30} />
                  </button>
                ) : (
                  <>
                    {!isNativeAndroid() && (
                      <button
                        className="vj-secondary"
                        onClick={pauseRecording}
                        aria-label={isPaused ? t('voiceUpload.resume', 'Resume') : t('voiceUpload.pause', 'Pause')}
                      >
                        {isPaused ? <Play size={22} /> : <Pause size={22} />}
                      </button>
                    )}
                    <button
                      className="vj-record is-stop"
                      onClick={stopRecording}
                      aria-label={t('voiceUpload.stopRecording', 'Stop recording')}
                    >
                      <span className="vj-record-ring" aria-hidden="true" />
                      <Square size={26} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : stage === 'review' && audioUrl ? (
            <>
              <h3>{t('voiceUpload.reviewTitle', 'Review Your Recording')}</h3>
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
              <div className="review-controls">
                <div className="button-group">
                  <button className="glass-icon-btn" onClick={playRecording}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button className="glass-icon-btn" onClick={resetRecording}>
                    <RotateCcw size={24} />
                  </button>
                </div>
                <div className="duration">
                  <Clock size={14} />
                  <span>{t('voiceUpload.duration', 'Duration: {{time}}', { time: formatTime(recordingTime) })}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Where you are, rather than a permanent lesson in how to use a
          microphone. The old card explained three steps and then sat there
          taking a third of the screen forever; this says the same thing on
          first arrival and afterwards reports progress. */}
      {hasPermission === true && (
        <ol className="vj-steps" aria-label={t('voiceUpload.howItWorksTitle', 'How it works')}>
          {[
            { key: 'speak',  label: t('voiceUpload.stepSpeak', 'Speak'),      done: !!audioUrl,      now: isRecording },
            { key: 'write',  label: t('voiceUpload.stepWrite', 'Write down'), done: !!transcription, now: isTranscribing },
            { key: 'review', label: t('voiceUpload.stepReview', 'Review'),    done: false,           now: !!transcription && !isTranscribing },
          ].map((st, i) => (
            <li
              key={st.key}
              className={`vj-step${st.done ? ' is-done' : ''}${st.now ? ' is-now' : ''}`}
            >
              <span className="vj-step-dot">
                {st.done ? <CheckCircle size={13} strokeWidth={2.2} /> : i + 1}
              </span>
              <span className="vj-step-label">{st.label}</span>
            </li>
          ))}
        </ol>
      )}

      {/* Transcription Progress (Whisper, all platforms) */}
      {isTranscribing && (
        <div className="glass-card transcription-card">
          <div className="transcription-header">
            <Volume2 size={16} />
            <span>{t('voiceUpload.writingDown', 'Writing down your entry…')}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${transcriptionProgress}%` }} />
          </div>
          <p className="progress-text">
            {transcriptionProgress < 30 && t('voiceUpload.uploadingRecording', 'Uploading your recording…')}
            {transcriptionProgress >= 30 && transcriptionProgress < 70 && t('voiceUpload.convertingSpeech', 'Converting speech to text…')}
            {transcriptionProgress >= 70 && transcriptionProgress < 100 && t('voiceUpload.almostThere', 'Almost there…')}
            {transcriptionProgress === 100 && t('voiceUpload.done', 'Done!')}
          </p>
        </div>
      )}

      {/* Transcription Display / Editor */}
      {hasPermission === true && transcription && (
        <div className="glass-card transcription-card">
          <div className="transcription-header">
            <CheckCircle size={16} className={transcription ? 'success' : 'muted'} />
            <span>{t('voiceUpload.transcriptionComplete', 'Transcription Complete')}</span>
            {!isRecording && !isEditingTranscription && (
              <button className="edit-btn" onClick={startEditingTranscription}>
                <Edit3 size={14} /> {t('voiceUpload.edit', 'Edit')}
              </button>
            )}
          </div>
          {isEditingTranscription ? (
            <div className="editor-area">
              <textarea
                value={editedTranscription}
                onChange={(e) => setEditedTranscription(e.target.value)}
                rows={6}
                placeholder={t('voiceUpload.transcriptionPlaceholder', 'Type your transcription here...')}
              />
              <div className="editor-actions">
                <button className="glass-button primary" onClick={saveTranscriptionEdit}>
                  <CheckCircle size={14} /> {t('voiceUpload.save', 'Save')}
                </button>
                <button className="glass-button secondary" onClick={cancelTranscriptionEdit}>
                  {t('voiceUpload.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="transcription-text">
              <p>{transcription || t('voiceUpload.noTranscriptionYet', 'No transcription yet')}</p>
            </div>
          )}
          <div className="transcription-stats">
            <span>{t('voiceUpload.words', 'Words: {{count}}', { count: transcription.split(/\s+/).filter(Boolean).length })}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-notice error">
          <AlertCircle size={16} />
          <span>{error}</span>
          {audioBlob && (
            <div style={{ marginLeft: 12 }}>
              <button className="glass-button" onClick={() => startTranscription(audioBlob)}>
                {t('voiceUpload.retryTranscription', 'Retry Transcription')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {audioBlob && hasPermission === true && (
        <button
          className="glass-button primary submit-button"
          onClick={handleSubmit}
          disabled={!transcription.trim() || isEditingTranscription}
        >
          <Upload size={18} />
          {isEditingTranscription ? t('voiceUpload.saveTranscriptionFirst', 'Save transcription first') : t('voiceUpload.submitVoiceJournal', 'Submit Voice Journal')}
        </button>
      )}
    </div>
  );
};

export default VoiceJournalUpload;