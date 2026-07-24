// src/pages/ListenScreen.jsx
// "Listen" — a single-episode podcast page (Ink & Intention) on handwriting &
// journaling. Reached from the Home card and Profile → Listen. Episode content
// is English-only (see src/data/podcasts.js); only the chrome is localized.
//
// A big glowing Play/Pause button is the centrepiece, driving a hidden <audio>
// element with a seekable progress bar. A glassy pop-up (portaled to <body>)
// carries the "About journaling" info.

import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Play, Pause, Clock, Sparkles, ExternalLink, BookOpen, ChevronRight, X } from 'lucide-react';
import { PODCAST, ABOUT_JOURNALING } from '../data/podcasts';
import '../styles/components/listenScreen.css';

const fmtTime = (s) => {
  if (!s || isNaN(s) || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
};

const ListenScreen = ({ onBack }) => {
  const { t } = useTranslation('journey');
  const ep = PODCAST;

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      const p = a.play();
      if (p && p.catch) p.catch(() => {}); // missing/blocked audio: fail quietly
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

  return (
    <div className="listen-screen analytics-screen">
      {/* Top bar */}
      <div className="listen-topbar">
        <button className="listen-back" onClick={onBack} aria-label={t('listen.back', 'Back')}>
          <ArrowLeft size={20} />
        </button>
        <span className="listen-eyebrow">{t('listen.eyebrow', 'Podcast')}</span>
      </div>

      {/* Stage — the glowing Play button is the centrepiece */}
      <div className="listen-stage">
        <div className="listen-stage-glow" aria-hidden="true" />
        <button
          className={`listen-bigplay${isPlaying ? ' is-playing' : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? t('listen.pause', 'Pause') : t('listen.play', 'Play')}
        >
          <span className="listen-bigplay-ring" aria-hidden="true" />
          <span className="listen-bigplay-ring listen-bigplay-ring--2" aria-hidden="true" />
          {isPlaying ? <Pause size={40} /> : <Play size={40} className="listen-bigplay-icon" />}
        </button>
        <div className={`listen-stage-eq${isPlaying ? ' is-playing' : ''}`} aria-hidden="true">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>

      {/* Episode meta */}
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

      {/* Progress + times (the Play control lives in the stage above) */}
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
        <Sparkles size={12} />
        {t('listen.poweredBy', 'Crafted with Microsoft Copilot')}
      </p>

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
