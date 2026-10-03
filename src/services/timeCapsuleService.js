// src/services/timeCapsuleService.js
//
// Letters to your future self.
//
// A letter is written now, sealed, and delivered back after 30, 90 or 365
// days. Until then the app will not show its contents — deleting is allowed,
// reading early is not. Sealing is the whole point: a letter you can reread
// any time is just another note.
//
// On first open, Miro adds a short note comparing "then" (summaries of the
// entries written just before sealing, captured into the letter itself) with
// "now" (everything written since). The note is generated once and stored, so
// reopening a letter never costs another model call.
//
// Storage: users/{uid}/time_capsules/{id}. Covered by the existing
// owner-only rule on users/{uid}/{subcollection=**} — no rules change needed.

import { Capacitor } from '@capacitor/core';
import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, Timestamp, serverTimestamp, writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { callClaudeApi } from '../utils/apiUtils';
import { HONESTY_DIRECTIVE, getLanguageDirective } from './claudeService';

export const HORIZONS = [30, 90, 365];

// Dev-only: a 1-minute "horizon" so the full seal → notify → open path can be
// exercised locally without waiting a month. Never offered in production.
export const DEV_HORIZON_MINUTES = 1;
export const devHorizonAvailable = () => Boolean(import.meta.env?.DEV);

// Letters land at a civil hour, not at whatever minute they were sealed.
const DELIVERY_HOUR = 9;

const SNAPSHOT_SIZE = 5;
const SINCE_LIMIT = 25;
const MAX_BODY = 8000;

const capsulesRef = (uid) => collection(db, 'users', uid, 'time_capsules');

// Entry timestamps arrive as Firestore Timestamps, {seconds}, or plain dates.
export const toDate = (ts) => {
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

/** When a letter sealed at `from` with `horizon` should arrive. Pure. */
export const computeDeliverAt = (horizon, from = new Date()) => {
  if (horizon === 'dev') {
    return new Date(from.getTime() + DEV_HORIZON_MINUTES * 60 * 1000);
  }
  const d = new Date(from);
  d.setDate(d.getDate() + horizon);
  d.setHours(DELIVERY_HOUR, 0, 0, 0);
  return d;
};

export const isArrived = (capsule, now = new Date()) => {
  const at = toDate(capsule?.deliverAt);
  return !!at && at <= now;
};

/** Whole calendar days until a date (0 = today). */
export const daysUntil = (date, now = new Date()) => {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.round((b - a) / 86400000));
};

const summarize = (e) => ({
  day: e.day ?? null,
  pathId: e.pathId || null,
  summary: (e.analysis?.summary || e.transcription || e.extractedText || '').substring(0, 280)
});

const byNewest = (a, b) =>
  (toDate(b?.timestamp)?.getTime() || 0) - (toDate(a?.timestamp)?.getTime() || 0);

// ---------------------------------------------------------------------------
// Notifications (native only)
// ---------------------------------------------------------------------------

// Loaded lazily, same reason as nudgeService: a static import re-triggers
// Vite dependency optimisation on first render.
const notificationsPlugin = async () => {
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return LocalNotifications;
};

// Stable 31-bit id derived from the capsule id, kept clear of the nudge id
// (4820) by living in its own range.
const notificationId = (capsuleId) => {
  let h = 0;
  for (let i = 0; i < capsuleId.length; i++) {
    h = (h * 31 + capsuleId.charCodeAt(i)) | 0;
  }
  return 100000 + (Math.abs(h) % 900000000);
};

const scheduleArrival = async (capsuleId, deliverAt, text) => {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const LocalNotifications = await notificationsPlugin();
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display === 'prompt' || perm.display === 'prompt-with-rationale') {
      perm = await LocalNotifications.requestPermissions();
    }
    if (perm.display !== 'granted') return false;
    await LocalNotifications.schedule({
      notifications: [{
        id: notificationId(capsuleId),
        title: text?.title || 'Kairos',
        body: text?.body || 'A letter from your past self has arrived.',
        schedule: { at: deliverAt, allowWhileIdle: true }
      }]
    });
    return true;
  } catch (e) {
    console.warn('Could not schedule letter arrival:', e.message);
    return false;
  }
};

