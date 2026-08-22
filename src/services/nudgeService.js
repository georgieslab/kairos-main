// src/services/nudgeService.js
//
// The two-day nudge: if you have not written in a while, the app says so once,
// gently, and then leaves you alone.
//
// This is a LOCAL notification, scheduled on the device. There is no server
// and no push token — the app works out when the reminder should fire and
// hands it to Android, which delivers it whether or not the app is running.
// The cost of that is reach: this does nothing on the web, and nothing at all
// once the app is uninstalled. It is also the reason it needs no key and no
// scheduled function.
//
// The model is deliberately "one pending reminder, always rebuilt from the
// last entry date" rather than "schedule one each time something happens".
// Anything incremental drifts: a missed cancel leaves a reminder that fires
// after you have already written, which is the single worst thing this feature
// can do. Rebuilding from scratch on every trigger means the pending
// notification is always a pure function of when you last wrote.

import { Capacitor } from '@capacitor/core';

// Fires at this hour, local time. A reminder that arrives at 04:00 because
// that is when the 48 hours happened to elapse is worse than no reminder.
const NUDGE_HOUR = 19;

// Days of silence before it fires.
const QUIET_DAYS = 2;

// One fixed id, so scheduling always replaces rather than accumulates. Even if
// a cancel is missed, there can only ever be one of these outstanding.
const NUDGE_ID = 4820;

export const canNudge = () => Capacitor.isNativePlatform();

// Loaded lazily for the same reason @capacitor/browser is in checkoutLauncher:
// a static import pulls the plugin into Vite's graph on first render and
// re-triggers dependency optimization, killing in-flight requests with a 504.
const plugin = async () => {
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return LocalNotifications;
};

/**
 * Asks once. Android 13+ requires the runtime grant; older versions return
 * granted without prompting. A refusal is final and is not re-asked, because
 * the only thing worse than a nagging app is one that nags about nagging.
 */
export const requestNudgePermission = async () => {
  if (!canNudge()) return false;
  try {
    const LocalNotifications = await plugin();
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;
    if (current.display === 'denied') return false;
    const asked = await LocalNotifications.requestPermissions();
    return asked.display === 'granted';
  } catch (e) {
    console.warn('Notification permission unavailable:', e.message);
    return false;
  }
};

/**
 * When the reminder should land, given the last time they wrote.
 *
 * Exported for its own sake: this is the part worth testing, and it is pure.
 * `now` is injectable so the tests are not at the mercy of the clock.
 */
export const nextNudgeAt = (lastWroteAt, now = new Date()) => {
  const base = lastWroteAt ? new Date(lastWroteAt) : new Date(now);
  if (isNaN(base.getTime())) return null;

  // QUIET_DAYS after they last wrote, moved to a civil hour.
  const target = new Date(base);
  target.setDate(target.getDate() + QUIET_DAYS);
  target.setHours(NUDGE_HOUR, 0, 0, 0);

  // Already dormant — someone who has not written in three weeks should not
  // get a notification dated three weeks ago the moment they open the app, and
  // should not get one this second either. Next civil hour instead.
  if (target <= now) {
    const soon = new Date(now);
    soon.setHours(NUDGE_HOUR, 0, 0, 0);
    if (soon <= now) soon.setDate(soon.getDate() + 1);
    return soon;
  }
  return target;
};

/**
 * Rebuilds the single pending reminder from when they last wrote. Safe to call
 * as often as you like — on launch, on resume, after saving an entry — and
 * calling it more often is the intended way to keep it correct.
 */
export const scheduleNudge = async (lastWroteAt, text) => {
  if (!canNudge()) return false;
  try {
    const LocalNotifications = await plugin();

    // Permission may have been granted in a previous session; only ask if it
    // has genuinely never been answered.
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') return false;

    // Always clear first. The pending reminder is derived state, and stale
    // derived state here means a notification that fires after they wrote.
    await LocalNotifications.cancel({ notifications: [{ id: NUDGE_ID }] });

    const at = nextNudgeAt(lastWroteAt);
    if (!at) return false;

    await LocalNotifications.schedule({
      notifications: [{
        id: NUDGE_ID,
        title: text?.title || 'Kairos',
        body: text?.body || 'The page is still open, whenever you want it.',
        // allowWhileIdle gets it past Doze, which is exactly the state a
        // phone is in after two days of not being used for this.
        schedule: { at, allowWhileIdle: true },
      }],
    });
    return true;
  } catch (e) {
    // A reminder that cannot be scheduled is not worth surfacing to the user —
    // nothing they did failed, and there is nothing for them to do about it.
    console.warn('Could not schedule the nudge:', e.message);
    return false;
  }
};

/** Drops the pending reminder entirely. */
export const clearNudge = async () => {
  if (!canNudge()) return;
  try {
    const LocalNotifications = await plugin();
    await LocalNotifications.cancel({ notifications: [{ id: NUDGE_ID }] });
  } catch {
    // Nothing pending, or the plugin is unavailable. Either way there is no
    // reminder outstanding, which is the state we wanted.
  }
};
