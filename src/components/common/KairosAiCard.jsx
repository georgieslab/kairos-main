// src/components/common/KairosAiCard.jsx
//
// Kairos AI on the Home screen — a conversation with yourself, held by
// something that has read your journal.
//
// A continuous living thread, not a ephemeral box that resets daily.
// Turns accumulate, Miro sees what was already said across days, and the entire
// conversation is kept. Users can talk over multiple days or start a fresh
// topic whenever they choose.
//
// Subscribed users (Artisan) have unlimited, uninterrupted conversation turns.
// Free users receive 1 message daily with a direct upgrade path.

import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ImagePlus, X, Sparkles, RotateCcw, Mic } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { callClaudeApi } from '../../utils/apiUtils';
import { HONESTY_DIRECTIVE, getLanguageDirective } from '../../services/claudeService';
import { getSubscriptionStatus, hasArtisanAccess, startUpgradeProcess } from '../../services/SubscriptionService';
import hapticService from '../../services/hapticService';
import MiroMark from './MiroMark';
import MiroThinking from './MiroThinking';
import '../../styles/components/kairosAi.css';

// Lazy load the Voice Chamber modal so it never blocks the initial Home screen load
const MiroVoiceModal = lazy(() => import('./MiroVoiceModal'));

// Matches the cap every other history-fed generator uses.
const CONTEXT_ENTRIES = 25;

// How much of the conversation is resent each turn.
const CONTEXT_TURNS = 50;

// Image dimensions and memory constraints
const MAX_EDGE = 1000;
const JPEG_QUALITY = 0.75;
const IMAGE_MEMORY = 10;

// Persistent document key for the continuous active chat
const ACTIVE_THREAD_KEY = 'active_thread';

const todayKey = () => new Date().toISOString().slice(0, 10);

// Entry timestamps arrive as Firestore Timestamps, {seconds}, or plain dates
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

/** Whole days between two moments, counted by calendar day */
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

