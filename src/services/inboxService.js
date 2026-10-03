// src/services/inboxService.js
//
// The Kairos Sanctuary Inbox service.
// Aggregates:
//   1. Arrived Time Capsules (Letters to future self waiting to be opened)
//   2. Persistent Miro notes, reflection drops, and announcements in `users/{uid}/inbox`
//   3. Milestone scrolls (celebrating streak & journey milestones)
//
// Provides synchronous/optimistic read states, local caching, and reactive hook.

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../config/firebase';
import { isArrived, toDate } from './timeCapsuleService';
import { callClaudeApi } from '../utils/apiUtils';

const LOCAL_READ_KEY = 'kairos_inbox_read_ids';
const LOCAL_ARCHIVED_KEY = 'kairos_inbox_archived_ids';

const getLocalSet = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveLocalSet = (key, set) => {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('Could not save local set for', key, err);
  }
};

/**
 * Fetch persistent inbox items from Firestore
 */
export const getFirestoreInboxItems = async (userId) => {
  if (!userId) return [];
  try {
    const ref = collection(db, 'users', userId, 'inbox');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      isFirestore: true,
    }));
  } catch (err) {
    console.warn('Could not fetch Firestore inbox items:', err);
    return [];
  }
};

/**
 * Mark a single item as read
 */
