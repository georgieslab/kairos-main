// src/components/common/LoadingQuote.jsx
// Rotating "famous phrase" shown on analysis/loading screens — same source
// as the Home screen's spark section, so the app speaks with one voice.

import React, { useState, useEffect } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { quotes } from '../../data/quotes';
import '../../styles/components/loadingQuote.css';

const pickIndex = (exclude = -1) => {
  if (quotes.length <= 1) return 0;
  let next = Math.floor(Math.random() * quotes.length);
  if (next === exclude) next = (next + 1) % quotes.length;
  return next;
};

const LoadingQuote = ({ rotate = true, interval = 6000 }) => {
  const [index, setIndex] = useState(() => pickIndex());
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!rotate) return undefined;
    const id = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex(prev => pickIndex(prev));
        setIsFading(false);
      }, 400);
    }, interval);
    return () => clearInterval(id);
  }, [rotate, interval]);

  const quote = quotes[index];
  if (!quote) return null;

  return (
    <div className={`loading-quote ${isFading ? 'is-fading' : ''}`} aria-live="polite">
      <QuoteIcon size={18} className="loading-quote__icon" aria-hidden="true" />
      <p className="loading-quote__text">"{quote.text}"</p>
      <p className="loading-quote__author">— {quote.author}</p>
    </div>
  );
};

export default LoadingQuote;
