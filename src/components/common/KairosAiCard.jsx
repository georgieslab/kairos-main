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

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowUp } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { callClaudeApi } from '../../utils/apiUtils';
import { HONESTY_DIRECTIVE, getLanguageDirective } from '../../services/claudeService';
import '../../styles/components/kairosAi.css';

// Matches the cap every other history-fed generator uses. It is the reason a
// user in year eight costs the same as one in week one.
const CONTEXT_ENTRIES = 20;

// How much of the conversation is resent each turn. Every turn resends the
// thread, so without a ceiling turn 40 costs several times turn 1 — the same
// compounding the slice() caps exist to prevent elsewhere. Ten exchanges is
// well past the point where a thread is still about one thing.
const CONTEXT_TURNS = 20;

const todayKey = () => new Date().toISOString().slice(0, 10);

const KairosAiCard = ({ entries = [], totalEntries = 0, statistics = {} }) => {
  const { t } = useTranslation('journey');
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState([]);   // { role: 'user'|'assistant', content }
  const [question, setQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [exhausted, setExhausted] = useState(false);
  const threadRef = useRef(null);

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

  // Keep the newest turn in view as the thread grows.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isThinking]);

  const context = useMemo(
    () =>
      (entries || []).slice(0, CONTEXT_ENTRIES).map((e) => ({
        day: e.day,
        pathId: e.pathId || null,
        theme: e.theme || '',
        summary: e.analysis?.summary || '',
        insights: e.analysis?.insights || [],
        excerpt: e.extractedText ? e.extractedText.substring(0, 300) : ''
      })),
    [entries]
  );

  const persist = async (next) => {
    if (!currentUser) return;
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid, 'kairos_conversations', todayKey()),
        {
          messages: next,
          // The first thing asked, for a conversation list to label this with.
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

  const ask = async () => {
    const q = question.trim();
    if (!q || isThinking || locked || !currentUser) return;

    const withUser = [...messages, { role: 'user', content: q }];
    setMessages(withUser);
    setQuestion('');
    setIsThinking(true);
    setError(null);

    const system = `${HONESTY_DIRECTIVE}
${getLanguageDirective()}

You are Kairos AI. The person is talking to you about their own journal, which
you have read. You are not a coach and not a cheerleader — you are closer to a
good reader of someone's work, or the friend who remembers what they said last
month.

Ground every claim in their actual entries. Quote or reference specific ones.
If their entries do not support an answer, say so plainly rather than producing
something that sounds insightful and is not about them.

This is a conversation. You can see what has already been said in it — refer
back to it rather than restating context they have just given you.

Their journal (${context.length} of ${totalEntries} entries, most recent first):
${JSON.stringify(context)}

Current streak: ${statistics.currentStreak || 0} days.

Answer in prose, under 200 words, second person. No preamble, no compliment
before the substance.`;

    try {
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
          // Only the tail of the thread. See CONTEXT_TURNS.
          messages: withUser.slice(-CONTEXT_TURNS).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const text = data?.content?.[0]?.text || '';
      const next = [...withUser, { role: 'assistant', content: text }];
      setMessages(next);
      persist(next);
    } catch (e) {
      // apiUtils rewrites the raw callable error, so this matches what it
      // actually throws: the generic allowance code, narrowed by .reason.
      const isExhausted = e?.reason === 'ai-daily-allowance-exhausted';

      if (isExhausted) {
        setExhausted(true);
        setError(
          t('kairosAi.exhausted', "That's today's message. Kairos AI is unlimited on a subscription — otherwise it picks up again tomorrow.")
        );
      } else {
        setError(
          t('kairosAi.failed', "That didn't go through. Nothing in your journal was affected — try again in a moment.")
        );
      }
      // Take the unanswered question back out of the thread rather than
      // leaving it sitting there as though it were asked and ignored.
      setMessages(messages);
      setQuestion(q);
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

  return (
    <section className="kai-card" aria-label={t('kairosAi.title', 'Kairos AI')}>
      <div className="kai-head">
        <span className="kai-halo" aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <span className="kai-title">{t('kairosAi.title', 'Kairos AI')}</span>
        <span className="kai-sub">
          {hasEnough
            ? t('kairosAi.readCount', 'has read {{count}} of your entries', { count: Math.min(totalEntries, CONTEXT_ENTRIES) })
            : t('kairosAi.needMore', 'a few more entries and it can start reading')}
        </span>
      </div>

      {messages.length > 0 && (
        <div className="kai-thread" ref={threadRef}>
          {messages.map((m, i) => (
            <p key={i} className={m.role === 'user' ? 'kai-msg kai-msg-you' : 'kai-msg kai-msg-ai'}>
              {m.content}
            </p>
          ))}
          {isThinking && (
            <p className="kai-msg kai-msg-ai kai-typing" aria-live="polite">
              <span /><span /><span />
            </p>
          )}
        </div>
      )}

      <div className={`kai-input-row${isThinking ? ' is-thinking' : ''}`}>
        <textarea
          className="kai-input"
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
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
          disabled={locked || isThinking || !question.trim()}
          aria-label={t('kairosAi.send', 'Send')}
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {error && <p className={exhausted ? 'kai-limit' : 'kai-error'}>{error}</p>}
    </section>
  );
};

export default KairosAiCard;
