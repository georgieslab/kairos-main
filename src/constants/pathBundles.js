// src/constants/pathBundles.js
// Paths bundled into the Kairos Moments one-time-purchase package. Owning (or
// redeeming an invite code for) the anchor 'kairos-moments' unlocks every path
// listed here, and buying any bundle member purchases the single Kairos
// Moments Stripe product — so one €2.99 payment covers the whole package.
// Access is checked against users/{uid}.purchasedPaths, the same field the
// Stripe webhook and invite-code redemption both write to.

export const KAIROS_MOMENTS_ANCHOR = 'kairos-moments';

export const KAIROS_MOMENTS_PACKAGE = ['kairos-moments', 'kairos-cards', 'kairos-sparks'];

/**
 * The path id whose Stripe product a purchase of `pathId` should actually buy.
 * Every bundle member routes to the single Kairos Moments product, so no
 * separate Stripe price needs configuring for the other paths in the package.
 * @param {string} pathId
 * @returns {string}
 */
export const getPurchaseAnchorId = (pathId) =>
  KAIROS_MOMENTS_PACKAGE.includes(pathId) ? KAIROS_MOMENTS_ANCHOR : pathId;

/**
 * Whether an exclusive path is unlocked given the user's purchased paths.
 * A bundle member unlocks if the user owns it directly OR owns the anchor.
 * @param {string} pathId
 * @param {string[]} purchasedPaths
 * @returns {boolean}
 */
export const isExclusivePathUnlocked = (pathId, purchasedPaths = []) => {
  if (purchasedPaths.includes(pathId)) return true;
  if (KAIROS_MOMENTS_PACKAGE.includes(pathId) && purchasedPaths.includes(KAIROS_MOMENTS_ANCHOR)) {
    return true;
  }
  return false;
};

/** Whether a path belongs to the Kairos Moments package. */
export const isKairosMomentsPackage = (pathId) => KAIROS_MOMENTS_PACKAGE.includes(pathId);
