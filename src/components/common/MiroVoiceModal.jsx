// src/components/common/MiroVoiceModal.jsx
//
// Dedicated Voice-to-Voice Chamber for Miro.
// Full-immersion Apple Spatial Glass modal with continuous multi-turn dialogue,
// living acoustic resonance orb, live speech transcription stream, and instant interruption.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import MiroMark from './MiroMark';
import MiroThinking from './MiroThinking';
import speechRecognitionService from '../../services/speechRecognitionService';
import textToSpeechService from '../../services/textToSpeechService';
import hapticService from '../../services/hapticService';
import '../../styles/components/miroVoiceModal.css';

const MiroVoiceModal = ({
  isOpen,
  onClose,
  messages = [],
  onSendMessage,
  isArtisan = false,
  exhausted = false,
  onUpgrade = null,
  locked = false,
  voiceEnabled = true,
  onToggleVoiceEnabled
}) => {
  const { t, i18n } = useTranslation(['home', 'journey']);

  // Phase: 'idle' | 'listening' | 'thinking' | 'speaking'
  const [phase, setPhase] = useState('idle');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Dedicated Voice Dialogue History (turns recorded during this voice chamber session)
  const [sessionTurns, setSessionTurns] = useState([]);

  const isExplicitlyPausedRef = useRef(false);
  const hasSentTurnRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const phaseRef = useRef(phase);
  const dialogueEndRef = useRef(null);
  const restartTimerRef = useRef(null);

  isOpenRef.current = isOpen;
  phaseRef.current = phase;

  const activeLang = i18n.resolvedLanguage || i18n.language || 'en';

  // Auto-scroll chat dialogue stream smoothly
  useEffect(() => {
    if (dialogueEndRef.current) {
      dialogueEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessionTurns, liveTranscript, phase]);

  // Stop any active audio and cancel timers
  const stopAllAudio = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    textToSpeechService.stop();
    speechRecognitionService.cancel();
  }, []);

  // Forward declaration ref for circular reference in continuous turn taking
  const startListeningRef = useRef(null);

  // Send turn to Claude and handle voice reply
  const sendVoiceTurn = useCallback(async (spokenText) => {
    const cleanText = (spokenText || '').trim();
    if (!cleanText || !onSendMessage) {
      return;
    }

    // Always append user turn to voice session stream immediately so it is never lost
    const userTurn = { id: `user-${Date.now()}`, role: 'user', content: cleanText };
    setSessionTurns((prev) => [...prev, userTurn]);
    setLiveTranscript('');
    setErrorMessage(null);

    // If session is locked due to plan exhaustion or entry count, explain directly
    if (locked) {
      setPhase('idle');
      setErrorMessage(
        exhausted && !isArtisan
          ? t('kairosAi.exhausted', "That's today's message. Miro is unlimited with Artisan — upgrade to continue.")
          : t('kairosAi.requiresJournalEntry', 'Please write a journal entry first to talk with Miro.')
      );
      return;
    }

    try {
      setPhase('thinking');
      const reply = await onSendMessage(cleanText);

      if (reply) {
        // Append Miro's response to voice session stream
        const miroTurn = { id: `miro-${Date.now()}`, role: 'assistant', content: reply };
        setSessionTurns((prev) => [...prev, miroTurn]);

        if (voiceEnabled) {
          setPhase('speaking');
          textToSpeechService.speak(reply, {
            lang: activeLang,
            rate: 0.95,
            pitch: 0.98,
            onStart: () => {
              if (isOpenRef.current) setPhase('speaking');
            },
            onEnd: () => {
              // Continuous turn-taking: automatically resume listening for follow-up!
              if (isOpenRef.current && !isExplicitlyPausedRef.current) {
                startListeningRef.current?.();
              } else {
                setPhase('idle');
              }
            },
            onError: () => {
              // On speech synthesis error, gracefully continue listening
              if (isOpenRef.current && !isExplicitlyPausedRef.current) {
                startListeningRef.current?.();
              } else {
                setPhase('idle');
              }
            }
          });
        } else {
          // If voice sound is muted, display text and transition back to listening after a brief pause
          setPhase('speaking');
          setTimeout(() => {
            if (isOpenRef.current && !isExplicitlyPausedRef.current) {
              startListeningRef.current?.();
            } else {
              setPhase('idle');
            }
          }, 2000);
        }
      } else {
        setPhase('idle');
      }
    } catch (err) {
      console.error('Error in Miro voice response:', err);
      setErrorMessage(err?.message || t('miro.failed', 'Could not get a response.'));
      setPhase('idle');
    }
  }, [onSendMessage, locked, exhausted, isArtisan, voiceEnabled, activeLang, t]);

  // Start speech recognition session with auto-endpointing & continuous auto-rearm
  const startListening = useCallback(async () => {

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    isExplicitlyPausedRef.current = false;
    hasSentTurnRef.current = false;
    setLiveTranscript('');
    setErrorMessage(null);

    // Stop any playing TTS audio before listening
    textToSpeechService.stop();
    setPhase('listening');

    const started = await speechRecognitionService.start({
      lang: activeLang,
      silenceTimeoutMs: 1800, // Auto-endpoint when user stops speaking for 1.8s
      onInterimResult: (transcript) => {
        if (!isOpenRef.current) return;
        setLiveTranscript(transcript);
      },
      onFinalResult: (transcript) => {
        if (!isOpenRef.current || hasSentTurnRef.current) return;
        const clean = (transcript || '').trim();
        if (clean) {
          hasSentTurnRef.current = true;
          sendVoiceTurn(clean);
        }
      },
      onError: (err) => {
        if (!isOpenRef.current) return;
        if (err.code === 'not-allowed') {
          setErrorMessage(t('miro.micDenied', 'Microphone access denied'));
          setPhase('idle');
        } else if (err.code !== 'no-speech' && err.code !== 'aborted') {
          console.warn('Speech recognition notice:', err);
        }
      },
      onEnd: ({ transcript, wasListening, cancelled } = {}) => {
        if (!isOpenRef.current) return;

        // If turn was already sent, no action needed
        if (hasSentTurnRef.current) return;

        const clean = (transcript || liveTranscript || '').trim();
        if (clean && !cancelled) {
          hasSentTurnRef.current = true;
          sendVoiceTurn(clean);
          return;
        }
        // If the user hasn't spoken yet and didn't pause, keep listening!
        if (phaseRef.current === 'listening' && !isExplicitlyPausedRef.current && !cancelled) {
          restartTimerRef.current = setTimeout(() => {
            if (isOpenRef.current && phaseRef.current === 'listening' && !isExplicitlyPausedRef.current) {
              startListening();
            }
          }, 150);
        } else if (phaseRef.current === 'listening') {
          setPhase('idle');
        }
      }
    });

    if (!started) {
      setPhase('idle');
    }
  }, [locked, activeLang, sendVoiceTurn, t, liveTranscript]);

  startListeningRef.current = startListening;

  // Initialize session on modal open
  useEffect(() => {
    if (isOpen) {
      isExplicitlyPausedRef.current = false;
      hasSentTurnRef.current = false;
      setLiveTranscript('');
      setErrorMessage(null);
      setSessionTurns([]);

      hapticService.medium?.();
      const mountTimer = setTimeout(() => {
        startListening();
      }, 300);

      return () => {
        clearTimeout(mountTimer);
        stopAllAudio();
      };
    } else {
      stopAllAudio();
      setPhase('idle');
      setLiveTranscript('');
      setSessionTurns([]);
    }
  }, [isOpen]);

  // Handle keyboard escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopAllAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stopAllAudio]);

  // Central Orb Tap Handler: instant interrupt or submit
  const handleOrbClick = () => {
    hapticService.light?.();

    if (phase === 'speaking') {
      // Instant Barge-In: Cut Miro off and listen immediately
      textToSpeechService.stop();
      startListening();
    } else if (phase === 'listening') {
      if (liveTranscript.trim()) {
        speechRecognitionService.stop();
      } else {
        // Pause listening
        isExplicitlyPausedRef.current = true;
        speechRecognitionService.stop();
        setPhase('idle');
      }
    } else if (phase === 'idle') {
      startListening();
    }
  };

  // Mic button toggle
  const handleMicToggle = () => {
    hapticService.light?.();
    if (phase === 'listening') {
      isExplicitlyPausedRef.current = true;
      speechRecognitionService.stop();
      setPhase('idle');
    } else {
      startListening();
    }
  };

  // Suggested starter prompts
  const starterPrompts = [
    t('miro.starterPrompt1', 'How have I been doing lately?'),
    t('miro.starterPrompt2', 'What themes do you notice in my journal?'),
    t('miro.starterPrompt3', 'Help me reflect on today')
  ];

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="mvm-overlay" role="dialog" aria-modal="true" aria-label="Miro Voice Session">
      {/* ── Top Bar ───────────────────────────────────────────────────────*/}
      <div className="mvm-topbar">
        <div className="mvm-status-pill">
          <span
            className={`mvm-status-dot${
              phase === 'listening'
                ? ' is-listening'
                : phase === 'speaking'
                ? ' is-speaking'
                : phase === 'thinking'
                ? ' is-thinking'
                : ''
            }`}
          />
          <span>{t('miro.voiceTitle', 'Miro Voice')}</span>

          {/* Living Equalizer Waveform */}
          <div className={`mvm-wave-bars${phase === 'listening' || phase === 'speaking' ? ' is-active' : ''}`}>
            <span className="mvm-bar" />
            <span className="mvm-bar" />
            <span className="mvm-bar" />
            <span className="mvm-bar" />
          </div>
        </div>

        <button
          className="mvm-close-btn"
          onClick={() => {
            stopAllAudio();
            onClose();
          }}
          aria-label={t('miro.closeVoiceMode', 'Close voice mode')}
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Center Stage & Reactive Living Orb ────────────────────────────*/}
      <div className="mvm-stage">
        <div
          className="mvm-orb-container"
          onClick={handleOrbClick}
          title={
            phase === 'speaking'
              ? t('miro.tapToInterrupt', 'Tap orb to interrupt')
              : phase === 'listening'
              ? t('miro.done', 'Tap to finish speaking')
              : t('miro.tapToSpeak', 'Tap to speak')
          }
        >
          <div className="mvm-orb-ambient" />

          {phase === 'listening' && <div className="mvm-listening-ripple" />}
          {phase === 'speaking' && <div className="mvm-speaking-ripple" />}

          <div className="mvm-orb-core">
            {phase === 'thinking' ? (
              <MiroThinking size={98} />
            ) : (
              <MiroMark size={98} />
            )}
          </div>
        </div>

        {/* State Subtitle Label */}
        <div className="mvm-state-label">
          <span className="mvm-state-main">
            {phase === 'listening'
              ? t('miro.listeningSubtitle', 'Listening to you...')
              : phase === 'thinking'
              ? t('miro.thinkingSubtitle', 'Miro is reflecting on your journal...')
              : phase === 'speaking'
              ? t('miro.speakingSubtitle', 'Miro is speaking aloud...')
              : t('miro.tapToSpeak', 'Tap orb or mic to speak')}
          </span>
          <span className="mvm-state-sub">
            {phase === 'speaking'
              ? t('miro.tapToInterrupt', 'Tap orb anytime to interrupt')
              : phase === 'listening'
              ? t('miro.continuousActive', 'Hands-free dialogue active')
              : ''}
          </span>
        </div>
      </div>

        {/* ── Dedicated Voice Dialogue Stream ─────────────────────────────*/}
        <div className="mvm-chat-stream">
          {sessionTurns.length === 0 && !liveTranscript ? (
            <div className="mvm-welcome-box">
              <p className="mvm-welcome-lead">
                {t('miro.voiceWelcomePrompt', 'Speak freely to Miro about your day, your feelings, or anything in your journal.')}
              </p>
              <div className="mvm-starter-chips">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="mvm-starter-chip"
                    onClick={() => {
                      hapticService.light?.();
                      sendVoiceTurn(prompt);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mvm-turns-list">
              {sessionTurns.map((turn) => (
                <div
                  key={turn.id}
                  className={`mvm-bubble-wrapper ${turn.role === 'user' ? 'is-user' : 'is-miro'}`}
                >
                  <span className="mvm-bubble-badge">
                    {turn.role === 'user' ? t('journey.dayLabel', 'You') : t('miro.voiceTitle', 'Miro')}
                  </span>
                  <div className="mvm-bubble-content">
                    <p>{turn.content}</p>
                  </div>
                </div>
              ))}

              {/* Live interim user speech bubble */}
              {phase === 'listening' && liveTranscript && (
                <div className="mvm-bubble-wrapper is-user is-live">
                  <span className="mvm-bubble-badge">{t('journey.dayLabel', 'You')}</span>
                  <div className="mvm-bubble-content is-streaming">
                    <p>{liveTranscript}</p>
                    <span className="mvm-listening-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              )}

              {/* Live thinking bubble */}
              {phase === 'thinking' && (
                <div className="mvm-bubble-wrapper is-miro is-live">
                  <span className="mvm-bubble-badge">{t('miro.voiceTitle', 'Miro')}</span>
                  <div className="mvm-bubble-content is-thinking">
                    <div className="mvm-thinking-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}

              {/* Inline allowance exhaustion upgrade card if free daily limit reached */}
              {exhausted && !isArtisan && (
                <div className="mvm-exhausted-card">
                  <Sparkles size={20} className="mvm-exhausted-icon" />
                  <div className="mvm-exhausted-info">
                    <h4>{t('kairosAi.exhaustedTitle', 'Daily message used')}</h4>
                    <p>{t('kairosAi.exhaustedDesc', 'Free tier includes 1 message daily. Upgrade to Artisan for continuous, unlimited conversations.')}</p>
                  </div>
                  {onUpgrade && (
                    <button className="mvm-upgrade-cta" onClick={onUpgrade}>
                      <Sparkles size={14} />
                      <span>{t('kairosAi.upgradeCta', 'Upgrade to Artisan')}</span>
                    </button>
                  )}
                </div>
              )}

              <div ref={dialogueEndRef} />
            </div>
          )}
        </div>

        {/* ── Controls Bar ───────────────────────────────────────────────*/}
        <div className="mvm-controls-bar">
          {/* Audio Output Mute / Unmute */}
          <button
            className="mvm-side-btn"
            onClick={() => {
              if (onToggleVoiceEnabled) {
                onToggleVoiceEnabled();
              }
              if (voiceEnabled) {
                textToSpeechService.stop();
              }
            }}
            title={voiceEnabled ? t('miro.muteVoice', "Mute Miro's voice") : t('miro.unmuteVoice', "Unmute Miro's voice")}
            aria-label={voiceEnabled ? t('miro.muteVoice', "Mute Miro's voice") : t('miro.unmuteVoice', "Unmute Miro's voice")}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

        {/* Primary Mic Trigger Jewel */}
        <button
          className={`mvm-main-mic${phase === 'listening' ? ' is-listening' : ''}`}
          onClick={handleMicToggle}
          disabled={locked || phase === 'thinking'}
          title={phase === 'listening' ? t('miro.done', 'Done speaking') : t('miro.tapToSpeak', 'Tap to speak')}
          aria-label={phase === 'listening' ? t('miro.done', 'Done speaking') : t('miro.tapToSpeak', 'Tap to speak')}
        >
          {phase === 'listening' ? <MicOff size={28} /> : <Mic size={28} />}
        </button>

        {/* Done / Close session */}
        <button
          className="mvm-side-btn"
          onClick={() => {
            stopAllAudio();
            onClose();
          }}
          title={t('miro.done', 'Done')}
          aria-label={t('miro.done', 'Done')}
        >
          <X size={20} />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MiroVoiceModal;

