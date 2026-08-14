// src/constants/pathBundles.js
// One-time-purchase path packages.
//
// A bundle is a set of exclusive paths sold as a single Stripe product. Owning
// the anchor path — by purchase or by redeeming an invite code — unlocks every
// path in that bundle, so one payment covers the package. Access is checked
// against users/{uid}.purchasedPaths, the field the Stripe webhook and
// invite-code redemption both write to.
//
// ── Adding a bundle ──────────────────────────────────────────────────────────
// 1. Add an entry to BUNDLES below. The key is the anchor path id.
// 2. Mark each path `isExclusive: true` in JourneyData.js.
// 3. Add a matching entry to EXCLUSIVE_PATH_PRODUCTS in functions/index.js
//    with the Stripe product id and the amount in cents.
// Nothing else needs touching: PathSelection, PathUnlockModal and the webhook
// all read through the helpers here.

/**
 * Every one-time-purchase package, keyed by anchor path id.
 * `paths` must include the anchor itself.
 */
export const BUNDLES = {
  'kairos-moments': {
    label: 'Kairos Moments',
    paths: ['kairos-moments', 'kairos-cards', 'kairos-sparks']
  }
};

// Kept as named exports because several modules import them directly. They are
// now derived from BUNDLES rather than declared separately, so there is one
// place to change when the package changes.
export const KAIROS_MOMENTS_ANCHOR = 'kairos-moments';
export const KAIROS_MOMENTS_PACKAGE = BUNDLES[KAIROS_MOMENTS_ANCHOR].paths;

/**
 * The anchor id for whichever bundle a path belongs to, or null if the path is
 * sold on its own.
 * @param {string} pathId
 * @returns {string|null}
 */
export const getBundleAnchor = (pathId) => {
  for (const [anchor, bundle] of Object.entries(BUNDLES)) {
    if (bundle.paths.includes(pathId)) return anchor;
  }
  return null;
};

/**
 * The path id whose Stripe product a purchase of `pathId` should actually buy.
 * Bundle members route to their anchor, so only the anchor needs a Stripe
 * product configured. A standalone exclusive path buys itself.
 * @param {string} pathId
 * @returns {string}
 */
export const getPurchaseAnchorId = (pathId) => getBundleAnchor(pathId) || pathId;

/**
 * Whether an exclusive path is unlocked given the user's purchased paths.
 * Unlocks if the user owns the path directly, or owns its bundle's anchor.
 * @param {string} pathId
 * @param {string[]} purchasedPaths
 * @returns {boolean}
 */
export const isExclusivePathUnlocked = (pathId, purchasedPaths = []) => {
  if (purchasedPaths.includes(pathId)) return true;
  const anchor = getBundleAnchor(pathId);
  return !!anchor && purchasedPaths.includes(anchor);
};

/** Whether a path belongs to any one-time-purchase bundle. */
export const isBundledPath = (pathId) => getBundleAnchor(pathId) !== null;

/** Whether a path belongs to the Kairos Moments package specifically. */
export const isKairosMomentsPackage = (pathId) =>
  getBundleAnchor(pathId) === KAIROS_MOMENTS_ANCHOR;
