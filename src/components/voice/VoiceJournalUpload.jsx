// src/components/voice/VoiceJournalUpload.jsx - Updated with CSS classes
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
  Edit3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { uploadVoiceJournal } from '../../services/claudeService';
import '../../styles/VoiceJournalUpload.css'; // Import the CSS file

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
  
  // ✅ Safe AudioContext closure
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
    recognitionRef.current.stop();
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

  // Audio level monitoring
  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1
      
      if (isRecording && !isPaused) {
        animationRef.current = requestAnimationFrame(monitorAudioLevel);
      }
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onresult = (event) => {
      interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Update transcription in real-time
      const fullTranscript = finalTranscript + interimTranscript;
      setTranscription(fullTranscript);
      
      // Auto-save edited version
      if (!isEditingTranscription) {
        setEditedTranscription(fullTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      // Save final transcription when recognition ends
      if (finalTranscript.trim()) {
        const cleanTranscript = finalTranscript.trim();
        setTranscription(cleanTranscript);
        if (!isEditingTranscription) {
          setEditedTranscription(cleanTranscript);
        }
      }
    };

    return recognition;
  };

  const startRecording = async () => {
    try {
      setError('');
      setRecordingTime(0);
      setTranscription('');
      setEditedTranscription('');
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;

      // Set up audio context for level monitoring
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStage('review');
      };

      // Start speech recognition
      const recognition = initializeSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        console.log('Speech recognition started');
      }

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setStage('record');
      
      // Start audio level monitoring
      monitorAudioLevel();

    } catch (err) {
      setError('Microphone access denied. Please allow microphone permission.');
      console.error('Error starting recording:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsPaused(true);
        clearInterval(timerRef.current);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        mediaRecorderRef.current.resume();
        // Restart speech recognition
        const recognition = initializeSpeechRecognition();
        if (recognition) {
          recognitionRef.current = recognition;
          recognition.start();
        }
        setIsPaused(false);
        monitorAudioLevel();
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
      
      setIsRecording(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      setAudioLevel(0);
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
    setRecordingTime(0);
    setIsPlaying(false);
    setError('');
    setStage('record');
    setIsEditingTranscription(false);
  };

  // Handle transcription editing
  const startEditingTranscription = () => {
    setIsEditingTranscription(true);
    setEditedTranscription(transcription);
  };

  const saveTranscriptionEdit = () => {
    setTranscription(editedTranscription);
    setIsEditingTranscription(false);
  };

  const cancelTranscriptionEdit = () => {
    setEditedTranscription(transcription);
    setIsEditingTranscription(false);
  };

  // In VoiceJournalUpload.jsx, replace the handleSubmit function with this:

const handleSubmit = async () => {
  if (!audioBlob || !currentUser) return;
  
  const finalTranscription = isEditingTranscription ? editedTranscription : transcription;
  
  if (!finalTranscription.trim()) {
    setError('Please ensure your voice was transcribed or edit the transcription manually.');
    return;
  }
  
  setIsUploading(true);
  
  try {
    console.log('🎤 Starting voice journal upload process...');
    
    // Upload voice journal to Firebase Storage
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

    // Create comprehensive voice data object
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
      userId: currentUser.uid
    };

    console.log('🎤 Voice data prepared:', voiceData);
    
    // Call parent with voice data object directly
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
          <h1 className="voice-header-title">Voice Journal</h1>
          <div className="voice-header-spacer"></div>
        </div>
      </div>

      <div className="voice-content">
        {/* Prompt Display */}
        {prompt && (
          <div className={`voice-prompt-card ${themeClass}`}>
            <h3 className={`voice-prompt-label ${themeClass}`}>Today's Voice Prompt</h3>
            <p className={`voice-prompt-text ${themeClass}`}>"{prompt}"</p>
          </div>
        )}

        {/* Speech Recognition Status */}
        {isRecording && (
          <div className="voice-recognition-status">
            <div className="voice-recognition-status-content">
              <Volume2 size={16} />
              <span>Live transcription active - speak naturally</span>
            </div>
          </div>
        )}

        {/* Recording Interface */}
        <div className={`voice-recording-card ${themeClass}`}>
          <div className="voice-recording-content">
            {stage === 'record' && !audioUrl && (
              <>
                <h3 className="voice-recording-title">Record Your Voice Journal</h3>
                <p className={`voice-recording-subtitle ${themeClass}`}>Speak your thoughts and reflections</p>
                
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="voice-record-button"
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
                    
                    {/* Audio Level Indicator */}
                    <div className="voice-level-container">
                      <div 
                        className="voice-level-bar"
                        style={{ width: `${audioLevel * 100}%` }}
                      />
                    </div>
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

        {/* Real-time Transcription Display */}
        {transcription && (
          <div className={`voice-transcription-card ${themeClass}`}>
            <div className="voice-transcription-header">
              <div className="voice-transcription-status">
                <CheckCircle size={16} className="text-green-500" />
                <span>
                  {isRecording ? 'Live Transcription' : 'Transcription Complete'}
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
                  placeholder="Edit your transcription here..."
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
                  {transcription}
                </p>
              </div>
            )}
            
            {/* Word count and transcription stats */}
            <div className="voice-transcription-stats">
              <span>
                Words: {transcription.split(/\s+/).filter(Boolean).length}
              </span>
              {isRecording && (
                <span className="voice-transcription-live-status">
                  ✨ Real-time transcription active
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
        {audioBlob && (
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
          <h4 className={`voice-tips-title ${themeClass}`}>Voice Journaling Tips</h4>
          <ul className="voice-tips-list">
            <li className={`voice-tips-item ${themeClass}`}>• Find a quiet space for the best recording quality</li>
            <li className={`voice-tips-item ${themeClass}`}>• Speak naturally and let emotions come through your voice</li>
            <li className={`voice-tips-item ${themeClass}`}>• Your speech is transcribed automatically as you speak</li>
            <li className={`voice-tips-item ${themeClass}`}>• Take pauses when you need time to think - silence is okay</li>
            <li className={`voice-tips-item ${themeClass}`}>• You can edit the transcription before submitting</li>
            <li className={`voice-tips-item ${themeClass}`}>• 🎤 AI will analyze both your words and vocal expressions</li>
          </ul>
        </div>

        {/* Voice analysis preview */}
        {transcription && !isRecording && (
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