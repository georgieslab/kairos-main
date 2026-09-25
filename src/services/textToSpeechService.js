// src/services/textToSpeechService.js
//
// High-fidelity, cross-platform Text-to-Speech (TTS) manager for Miro.
// Uses native window.speechSynthesis with markdown cleaning, natural cadence,
// voice scoring, and interruption control.

/**
 * Strips markdown, URLs, code blocks, and formatting before feeding text into TTS.
 * Ensures Miro sounds calm, natural, and conversational rather than reading syntax aloud.
 */
export const cleanTextForSpeech = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Remove fenced code blocks (```code```)
  text = text.replace(/```[\s\S]*?```/g, '');

  // 2. Remove inline code (`code`)
  text = text.replace(/`([^`]+)`/g, '$1');

  // 3. Remove image markdown (![alt](url))
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // 4. Transform links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 5. Remove raw URLs
  text = text.replace(/https?:\/\/\S+/gi, '');

  // 6. Remove markdown headers (# Title)
  text = text.replace(/^#{1,6}\s+/gm, '');

  // 7. Remove blockquotes (> quote)
  text = text.replace(/^>\s+/gm, '');

  // 8. Transform bullet points and numbered lists to gentle pauses
  text = text.replace(/^[\*\-\+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');

  // 9. Remove bold / italic markers (**bold**, *italic*, __bold__, _italic_)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  text = text.replace(/~~([^~]+)~~/g, '$1');

  // 10. Remove remaining standalone brackets and symbol artifacts
  text = text.replace(/[\[\]{}|<>#*_~]/g, ' ');

  // 11. Normalize quotation marks to simple speech-friendly pauses
  text = text.replace(/[""«»]/g, '');

  // 12. Normalize multiple newlines/spaces into single spaces or pauses
  text = text.replace(/\n{2,}/g, '. ');
  text = text.replace(/\n/g, ' ');
  text = text.replace(/\s{2,}/g, ' ');

  return text.trim();
};

class TextToSpeechService {
  constructor() {
    this._voices = [];
    this._isSpeaking = false;
    this._currentUtterance = null;
    this._keepAliveInterval = null;
    this._activeCallbacks = {
      onStart: null,
      onEnd: null,
      onError: null
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Defer voice discovery so it never blocks initial app render
      const deferInit = () => {
        this._loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this._loadVoices();
        }
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(deferInit, { timeout: 2000 });
      } else {
        setTimeout(deferInit, 1200);
      }
    }
  }

  _loadVoices() {
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        this._voices = window.speechSynthesis.getVoices() || [];
      }
    } catch (e) {
      this._voices = [];
    }
  }

  /**
   * Check if TTS is supported in current environment
   */
  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  /**
   * Select best voice for the active language with preference for warm, natural voices
   */
  getBestVoice(lang = 'en') {
    if (!this._voices || this._voices.length === 0) {
      this._loadVoices();
    }

    const lowerLang = (lang || 'en').toLowerCase().slice(0, 2);
    const matchingVoices = this._voices.filter((v) => {
      const vLang = (v.lang || '').toLowerCase();
      return vLang.startsWith(lowerLang);
    });

    if (matchingVoices.length === 0) {
      // Do not force an English voice on a non-English language;
      // return null so the browser can match by utterance.lang naturally.
      if (lowerLang !== 'en') return null;
      return this._voices.find((v) => v.default) || this._voices[0] || null;
    }

    // Voice scoring heuristic
    const scoreVoice = (voice) => {
      let score = 0;
      const name = (voice.name || '').toLowerCase();

      // High-priority natural/neural keywords
      if (name.includes('natural') || name.includes('neural')) score += 100;
      if (name.includes('premium') || name.includes('enhanced')) score += 50;
      if (name.includes('google')) score += 40;
      if (name.includes('siri') || name.includes('apple')) score += 40;

      // Preferred voice names
      if (lowerLang === 'en') {
        if (name.includes('samantha')) score += 30;
        if (name.includes('daniel')) score += 30;
        if (name.includes('karen')) score += 25;
        if (name.includes('serena')) score += 25;
        if (name.includes('oliver')) score += 25;
        if (voice.lang === 'en-US' || voice.lang === 'en_US') score += 10;
      } else if (lowerLang === 'de') {
        if (name.includes('anna')) score += 30;
        if (name.includes('markus')) score += 30;
        if (name.includes('marlene')) score += 25;
      }

      if (voice.default) score += 5;
      return score;
    };

    return matchingVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || matchingVoices[0];
  }

  /**
   * Speak the given text
   * @param {string} text - Raw text to speak (markdown will be cleaned)
   * @param {Object} options
   * @param {string} options.lang - Language code ('en', 'de', 'ka')
   * @param {number} options.rate - Speech rate (default 0.95: calm, unhurried cadence)
   * @param {number} options.pitch - Speech pitch (default 0.98)
   * @param {Function} options.onStart - Triggered when audio playback begins
   * @param {Function} options.onEnd - Triggered when audio finishes or stops
   * @param {Function} options.onError - Triggered on synthesis error
   */
  speak(text, {
    lang = 'en',
    rate = 0.95,
    pitch = 0.98,
    onStart = null,
    onEnd = null,
    onError = null
  } = {}) {
    if (!this.isSupported()) {
      if (onError) onError(new Error('Speech synthesis is not supported'));
      return false;
    }

    // Cancel any active utterance first
    this.stop();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return false;
    }

    this._activeCallbacks = { onStart, onEnd, onError };

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this._currentUtterance = utterance;

      const voice = this.getBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang === 'de' ? 'de-DE' : lang === 'ka' ? 'ka-GE' : 'en-US';
      }

      utterance.volume = 1.0;
      utterance.rate = Math.max(0.1, Math.min(2.0, rate || 0.95));
      utterance.pitch = Math.max(0.1, Math.min(2.0, pitch || 0.98));

      // Guarded completion callback ensuring onEnd is called at most once
      let hasFinished = false;
      const finishPlayback = (isError = false, errDetails = null) => {
        if (hasFinished) return;
        hasFinished = true;
        this._cleanup();

        if (isError && this._activeCallbacks.onError) {
          this._activeCallbacks.onError(errDetails);
        } else if (this._activeCallbacks.onEnd) {
          this._activeCallbacks.onEnd();
        }
      };

      utterance.onstart = () => {
        this._isSpeaking = true;
        this._startKeepAlive();
        if (this._activeCallbacks.onStart) {
          this._activeCallbacks.onStart();
        }
      };

      utterance.onend = () => {
        finishPlayback(false);
      };

      utterance.onerror = (event) => {
        // 'interrupted' or 'canceled' are intentional stops
        if (event.error === 'interrupted' || event.error === 'canceled') {
          finishPlayback(false);
          return;
        }
        console.warn('Speech synthesis error:', event.error);
        finishPlayback(true, event);
      };

      // Safety watchdog: prevent conversational deadlock if browser TTS hangs or drops onend
      const estimatedWords = cleanText.split(/\s+/).length;
      // ~2.5 words per second + 4s baseline grace period
      const watchdogMs = Math.max(4500, Math.round((estimatedWords / 2.5) * 1000) + 4000);
      this._clearWatchdog();
      this._watchdogTimer = setTimeout(() => {
        if (this._isSpeaking || (window.speechSynthesis && window.speechSynthesis.speaking)) {
          console.warn('TTS safety watchdog triggered; auto-resuming dialogue');
          finishPlayback(false);
        }
      }, watchdogMs);

      // Chromium fix: unfreeze audio pipeline and schedule speak after a micro-tick
      // to avoid the notorious Chrome cancel/speak deadlock
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.resume();
      }

      setTimeout(() => {
        if (!this._currentUtterance) return;
        try {
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          }
        } catch (innerErr) {
          console.error('Inner speak error:', innerErr);
          finishPlayback(true, innerErr);
        }
      }, 50);

      return true;
    } catch (err) {
      this._cleanup();
      console.error('Failed to execute speak():', err);
      if (this._activeCallbacks.onError) {
        this._activeCallbacks.onError(err);
      }
      return false;
    }
  }

  /**
   * Keepalive timer to avoid Chromium/Android WebView 15-second speech cutoff bug
   */
  _startKeepAlive() {
    this._stopKeepAlive();
    this._keepAliveInterval = setInterval(() => {
      if (!this._isSpeaking || !window.speechSynthesis.speaking) {
        this._stopKeepAlive();
        return;
      }
      // Slight pause/resume keeps the background speech thread alive in Chromium
      try {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } catch (e) {}
    }, 8000);
  }

  _stopKeepAlive() {
    if (this._keepAliveInterval) {
      clearInterval(this._keepAliveInterval);
      this._keepAliveInterval = null;
    }
  }

  _clearWatchdog() {
    if (this._watchdogTimer) {
      clearTimeout(this._watchdogTimer);
      this._watchdogTimer = null;
    }
  }

  _cleanup() {
    this._isSpeaking = false;
    this._currentUtterance = null;
    this._stopKeepAlive();
    this._clearWatchdog();
  }

  /**
   * Immediately stops any speech synthesis playback
   */
  stop() {
    this._cleanup();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
    }
    this._isSpeaking = false;
    this._currentUtterance = null;
  }

  /**
   * Checks if Miro is currently speaking
   */
  isSpeaking() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return this._isSpeaking || window.speechSynthesis.speaking;
  }
}

const textToSpeechService = new TextToSpeechService();
export default textToSpeechService;

