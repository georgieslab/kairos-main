// src/components/common/MiroMark.jsx
//
// Miro's mark.
//
// A dark blue circle, near enough to black — but a sphere rather than a disc:
// the gradient is off-centre so the light falls from the upper left, and a rim
// picks out the far edge. That is what keeps it from reading as a hole.
//
// The glow is bluish-violet and deliberately dim. Night sky, deep water —
// something lit from within rather than a neon sign. It breathes on a slow
// cycle, slower than a resting breath, so the mark is alive without asking for
// attention.
//
// Inside is an open ring: a circle that does not close, with a gap on one
// side. A conversation that has not ended. It turns very slowly, which moves
// the opening around the mark without ever drawing the eye to the motion.
//
// This is the one thing on Home that does NOT take the active journey's
// colour. Everything else on the screen shifts to the path you are walking;
// Miro stays the same colour whichever path that is, because Miro is not part
// of any of them.

import React from 'react';
import '../../styles/components/miroMark.css';

// r=8.5 gives a circumference of 53.4. Leaving 6.7 of that undrawn opens the
// ring by roughly 45 degrees — open enough to read as unfinished, not so open
// that it stops being a circle.
const RING_R = 8.5;
const RING_C = 2 * Math.PI * RING_R;
const GAP = RING_C * (45 / 360);

const MiroMark = ({ size = 34, className = '' }) => (
  <svg
    className={`miro-mark ${className}`.trim()}
    viewBox="0 0 40 40"
    width={size}
    height={size}
    role="presentation"
    aria-hidden="true"
  >
    <defs>
      {/* Off-centre, so the body reads as lit from the upper left. Three
          stops rather than two: the middle one is what stops the falloff
          looking like a vignette. */}
      <radialGradient id="miro-body" cx="36%" cy="28%" r="80%">
        <stop offset="0%"   stopColor="#1d2650" />
        <stop offset="52%"  stopColor="#0d1226" />
        <stop offset="100%" stopColor="#04060e" />
      </radialGradient>

      {/* The ring is brighter where the light is and falls away opposite, so
          it sits in the sphere rather than on top of it. */}
      <linearGradient id="miro-ring" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%"   stopColor="#b9c2ff" />
        <stop offset="60%"  stopColor="#8e97e0" />
        <stop offset="100%" stopColor="#5b64a8" />
      </linearGradient>

      {/* A thin lit edge along the top-left, fading before it wraps. */}
      <linearGradient id="miro-rim" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%"   stopColor="rgba(163, 176, 255, 0.55)" />
        <stop offset="45%"  stopColor="rgba(120, 132, 210, 0.12)" />
        <stop offset="100%" stopColor="rgba(90, 100, 170, 0)" />
      </linearGradient>
    </defs>

    <g className="miro-body-group">
      <circle cx="20" cy="20" r="17.2" fill="url(#miro-body)" />
      <circle cx="20" cy="20" r="17.2" fill="none" stroke="url(#miro-rim)" strokeWidth="1" />
    </g>

    <circle
      className="miro-ring"
      cx="20"
      cy="20"
      r={RING_R}
      fill="none"
      stroke="url(#miro-ring)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeDasharray={`${RING_C - GAP} ${GAP}`}
    />
  </svg>
);

export default MiroMark;
