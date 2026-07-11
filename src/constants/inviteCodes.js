// src/constants/inviteCodes.js
// Invite codes for exclusive one-time-purchase paths. Redeeming a code adds
// the listed path ids to users/{uid}.purchasedPaths — same field the Stripe
// webhook writes, so code-unlocked and paid paths behave identically.
// Codes are matched case-insensitively with surrounding whitespace ignored.

export const INVITE_CODES = {
  HALFBOYHALFGIRL: ['kairos-moments']
};

/** Normalize user input and return the path ids the code unlocks, or null. */
export const resolveInviteCode = (rawCode) => {
  const code = (rawCode || '').trim().toUpperCase();
  return INVITE_CODES[code] || null;
};
