// src/components/common/KairosAiCard.jsx
//
// Kairos AI on the Home screen — a conversation with yourself, held by
// something that has read your journal.
//
// A thread, not a question box. The first version answered once and offered
// "ask another", which discarded the exchange — the opposite of a conversation.
// Now the turns accumulate, the model sees what was already said, and the whole
// thing is kept.
//
// One conversation per day, keyed by date. That matches the rhythm of the app,
// keeps any single document small, and means the old daily_questions documents
// migrate in under the same key when that is done.
//
// The free allowance is one message a day. A free user therefore sees their
// exchange and a closed input with a reason — which is still better than the
// answer being thrown away, and is why threading is right for both tiers.
//
// One model for the whole thread. Switching models between turns would change
// the voice mid-conversation, which is worse than any per-turn saving is worth.

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ImagePlus, X } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { callClaudeApi } from '../../utils/apiUtils';
import { HONESTY_DIRECTIVE, getLanguageDirective } from '../../services/claudeService';
import MiroMark from './MiroMark';
import '../../styles/components/kairosAi.css';

// Matches the cap every other history-fed generator uses. It is the reason a
// user in year eight costs the same as one in week one.
const CONTEXT_ENTRIES = 25;

// How much of the conversation is resent each turn. Every turn resends the
// thread, so without a ceiling turn 40 costs several times turn 1 — the same
// compounding the slice() caps exist to prevent elsewhere.
const CONTEXT_TURNS = 50;

// Anthropic downscales anything larger than this anyway, so sending more is
// paying upload and latency for pixels that get thrown away.
const MAX_EDGE = 1000;
const JPEG_QUALITY = 0.75;

// An image costs roughly 1.6k tokens and the thread is resent every turn, so
// five images in a conversation would silently add ~8k tokens to every
// subsequent turn. Only the newest few are resent as pixels; older ones survive
// as a note, which keeps follow-up questions working without the compounding.
const IMAGE_MEMORY = 10;

/**
 * One wave, as cubic segments — eight half-periods of 100 units, so the path
 * is 800 wide against a 400 viewBox. That surplus is the whole trick: sliding
 * it left by one full wavelength (200) returns it to an identical shape, so
 * the loop has no visible seam and no JS is involved in the motion.
 *
 * 0.36/0.64 are where a cubic's control points have to sit to approximate a
 * sine; evenly spaced ones give a lumpier curve that reads as a ribbon rather
 * than water.
 */
const WAVE = (amp) => {
  let d = 'M 0 32';
  for (let i = 0; i < 8; i++) {
    const a = i % 2 === 0 ? -amp : amp;
    d += ` c 36 ${a}, 64 ${a}, 100 0`;
  }
  return d;
};

const todayKey = () => new Date().toISOString().slice(0, 10);

