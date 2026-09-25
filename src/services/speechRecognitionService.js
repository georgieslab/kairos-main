// src/services/speechRecognitionService.js
//
// Unified speech recognition abstraction for Kairos Smart Journal.
// Supports standard Web Speech API (window.SpeechRecognition / webkitSpeechRecognition)
// and Cordova mobile plugin (window.plugins.speechRecognition).

import { Capacitor } from '@capacitor/core';

class SpeechRecognitionService {
  constructor() {
    this._recognition = null;
    this._isListening = false;
    this._currentLanguage = 'en-US';
    this._finalTranscript = '';
    this._interimTranscript = '';
    this._silenceTimeoutMs = 0;
    this._silenceTimer = null;
    this._callbacks = {
      onInterimResult: null,
      onFinalResult: null,
      onError: null,
      onEnd: null
    };
  }

  /**
   * Normalize an i18next language code (e.g., 'en', 'de', 'ka') to a BCP-47 locale
   */
  getLocale(lang) {
    if (!lang) return 'en-US';
    const lower = lang.toLowerCase();
    if (lower.startsWith('de')) return 'de-DE';
    if (lower.startsWith('ka')) return 'ka-GE';
    if (lower.startsWith('en')) return 'en-US';
    if (lower.includes('-') || lower.includes('_')) {
      return lower.replace('_', '-');
    }
    return lang;
  }

  /**
   * Check if speech recognition is available in current browser or native environment
   */
  isSupported() {
    if (typeof window === 'undefined') return false;

    // Check Cordova plugin
    if (window?.plugins?.speechRecognition) {
      return true;
    }

    // Check Web Speech API
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    return Boolean(SpeechRecognition);
  }

  /**
   * Check or request microphone / speech recognition permissions
   */
  async requestPermission() {
    if (typeof window === 'undefined') return false;

    // Cordova plugin permission check
    const cordovaPlugin = window?.plugins?.speechRecognition;
    if (cordovaPlugin && typeof cordovaPlugin.requestPermission === 'function') {
      try {
        const hasPerm = await new Promise((resolve) => {
          cordovaPlugin.hasPermission(
            (granted) => resolve(Boolean(granted)),
            () => resolve(false)
          );
        });
        if (hasPerm) return true;

        return await new Promise((resolve) => {
          cordovaPlugin.requestPermission(
            () => resolve(true),
            () => resolve(false)
          );
        });
      } catch (err) {
        console.warn('Cordova speech permission error:', err);
      }
    }

    // Browser Web Speech / getUserMedia check
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release stream tracks
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (err) {
        console.warn('Microphone permission denied or unavailable:', err);
        return false;
      }
    }

