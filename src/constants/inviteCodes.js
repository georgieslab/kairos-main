// src/constants/inviteCodes.js
// Promo & invite codes for exclusive one-time-purchase paths. Redeeming a code adds
// the listed path ids to users/{uid}.purchasedPaths — same field the Stripe
// webhook writes, so code-unlocked and paid paths behave identically.
// Codes are matched case-insensitively with surrounding whitespace, hyphens, and underscores ignored.

import { KAIROS_MOMENTS_PACKAGE, BUNDLES, getPurchaseAnchorId } from './pathBundles';

export const STARTING_OVER_PACKAGE = BUNDLES['starting-over']?.paths || [
  'starting-over',
  'learning-to-speak',
  'two-homes'
];

export const INVITE_CODES = {
  // Unlocks Kairos Moments package (Moments + Cards + Sparks) and Starting Over package (The Crossing + Learning to Speak + Two Homes).
  HALFBOYHALFGIRL: [...KAIROS_MOMENTS_PACKAGE, ...STARTING_OVER_PACKAGE]
};

export const SUBSCRIPTION_PROMO_CODES = {
  // 30 days of full Artisan tier subscription
  HALFJOURNAL2026: {
    code: 'HalfJournal2026',
    tier: 'artisan',
    days: 30,
    title: '30 Days Artisan Access'
  }
};

/** Normalize user input and return the path ids the code unlocks, or null. */
export const resolveInviteCode = (rawCode) => {
  if (!rawCode) return null;
  // Normalize: uppercase, remove spaces, dashes, and underscores
  const code = rawCode.trim().toUpperCase().replace(/[\s\-_]/g, '');
  return INVITE_CODES[code] || null;
};

/** Normalize user input and return the subscription promo details, or null. */
export const resolveSubscriptionPromoCode = (rawCode) => {
  if (!rawCode) return null;
  const code = rawCode.trim().toUpperCase().replace(/[\s\-_]/g, '');
  return SUBSCRIPTION_PROMO_CODES[code] || null;
};

/**
 * Returns true if there is at least one active promo/invite code that unlocks this path.
 * Used by PathUnlockModal to only offer the promo code input for paths that actually have codes.
 */
export const hasInviteCodeForPath = (pathId) => {
  if (!pathId) return false;
  const anchorId = getPurchaseAnchorId(pathId);
  return Object.values(INVITE_CODES).some(
    (unlockedIds) =>
      Array.isArray(unlockedIds) &&
      (unlockedIds.includes(pathId) || (anchorId && unlockedIds.includes(anchorId)))
  );
};