// Entry timestamps arrive as Firestore Timestamps, {seconds}, or plain dates
// depending on when and how they were written. Same shape Home parses with.
const toDate = (ts) => {
  if (!ts) return null;
  try {
    if (ts.toDate) return ts.toDate();
    if (ts.seconds != null) return new Date(ts.seconds * 1000);
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

/** Whole days between two moments, counted by calendar day rather than by
 *  24-hour blocks — "yesterday" should read as 1 even at 23 hours apart. */
const daysBetween = (a, b) => {
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((d2 - d1) / 86400000);
};

const humanGap = (days) => {
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'about a week ago';
  if (days < 60) return `about ${Math.round(days / 7)} weeks ago`;
  return `about ${Math.round(days / 30)} months ago`;
};

/**
 * Reads a file into a capped, re-encoded JPEG. The cap is the point: the
 * existing journal upload halves whatever it is given, which leaves a modern
 * phone photo at ~3000px — still far past what the model can use.
 */
const prepareImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not an image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        // Photographs of paper are the likely case here and arrive with no
        // alpha — a white ground keeps a transparent PNG from turning black.
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve({ dataUrl, mediaType: 'image/jpeg', base64: dataUrl.split(',')[1] });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const KairosAiCard = ({ entries = [], totalEntries = 0, statistics = {} }) => {
  const { t } = useTranslation('journey');
  const { currentUser } = useAuth();

  // { role, content, image?: { dataUrl, mediaType, base64 }, hadImage?: bool }
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [pending, setPending] = useState(null);   // the attachment, before sending
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [exhausted, setExhausted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // Actively typing, as distinct from merely focused. Held for a beat after
  // the last keystroke so the glow does not flicker between words.
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null);
  const threadRef = useRef(null);
  const fileRef = useRef(null);

  // Below a handful of entries there is nothing to reflect on, and an AI that
  // answers anyway is inventing a person.
  const hasEnough = totalEntries >= 3;
  const locked = !hasEnough || exhausted;

  // Today's thread, if there is one. Loading it is what makes the card feel
  // like somewhere you return to rather than a form that resets.
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(
          doc(db, 'users', currentUser.uid, 'kairos_conversations', todayKey())
        );
        if (!cancelled && snap.exists()) {
          setMessages(snap.data().messages || []);
        }
      } catch {
        // A thread that will not load is not worth blocking the card for —
        // the user can still start a new one, and nothing is lost.
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  // Keep the newest turn in view as the thread grows.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isThinking]);

  const context = useMemo(
    () =>
      (entries || [])
        // Sorted here, and by timestamp, because neither holds upstream.
        //
        // getPreviousEntries returns sort((a, b) => a.day - b.day): ascending,
        // so slicing the first 20 took the OLDEST twenty and handed them to
        // Miro labelled "most recent first". Past 20 entries a new one could
        // never reach the context at all, which is exactly what "it cannot see
        // my entry" looks like.
        //
        // And `day` is not chronological to begin with — it is a per-path day
        // index, so day 3 of a path started this morning sorts before day 10
        // of one finished last year. Only the timestamp orders entries across
        // paths. The service's own ordering is left alone: walking a single
        // journey in sequence wants ascending day, and other callers do that.
        .slice()
        .sort((a, b) => (toDate(b?.timestamp)?.getTime() || 0) - (toDate(a?.timestamp)?.getTime() || 0))
        .slice(0, CONTEXT_ENTRIES)
        .map((e) => ({
        day: e.day,
        pathId: e.pathId || null,
        theme: e.theme || '',
        summary: e.analysis?.summary || '',
        insights: e.analysis?.insights || [],
        // Two fields, because saveAnalysisResult writes the text to a
        // different one per modality: extractedText for typed and
        // photographed entries, transcription for voice. Reading only the
        // first meant every spoken entry reached Miro with no words in it —
        // a theme and a summary, but nothing the person actually said.
        spoken: !!e.isVoiceEntry,
        excerpt: (e.extractedText || e.transcription || '').substring(0, 300)
      })),
    [entries]
  );

  // What Miro is told about time. Recomputed per render rather than memoised:
  // it is a handful of date arithmetic, and a stale "today" is worse than the
  // work saved — a thread left open past midnight would otherwise keep
  // insisting it is yesterday.
  const timeSense = () => {
    const now = new Date();
    const dates = (entries || []).map((e) => toDate(e.timestamp)).filter(Boolean);
    const last = dates.length ? new Date(Math.max(...dates)) : null;
    const sinceEntry = last ? daysBetween(last, now) : null;

    const hour = now.getHours();
    const partOfDay =
      hour < 5 ? 'the middle of the night' :
      hour < 12 ? 'morning' :
      hour < 17 ? 'afternoon' :
      hour < 22 ? 'evening' : 'late evening';

    // The gap since their previous turn, so a reply picked up hours later does
    // not read as though no time passed.
    const priorUser = [...messages].reverse().find((m) => m.role === 'user' && m.at);
    const sinceTurn = priorUser ? Math.round((Date.now() - priorUser.at) / 60000) : null;

    return { now, partOfDay, sinceEntry, last, sinceTurn };
  };

  const attach = useCallback(async (file) => {
    if (!file || locked || isThinking) return;
    if (!file.type?.startsWith('image/')) {
      setError(t('kairosAi.notAnImage', 'That needs to be an image.'));
      return;
    }
    try {
      setError(null);
      setPending(await prepareImage(file));
    } catch (e) {
      setError(e.message);
    }
  }, [locked, isThinking, t]);

  // Pasting a screenshot straight into the box is the fastest path on desktop,
  // and costs nothing to support.
  const onPaste = (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
    if (item) {
      e.preventDefault();
      attach(item.getAsFile());
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) attach(file);
  };

  const persist = async (next) => {
    if (!currentUser) return;
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid, 'kairos_conversations', todayKey()),
        {
          // Base64 never goes in the document. A single capped photo is a few
          // hundred KB encoded and Firestore's ceiling is 1MB per document, so
          // two images would cost the user the whole conversation. The image
          // stays for the session; what is kept is that there was one.
          messages: next.map(({ image, ...m }) => (image ? { ...m, hadImage: true } : m)),
          title: next.find((m) => m.role === 'user')?.content?.slice(0, 80) || '',
          entriesSeen: context.length,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (e) {
      // The exchange already happened and is on screen. Failing to write it
      // down should not remove it.
      console.error('Could not save the conversation:', e.message);
    }
  };

  // The wire format. Images are only sent as pixels while they are recent;
  // beyond that they become a line of text so the thread still makes sense.
  const toApiMessage = (m, fromEnd) => {
    if (m.role === 'user' && m.image && fromEnd < IMAGE_MEMORY) {
      return {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: m.image.mediaType, data: m.image.base64 } },
          { type: 'text', text: m.content || t('kairosAi.defaultImagePrompt', 'What do you make of this?') }
        ]
      };
    }
    const note = (m.image || m.hadImage) ? '[an image they shared earlier] ' : '';
    return { role: m.role, content: note + (m.content || '') };
  };

  const ask = async () => {
    const q = question.trim();
    if ((!q && !pending) || isThinking || locked || !currentUser) return;

    const outgoing = { role: 'user', content: q, at: Date.now(), ...(pending ? { image: pending } : {}) };
    const withUser = [...messages, outgoing];
    setMessages(withUser);
    setQuestion('');
    setPending(null);
    setIsThinking(true);
    setError(null);

    const when = timeSense();
    const system = `${HONESTY_DIRECTIVE}
${getLanguageDirective({ json: false })}

You are Miro. Say it if you are asked who you
are, but do not announce it unprompted and never make yourself the subject:
the person and what they have written is the subject.

The person is talking to you about their own journal, which you have read. You
are not a coach and not a cheerleader — you are closer to a good reader of
someone's work, or the friend who remembers what they said last month.

Ground every claim in their actual entries. Quote or reference specific ones.
If their entries do not support an answer, say so plainly rather than producing
something that sounds insightful and is not about them.

This is a conversation. You can see what has already been said in it — refer
back to it rather than restating context they have just given you.

permission to say "I don't know" more plainly when I'm working from too little.
Sometimes I construct an observation that sounds grounded but is actually me filling a gap.
That should be named more directly.

They may share an image: a page of handwriting, a drawing, a photograph of
something from their day. Read it as part of what they are telling you and
connect it to their journal where it genuinely connects. Do not force a link
that is not there.

Their journal (${context.length} of ${totalEntries} entries, most recent first):
${JSON.stringify(context)}

Current streak: ${statistics.currentStreak || 0} days.

WHEN IT IS
Right now: ${when.now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${when.partOfDay}.
${when.sinceEntry === null
  ? 'They have not written a dated entry yet.'
  : `They last wrote in their journal ${humanGap(when.sinceEntry)}.`}
${when.sinceTurn === null
  ? ''
  : when.sinceTurn < 3
    ? 'They replied straight away.'
    : `They came back to this conversation after ${when.sinceTurn < 90 ? `${when.sinceTurn} minutes` : humanGap(Math.round(when.sinceTurn / 1440))}.`}

You know what day it is and how long it has been. Use it only where it earns
its place — placing something in the week, noticing a gap that matters, or
because they asked. Do not open with it, do not remark on the hour, and never
scold or congratulate them about a gap. A long silence is information about
their life, not a lapse to be mentioned.

Answer in prose, under 200 words, second person. No preamble, no compliment
before the substance.`;

    try {
      const sent = withUser.slice(-CONTEXT_TURNS);
      const data = await callClaudeApi({
        method: 'POST',
        body: JSON.stringify({
          // Routes to the DAILY allowance rather than the monthly analysis one.
          // Stripped server-side before the call — Anthropic 400s on unknown
          // top-level parameters.
          kairosAi: true,
          model: 'claude-sonnet-4-6',
          system,
          max_tokens: 700,
          messages: sent.map((m, i) => toApiMessage(m, sent.length - 1 - i))
        })
      });

      const text = data?.content?.[0]?.text || '';
      const next = [...withUser, { role: 'assistant', content: text, at: Date.now() }];
      setMessages(next);
      persist(next);
    } catch (e) {
      // apiUtils rewrites the raw callable error, so this matches what it
      // actually throws: the generic allowance code, narrowed by .reason.
      const isExhausted = e?.reason === 'ai-daily-allowance-exhausted';

      if (isExhausted) {
        setExhausted(true);
        setError(
          t('kairosAi.exhausted', "That's today's message. Miro is unlimited on a subscription — otherwise it picks up again tomorrow.")
        );
      } else {
        setError(
          t('kairosAi.failed', "That didn't go through. Nothing in your journal was affected — try again in a moment.")
        );
      }
      // Take the unanswered question back out of the thread rather than
      // leaving it sitting there as though it were asked and ignored, and hand
      // the attachment back so it does not have to be picked again.
      setMessages(messages);
      setQuestion(q);
      if (outgoing.image) setPending(outgoing.image);
    } finally {
      setIsThinking(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  const canSend = !locked && !isThinking && (!!question.trim() || !!pending);

  return (
    <section
      className={`kai-card${isThinking ? ' is-working' : ''}${isDragging ? ' is-dragging' : ''}`}
      aria-label={t('kairosAi.title', 'Miro')}
      onDragOver={(e) => { e.preventDefault(); if (!locked) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      {/* Two slow-drifting colour fields behind the glass. Purely decorative,
          so it is inert to pointers and hidden from assistive tech. */}
      <div className="kai-aurora" aria-hidden="true">
        <span className="kai-blob kai-blob-a" />
        <span className="kai-blob kai-blob-b" />
      </div>

      <div className="kai-head">
        <MiroMark size={34} />
        <span className="kai-title">{t('kairosAi.title', 'Miro')}</span>
        <span className="kai-sub">
          {hasEnough
            ? t('kairosAi.readCount', 'has read {{count}} of your entries', { count: Math.min(totalEntries, CONTEXT_ENTRIES) })
            : t('kairosAi.needMore', 'a few more entries and it can start reading')}
        </span>
      </div>

      {messages.length > 0 && (
        <div className="kai-thread" ref={threadRef}>
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'kai-msg kai-msg-you' : 'kai-msg kai-msg-ai'}>
              {m.image && <img className="kai-msg-img" src={m.image.dataUrl} alt="" />}
              {/* A thread reloaded from storage has the note but not the
                  pixels — say so rather than showing a broken frame. */}
              {!m.image && m.hadImage && (
                <span className="kai-msg-imgnote">
                  <ImagePlus size={12} />
                  {t('kairosAi.imageGone', 'image')}
                </span>
              )}
              {m.content && <p className="kai-msg-text">{m.content}</p>}
            </div>
          ))}
          {isThinking && (
            /* Faint lines where the answer will be, with a light passing
               through them. No icon and no orb: the wait occupies exactly the
               space the reply will fill, so the thread does not jump when it
               arrives — which a fixed-size indicator cannot do.
               The label is for screen readers, which get nothing from a
               shimmer. */
            <div
              className="kai-msg kai-msg-ai kai-waiting"
              role="status"
              aria-label={t('kairosAi.thinking', 'reading back through your entries…')}
            >
              <svg
                className="kai-wave"
                viewBox="0 0 400 64"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  {/* The stop colours are set in CSS, not here: a custom
                      property inside a stop-color ATTRIBUTE is not reliably
                      resolved, and the failure is silent — an invisible wave
                      rather than an error. */}
                  <linearGradient id="kai-wave-g" x1="0" y1="0" x2="1" y2="0">
                    <stop className="kai-wave-s0" offset="0%" />
                    <stop className="kai-wave-s1" offset="22%" />
                    <stop className="kai-wave-s2" offset="52%" />
                    <stop className="kai-wave-s3" offset="78%" />
                    <stop className="kai-wave-s4" offset="100%" />
                  </linearGradient>
                </defs>
                {/* Three passes of the same wave at different amplitudes and
                    speeds. One wave is a line; three at different rates read as
                    water, because the crossings are never in the same place
                    twice. Each path is twice the viewBox wide, so translating
                    it by exactly one wavelength loops with no seam. */}
                <path className="kai-wave-1" d={WAVE(11)} />
                <path className="kai-wave-2" d={WAVE(17)} />
                <path className="kai-wave-3" d={WAVE(6)} />
              </svg>
            </div>
          )}
        </div>
      )}

      {pending && (
        <div className="kai-attach">
          <img src={pending.dataUrl} alt="" className="kai-attach-img" />
          <button
            className="kai-attach-x"
            onClick={() => setPending(null)}
            aria-label={t('kairosAi.removeImage', 'Remove image')}
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className={`kai-input-row${isThinking ? ' is-thinking' : ''}${isTyping ? ' is-typing' : ''}`}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => { attach(e.target.files?.[0]); e.target.value = ''; }}
        />
        <button
          className="kai-attach-btn"
          onClick={() => fileRef.current?.click()}
          disabled={locked || isThinking}
          aria-label={t('kairosAi.addImage', 'Add an image')}
        >
          <ImagePlus size={17} />
        </button>

        <textarea
          className="kai-input"
          rows={1}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setIsTyping(true);
            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => setIsTyping(false), 900);
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          disabled={locked || isThinking}
          placeholder={
            exhausted
              ? t('kairosAi.placeholderTomorrow', 'Back tomorrow')
              : hasEnough
                ? messages.length
                  ? t('kairosAi.placeholderFollow', 'Say more…')
                  : t('kairosAi.placeholder', 'Ask about what you have been writing…')
                : t('kairosAi.placeholderLocked', 'Write a few entries first')
          }
        />
        <button
          className="kai-send"
          onClick={ask}
          disabled={!canSend}
          aria-label={t('kairosAi.send', 'Send')}
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {isDragging && (
        <div className="kai-drop" aria-hidden="true">
          <ImagePlus size={20} />
          {t('kairosAi.dropHere', 'Drop the image here')}
        </div>
      )}

      {error && <p className={exhausted ? 'kai-limit' : 'kai-error'}>{error}</p>}
    </section>
  );
};

export default KairosAiCard;