export const markItemAsRead = async (userId, item) => {
  const readSet = getLocalSet(LOCAL_READ_KEY);
  readSet.add(item.id);
  saveLocalSet(LOCAL_READ_KEY, readSet);

  if (userId && item.isFirestore) {
    try {
      const ref = doc(db, 'users', userId, 'inbox', item.id);
      await updateDoc(ref, {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not mark inbox item as read in Firestore:', err);
    }
  }
};

/**
 * Mark all items as read
 */
export const markAllItemsAsRead = async (userId, items = []) => {
  const readSet = getLocalSet(LOCAL_READ_KEY);
  items.forEach((i) => readSet.add(i.id));
  saveLocalSet(LOCAL_READ_KEY, readSet);

  if (!userId) return;
  const firestoreItems = items.filter((i) => i.isFirestore && !i.read);
  if (!firestoreItems.length) return;

  try {
    const batch = writeBatch(db);
    firestoreItems.forEach((i) => {
      const ref = doc(db, 'users', userId, 'inbox', i.id);
      batch.update(ref, { read: true, readAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Could not batch mark inbox items as read:', err);
  }
};

/**
 * Archive / Dismiss an inbox item
 */
export const archiveInboxItem = async (userId, item) => {
  const archSet = getLocalSet(LOCAL_ARCHIVED_KEY);
  archSet.add(item.id);
  saveLocalSet(LOCAL_ARCHIVED_KEY, archSet);

  if (userId && item.isFirestore) {
    try {
      const ref = doc(db, 'users', userId, 'inbox', item.id);
      await updateDoc(ref, {
        archived: true,
        archivedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Could not archive item in Firestore:', err);
    }
  }
};

/**
 * Delete all inbox items for GDPR account deletion
 */
export const deleteAllInboxItems = async (userId) => {
  if (!userId) return;
  try {
    const ref = collection(db, 'users', userId, 'inbox');
    const snap = await getDocs(ref);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    console.warn('Could not delete all inbox items:', err);
  }
};

/**
 * Synthesizes dynamic items from local state (time capsules, streaks, milestones)
 */
export const synthesizeDynamicItems = (capsules = [], statistics = {}) => {
  const now = new Date();
  const dynamicItems = [];
  const readSet = getLocalSet(LOCAL_READ_KEY);
  const archSet = getLocalSet(LOCAL_ARCHIVED_KEY);

  // 1. Arrived Letters to Future Self
  capsules.forEach((c) => {
    if (isArrived(c, now)) {
      const isOpened = c.status === 'opened';
      const itemId = `capsule_arrived_${c.id}`;
      if (archSet.has(itemId)) return;

      const arrivedDate = toDate(c.deliverAt) || now;
      const writtenDate = toDate(c.sealedAt || c.createdAt);

      dynamicItems.push({
        id: itemId,
        type: 'capsule',
        sourceId: c.id,
        capsule: c,
        titleKey: isOpened ? 'inbox.capsuleOpenedTitle' : 'inbox.capsuleArrivedTitle',
        titleFallback: isOpened ? 'Letter from your past self (Opened)' : 'A letter from your past self has arrived',
        subtitleKey: 'inbox.capsuleArrivedSubtitle',
        subtitleFallback: 'Delivered to your quiet desk',
        previewKey: isOpened ? 'inbox.capsuleOpenedPreview' : 'inbox.capsuleArrivedPreview',
        previewFallback: isOpened
          ? 'You broke the seal and reflected with Miro. Revisit your past thoughts whenever you wish.'
          : 'Written in the past. Break the wax seal to read your words and see what Miro observed.',
        createdAt: arrivedDate,
        writtenDate,
        read: isOpened || readSet.has(itemId),
        action: {
          type: 'open_capsule',
          capsule: c,
          labelKey: isOpened ? 'inbox.revisitLetterCta' : 'inbox.breakSealCta',
          labelFallback: isOpened ? 'Revisit Letter' : 'Break Seal & Reveal',
        },
      });
    }
  });

  // 2. Streak milestones (7, 30, 100 days)
  const streak = statistics.currentStreak || 0;
  [7, 30, 100, 365].forEach((threshold) => {
    if (streak >= threshold) {
      const milestoneId = `milestone_streak_${threshold}`;
      if (archSet.has(milestoneId)) return;

      dynamicItems.push({
        id: milestoneId,
        type: 'milestone',
        threshold,
        titleKey: `inbox.streakMilestoneTitle_${threshold}`,
        titleFallback: `${threshold}-Day Flame Awakened`,
        subtitleKey: 'inbox.milestoneSubtitle',
        subtitleFallback: 'Practice Milestone',
        previewKey: `inbox.streakMilestonePreview_${threshold}`,
        previewFallback: `You have shown up for ${threshold} days of conscious journaling. Your words are weaving a tapestry of self-awareness.`,
        createdAt: new Date(), // Stays visible during active streak
        read: readSet.has(milestoneId),
        action: {
          type: 'navigate_analytics',
          labelKey: 'inbox.viewJourneyStatsCta',
          labelFallback: 'View Journey Stats',
        },
      });
    }
  });

  // 3. First entry celebration milestone
  if ((statistics.totalEntries || 0) >= 1) {
    const firstEntryId = 'milestone_first_entry';
    if (!archSet.has(firstEntryId)) {
      dynamicItems.push({
        id: firstEntryId,
        type: 'milestone',
        titleKey: 'inbox.firstEntryTitle',
        titleFallback: 'A New Journey Begins · Miro Unlocked',
        subtitleKey: 'inbox.milestoneSubtitle',
        subtitleFallback: 'Practice Milestone',
        previewKey: 'inbox.firstEntryPreview',
        previewFallback: 'You made your very first entry. Miro is listening, learning, and ready to walk beside you.',
        createdAt: new Date(),
        read: readSet.has(firstEntryId),
        action: {
          type: 'open_voice',
          labelKey: 'inbox.reflectWithMiroCta',
          labelFallback: 'Reflect with Miro',
        },
      });
    }
  }

  return dynamicItems;
};

/**
 * Custom hook to subscribe and manage the Inbox
 */
export const useInbox = (userId, capsules = [], statistics = {}) => {
  const [firestoreItems, setFirestoreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localVersion, setLocalVersion] = useState(0);

  const refreshFirestore = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const items = await getFirestoreInboxItems(userId);
      setFirestoreItems(items);
    } catch (err) {
      console.warn('useInbox fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshFirestore();
  }, [refreshFirestore]);

  // Combine Firestore items + dynamically synthesized items
  const allItems = useMemo(() => {
    // Reference localVersion to recompute on local read/archive
    void localVersion;
    const archSet = getLocalSet(LOCAL_ARCHIVED_KEY);
    const readSet = getLocalSet(LOCAL_READ_KEY);

    const dynamic = synthesizeDynamicItems(capsules, statistics);

    const activeFirestore = firestoreItems
      .filter((item) => !item.archived && !archSet.has(item.id))
      .map((item) => ({
        ...item,
        read: item.read || readSet.has(item.id),
      }));

    const combined = [...dynamic, ...activeFirestore];

    // Sort newest first
    combined.sort((a, b) => {
      const tA = toDate(a.createdAt)?.getTime() || 0;
      const tB = toDate(b.createdAt)?.getTime() || 0;
      return tB - tA;
    });

    return combined;
  }, [capsules, statistics, firestoreItems, localVersion]);

  const unreadCount = useMemo(() => {
    return allItems.filter((i) => !i.read).length;
  }, [allItems]);

  const markAsRead = useCallback(async (item) => {
    await markItemAsRead(userId, item);
    setLocalVersion((v) => v + 1);
  }, [userId]);

  const markAllAsRead = useCallback(async () => {
    await markAllItemsAsRead(userId, allItems);
    setLocalVersion((v) => v + 1);
  }, [userId, allItems]);

  const archiveItem = useCallback(async (item) => {
    await archiveInboxItem(userId, item);
    setLocalVersion((v) => v + 1);
  }, [userId]);

  return {
    items: allItems,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveItem,
    loading,
    refresh: refreshFirestore,
  };
};

/**
 * Send an inbox message to a specific user
 */
export const sendInboxMessage = async (targetUserId, messageData) => {
  if (!targetUserId) throw new Error('Target user ID is required');
  if (!messageData || !messageData.title) throw new Error('Message title is required');

  const ref = collection(db, 'users', targetUserId, 'inbox');
  const payload = {
    title: messageData.title.trim(),
    subtitle: messageData.subtitle?.trim() || '',
    preview: messageData.preview?.trim() || messageData.body?.slice(0, 140)?.trim() || '',
    body: messageData.body?.trim() || '',
    type: messageData.type || 'whisper', // 'whisper' | 'miro_note' | 'capsule' | 'milestone' | 'user_note'
    author: messageData.author || 'Miro',
    createdAt: serverTimestamp(),
    read: false,
    archived: false,
    ...(messageData.action ? { action: messageData.action } : {}),
    ...(messageData.metadata ? { metadata: messageData.metadata } : {}),
  };

  const newDoc = await addDoc(ref, payload);
  return { id: newDoc.id, ...payload };
};

/**
 * Broadcast an inbox message to all users via Cloud Function (with local preview fallback)
 */
export const broadcastInboxMessage = async (messageData, fallbackUserId) => {
  if (!messageData || !messageData.title) throw new Error('Message title is required');

  try {
    const functions = getFunctions();
    const sendFn = httpsCallable(functions, 'sendInboxMessage');
    const res = await sendFn({ broadcast: true, message: messageData });
    return res.data;
  } catch (err) {
    console.warn(
      'Cloud Function sendInboxMessage failed or is not yet deployed on Firebase Cloud Functions:',
      err.message || err
    );

    // If fallback user ID is available, save to their own inbox so the note is immediately visible
    if (fallbackUserId) {
      console.log('Delivering broadcast note to current user inbox as preview...');
      await sendInboxMessage(fallbackUserId, messageData);
      return {
        success: true,
        count: 1,
        fallbackToSelf: true,
        message: 'Delivered to your Sanctuary Inbox as a preview.'
      };
    }

    throw new Error(
      'Cloud Function sendInboxMessage is not yet deployed. Please select "Myself (Test)" to test.'
    );
  }
};

/**
 * Send a personal contemplative note to Miro in the inbox and receive Miro's thoughtful reflection
 */
export const sendNoteToMiro = async (userId, { title, text, askMiro = true }) => {
  if (!userId) throw new Error('User ID is required');
  if (!text || !text.trim()) throw new Error('Note text is required');

  const noteTitle = (title || 'Personal Reflection').trim();
  const noteBody = text.trim();

  // 1. Save user's note to their inbox
  const userNote = await sendInboxMessage(userId, {
    title: noteTitle,
    subtitle: 'Note from you',
    preview: noteBody.slice(0, 140),
    body: noteBody,
    type: 'user_note',
    author: 'You',
  });

  // 2. If askMiro is true, generate Miro's reflection response note
  if (askMiro) {
    try {
      const response = await callClaudeApi({
        method: 'POST',
        body: JSON.stringify({
          system: 'You are Miro, an empathetic and honest reflection companion in Kairos. The user has left a personal contemplative note in their sanctuary inbox. Write a thoughtful, grounded reflection note (1-2 short paragraphs, under 140 words) acknowledging their words, pointing out an honest observation, and offering a gentle question. Plain language, no excessive praise.',
          messages: [{ role: 'user', content: `The user wrote this note in their inbox:\n\nTitle: "${noteTitle}"\nNote: "${noteBody}"` }],
          max_tokens: 400
        })
      });

      const replyText = response?.content?.[0]?.text;
      if (replyText) {
        await sendInboxMessage(userId, {
          title: `Reflection on: ${noteTitle}`,
          subtitle: 'Miro’s Observation',
          preview: replyText.slice(0, 140),
          body: replyText,
          type: 'miro_note',
          author: 'Miro',
          action: {
            type: 'open_voice',
            labelKey: 'inbox.reflectWithMiroCta',
            labelFallback: 'Reflect in Voice'
          }
        });
      }
    } catch (aiErr) {
      console.warn('Could not generate Miro reply to user note:', aiErr);
    }
  }

  return userNote;
};

export default {
  getFirestoreInboxItems,
  markItemAsRead,
  markAllItemsAsRead,
  archiveInboxItem,
  deleteAllInboxItems,
  synthesizeDynamicItems,
  sendInboxMessage,
  broadcastInboxMessage,
  sendNoteToMiro,
  useInbox,
};