const cancelArrival = async (capsuleId) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const LocalNotifications = await notificationsPlugin();
    await LocalNotifications.cancel({ notifications: [{ id: notificationId(capsuleId) }] });
  } catch {
    // Nothing pending — the state we wanted.
  }
};

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export const listCapsules = async (uid) => {
  const snap = await getDocs(query(capsulesRef(uid), orderBy('deliverAt', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Seals a letter. `entries` are the user's current entries; the most recent
 * few are frozen into the letter as the "then" snapshot for Miro's note.
 */
export const sealCapsule = async (uid, { body, horizon, entries = [], notificationText }) => {
  const text = (body || '').trim().slice(0, MAX_BODY);
  if (!text) throw new Error('empty-letter');
  if (horizon !== 'dev' && !HORIZONS.includes(horizon)) throw new Error('bad-horizon');
  if (horizon === 'dev' && !devHorizonAvailable()) throw new Error('bad-horizon');

  const now = new Date();
  const deliverAt = computeDeliverAt(horizon, now);
  const snapshot = [...entries].sort(byNewest).slice(0, SNAPSHOT_SIZE).map(summarize);

  const ref = await addDoc(capsulesRef(uid), {
    body: text,
    horizonDays: horizon === 'dev' ? 0 : horizon,
    createdAt: serverTimestamp(),
    sealedAt: Timestamp.fromDate(now),
    deliverAt: Timestamp.fromDate(deliverAt),
    snapshot,
    entryCountAtSealing: entries.length,
    status: 'sealed',
    openedAt: null,
    miroNote: null
  });

  await scheduleArrival(ref.id, deliverAt, notificationText);
  return { id: ref.id, deliverAt };
};

export const deleteCapsule = async (uid, capsuleId) => {
  await cancelArrival(capsuleId);
  await deleteDoc(doc(db, 'users', uid, 'time_capsules', capsuleId));
};

/** Used by account deletion: removes every letter and pending notification. */
export const deleteAllCapsules = async (uid) => {
  const snap = await getDocs(capsulesRef(uid));
  if (snap.empty) return 0;
  await Promise.all(snap.docs.map((d) => cancelArrival(d.id)));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return snap.size;
};

/** Marks an arrived letter as opened. Refuses to open one that hasn't arrived. */
export const markOpened = async (uid, capsule) => {
  if (!isArrived(capsule)) throw new Error('not-arrived');
  if (capsule.status === 'opened') return capsule;
  await updateDoc(doc(db, 'users', uid, 'time_capsules', capsule.id), {
    status: 'opened',
    openedAt: serverTimestamp()
  });
  return { ...capsule, status: 'opened', openedAt: new Date() };
};

// ---------------------------------------------------------------------------
// Miro's note
// ---------------------------------------------------------------------------

/**
 * Generates (once) and stores Miro's note on what changed between sealing and
 * now. Returns the existing note if there already is one.
 */
export const generateMiroNote = async (uid, capsule, entries = []) => {
  if (capsule.miroNote) return capsule.miroNote;
  if (!isArrived(capsule)) throw new Error('not-arrived');

  const sealedAt = toDate(capsule.sealedAt) || toDate(capsule.createdAt);
  const since = [...entries]
    .filter((e) => {
      const d = toDate(e.timestamp);
      return d && sealedAt && d > sealedAt;
    })
    .sort(byNewest)
    .slice(0, SINCE_LIMIT)
    .map(summarize);

  const sealedLabel = sealedAt
    ? sealedAt.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : 'some time ago';

  const system = `${HONESTY_DIRECTIVE}
${getLanguageDirective({ json: false })}

You are Miro. On ${sealedLabel} this person wrote a sealed letter to their
future self. Today it was delivered and they have just read it. You are adding
a short note underneath it.

Your job: say what actually changed between then and now, and what did not.
Ground everything in the material below — the letter, the entries they wrote in
the days before sealing it ("then"), and the entries since ("now").

- If something they hoped for or worried about in the letter shows up in later
  entries, name it specifically.
- If something they said they would change has not changed, say so plainly and
  without judgement. That is as useful as progress.
- If there are few or no entries since, say that honestly. Do not invent a
  journey they have not written.
- Do not summarise the letter back to them. They just read it.
- No congratulations on the passage of time, no "look how far you've come"
  unless the entries genuinely show it.

Speak directly to them, second person, plain prose, under 150 words. No
heading, no sign-off.

THE LETTER:
${capsule.body}

THEN (${capsule.snapshot?.length || 0} entries before sealing, newest first):
${JSON.stringify(capsule.snapshot || [])}

NOW (${since.length} entries written since sealing, newest first):
${JSON.stringify(since)}`;

  const data = await callClaudeApi({
    method: 'POST',
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      system,
      max_tokens: 500,
      temperature: 0.7,
      messages: [{ role: 'user', content: 'I just opened the letter.' }]
    })
  });

  const note = (data?.content?.[0]?.text || '').trim();
  if (!note) throw new Error('empty-note');

  await updateDoc(doc(db, 'users', uid, 'time_capsules', capsule.id), {
    miroNote: note,
    miroNoteAt: serverTimestamp(),
    entriesSinceAtOpen: since.length
  });
  return note;
};
