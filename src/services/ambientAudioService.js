// src/services/ambientAudioService.js
// Procedural Web Audio API soundscape synthesis engine for Καιρός.
// Generates infinite, zero-bandwidth, offline contemplative soundscapes
// tuned to harmonic relaxation frequencies.

class AmbientAudioService {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.activeIntervals = [];
    this.currentTrackId = null;
    this.volume = 0.75;
    this.isMuted = false;
    this.fadeTimer = null;
  }

  _initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API is not supported in this environment');
        return false;
      }
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  getVolume() {
    return this.volume;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  isPlaying() {
    return !!this.currentTrackId;
  }

  getActiveTrackId() {
    return this.currentTrackId;
  }

  stop(fadeDuration = 0.4) {
    if (!this.ctx || !this.currentTrackId) return;

    if (this.fadeTimer) {
      clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }

    // Clear background drop intervals
    this.activeIntervals.forEach(id => clearInterval(id));
    this.activeIntervals = [];

    const now = this.ctx.currentTime;
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + fadeDuration);
    } catch {
      // AudioContext state error fallback
    }

    const nodesToClean = [...this.activeNodes];
    this.activeNodes = [];
    const prevTrack = this.currentTrackId;
    this.currentTrackId = null;

    setTimeout(() => {
      nodesToClean.forEach(node => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch {
          // already stopped
        }
      });
      // Restore master gain target for next play
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      }
    }, (fadeDuration + 0.05) * 1000);

    return prevTrack;
  }

  fadeStop(durationSec = 3) {
    return this.stop(durationSec);
  }

  play(trackId) {
    if (!this._initContext()) return;

    if (this.currentTrackId === trackId) {
      return; // Already playing this track
    }

    if (this.currentTrackId) {
      this.stop(0.2);
    }

    this.currentTrackId = trackId;

    // Reset master gain smoothly
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    const targetVol = this.isMuted ? 0 : this.volume;
    this.masterGain.gain.linearRampToValueAtTime(targetVol, now + 0.6);

    switch (trackId) {
      case 'rain':
        this._buildRainSoundscape();
        break;
      case 'temple':
        this._buildTempleSoundscape();
        break;
      case 'pen':
        this._buildPenSoundscape();
        break;
      case 'night':
        this._buildNightSoundscape();
        break;
      default:
        this._buildRainSoundscape();
        break;
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     1. Rain on Japanese Slate
     Pink noise filtered through damp stone acoustic band + soft rain droplets
     ────────────────────────────────────────────────────────────────────────── */
  _buildRainSoundscape() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    
    // Pink noise generation
    for (let channel = 0; channel < 2; channel++) {
      const output = noiseBuffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
        b6 = white * 0.115926;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating rain striking slate tiles
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(820, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(180, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    whiteNoise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, lowpass, highpass, rainGain);

    // Subtle randomized droplets on stone tiles
    const dropletInterval = setInterval(() => {
      if (this.currentTrackId !== 'rain' || !this.ctx) return;
      this._playSingleRainDrop();
    }, 450);

    this.activeIntervals.push(dropletInterval);
  }

  _playSingleRainDrop() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const freq = 1200 + Math.random() * 900;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.setValueAtTime(4, now);

    const dropVol = 0.04 + Math.random() * 0.05;
    gain.gain.setValueAtTime(dropVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. Temple Singing Bowl & Harmonic Drone
     432Hz Pythagorean tuned meditative resonance
     ────────────────────────────────────────────────────────────────────────── */
  _buildTempleSoundscape() {
    const freqs = [108, 216, 432, 648, 864]; // Pythagorean harmonics of 432Hz
    const gains = [0.28, 0.22, 0.35, 0.12, 0.08];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Gentle micro-detuning for deep acoustic shimmer
      const detune = (idx - 2) * 1.8;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime(detune, this.ctx.currentTime);

      gain.gain.setValueAtTime(gains[idx], this.ctx.currentTime);

      // Slow breathing LFO swell for the 432Hz root
      if (freq === 432) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 12-second breath cycle
        lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
        this.activeNodes.push(lfo, lfoGain);
      }

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc, gain);
    });

    // Occasional gentle distant singing bowl chime
    const chimeInterval = setInterval(() => {
      if (this.currentTrackId !== 'temple' || !this.ctx) return;
      this._playBowlChime();
    }, 14000);

    this.activeIntervals.push(chimeInterval);
    // Trigger one initial soft chime after 1.5s
    setTimeout(() => this._playBowlChime(), 1500);
  }

  _playBowlChime() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const bowlOsc = this.ctx.createOscillator();
    const bowlGain = this.ctx.createGain();

    bowlOsc.type = 'sine';
    bowlOsc.frequency.setValueAtTime(576, now); // D5 harmonic
    bowlOsc.frequency.exponentialRampToValueAtTime(432, now + 4.5);

    bowlGain.gain.setValueAtTime(0.001, now);
    bowlGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    bowlGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);

    bowlOsc.connect(bowlGain);
    bowlGain.connect(this.masterGain);

    bowlOsc.start(now);
    bowlOsc.stop(now + 6.2);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     3. Fountain Pen Whispers
     Tactile nib friction on heavy archival paper + subtle ambient warmth
     ────────────────────────────────────────────────────────────────────────── */
  _buildPenSoundscape() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    // Warm textured noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Resonant bandpass for fibrous paper nib friction
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2800, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(3.2, this.ctx.currentTime);

    // Gentle rhythmic nib stroke modulation
    const strokeLfo = this.ctx.createOscillator();
    const strokeGain = this.ctx.createGain();
    strokeLfo.type = 'sine';
    strokeLfo.frequency.setValueAtTime(0.38, this.ctx.currentTime); // gentle cursive writing cadence
    strokeGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    strokeLfo.connect(strokeGain);

    const baseGain = this.ctx.createGain();
    baseGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    strokeGain.connect(baseGain.gain);

    // Warm deep undertone of a wooden desk
    const deskRumble = this.ctx.createOscillator();
    const deskGain = this.ctx.createGain();
    deskRumble.type = 'sine';
    deskRumble.frequency.setValueAtTime(74, this.ctx.currentTime);
    deskGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(baseGain);
    baseGain.connect(this.masterGain);

    deskRumble.connect(deskGain);
    deskGain.connect(this.masterGain);

    noise.start();
    strokeLfo.start();
    deskRumble.start();

    this.activeNodes.push(noise, bandpass, strokeLfo, strokeGain, baseGain, deskRumble, deskGain);
  }

  /* ──────────────────────────────────────────────────────────────────────────
     4. Celestial Night & Cosmic Emerald Auroras
     Deep spatial meditation chords
     ────────────────────────────────────────────────────────────────────────── */
  _buildNightSoundscape() {
    // Meditative 432Hz ambient chord: A2 (108Hz), E3 (162Hz), A3 (216Hz), C#4 (270Hz), E4 (324Hz)
    const chord = [108, 162, 216, 270, 324];
    const types = ['sine', 'triangle', 'sine', 'triangle', 'sine'];

    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = types[i];
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((i - 2) * 2.2, this.ctx.currentTime);

      const amp = (0.24 / (i + 1)) * 1.2;
      gain.gain.setValueAtTime(amp, this.ctx.currentTime);

      // Ethereal chorus drift
      const chorusLfo = this.ctx.createOscillator();
      const chorusDepth = this.ctx.createGain();
      chorusLfo.frequency.setValueAtTime(0.04 + i * 0.015, this.ctx.currentTime);
      chorusDepth.gain.setValueAtTime(3.5, this.ctx.currentTime);
      chorusLfo.connect(chorusDepth);
      chorusDepth.connect(osc.detune);
      chorusLfo.start();

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.activeNodes.push(osc, gain, chorusLfo, chorusDepth);
    });
  }
}

// Singleton instance export
const ambientAudioService = new AmbientAudioService();
export default ambientAudioService;