    return true;
  }

  /**
   * Start listening for voice input
   * @param {Object} options
   * @param {Function} options.onInterimResult - Callback for interim/in-progress transcripts
   * @param {Function} options.onFinalResult - Callback for final complete transcript
   * @param {Function} options.onError - Callback on recognition error
   * @param {Function} options.onEnd - Callback on recognition stop/end
   * @param {string} options.lang - Target language ('en', 'de', 'ka', or locale)
   */
  async start({
    onInterimResult = null,
    onFinalResult = null,
    onError = null,
    onEnd = null,
    lang = 'en',
    silenceTimeoutMs = 0
  } = {}) {
    // If already active, cancel previous session first
    if (this._isListening) {
      this.cancel();
    }

    this._callbacks = { onInterimResult, onFinalResult, onError, onEnd };
    this._currentLanguage = this.getLocale(lang);
    this._finalTranscript = '';
    this._interimTranscript = '';
    this._lastSpokenText = '';
    this._silenceTimeoutMs = silenceTimeoutMs;
    this._clearSilenceTimer();

    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      const err = new Error('Microphone permission denied');
      err.code = 'not-allowed';
      if (this._callbacks.onError) {
        this._callbacks.onError(err);
      }
      return false;
    }

    // Attempt Cordova native plugin if present and on native platform
    const cordovaPlugin = window?.plugins?.speechRecognition;
    const isNative = Capacitor.isNativePlatform?.() || Boolean(window?.Capacitor?.getPlatform?.() === 'android');

    if (isNative && cordovaPlugin && typeof cordovaPlugin.startListening === 'function') {
      return this._startCordovaRecognition(cordovaPlugin);
    }

    // Fall back to Web Speech API
    return this._startWebSpeechRecognition();
  }

  /**
   * Web Speech API implementation
   */
  _startWebSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognition) {
      const err = new Error('Speech recognition is not supported on this device/browser');
      err.code = 'not-supported';
      if (this._callbacks.onError) this._callbacks.onError(err);
      return false;
    }

    try {
      const recognition = new SpeechRecognition();
      this._recognition = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = this._currentLanguage;

      recognition.onstart = () => {
        this._isListening = true;
      };

      recognition.onresult = (event) => {
        let interim = '';
        let newlyFinal = '';

        const startIdx = event.resultIndex || 0;
        for (let i = startIdx; i < event.results.length; i++) {
          const res = event.results[i];
          const transcript = res[0]?.transcript || '';
          if (res.isFinal) {
            newlyFinal += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (newlyFinal.trim()) {
          this._finalTranscript = (this._finalTranscript + ' ' + newlyFinal).trim();
        }
        this._interimTranscript = interim;

        const combined = this._finalTranscript
          ? `${this._finalTranscript} ${interim}`.trim()
          : interim.trim();

        this._lastSpokenText = combined;

        if (this._callbacks.onInterimResult) {
          this._callbacks.onInterimResult(combined);
        }

        this._resetSilenceTimer();
      };

      recognition.onerror = (event) => {
        const errCode = event.error || 'unknown';
        // 'no-speech' is a normal silence timeout from the browser;
        // let onend handle it without treating it as a crash
        if (errCode === 'no-speech' || errCode === 'aborted') {
          return;
        }

        this._isListening = false;
        const err = new Error(event.message || `Speech recognition error: ${errCode}`);
        err.code = errCode;

        if (this._callbacks.onError) {
          this._callbacks.onError(err);
        }
      };

      recognition.onend = () => {
        const cancelled = this._isCancelled;
        this._isListening = false;
        this._isCancelled = false;

        const totalTranscript = (this._lastSpokenText || this._finalTranscript || this._interimTranscript || '').trim();
        if (!cancelled && this._callbacks.onFinalResult && totalTranscript) {
          this._callbacks.onFinalResult(totalTranscript);
        }

        if (this._callbacks.onEnd) {
          this._callbacks.onEnd({ transcript: totalTranscript, wasListening: Boolean(totalTranscript), cancelled });
        }

        this._recognition = null;
        this._lastSpokenText = '';
      };

      recognition.start();
      return true;
    } catch (err) {
      this._isListening = false;
      this._recognition = null;
      if (this._callbacks.onError) this._callbacks.onError(err);
      return false;
    }
  }

  /**
   * Cordova plugin implementation
   */
  _startCordovaRecognition(plugin) {
    try {
      this._isListening = true;

      plugin.startListening(
        (matches) => {
          let text = '';
          if (Array.isArray(matches)) {
            text = matches[0] || '';
          } else if (typeof matches === 'string') {
            text = matches;
          } else if (matches?.value) {
            text = matches.value;
          }

          if (text) {
            this._finalTranscript = text.trim();
            if (this._callbacks.onInterimResult) {
              this._callbacks.onInterimResult(this._finalTranscript);
            }
          }
        },
        (error) => {
          this._isListening = false;
          const err = new Error(typeof error === 'string' ? error : error?.message || 'Cordova speech error');
          err.code = 'cordova-error';
          if (this._callbacks.onError) this._callbacks.onError(err);
        },
        {
          language: this._currentLanguage,
          matches: 1,
          showPartial: true
        }
      );
      return true;
    } catch (err) {
      this._isListening = false;
      if (this._callbacks.onError) this._callbacks.onError(err);
      return false;
    }
  }

  _resetSilenceTimer() {
    this._clearSilenceTimer();
    if (this._silenceTimeoutMs > 0 && this._isListening) {
      this._silenceTimer = setTimeout(() => {
        const text = (this._lastSpokenText || this._finalTranscript || this._interimTranscript || '').trim();
        if (text) {
          if (this._callbacks.onFinalResult) {
            this._callbacks.onFinalResult(text);
          }
          this.stop();
        }
      }, this._silenceTimeoutMs);
    }
  }

  _clearSilenceTimer() {
    if (this._silenceTimer) {
      clearTimeout(this._silenceTimer);
      this._silenceTimer = null;
    }
  }

  /**
   * Stop listening and finalize transcript
   */
  stop() {
    this._clearSilenceTimer();
    if (!this._isListening && !this._recognition) return;

    // Web Speech API: trigger recognition.stop() and let recognition.onend handle results
    if (this._recognition) {
      this._isListening = false;
      try {
        this._recognition.stop();
      } catch (err) {
        console.warn('Error stopping Web Speech recognition:', err);
      }
      return;
    }

    // Cordova plugin: manual callback invocation
    this._isListening = false;
    const cordovaPlugin = window?.plugins?.speechRecognition;
    if (cordovaPlugin && typeof cordovaPlugin.stopListening === 'function') {
      try {
        cordovaPlugin.stopListening(
          () => {},
          () => {}
        );
      } catch (err) {
        console.warn('Error stopping Cordova speech recognition:', err);
      }
    }

    const totalTranscript = (this._finalTranscript + ' ' + this._interimTranscript).trim();
    if (this._callbacks.onFinalResult && totalTranscript) {
      this._callbacks.onFinalResult(totalTranscript);
    }
    if (this._callbacks.onEnd) {
      this._callbacks.onEnd({ transcript: totalTranscript, wasListening: true });
    }
  }

  /**
   * Abort listening immediately without emitting final results
   */
  cancel() {
    this._clearSilenceTimer();
    this._isCancelled = true;
    this._isListening = false;
    this._finalTranscript = '';
    this._interimTranscript = '';
    this._lastSpokenText = '';

    if (this._recognition) {
      try {
        this._recognition.abort();
      } catch (err) {
        console.warn('Error aborting Web Speech recognition:', err);
      }
      this._recognition = null;
    }

    const cordovaPlugin = window?.plugins?.speechRecognition;
    if (cordovaPlugin && typeof cordovaPlugin.abort === 'function') {
      try {
        cordovaPlugin.abort(
          () => {},
          () => {}
        );
      } catch (err) {
        console.warn('Error aborting Cordova speech recognition:', err);
      }
    }

    if (this._callbacks.onEnd) {
      this._callbacks.onEnd({ cancelled: true });
    }
  }

  /**
   * Whether speech recognition is currently active
   */
  isListening() {
    return this._isListening;
  }
}

const speechRecognitionService = new SpeechRecognitionService();
export default speechRecognitionService;

