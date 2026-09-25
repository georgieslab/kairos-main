// src/pages/ListenScreen.jsx
// "Listen" — Multi-Track Contemplative Audio Suite for Καιρός.
// Features:
// 1. Podcast Mode: Single-episode podcast (Ink & Intention) on handwriting neuro-psychology.
// 2. Ambient Soundscapes Mode: Infinite procedural Web Audio loops (Rain, Temple Bowls, Pen Whispers, Celestial Night)
//    with sleep/focus session timer and volume controls.
// Apple Spatial Glass aesthetic with dynamic soundscape color morphing.

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Play,
  Pause,
  Clock,
  ExternalLink,
  BookOpen,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  CloudRain,
  Bell,
  PenTool,
  Moon,
  Radio,
  Timer
} from 'lucide-react';
import { PODCAST, ABOUT_JOURNALING, AMBIENT_TRACKS } from '../data/podcasts';
import ambientAudioService from '../services/ambientAudioService';
import hapticService from '../services/hapticService';
import '../styles/components/listenScreen.css';

const fmtTime = (s) => {
  if (!s || isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const TRACK_ICONS = {
  CloudRain,
  Bell,
  PenTool,
  Moon
};

const TIMER_PRESETS = [0, 15, 30, 45, 60];

const ListenScreen = ({ onBack }) => {
  const { t } = useTranslation('journey');
  const ep = PODCAST;

  // Active Tab: 'podcast' | 'ambient'
  const [activeTab, setActiveTab] = useState('ambient');

  // Podcast state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Ambient soundscape state
  const [selectedTrack, setSelectedTrack] = useState(AMBIENT_TRACKS[0]);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);

  // Focus timer countdown
  useEffect(() => {
    let interval = null;
    if (isAmbientPlaying && timerRemainingSec > 0) {
      interval = setInterval(() => {
        setTimerRemainingSec((prev) => {
          if (prev <= 1) {
            ambientAudioService.fadeStop(3);
            setIsAmbientPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAmbientPlaying, timerRemainingSec]);

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      ambientAudioService.stop(0.2);
    };
  }, []);

  // Mode tab change handler
  const handleTabChange = (tab) => {
    hapticService.light?.();
    if (tab === 'ambient') {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      if (ambientAudioService.isPlaying()) {
        ambientAudioService.stop(0.3);
        setIsAmbientPlaying(false);
      }
    }
    setActiveTab(tab);
  };

  // Podcast play/pause
  const togglePlay = () => {
    hapticService.medium?.();
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      a.pause();
    }
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
    setCurrent(a.currentTime);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  // Ambient soundscape play/pause
  const toggleAmbientPlay = () => {
    hapticService.medium?.();
    if (isAmbientPlaying) {
      ambientAudioService.stop(0.3);
      setIsAmbientPlaying(false);
    } else {
      ambientAudioService.play(selectedTrack.id);
      setIsAmbientPlaying(true);
      if (timerMinutes > 0 && timerRemainingSec === 0) {
        setTimerRemainingSec(timerMinutes * 60);
      }
    }
  };

  // Switch soundscape track
  const handleSelectTrack = (track) => {
    hapticService.light?.();
    setSelectedTrack(track);
    if (isAmbientPlaying) {
      ambientAudioService.play(track.id);
    }
  };

  // Volume slider
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientAudioService.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const handleToggleMute = () => {
    hapticService.light?.();
    const muted = ambientAudioService.toggleMute();
    setIsMuted(muted);
  };

  // Set focus timer
  const handleSetTimer = (minutes) => {
    hapticService.light?.();
    setTimerMinutes(minutes);
    if (minutes > 0) {
      setTimerRemainingSec(minutes * 60);
    } else {
      setTimerRemainingSec(0);
    }
  };

  // Determine current active color for dynamic spatial morphing
  const activeColorRgb = activeTab === 'ambient' ? selectedTrack.colorRgb : '147, 112, 219';

  return (
    <div
      className="listen-screen analytics-screen"
      style={{ '--lc': activeColorRgb }}
    >
      {/* Top bar */}
      <div className="listen-topbar">
        <button className="listen-back" onClick={onBack} aria-label={t('listen.back', 'Back')}>
          <ArrowLeft size={20} />
        </button>
        <span className="listen-eyebrow">
          {activeTab === 'ambient'
            ? t('listen.ambientEyebrow', 'Contemplation & Focus')
            : t('listen.eyebrow', 'Podcast')}
        </span>
      </div>

      {/* Segmented Mode Switcher */}
      <div className="listen-mode-dock" role="tablist" aria-label="Audio Modes">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'ambient'}
          className={`listen-mode-btn${activeTab === 'ambient' ? ' is-active' : ''}`}
          onClick={() => handleTabChange('ambient')}
        >
          <Radio size={14} className="listen-mode-icon" />
          <span>{t('listen.tabAmbient', 'Ambient Soundscapes')}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'podcast'}
          className={`listen-mode-btn${activeTab === 'podcast' ? ' is-active' : ''}`}
          onClick={() => handleTabChange('podcast')}
        >
          <span>{t('listen.tabPodcast', 'Podcast')}</span>
        </button>
      </div>

      {/* Stage — glowing Blob Play button centrepiece */}
      <div className="listen-stage">
        <div className="listen-stage-glow" aria-hidden="true" />
        
        {activeTab === 'ambient' ? (
          <button
            className={`listen-bigplay${isAmbientPlaying ? ' is-playing' : ''}`}
            onClick={toggleAmbientPlay}
            aria-label={isAmbientPlaying ? t('listen.pause', 'Pause') : t('listen.play', 'Play')}
          >
            <span className="listen-bigplay-ring" aria-hidden="true" />
            <span className="listen-bigplay-ring listen-bigplay-ring--2" aria-hidden="true" />
            {isAmbientPlaying ? <Pause size={40} /> : <Play size={40} className="listen-bigplay-icon" />}
          </button>
        ) : (
          <button
            className={`listen-bigplay${isPlaying ? ' is-playing' : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? t('listen.pause', 'Pause') : t('listen.play', 'Play')}
          >
            <span className="listen-bigplay-ring" aria-hidden="true" />
            <span className="listen-bigplay-ring listen-bigplay-ring--2" aria-hidden="true" />
            {isPlaying ? <Pause size={40} /> : <Play size={40} className="listen-bigplay-icon" />}
          </button>
        )}

        {/* Morphing acoustic equalizer */}
        <div 
          className={`listen-stage-eq${(activeTab === 'ambient' ? isAmbientPlaying : isPlaying) ? ' is-playing' : ''}`} 
          aria-hidden="true"
        >
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: AMBIENT SOUNDSCAPES
         ========================================================================= */}
      {activeTab === 'ambient' && (
        <div className="listen-ambient-view">
          {/* Active Soundscape Title */}
          <h1 className="listen-episode-title">
            {t(`listen.tracks.${selectedTrack.id}.title`, selectedTrack.title)}
          </h1>
          <p className="listen-episode-tagline">
            {selectedTrack.subtitle}
          </p>

          <div className="listen-meta">
            <span className="listen-pill">
              <Clock size={13} />
              {timerRemainingSec > 0
                ? t('listen.timerRemaining', '{{time}} left', { time: fmtTime(timerRemainingSec) })
                : selectedTrack.durationLabel}
            </span>
            <span className="listen-pill listen-pill--topic">
              {t(`listen.tracks.${selectedTrack.id}.tagline`, selectedTrack.tagline)}
            </span>
          </div>

          {/* Sound Controls Bar (Volume + Timer) */}
          <div className="listen-ambient-controls">
            {/* Volume Control */}
            <div className="listen-volume-wrap">
              <button
                type="button"
                className="listen-vol-btn"
                onClick={handleToggleMute}
                title={isMuted ? t('listen.unmute', 'Unmute') : t('listen.mute', 'Mute')}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="listen-volume-slider"
                aria-label={t('listen.volume', 'Volume')}
              />
            </div>

            {/* Focus Session Timer Pills */}
            <div className="listen-timer-group">
              <div className="listen-timer-label">
                <Timer size={13} />
                <span>{t('listen.timer', 'Focus Timer')}</span>
              </div>
              <div className="listen-timer-pills">
                {TIMER_PRESETS.map((min) => (
                  <button
                    key={min}
                    type="button"
                    className={`listen-timer-pill${timerMinutes === min ? ' is-active' : ''}`}
                    onClick={() => handleSetTimer(min)}
                  >
                    {min === 0 ? t('listen.timerOff', 'Loop') : t('listen.timerMinutes', '{{min}}m', { min })}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Soundscape Track Selector Cards */}
          <div className="listen-tracks-section">
            <div className="listen-tracks-grid">
              {AMBIENT_TRACKS.map((track) => {
                const isCurrent = selectedTrack.id === track.id;
                const IconComponent = TRACK_ICONS[track.iconName] || CloudRain;

                return (
                  <button
                    key={track.id}
                    type="button"
                    className={`listen-track-card${isCurrent ? ' is-selected' : ''}`}
                    style={{ '--track-color': track.colorRgb }}
                    onClick={() => handleSelectTrack(track)}
                  >
                    <div className="listen-track-icon-wrap">
                      <IconComponent size={18} className="listen-track-icon" />
                      {isCurrent && isAmbientPlaying && (
                        <span className="listen-track-playing-pulse" aria-hidden="true" />
                      )}
                    </div>
                    <div className="listen-track-info">
                      <span className="listen-track-title">
                        {t(`listen.tracks.${track.id}.title`, track.title)}
                      </span>
                      <span className="listen-track-tag">
                        {t(`listen.tracks.${track.id}.tagline`, track.tagline)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PODCAST (INK & INTENTION)
         ========================================================================= */}
      {activeTab === 'podcast' && (
        <div className="listen-podcast-view">
          <h1 className="listen-episode-title">{ep.title}</h1>
          {ep.tagline ? <p className="listen-episode-tagline">{ep.tagline}</p> : null}

          <div className="listen-meta">
            {ep.durationMin ? (
              <span className="listen-pill">
                <Clock size={13} />
                {t('listen.minutes', '{{count}} min', { count: ep.durationMin })}
              </span>
            ) : null}
            <span className="listen-pill listen-pill--topic">{t('listen.topic', 'Handwriting & journaling')}</span>
          </div>

          {/* Progress + times */}
          {ep.audioUrl ? (
            <div className="listen-progress-wrap">
              <div
                className="listen-progress"
                onClick={seek}
                role="progressbar"
                aria-label={ep.title}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div className="listen-progress-fill" style={{ width: `${progress}%` }}>
                  <span className="listen-progress-knob" />
                </div>
              </div>
              <div className="listen-times">
                <span>{fmtTime(current)}</span>
                <span>{fmtTime(duration)}</span>
              </div>
              <audio
                ref={audioRef}
                src={ep.audioUrl}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => { setIsPlaying(false); setCurrent(0); }}
                onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              >
                {t('listen.noAudio', 'Your browser does not support audio playback.')}
              </audio>
            </div>
          ) : ep.link ? (
            <a className="listen-external" href={ep.link} target="_blank" rel="noopener noreferrer">
              <Play size={16} />
              {t('listen.listenExternal', 'Listen')}
              <ExternalLink size={14} />
            </a>
          ) : null}

          <p className="listen-desc">{ep.description}</p>

          {/* About journaling → glassy pop-up */}
          <button className="listen-about-btn" onClick={() => setShowInfo(true)}>
            <span className="listen-about-icon"><BookOpen size={18} /></span>
            <span className="listen-about-label">{t('listen.about', 'About journaling')}</span>
            <ChevronRight size={18} className="listen-about-chevron" />
          </button>

          {/* Attribution */}
          <p className="listen-powered">
            {t('listen.poweredBy', 'Crafted with Microsoft Copilot')}
          </p>
        </div>
      )}

      {/* Glassy info pop-up */}
      {showInfo && createPortal(
        <div className="listen-info-overlay" onClick={() => setShowInfo(false)}>
          <div
            className="listen-info-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={ABOUT_JOURNALING.title}
          >
            <button
              className="listen-info-close"
              onClick={() => setShowInfo(false)}
              aria-label={t('listen.close', 'Close')}
            >
              <X size={18} />
            </button>

            <div className="listen-info-halo"><BookOpen size={24} /></div>
            <h2 className="listen-info-title">{ABOUT_JOURNALING.title}</h2>
            <p className="listen-info-intro">{ABOUT_JOURNALING.intro}</p>

            <ul className="listen-info-list">
              {ABOUT_JOURNALING.points.map((pt) => (
                <li key={pt.title} className="listen-info-point">
                  <span className="listen-info-dot" aria-hidden="true" />
                  <div>
                    <span className="listen-info-point-title">{pt.title}</span>
                    <span className="listen-info-point-text">{pt.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ListenScreen;