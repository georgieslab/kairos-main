// src/components/common/KairosAiCard.jsx
//
// Kairos AI on the Home screen — a conversation with yourself, held by
// something that has read your journal.
//
// This is the first surface of the feature and it is deliberately one exchange
// rather than a thread. The free allowance is one message a day (see
// FREE_DAILY_AI_MESSAGES in functions/index.js), so a threaded UI here would
// spend most of its life showing a locked input to the people who have not
// paid. The full conversation lives on its own screen; this is the way in, and
// for a free user it is the whole feature.
//
// It replaces the Daily Insight card that used to sit on Insights. Same idea,
// moved to where the daily habit already is.

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowUp, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { callClaudeApi, safeJsonParse } from '../../utils/apiUtils';
import { HONESTY_DIRECTIVE, getLanguageDirective } from '../../services/claudeService';
import '../../styles/components/kairosAi.css';

// Matches the cap every other history-fed generator uses. It is the reason a
// user in year eight costs the same as one in week one — see the note on
// FREE_DAILY_AI_MESSAGES.
const CONTEXT_ENTRIES = 20;

const KairosAiCard = ({ entries = [], totalEntries = 0, statistics = {} }) => {
  const { t } = useTranslation('journey');
  const { currentUser, userProfile } = useAuth();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);

  // Below a handful of entries there is nothing to reflect on, and an AI that
  // answers anyway is inventing a person. The card says so rather than
  // pretending, which is the same call the analysis prompts make.
  const hasEnough = totalEntries >= 3;

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

  const ask = async () => {
    const q = question.trim();
    if (!q || isThinking || !currentUser) return;

    setIsThinking(true);
    setError(null);

    const system = `${HONESTY_DIRECTIVE}
${getLanguageDirective()}

You are Kairos AI. The person is talking to you about their own journal, which
you have read. You are not a coach and not a cheerleader — you are closer to a
good reader of someone's work, or the friend who remembers what they said last
month.

Ground every claim in their actual entries. Quote or reference specific ones.
If their entries do not support an answer, say that plainly rather than
producing something that sounds insightful and is not about them.

Their journal (${context.length} of ${totalEntries} entries, most recent first):
${JSON.stringify(context)}

Current streak: ${statistics.currentStreak || 0} days.

Answer in prose, under 200 words, second person. No preamble, no compliment
before the substance, no closing question unless it is genuinely the next thing
worth asking.`;

    try {
      const data = await callClaudeApi({
        method: 'POST',
        body: JSON.stringify({
          // Routes this to the DAILY allowance rather than the monthly analysis
          // one. Without the flag it is metered as an analysis and would eat
          // the ten-a-month a free user needs for their actual entries.
          kairosAi: true,
          model: 'claude-sonnet-4-6',
          system,
          max_tokens: 700,
          messages: [{ role: 'user', content: q }]
        })
      });

      const text = data?.content?.[0]?.text || '';
      setAnswer({ question: q, text });
      setQuestion('');
    } catch (e) {
      // The daily gate throws resource-exhausted with a reason the UI can
      // distinguish from a genuine failure — one is a limit, the other is a
      // bug, and telling someone "try again" when they cannot is worse than
      // saying why.
      const exhausted =
        e?.details?.reason === 'ai-daily-allowance-exhausted' ||
        e?.code === 'functions/resource-exhausted';
      setError(
        exhausted
          ? t('kairosAi.exhausted', "That's today's question. Kairos AI is unlimited on a subscription — otherwise it comes back tomorrow.")
          : t('kairosAi.failed', "That didn't go through. Nothing in your journal was affected — try again in a moment.")
      );
    } finally {
      setIsThinking(false);
    }
  };

  const onKeyDown = (e) => {
    // Enter sends, Shift+Enter breaks the line. A single-line question is the
    // common case and reaching for a button for it is friction.
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

      {answer ? (
        <div className="kai-exchange">
          <p className="kai-asked">{answer.question}</p>
          <p className="kai-answer">{answer.text}</p>
          <button className="kai-again" onClick={() => setAnswer(null)}>
            <RotateCcw size={13} />
            {t('kairosAi.askAnother', 'Ask another')}
          </button>
        </div>
      ) : (
        <>
          <div className={`kai-input-row${isThinking ? ' is-thinking' : ''}`}>
            <textarea
              className="kai-input"
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={!hasEnough || isThinking}
              placeholder={
                hasEnough
                  ? t('kairosAi.placeholder', 'Ask about what you have been writing…')
                  : t('kairosAi.placeholderLocked', 'Write a few entries first')
              }
            />
            <button
              className="kai-send"
              onClick={ask}
              disabled={!hasEnough || isThinking || !question.trim()}
              aria-label={t('kairosAi.send', 'Ask')}
            >
              <ArrowUp size={16} />
            </button>
          </div>

          {isThinking && (
            <p className="kai-thinking">{t('kairosAi.thinking', 'Reading what you wrote…')}</p>
          )}
          {error && <p className="kai-error">{error}</p>}
        </>
      )}
    </section>
  );
};

export default KairosAiCard;
