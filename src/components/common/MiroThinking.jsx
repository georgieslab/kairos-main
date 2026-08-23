// src/components/common/MiroThinking.jsx
//
// Miro thinking: the same sphere as its mark, with water moving inside it.
//
// The waves were right and the bare band was not — so they are held in the
// body now rather than laid across the message. That also makes the waiting
// state the same object as the mark in the header, instead of a second shape
// with its own vocabulary.
//
// Its gradient ids are prefixed differently from MiroMark's on purpose: both
// are on screen at once while an answer is coming, and two <defs> sharing an
// id in one document is a silent collision — the second one drawn simply
// picks up the first one's paint.

import React from 'react';
import '../../styles/components/miroThinking.css';

/**
 * One wave as cubic segments. Eight half-periods of 16 units puts the path at
 * 128 wide against a 64 viewBox, so sliding it one wavelength (32) returns an
 * identical shape and the loop has no seam — 96 units still cover the frame.
 *
 * 0.36/0.64 is where a cubic's control points approximate a sine. Evenly
 * spaced ones give a lumpier curve that reads as ribbon rather than water.
 */
const W = (amp, y) => {
  let d = `M 0 ${y}`;
  for (let i = 0; i < 8; i++) {
    const a = i % 2 === 0 ? -amp : amp;
    d += ` c 5.76 ${a}, 10.24 ${a}, 16 0`;
  }
  return d;
};

const MiroThinking = ({ size = 46, className = '' }) => (
  <svg
    className={`miro-think ${className}`.trim()}
    viewBox="0 0 64 64"
    width={size}
    height={size}
    role="presentation"
    aria-hidden="true"
  >
    <defs>
      {/* Same off-centre light as the mark, so the two read as one object. */}
      <radialGradient id="mt-body" cx="36%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#1d2650" />
        <stop offset="52%" stopColor="#0d1226" />
        <stop offset="100%" stopColor="#04060e" />
      </radialGradient>

      {/* Stop colours come from CSS: a custom property inside a stop-color
          ATTRIBUTE is not reliably resolved, and it fails silently. */}
      <linearGradient id="mt-wave" x1="0" y1="0" x2="1" y2="0">
        <stop className="mt-s0" offset="0%" />
        <stop className="mt-s1" offset="26%" />
        <stop className="mt-s2" offset="52%" />
        <stop className="mt-s3" offset="76%" />
        <stop className="mt-s4" offset="100%" />
      </linearGradient>

      <linearGradient id="mt-rim" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="rgba(163, 176, 255, 0.5)" />
        <stop offset="45%" stopColor="rgba(120, 132, 210, 0.12)" />
        <stop offset="100%" stopColor="rgba(90, 100, 170, 0)" />
      </linearGradient>

      {/* Keeps the water inside the glass. */}
      <clipPath id="mt-clip">
        <circle cx="32" cy="32" r="29" />
      </clipPath>
    </defs>

    <circle cx="32" cy="32" r="29" fill="url(#mt-body)" />

    <g clipPath="url(#mt-clip)">
      {/* The tide: the whole body of water rises and falls under the drift,
          so the surface is never doing only one thing. */}
      <g className="mt-tide">
        <path className="mt-w1" d={W(3.4, 30)} />
        <path className="mt-w2" d={W(5.0, 34)} />
        <path className="mt-w3" d={W(2.2, 26)} />
        <path className="mt-w4" d={W(4.2, 38)} />
      </g>
    </g>

    <circle cx="32" cy="32" r="29" fill="none" stroke="url(#mt-rim)" strokeWidth="1" />
  </svg>
);

export default MiroThinking;