/** Reads a file into a capped, re-encoded JPEG */
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
  const { t, i18n } = useTranslation(['journey', 'home']);
  const { currentUser } = useAuth();

  // { role, content, at?: number, image?: { dataUrl, mediaType, base64 }, hadImage?: bool }
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [pending, setPending] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [exhausted, setExhausted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const typingTimer = useRef(null);
  const threadRef = useRef(null);
  const fileRef = useRef(null);

  // Check Artisan subscription status
  useEffect(() => {
    if (!currentUser) return;
    getSubscriptionStatus(currentUser.uid)
      .then(setSubscription)
      .catch(() => setSubscription({ status: 'free' }));
  }, [currentUser]);

  const isArtisan = useMemo(() => hasArtisanAccess(subscription), [subscription]);

  // Below a handful of entries there is nothing to reflect on
  const hasEnough = totalEntries >= 3;
  const locked = !hasEnough || (exhausted && !isArtisan);

  // Continuous active thread loading (with fallback to today's doc for seamless migration)
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        // 1. Try loading persistent active_thread
        const activeSnap = await getDoc(
          doc(db, 'users', currentUser.uid, 'kairos_conversations', ACTIVE_THREAD_KEY)
        );
        if (!cancelled && activeSnap.exists() && (activeSnap.data().messages || []).length > 0) {
          setMessages(activeSnap.data().messages || []);
          return;
        }

        // 2. Fallback: load today's daily doc if active_thread is empty
        const todaySnap = await getDoc(
          doc(db, 'users', currentUser.uid, 'kairos_conversations', todayKey())
        );
        if (!cancelled && todaySnap.exists()) {
          const prevMessages = todaySnap.data().messages || [];
          setMessages(prevMessages);
          // Migrate to active_thread
          if (prevMessages.length > 0) {
            setDoc(
              doc(db, 'users', currentUser.uid, 'kairos_conversations', ACTIVE_THREAD_KEY),
              {
                messages: prevMessages,
                title: todaySnap.data().title || '',
                updatedAt: serverTimestamp()
              },
              { merge: true }
            ).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Could not load Miro thread:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimer.current);
    };
  }, []);

  // Keep the newest turn in view as the thread grows.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isThinking]);

  // Build journal context on-demand when sending to save CPU/memory on render
  const getContext = () =>
    (entries || [])
      .slice()
      .sort((a, b) => (toDate(b?.timestamp)?.getTime() || 0) - (toDate(a?.timestamp)?.getTime() || 0))
      .slice(0, CONTEXT_ENTRIES)
      .map((e) => ({
        day: e.day,
        pathId: e.pathId || null,
        theme: e.theme || '',
        summary: e.analysis?.summary || '',
        insights: e.analysis?.insights || [],
        spoken: !!e.isVoiceEntry,
        excerpt: (e.extractedText || e.transcription || '').substring(0, 300)
      }));

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
        doc(db, 'users', currentUser.uid, 'kairos_conversations', ACTIVE_THREAD_KEY),
        {
          messages: next.map(({ image, ...m }) => (image ? { ...m, hadImage: true } : m)),
          title: next.find((m) => m.role === 'user')?.content?.slice(0, 80) || '',
          entriesSeen: context.length,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (e) {
      console.error('Could not save the conversation:', e.message);
    }
  };

  const toggleVoiceEnabled = () => {
    hapticService.light?.();
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(VOICE_ENABLED_KEY, String(next));
      }
      if (!next && (isMiroSpeaking || textToSpeechService.isSpeaking())) {
        textToSpeechService.stop();
        setIsMiroSpeaking(false);
      }
      return next;
    });
  };

  const handleStopSpeaking = () => {
    if (isMiroSpeaking || textToSpeechService.isSpeaking()) {
      hapticService.light?.();
      textToSpeechService.stop();
      setIsMiroSpeaking(false);
    }
  };

  const startNewChat = async () => {
    if (messages.length === 0 || isThinking || isClearing) return;
    if (isMiroSpeaking || textToSpeechService.isSpeaking()) {
      textToSpeechService.stop();
      setIsMiroSpeaking(false);
    }
    if (isListening || speechRecognitionService.isListening()) {
      speechRecognitionService.cancel();
      setIsListening(false);
    }
    setIsClearing(true);
    try {
      if (currentUser) {
        // Archive current thread
        const archiveId = `archive_${Date.now()}`;
        await setDoc(
          doc(db, 'users', currentUser.uid, 'kairos_conversations', archiveId),
          {
            messages: messages.map(({ image, ...m }) => (image ? { ...m, hadImage: true } : m)),
            title: messages.find((m) => m.role === 'user')?.content?.slice(0, 80) || '',
            archivedAt: serverTimestamp()
          }
        );
        // Clear active thread
        await setDoc(
          doc(db, 'users', currentUser.uid, 'kairos_conversations', ACTIVE_THREAD_KEY),
          { messages: [], updatedAt: serverTimestamp() }
        );
      }
      setMessages([]);
      setError(null);
      setMicError(null);
      setExhausted(false);
    } catch (e) {
      console.warn('Error archiving thread:', e);
      setMessages([]);
    } finally {
      setIsClearing(false);
    }
  };

  const handleUpgrade = async () => {
    if (!currentUser) return;
    try {
      await startUpgradeProcess(currentUser.uid);
    } catch (e) {
      console.error('Failed to open upgrade:', e);
    }
  };

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

  const ask = async (textOverride) => {
    if (textToSpeechService.isSpeaking()) {
      textToSpeechService.stop();
      setIsMiroSpeaking(false);
    }
    if (speechRecognitionService.isListening()) {
      speechRecognitionService.stop();
      setIsListening(false);
    }

    const q = (typeof textOverride === 'string' ? textOverride : question).trim();
    if ((!q && !pending) || isThinking || locked || !currentUser) return;

    const outgoing = { role: 'user', content: q, at: Date.now(), ...(pending ? { image: pending } : {}) };
    const withUser = [...messages, outgoing];
    setMessages(withUser);
    setQuestion('');
    setPending(null);
    setIsThinking(true);
    setError(null);
    setMicError(null);

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

This is an ongoing conversation. You can see what has already been said in it — refer
back to it rather than restating context they have just given you.

Permission to say "I don't know" plainly when you are working from too little.
Do not invent facts about their life or journal.

They may share an image: a page of handwriting, a drawing, a photograph of
something from their day. Read it as part of what they are telling you and
connect it to their journal where it genuinely connects.

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
its place. Do not open with it, do not remark on the hour, and never
scold or congratulate them about a gap.

Answer in prose, under 200 words, second person. No preamble, no compliment
before the substance.`;

    try {
      const sent = withUser.slice(-CONTEXT_TURNS);
      const data = await callClaudeApi({
        method: 'POST',
        body: JSON.stringify({
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
      return text;
    } catch (e) {
      const isExhausted = e?.reason === 'ai-daily-allowance-exhausted';

      if (isExhausted) {
        setExhausted(true);
        setError(
          t('kairosAi.exhausted', "That's today's message. Miro is unlimited with Artisan — otherwise it picks up again tomorrow.")
        );
      } else {
        setError(
          t('kairosAi.failed', "That didn't go through. Nothing in your journal was affected — try again in a moment.")
        );
      }
      setMessages(messages);
      setQuestion(q);
      if (outgoing.image) setPending(outgoing.image);
      return null;
    } finally {
      setIsThinking(false);
    }
  };

  const handleOpenVoiceModal = useCallback(() => {
    if (locked || isThinking) return;
    hapticService.light?.();
    setIsVoiceModalOpen(true);
  }, [locked, isThinking]);

  // Global event listener to allow 1-tap voice trigger from Hero card or anywhere in app
  useEffect(() => {
    const handleGlobalVoiceOpen = () => {
      handleOpenVoiceModal();
    };
    window.addEventListener('kairos:open-voice-modal', handleGlobalVoiceOpen);
    return () => window.removeEventListener('kairos:open-voice-modal', handleGlobalVoiceOpen);
  }, [handleOpenVoiceModal]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  const formatMessageDate = (timestamp) => {
    if (!timestamp) return null;
    const d = new Date(timestamp);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return t('kairosAi.dateToday', 'Today');
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return t('kairosAi.dateYesterday', 'Yesterday');
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
      {/* Living Ambient Presence (Refined & Minimalist) */}
      <div className="kai-ambient" aria-hidden="true" />

      <div className="kai-head">
        <div className="kai-head-left">
          <div
            className="miro-orb-wrap miro-orb-clickable"
            onClick={handleOpenVoiceModal}
            title={t('miro.openVoiceChamber', "Open Voice Chamber")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenVoiceModal();
              }
            }}
          >
            <MiroMark size={34} />
          </div>
          <div className="kai-title-wrap">
            <div className="kai-title-row">
              <span className="kai-title">{t('kairosAi.title', 'Miro')}</span>
              {isArtisan && (
                <span className="kai-artisan-badge" title={t('kairosAi.artisanUnlimited', 'Artisan · Unlimited')}>
                  <Sparkles size={11} />
                  <span>Artisan</span>
                </span>
              )}
            </div>
            <span className="kai-sub">
              {hasEnough
                ? t('kairosAi.readCount', 'has read {{count}} of your entries', { count: Math.min(totalEntries, CONTEXT_ENTRIES) })
                : t('kairosAi.needMore', 'a few more entries and it can start reading')}
            </span>
          </div>
        </div>

        <div className="kai-head-actions">
          {/* Prominent 1-Tap Voice Chamber Jewel */}
          <button
            type="button"
            className="kai-voice-jewel-btn"
            onClick={handleOpenVoiceModal}
            disabled={locked || isThinking}
            title={t('miro.openVoiceChamber', 'Open Voice Chamber')}
            aria-label={t('miro.openVoiceChamber', 'Open Voice Chamber')}
          >
            <span className="kai-voice-jewel-aura" aria-hidden="true" />
            <Mic size={13} className="kai-voice-jewel-icon" />
            <span className="kai-voice-jewel-label">{t('miro.talkVoice', 'Voice Mode')}</span>
            <span className="kai-voice-jewel-eq" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
          </button>

          {messages.length > 0 && (
            <button
              className="kai-new-chat-btn"
              onClick={startNewChat}
              disabled={isThinking || isClearing}
              title={t('kairosAi.newChat', 'Start a fresh topic')}
              aria-label={t('kairosAi.newChat', 'Start a fresh topic')}
            >
              <RotateCcw size={13} />
              <span className="kai-new-chat-label">{t('kairosAi.newChatShort', 'New topic')}</span>
            </button>
          )}
        </div>
      </div>

      {messages.length > 0 ? (
        <div className="kai-thread" ref={threadRef}>
          {messages.map((m, i) => {
            const showDate =
              m.at &&
              (i === 0 ||
                !messages[i - 1].at ||
                new Date(m.at).toDateString() !== new Date(messages[i - 1].at).toDateString());

            return (
              <React.Fragment key={i}>
                {showDate && (
                  <div className="kai-date-separator">
                    <span>{formatMessageDate(m.at)}</span>
                  </div>
                )}
                <div
                  className={m.role === 'user' ? 'kai-msg kai-msg-you' : 'kai-msg kai-msg-ai'}
                >
                  {m.image && <img className="kai-msg-img" src={m.image.dataUrl} alt="" />}
                  {!m.image && m.hadImage && (
                    <span className="kai-msg-imgnote">
                      <ImagePlus size={12} />
                      {t('kairosAi.imageGone', 'image')}
                    </span>
                  )}
                  {m.content && <p className="kai-msg-text">{m.content}</p>}
                </div>
              </React.Fragment>
            );
          })}
          {isThinking && (
            <div
              className="kai-msg kai-msg-ai kai-waiting"
              role="status"
              aria-label={t('kairosAi.thinking', 'reading back through your entries…')}
            >
              <MiroThinking size={32} />
            </div>
          )}
        </div>
      ) : hasEnough ? (
        <div className="kai-starters">
          <button
            type="button"
            className="kai-starter-chip"
            onClick={() => ask(t('miro.starterPrompt1', "How have I been doing lately?"))}
            disabled={locked || isThinking}
          >
            <span>{t('miro.starterPrompt1', "How have I been doing lately?")}</span>
          </button>
          <button
            type="button"
            className="kai-starter-chip"
            onClick={() => ask(t('miro.starterPrompt2', "What themes do you notice in my journal?"))}
            disabled={locked || isThinking}
          >
            <span>{t('miro.starterPrompt2', "What themes do you notice in my journal?")}</span>
          </button>
        </div>
      ) : null}

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
          title={t('kairosAi.addImage', 'Add an image')}
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
            exhausted && !isArtisan
              ? t('kairosAi.placeholderTomorrow', 'Back tomorrow')
              : hasEnough
                ? messages.length
                  ? t('kairosAi.placeholderFollow', 'Say more…')
                  : isArtisan
                    ? t('kairosAi.placeholderArtisan', 'Talk with Miro about your journal…')
                    : t('kairosAi.placeholder', 'Ask about what you have been writing…')
                : t('kairosAi.placeholderLocked', 'Write a few entries first')
          }
        />

        {canSend ? (
          <button
            className="kai-send is-ready"
            onClick={() => ask()}
            aria-label={t('kairosAi.send', 'Send')}
          >
            <span className="kai-send-aura" aria-hidden="true" />
            <ArrowUp size={16} className="kai-send-icon" />
          </button>
        ) : (
          <button
            type="button"
            className="kai-mic-btn"
            onClick={handleOpenVoiceModal}
            disabled={locked || isThinking}
            title={t('miro.voiceTitle', 'Miro Voice')}
            aria-label={t('miro.voiceTitle', 'Miro Voice')}
          >
            <Mic size={16} className="kai-mic-icon" />
          </button>
        )}
      </div>

      {isDragging && (
        <div className="kai-drop" aria-hidden="true">
          <ImagePlus size={20} />
          {t('kairosAi.dropHere', 'Drop the image here')}
        </div>
      )}

      {exhausted && !isArtisan ? (
        <div className="kai-upgrade-prompt">
          <div className="kai-upgrade-text">
            <p className="kai-limit-title">{t('kairosAi.exhaustedTitle', 'Daily message used')}</p>
            <p className="kai-limit-desc">{t('kairosAi.exhaustedDesc', 'Free tier includes 1 message daily. Upgrade to Artisan for continuous, unlimited conversations.')}</p>
          </div>
          <button className="kai-upgrade-btn" onClick={handleUpgrade}>
            <Sparkles size={14} />
            <span>{t('kairosAi.upgradeCta', 'Upgrade to Artisan')}</span>
          </button>
        </div>
      ) : error ? (
        <p className="kai-error">{error}</p>
      ) : null}

      {/* Dedicated Spatial Glass Voice Chamber Popup (Lazy Loaded) */}
      {isVoiceModalOpen && (
        <Suspense fallback={null}>
          <MiroVoiceModal
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            messages={messages}
            onSendMessage={ask}
            isArtisan={isArtisan}
            exhausted={exhausted}
            onUpgrade={handleUpgrade}
            locked={locked}
          />
        </Suspense>
      )}
    </section>
  );
};

export default KairosAiCard;
