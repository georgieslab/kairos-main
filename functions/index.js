// functions/index.js - FIXED: Handles undefined values properly

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");
const cors = require('cors')({ origin: true });
const fetch = require('node-fetch');
const FormData = require('form-data');
// Every credential this file needs now comes from Secret Manager. The old
// functions.config() / Runtime Config service is retired: deploys that rely on
// it fail once it shuts down, so nothing here reads it any more.
//
// Set or rotate a value with:
//   firebase functions:secrets:set STRIPE_SECRET_KEY
//
// A secret is only readable by a function that declares it in
// .runWith({ secrets: [...] }) — that binding is not optional. Omitting it
// makes .value() return undefined at runtime, which the build cannot catch.
const { defineSecret } = require("firebase-functions/params");
const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Free-plan AI allowance, per calendar month (UTC).
 *
 * The free tier used to gate journey paths, which cost nothing to serve — the
 * prompts are written and translated once — while leaving AI analysis, the
 * only thing with a real per-use cost, completely unmetered. A free account
 * journalling daily ran to roughly EUR 10 a year of API spend indefinitely.
 * This meters the expensive half instead.
 *
 * 10 is above the 5-7 entries that generateProgressReport says are needed
 * before patterns become visible, so the free plan can still demonstrate the
 * thing being sold.
 */
const FREE_MONTHLY_ANALYSES = 10;

/**
 * Kairos AI is a conversation, and a conversation is the first unbounded thing
 * in this app. Every other AI feature is capped somewhere — analyses cap
 * history at slice(0, 20), the daily question capped itself at one per day —
 * which is why a user in year eight costs the same as one in week one.
 *
 * A thread has no such ceiling: turns are unlimited AND each turn resends the
 * whole thread, so cost rises as the conversation goes on. On sonnet-4-6 a
 * ten-turn thread is roughly $0.27, and a user having five a week is ~$70/year.
 * That is fine against a 9.99/month subscription and ruinous against nothing,
 * so the free tier keeps the gate the daily question already had: one exchange
 * per day.
 */
const FREE_DAILY_AI_MESSAGES = 1;

/**
 * True when a subscription grants Artisan access right now.
 *
 * Expiry was previously unenforced anywhere: the client's hasArtisanAccess
 * looked only at status, and validateSubscriptionData — the one function that
 * did compare currentPeriodEnd against the clock — was never called. Journal
 * bundles therefore never actually ran out, whatever tierMonths said.
 * A null currentPeriodEnd means no expiry (the Legacy grant).
 */
function hasActiveArtisan(subscription) {
  if (!subscription) return false;
  if (!['active', 'trialing'].includes(subscription.status)) return false;
  const end = subscription.currentPeriodEnd;
  if (!end) return true;
  const endDate = end.toDate ? end.toDate() : new Date(end);
  return endDate > new Date();
}

/**
 * Vision requests carry the photographed page for transcription. They are not
 * metered on their own: a transcription is useless without the analysis that
 * follows, and charging for both would make a handwritten entry cost twice
 * what a typed one does — on the app's core flow.
 */
function isVisionRequest(body) {
  return (body.messages || []).some(
    (m) =>
      Array.isArray(m.content) &&
      m.content.some((c) => c && c.type === 'image')
  );
}

/**
 * A Kairos AI turn, flagged by the client rather than sniffed from the payload.
 * Sniffing would be guesswork — a conversation turn and an analysis are both
 * just messages — and guessing wrong in either direction is bad: an analysis
 * charged against the daily gate locks someone out of the app's core flow, and
 * a conversation charged against the monthly one exhausts it in ten turns.
 */
function isKairosAiRequest(body) {
  return body && body.kairosAi === true;
}

/**
 * Reserves one unit of the free DAILY Kairos AI allowance. Same transaction
 * shape as the monthly reservation, and a separate counter: the two limits
 * measure different things and must not draw down each other.
 */
async function reserveDailyAiMessage(uid) {
  const userRef = db.collection('users').doc(uid);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() : {};

    if (hasActiveArtisan(data.subscription)) return { metered: false };
    // An invite code grants the same unmetered access a subscription does.
    if (data.kairosAiAccess === true) return { metered: false };

    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC
    const usage = data.aiChatUsage || {};
    const used = usage.day === day ? usage.count || 0 : 0;

    if (used >= FREE_DAILY_AI_MESSAGES) {
      return { metered: true, exhausted: true, used, limit: FREE_DAILY_AI_MESSAGES };
    }

    tx.set(userRef, { aiChatUsage: { day, count: used + 1 } }, { merge: true });
    return { metered: true, exhausted: false, used: used + 1, limit: FREE_DAILY_AI_MESSAGES };
  });
}

/** Hands back a reserved AI turn when the Claude call itself fails. */
async function releaseDailyAiMessage(uid) {
  const userRef = db.collection('users').doc(uid);
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const data = snap.exists ? snap.data() : {};
      const day = new Date().toISOString().slice(0, 10);
      const usage = data.aiChatUsage || {};
      if (usage.day !== day || !usage.count) return;
      tx.set(userRef, { aiChatUsage: { day, count: usage.count - 1 } }, { merge: true });
    });
  } catch (e) {
    console.error('Could not release AI turn:', e.message);
  }
}

/**
 * Reserves one unit of the free monthly allowance. Runs in a transaction so
 * simultaneous requests cannot both read the same count and overshoot.
 * Returns { metered: false } for subscribers, who are not counted at all.
 */
async function reserveFreeAnalysis(uid) {
  const userRef = db.collection('users').doc(uid);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() : {};

    if (hasActiveArtisan(data.subscription)) return { metered: false };

    const period = new Date().toISOString().slice(0, 7); // YYYY-MM, UTC
    const usage = data.aiUsage || {};
    const used = usage.period === period ? usage.count || 0 : 0;

    if (used >= FREE_MONTHLY_ANALYSES) {
      return { metered: true, exhausted: true, used, limit: FREE_MONTHLY_ANALYSES };
    }

    tx.set(userRef, { aiUsage: { period, count: used + 1 } }, { merge: true });
    return { metered: true, exhausted: false, used: used + 1, limit: FREE_MONTHLY_ANALYSES };
  });
}

/** Hands a reserved unit back when the Claude call itself fails. */
async function releaseFreeAnalysis(uid) {
  const userRef = db.collection('users').doc(uid);
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) return;
      const usage = snap.data().aiUsage || {};
      const period = new Date().toISOString().slice(0, 7);
      if (usage.period !== period || !usage.count) return;
      tx.set(userRef, { aiUsage: { period, count: usage.count - 1 } }, { merge: true });
    });
  } catch (err) {
    // Never let a refund failure mask the original error the user is seeing.
    console.error('⚠️ could not release AI allowance:', err);
  }
}

// Helper function to remove undefined values from objects
function removeUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  );
}

// 🔧 WORKING: Keep existing functions that work
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
  try {
    console.log("🔍 getSubscriptionStatus called with:", data);
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const {userId} = data;
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      console.log("👤 User not found, returning free status");
      return {status: "free"};
    }

    const userData = userDoc.data();
    const subscription = userData.subscription || {status: "free"};

    console.log("✅ Subscription status retrieved:", subscription.status);

    return {
      status: subscription.status || "free",
      currentPeriodEnd: subscription.currentPeriodEnd,
      paymentFailed: subscription.paymentFailed || false
    };
  } catch (error) {
    console.error("❌ Error getting subscription status:", error);
    return {status: "free"};
  }
});

exports.createCheckoutSession = functions
  .runWith({ secrets: [stripeSecretKey] })
  .https.onCall(async (data, context) => {
  try {
    console.log("🛒 createCheckoutSession called");
    console.log("📋 Request data:", JSON.stringify(data, null, 2));
    console.log("🔐 Auth context:", context.auth ? "VALID" : "MISSING");
    
    if (!context.auth) {
      console.error("❌ No authentication context");
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId, interval } = data;
    if (!userId) {
      console.error("❌ No userId provided");
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    // 'month' | 'year'. Anything else falls back to monthly rather than
    // erroring, so a stale client cannot lock someone out of subscribing.
    const billingInterval = interval === 'year' ? 'year' : 'month';

    console.log("👤 Processing for user:", userId);

    // Resolve the Stripe key from Secret Manager. This used to read
    // functions.config() into a local named stripeSecretKey, which shadowed the
    // module-level secret binding of the same name — so the local has to go, not
    // just its value.
    const secretKey = stripeSecretKey.value();
    if (!secretKey) {
      console.error("❌ STRIPE_SECRET_KEY is not bound to this function");
      throw new functions.https.HttpsError('failed-precondition', 'Payment system configuration error');
    }
    const monthlyPriceId = MONTHLY_PRICE_ID;

    // Initialize Stripe
    let stripeClient;
    try {
      stripeClient = stripe(secretKey);
      console.log("✅ Stripe client initialized");
    } catch (stripeError) {
      console.error("❌ Stripe initialization failed:", stripeError);
      throw new functions.https.HttpsError('internal', 'Payment system initialization failed');
    }

    // Get or create customer
    let customerId;
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      
      if (userDoc.exists && userDoc.data().stripeCustomerId) {
        customerId = userDoc.data().stripeCustomerId;
        console.log("📋 Using existing customer:", customerId);
      } else {
        console.log("🆕 Creating new customer...");
        const customer = await stripeClient.customers.create({
          metadata: { firebaseUID: userId }
        });
        customerId = customer.id;
        
        await db.collection("users").doc(userId).update({
          stripeCustomerId: customerId
        });
        
        console.log("✅ Created new customer:", customerId);
      }
    } catch (customerError) {
      console.error("❌ Customer creation/retrieval failed:", customerError);
      throw new functions.https.HttpsError('internal', 'Customer setup failed');
    }

    // Create checkout session with webhook URL
    try {
      console.log("🛒 Creating checkout session...", billingInterval);

      const lineItem = billingInterval === 'year'
        ? {
            price_data: {
              currency: ANNUAL_SUBSCRIPTION.currency,
              product: ANNUAL_SUBSCRIPTION.productId,
              unit_amount: ANNUAL_SUBSCRIPTION.unitAmount,
              recurring: { interval: 'year' }
            },
            quantity: 1,
          }
        : { price: monthlyPriceId, quantity: 1 };

      const session = await stripeClient.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [lineItem],
        success_url: `https://reflection-writer.web.app/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://reflection-writer.web.app/cancel`,
        metadata: {
          firebaseUID: userId
        },
        subscription_data: {
          metadata: {
            firebaseUID: userId
          }
        }
      });

      console.log("✅ Checkout session created successfully:", session.id);
      console.log("🔗 Checkout URL:", session.url);
      
      return {
        sessionId: session.id,
        url: session.url
      };

    } catch (checkoutError) {
      console.error("❌ Checkout session creation failed:", checkoutError);
      console.error("Full error details:", JSON.stringify(checkoutError, null, 2));
      throw new functions.https.HttpsError('internal', `Checkout creation failed: ${checkoutError.message}`);
    }

  } catch (error) {
    console.error("❌ createCheckoutSession error:", error);

    if (error.code && error.code.startsWith('functions/')) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', `Checkout session creation failed: ${error.message}`);
  }
});

// ── What each plan bills against ────────────────────────────────────────────
// Two shapes are in use here. The monthly subscription bills against a Price
// created in the Stripe Dashboard, so its ID has to be recorded somewhere.
// Everything else prices inline per-session via price_data against a real
// Product — reporting still lands on the product, and there is no second value
// anywhere that can drift out of step with this file.
//
// None of these are credentials. A Stripe Price or Product ID is an identifier
// that Stripe expects client-side in most integrations, so they are plain
// constants rather than secrets. MONTHLY_PRICE_ID used to live in
// config.stripe.monthly_price_id and moved here when Runtime Config was retired.

// Monthly Artisan subscription — the one plan billing through a Dashboard Price.
const MONTHLY_PRICE_ID = 'price_1SL5HqIbSI0LUOgqxD7GSfiJ';

// Annual Artisan subscription, priced inline.
const ANNUAL_SUBSCRIPTION = {
  productId: 'prod_SL33owKsKNM6jq',
  currency: 'eur',
  unitAmount: 11199 // €111.99 — €31.89 less than twelve months at €11.99
};

// 💎 ONE-TIME PATH PURCHASES (exclusive paths outside the Artisan subscription).
// Priced inline like the annual plan. The grant happens in the webhook, via
// users/{uid}.purchasedPaths arrayUnion.
const EXCLUSIVE_PATH_PRODUCTS = {
  'kairos-moments': {
    productId: 'prod_Us7OkREsJYUvmTjqwert',
    currency: 'eur',
    unitAmount: 299 // €2.99
  },
  // Starting Over — anchor for 'learning-to-speak' and 'two-homes' as well;
  // getPurchaseAnchorId routes all three here, so only this one needs a product.
  'starting-over': {
    productId: 'prod_V4m4CDE6lLcyTj',
    currency: 'eur',
    unitAmount: 299 // €2.99
  },
  // Pain — anchor for 'existential-pain' and 'body-pain' as well;
  // getPurchaseAnchorId routes all three here, so only this one needs a product.
  'moral-pain': {
    productId: 'prod_V5eR8w8cqyutxE',
    currency: 'eur',
    unitAmount: 299 // €2.99
  },
  // First Light — a single path rather than a pack of three, priced as an
  // impulse buy. Shipped at €0.29 first, which Stripe refuses outright: see
  // MINIMUM_CHARGE below. €0.99 nets about €0.72 after the fixed fee, against
  // €0.04 at the original price.
  'first-light': {
    productId: 'prod_V5G9gux3Xgo07y',
    currency: 'eur',
    unitAmount: 99 // €0.99
  }
};

// Stripe rejects any Checkout Session below a per-currency floor, with
// "The Checkout Session's total amount due must add up to at least €0.50 EUR".
// It is a 400 at session creation, so the failure surfaces to the user as
// "could not start the payment" with nothing indicating why, and only in
// production — nothing in a build or a type check will catch a price set too
// low. Hence the explicit guard.
//
// Only EUR is listed because every product here is priced in EUR. Add the
// currency's own minimum before selling in another one; they differ.
const MINIMUM_CHARGE = { eur: 50 };

// Checked at module load so a bad price fails at deploy time rather than on a
// customer's first tap. Logged rather than thrown: throwing here would take
// down every function in the file, not just this one.
for (const [pathId, product] of Object.entries(EXCLUSIVE_PATH_PRODUCTS)) {
  const floor = MINIMUM_CHARGE[product.currency];
  if (floor && product.unitAmount < floor) {
    console.error(
      `❌ ${pathId} is priced at ${product.unitAmount} ${product.currency}, below Stripe's ` +
      `minimum of ${floor}. Checkout for this path will fail with a 400.`
    );
  }
}

exports.createPathCheckoutSession = functions
  .runWith({ secrets: [stripeSecretKey] })
  .https.onCall(async (data, context) => {
  try {
    console.log("💎 createPathCheckoutSession called:", JSON.stringify(data));

    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId, pathId } = data;
    if (!userId || !pathId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID and path ID are required');
    }
    if (userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'userId must match the authenticated user');
    }

    const product = EXCLUSIVE_PATH_PRODUCTS[pathId];
    if (!product) {
      throw new functions.https.HttpsError('invalid-argument', `Unknown exclusive path: ${pathId}`);
    }

    // Fail here rather than letting Stripe return a 400 the client renders as a
    // generic "could not start the payment", which says nothing about the cause.
    const minimum = MINIMUM_CHARGE[product.currency];
    if (minimum && product.unitAmount < minimum) {
      console.error(`❌ ${pathId} priced below Stripe's minimum: ${product.unitAmount} < ${minimum} ${product.currency}`);
      throw new functions.https.HttpsError(
        'failed-precondition',
        `${pathId} is priced below the minimum Stripe will charge for ${product.currency.toUpperCase()}.`
      );
    }

    const secretKey = stripeSecretKey.value();
    if (!secretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Payment system configuration error');
    }
    const stripeClient = stripe(secretKey);

    // Reuse the existing Stripe customer if there is one
    let customerId;
    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists && userDoc.data().stripeCustomerId) {
      customerId = userDoc.data().stripeCustomerId;
    } else {
      const customer = await stripeClient.customers.create({
        metadata: { firebaseUID: userId }
      });
      customerId = customer.id;
      await db.collection("users").doc(userId).update({ stripeCustomerId: customerId });
    }

    // Already purchased? Don't charge twice.
    const purchased = (userDoc.exists && userDoc.data().purchasedPaths) || [];
    if (purchased.includes(pathId)) {
      throw new functions.https.HttpsError('already-exists', 'Path already purchased');
    }

    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: product.currency,
          unit_amount: product.unitAmount,
          product: product.productId
        },
        quantity: 1
      }],
      success_url: `https://reflection-writer.web.app/?checkout=success&path=${pathId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://reflection-writer.web.app/?checkout=cancel&path=${pathId}`,
      // Terms §7 states the buyer requests immediate access and thereby gives
      // up the EU 14-day right of withdrawal. That is only true if they are
      // actually told so before paying, so it is shown above the pay button.
      //
      // This is display text, not a recorded consent. The stronger form is
      // consent_collection: { terms_of_service: 'required' }, which renders a
      // real checkbox and stores the acceptance on the session — but it errors
      // unless a Terms of Service URL is set in the Stripe Dashboard's public
      // business details. Add the URL there, then switch to it.
      custom_text: {
        submit: {
          message:
            'These paths unlock immediately. By paying you ask for access straight away and accept that this ends your 14-day right of withdrawal. Faulty or not as described is always refundable.'
        }
      },
      metadata: {
        firebaseUID: userId,
        pathId: pathId,
        type: 'path_purchase'
      }
    });

    console.log("✅ Path checkout session created:", session.id);
    return { sessionId: session.id, url: session.url };

  } catch (error) {
    console.error("❌ createPathCheckoutSession error:", error);
    if (error.code && error.code.startsWith('functions/')) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', `Path checkout creation failed: ${error.message}`);
  }
});

// 🆕 FIXED: STRIPE WEBHOOK HANDLER
exports.stripeWebhook = functions
  .runWith({ secrets: [stripeSecretKey, stripeWebhookSecret] })
  .https.onRequest(async (req, res) => {
  try {
    console.log("🔔 Stripe webhook received");
    console.log("📋 Headers:", req.headers);
    console.log("🎯 Event type:", req.body?.type);
    
    // Both come from Secret Manager and both are bound in .runWith above. The
    // locals are named apart from the module-level bindings on purpose: the
    // previous versions reused those exact names and shadowed them.
    const secretKey = stripeSecretKey.value();
    const webhookSecret = stripeWebhookSecret.value();

    if (!secretKey || !webhookSecret) {
      console.error("❌ Stripe secrets are not bound to this function");
      return res.status(500).send("Missing Stripe configuration");
    }

    const stripeClient = stripe(secretKey);
    
    // Get the signature from headers
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      console.error("❌ No Stripe signature found");
      return res.status(400).send("No signature");
    }
    
    let event;
    try {
      // Verify webhook signature
      event = stripeClient.webhooks.constructEvent(
        req.rawBody, 
        signature, 
        webhookSecret
      );
      console.log("✅ Webhook signature verified");
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    }
    
    console.log("🎯 Processing event:", event.type);
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, stripeClient);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, stripeClient);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }
    
    console.log("✅ Webhook processed successfully");
    res.status(200).send("Webhook processed");
    
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).send("Webhook processing failed");
  }
});

// 🆕 NEW: Handle checkout session completed (BEST place to activate subscription)
async function handleCheckoutSessionCompleted(session, stripeClient) {
  try {
    console.log("✅ Processing completed checkout session:", session.id);
    console.log("🔍 Session data:", JSON.stringify(session, null, 2));

    const firebaseUID = session.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID in session metadata");
      return;
    }

    // 💎 One-time path purchase — grant the path and stop. Must NOT fall
    // through to the subscription activation below.
    if (session.metadata?.type === 'path_purchase' && session.metadata?.pathId) {
      const pathId = session.metadata.pathId;
      console.log(`💎 Granting exclusive path '${pathId}' to user:`, firebaseUID);
      await db.collection('users').doc(firebaseUID).update({
        purchasedPaths: admin.firestore.FieldValue.arrayUnion(pathId),
        updatedAt: admin.firestore.Timestamp.now()
      });
      console.log("✅ Exclusive path granted:", pathId);
      return;
    }

    console.log("👤 Activating subscription for user:", firebaseUID);
    
    // Get subscription details from Stripe
    let subscription = null;
    if (session.subscription) {
      try {
        subscription = await stripeClient.subscriptions.retrieve(session.subscription);
        console.log("✅ Retrieved subscription:", subscription.id);
      } catch (subError) {
        console.error("❌ Error retrieving subscription:", subError);
      }
    }
    
    // Build update object, filtering out undefined values
    const updateData = {
      'subscription.status': 'active',
      'subscription.stripeCustomerId': session.customer,
      'subscription.activatedAt': admin.firestore.Timestamp.now(),
      'subscription.paymentFailed': false,
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': 'artisan',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    // Add subscription-specific fields if available
    if (subscription) {
      updateData['subscription.stripeSubscriptionId'] = subscription.id;
      updateData['subscription.currentPeriodEnd'] = admin.firestore.Timestamp.fromDate(
        new Date(subscription.current_period_end * 1000)
      );
      updateData['subscription.currentPeriodStart'] = admin.firestore.Timestamp.fromDate(
        new Date(subscription.current_period_start * 1000)
      );
    } else if (session.subscription) {
      // Fallback to session.subscription if we couldn't retrieve full details
      updateData['subscription.stripeSubscriptionId'] = session.subscription;
    }
    
    // Remove any undefined values
    const cleanedUpdateData = removeUndefined(updateData);
    
    console.log("💾 Updating Firestore with:", cleanedUpdateData);
    
    await db.collection('users').doc(firebaseUID).update(cleanedUpdateData);
    
    console.log("✅ Subscription activated successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling checkout completion:", error);
  }
}

// 🔧 FIXED: Handle successful payment
async function handleInvoicePaymentSucceeded(invoice, stripeClient) {
  try {
    console.log("💰 Processing successful payment for invoice:", invoice.id);
    
    // Get Firebase UID from metadata
    let firebaseUID = null;
    
    if (invoice.subscription_details?.metadata?.firebaseUID) {
      firebaseUID = invoice.subscription_details.metadata.firebaseUID;
    } else if (invoice.lines?.data?.[0]?.metadata?.firebaseUID) {
      firebaseUID = invoice.lines.data[0].metadata.firebaseUID;
    } else if (invoice.subscription) {
      // Fetch subscription to get metadata
      try {
        const subscription = await stripeClient.subscriptions.retrieve(invoice.subscription);
        firebaseUID = subscription.metadata?.firebaseUID;
      } catch (subError) {
        console.error("❌ Error fetching subscription:", subError);
      }
    }
    
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in invoice metadata");
      return;
    }
    
    console.log("👤 Updating subscription for user:", firebaseUID);
    
    // Build update object, being careful with undefined values
    const updateData = {
      'subscription.status': 'active',
      'subscription.stripeCustomerId': invoice.customer,
      'subscription.paymentFailed': false,
      'subscription.lastPaymentDate': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': 'artisan',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    // Only add these if they exist
    if (invoice.subscription) {
      updateData['subscription.stripeSubscriptionId'] = invoice.subscription;
    }
    
    if (invoice.period_end) {
      updateData['subscription.currentPeriodEnd'] = admin.firestore.Timestamp.fromDate(
        new Date(invoice.period_end * 1000)
      );
    }
    
    if (invoice.period_start) {
      updateData['subscription.currentPeriodStart'] = admin.firestore.Timestamp.fromDate(
        new Date(invoice.period_start * 1000)
      );
    }
    
    // Remove any undefined values before updating
    const cleanedUpdateData = removeUndefined(updateData);
    
    console.log("💾 Updating Firestore with:", cleanedUpdateData);
    
    await db.collection('users').doc(firebaseUID).update(cleanedUpdateData);
    
    console.log("✅ User subscription updated successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling payment success:", error);
  }
}

// 🔧 FIXED: Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  try {
    console.log("🆕 Processing new subscription:", subscription.id);
    
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in subscription metadata");
      return;
    }
    
    console.log("👤 Creating subscription for user:", firebaseUID);
    
    const updateData = {
      'subscription.status': subscription.status,
      'subscription.stripeCustomerId': subscription.customer,
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(
        new Date(subscription.current_period_end * 1000)
      ),
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromDate(
        new Date(subscription.current_period_start * 1000)
      ),
      'subscription.paymentFailed': false,
      'subscription.createdAt': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': subscription.status === 'active' ? 'artisan' : 'free',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    const cleanedUpdateData = removeUndefined(updateData);
    
    await db.collection('users').doc(firebaseUID).update(cleanedUpdateData);
    
    console.log("✅ Subscription created successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling subscription creation:", error);
  }
}

// 🔧 FIXED: Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  try {
    console.log("🔄 Processing subscription update:", subscription.id);
    
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in subscription metadata");
      return;
    }
    
    console.log("👤 Updating subscription for user:", firebaseUID);
    
    const tier = ['active', 'trialing'].includes(subscription.status) ? 'artisan' : 'free';
    
    const updateData = {
      'subscription.status': subscription.status,
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(
        new Date(subscription.current_period_end * 1000)
      ),
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromDate(
        new Date(subscription.current_period_start * 1000)
      ),
      'subscription.paymentFailed': false,
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': tier,
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    const cleanedUpdateData = removeUndefined(updateData);
    
    await db.collection('users').doc(firebaseUID).update(cleanedUpdateData);
    
    console.log("✅ Subscription updated successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling subscription update:", error);
  }
}

// 🔧 FIXED: Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  try {
    console.log("❌ Processing subscription cancellation:", subscription.id);
    
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in subscription metadata");
      return;
    }
    
    console.log("👤 Canceling subscription for user:", firebaseUID);
    
    const updateData = {
      'subscription.status': 'canceled',
      'subscription.canceledAt': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': 'free',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    const cleanedUpdateData = removeUndefined(updateData);
    
    await db.collection('users').doc(firebaseUID).update(cleanedUpdateData);
    
    console.log("✅ Subscription canceled successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling subscription cancellation:", error);
  }
}

// 🔧 FIXED: Handle failed payments
async function handleInvoicePaymentFailed(invoice) {
  try {
    console.log("💸 Processing failed payment for invoice:", invoice.id);
    
    let firebaseUID = null;
    
    if (invoice.subscription_details?.metadata?.firebaseUID) {
      firebaseUID = invoice.subscription_details.metadata.firebaseUID;
    } else if (invoice.lines?.data?.[0]?.metadata?.firebaseUID) {
      firebaseUID = invoice.lines.data[0].metadata.firebaseUID;
    }
    
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in invoice metadata");
      return;
    }
    
    console.log("👤 Updating payment failure for user:", firebaseUID);
    
    const updateData = {
      'subscription.paymentFailed': true,
      'subscription.lastFailedPayment': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    const cleanedUpdateData = removeUndefined(updateData);
    
    await db.collection('users').doc(firebaseUID).update(cleanedUpdateData);
    
    console.log("✅ Payment failure recorded for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling payment failure:", error);
  }
}

// Keep existing portal and cancellation functions...
exports.getCustomerPortalUrl = functions
  .runWith({ secrets: [stripeSecretKey] })
  .https.onCall(async (data, context) => {
  try {
    console.log("🏪 getCustomerPortalUrl called");
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    const secretKey = stripeSecretKey.value();

    if (!secretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration missing');
    }

    const stripeClient = stripe(secretKey);

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    let customerId = userData.subscription?.stripeCustomerId || userData.stripeCustomerId;

    if (!customerId) {
      throw new functions.https.HttpsError('failed-precondition', 'No Stripe customer ID found');
    }

    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://reflection-writer.web.app/profile',
    });

    console.log("✅ Customer portal URL created successfully");

    return {
      url: portalSession.url
    };

  } catch (error) {
    console.error("❌ Error in getCustomerPortalUrl:", error);
    throw new functions.https.HttpsError('internal', `Portal creation failed: ${error.message}`);
  }
});

exports.cancelSubscription = functions
  .runWith({ secrets: [stripeSecretKey] })
  .https.onCall(async (data, context) => {
  try {
    console.log("❌ cancelSubscription called");
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    const secretKey = stripeSecretKey.value();

    if (!secretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration missing');
    }

    const stripeClient = stripe(secretKey);

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    const subscriptionId = userData.subscription?.stripeSubscriptionId;

    if (!subscriptionId) {
      throw new functions.https.HttpsError('failed-precondition', 'No active subscription found');
    }

    console.log("🗑️ Canceling subscription:", subscriptionId);

    const subscription = await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    console.log("✅ Subscription cancellation scheduled");

    const updateData = {
      'subscription.cancelAtPeriodEnd': true,
      'subscription.canceledAt': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(userId).update(removeUndefined(updateData));

    return {
      success: true,
      message: 'Subscription will be canceled at the end of the current period',
      cancelDate: new Date(subscription.current_period_end * 1000).toISOString()
    };

  } catch (error) {
    console.error("❌ Error canceling subscription:", error);
    throw new functions.https.HttpsError('internal', `Cancellation failed: ${error.message}`);
  }
});

exports.testWebhook = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
    console.log("🔔 Test webhook called");
    res.status(200).json({ 
      message: "Webhook endpoint is working",
      timestamp: new Date().toISOString()
    });
  });
});

// 🎙️ NEW: Transcribe audio using OpenAI Whisper
exports.transcribeAudio = functions
  .runWith({ secrets: [openaiApiKey] })
  .https.onCall(async (data, context) => {
  try {
    console.log("🎙️ transcribeAudio called");
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { audioUrl } = data;
    if (!audioUrl) {
      throw new functions.https.HttpsError('invalid-argument', 'Audio URL is required');
    }

    // From Secret Manager, bound in .runWith above. Local renamed because the
    // old name shadowed the module-level binding.
    const whisperKey = openaiApiKey.value();

    if (!whisperKey) {
      throw new functions.https.HttpsError('failed-precondition', 'OpenAI API key not configured');
    }

    console.log("📥 Downloading audio from:", audioUrl);

    // Download the audio file from Firebase Storage
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to download audio: ${audioResponse.statusText}`);
    }

    const audioBuffer = await audioResponse.buffer();
    console.log("✅ Audio downloaded, size:", audioBuffer.length, "bytes");

    // Create form data for Whisper API
    const formData = new FormData();
    formData.append('file', audioBuffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm'
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Adjust if needed
    formData.append('response_format', 'json');

    console.log("🚀 Sending to OpenAI Whisper API...");

    // Call OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whisperKey}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error("❌ Whisper API error:", errorText);
      throw new Error(`Whisper API failed: ${whisperResponse.statusText}`);
    }

    const result = await whisperResponse.json();
    console.log("✅ Transcription successful, length:", result.text?.length || 0);

    return {
      transcription: result.text || '',
      success: true
    };

  } catch (error) {
    console.error("❌ Transcription error:", error);
    throw new functions.https.HttpsError('internal', `Transcription failed: ${error.message}`);
  }
});

// 🎙️ HTTP fallback with explicit CORS for environments where callable preflight fails
exports.transcribeAudioHttp = functions
  .runWith({ secrets: [openaiApiKey] })
  .https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        // cors middleware will handle response headers
        return res.status(204).send('');
      }

      // Verify Firebase ID token from Authorization header
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/^Bearer (.+)$/);
      if (!match) {
        return res.status(401).json({ error: 'Unauthorized: Missing Bearer token' });
      }

      let decoded;
      try {
        decoded = await admin.auth().verifyIdToken(match[1]);
      } catch (e) {
        console.error('❌ ID token verification failed:', e);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const { audioUrl } = req.body || {};
      if (!audioUrl) {
        return res.status(400).json({ error: 'Audio URL is required' });
      }

      // From Secret Manager, bound in .runWith above. Local renamed because the
      // old name shadowed the module-level binding.
      const whisperKey = openaiApiKey.value();
      if (!whisperKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      console.log('📥 [HTTP] Downloading audio from:', audioUrl, ' for user:', decoded.uid);

      // Download the audio file from Firebase Storage
      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        const t = await audioResponse.text().catch(() => '');
        console.error('❌ [HTTP] Failed to download audio:', audioResponse.status, t);
        return res.status(400).json({ error: `Failed to download audio: ${audioResponse.statusText}` });
      }

      const audioBuffer = await audioResponse.buffer();
      console.log('✅ [HTTP] Audio downloaded, size:', audioBuffer.length, 'bytes');

      // Create form data for Whisper API
      const formData = new FormData();
      formData.append('file', audioBuffer, { filename: 'audio.webm', contentType: 'audio/webm' });
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      console.log('🚀 [HTTP] Sending to OpenAI Whisper API...');

      // Call OpenAI Whisper API
      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whisperKey}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text();
        console.error('❌ [HTTP] Whisper API error:', errorText);
        return res.status(502).json({ error: `Whisper API failed: ${whisperResponse.statusText}` });
      }

      const result = await whisperResponse.json();
      console.log('✅ [HTTP] Transcription successful, length:', result.text?.length || 0);

      return res.status(200).json({ transcription: result.text || '', success: true });
    } catch (error) {
      console.error('❌ [HTTP] Transcription error:', error);
      return res.status(500).json({ error: `Transcription failed: ${error.message}` });
    }
  });
});

/**
 * Activate journal bundle subscription when user registers a physical journal
 * Grants free Artisan access for 3/6/12 months based on journal tier
 */
exports.activateJournalSubscription = functions.https.onCall(async (data, context) => {
  try {
    console.log("📔 activateJournalSubscription called with:", data);
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId, journalId, tier } = data;
    
    if (!userId || !journalId || !tier) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        'userId, journalId, and tier are required'
      );
    }

    // Validate tier
    const validTiers = ['essential', 'insight', 'legacy'];
    if (!validTiers.includes(tier)) {
      throw new functions.https.HttpsError(
        'invalid-argument', 
        `Invalid tier: ${tier}. Must be one of: ${validTiers.join(', ')}`
      );
    }

    // Get user document
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    const currentSubscription = userData.subscription || { status: 'free' };

    // What each journal grants, matching the collections on the pricing page
    // and section 7 of the terms. Insight carries Premium for the life of the
    // service — no renewal, no expiry — so the grants rise with the price
    // rather than inverting partway up.
    const TIER_GRANTS = {
      essential: { months: 3 },
      legacy: { months: 12 },
      insight: { lifetime: true }
    };

    const grant = TIER_GRANTS[tier];
    const months = grant.months;
    const now = new Date();

    // Calculate end date. null means it never ends — hasActiveArtisan treats a
    // missing currentPeriodEnd as no expiry.
    let subscriptionEndDate = null;

    if (grant.lifetime) {
      console.log('♾️ Lifetime grant — no expiry recorded');
    } else if (currentSubscription.lifetime) {
      // Never downgrade someone who already owns lifetime by later registering
      // a shorter journal.
      console.log('♾️ User already holds lifetime access — leaving it alone');
    } else if (currentSubscription.status === 'active' && currentSubscription.currentPeriodEnd) {
      const existingEnd = currentSubscription.currentPeriodEnd.toDate 
        ? currentSubscription.currentPeriodEnd.toDate() 
        : new Date(currentSubscription.currentPeriodEnd);
      
      // If existing subscription is in the future, extend from there
      if (existingEnd > now) {
        subscriptionEndDate = new Date(existingEnd);
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + months);
        console.log(`📅 Extending existing subscription by ${months} months`);
      } else {
        // Existing subscription expired, start fresh
        subscriptionEndDate = new Date(now);
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + months);
        console.log(`📅 Starting new ${months}-month subscription`);
      }
    } else {
      // No active subscription, start fresh
      subscriptionEndDate = new Date(now);
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + months);
      console.log(`📅 Starting new ${months}-month subscription`);
    }

    const isLifetime = !!(grant.lifetime || currentSubscription.lifetime);

    // Update user subscription
    const subscriptionUpdate = {
      subscription: {
        status: 'active',
        tier: 'artisan',
        source: 'journal_bundle',
        journalId: journalId,
        journalTier: tier,
        lifetime: isLifetime,
        currentPeriodEnd: subscriptionEndDate
          ? admin.firestore.Timestamp.fromDate(subscriptionEndDate)
          : null,
        activatedAt: admin.firestore.FieldValue.serverTimestamp(),
        autoRenew: false // Journal bundles don't auto-renew, user must subscribe separately
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.update(subscriptionUpdate);

    console.log(`✅ Journal subscription activated for user ${userId}`);
    console.log(`📔 Journal: ${journalId} (${tier} tier)`);
    console.log(
      isLifetime
        ? '📅 Valid indefinitely (lifetime)'
        : `📅 Valid until: ${subscriptionEndDate.toISOString()}`
    );

    return {
      success: true,
      subscription: {
        status: 'active',
        tier: 'artisan',
        lifetime: isLifetime,
        months: isLifetime ? null : months,
        currentPeriodEnd: subscriptionEndDate ? subscriptionEndDate.toISOString() : null,
        message: isLifetime
          ? 'Kairos Premium activated for the life of the service.'
          : `${months} months of Artisan access activated!`
      }
    };

  } catch (error) {
    console.error("❌ Error activating journal subscription:", error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});


exports.callClaude = functions
  .runWith({
    timeoutSeconds: 300,
    memory: "512MB",
    secrets: [anthropicApiKey], // binds the secret so this function can read it
  })
  .https.onCall(async (data, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const key = anthropicApiKey.value();
      if (!key) {
        console.error("❌ ANTHROPIC_API_KEY secret is empty / not set");
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Anthropic API key not configured"
        );
      }

      const requestBody = data || {};
      if (!requestBody.model || !requestBody.messages) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Request must include 'model' and 'messages'"
        );
      }

      if (!requestBody.max_tokens || requestBody.max_tokens > 8192) {
        requestBody.max_tokens = Math.min(requestBody.max_tokens || 4096, 8192);
      }

      console.log(
        "🤖 callClaude:",
        requestBody.model,
        "| max_tokens:",
        requestBody.max_tokens,
        "| user:",
        context.auth.uid
      );

      // Reserve before calling, not after: reserving afterwards would let
      // concurrent requests all pass the check and overshoot the allowance.
      // The reservation is handed back below if the call itself fails.
      // Two allowances, and a request draws on exactly one of them. A Kairos AI
      // turn is gated daily; everything else is gated monthly; a vision request
      // is not gated at all, because a transcription is useless without the
      // analysis that follows and charging for both would make a handwritten
      // entry cost twice what a typed one does.
      let allowance = { metered: false };
      let allowanceKind = null;

      if (isKairosAiRequest(requestBody)) {
        allowanceKind = 'ai';
        allowance = await reserveDailyAiMessage(context.auth.uid);
        if (allowance.exhausted) {
          throw new functions.https.HttpsError(
            "resource-exhausted",
            `Free plan allowance reached: ${allowance.limit} Kairos AI message per day.`,
            {
              reason: "ai-daily-allowance-exhausted",
              used: allowance.used,
              limit: allowance.limit,
            }
          );
        }
      } else if (!isVisionRequest(requestBody)) {
        allowanceKind = 'analysis';
        allowance = await reserveFreeAnalysis(context.auth.uid);
        if (allowance.exhausted) {
          throw new functions.https.HttpsError(
            "resource-exhausted",
            `Free plan allowance reached: ${allowance.limit} analyses this month.`,
            {
              reason: "free-allowance-exhausted",
              used: allowance.used,
              limit: allowance.limit,
            }
          );
        }
      }

      let result;
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          console.error("❌ Anthropic API error:", response.status, errText);
          throw new functions.https.HttpsError(
            "internal",
            `Claude API error: ${response.status}`
          );
        }

        result = await response.json();
      } catch (callError) {
        // The user got nothing, so they should not be charged for it — and the
        // refund has to go back to whichever of the two allowances was drawn
        // down. Handing an AI turn back to the monthly analysis counter would
        // both leave the daily gate closed and quietly inflate the other.
        if (allowance.metered) {
          if (allowanceKind === 'ai') {
            await releaseDailyAiMessage(context.auth.uid);
          } else {
            await releaseFreeAnalysis(context.auth.uid);
          }
        }
        throw callError;
      }

      console.log(
        "✅ callClaude success | input tokens:",
        result.usage && result.usage.input_tokens,
        "| output tokens:",
        result.usage && result.usage.output_tokens
      );

      // Piggybacked on the Anthropic payload so the client can show what is
      // left without a second round trip. Absent for subscribers.
      if (allowance.metered) {
        result.kairosAllowance = { used: allowance.used, limit: allowance.limit };
      }

      return result;
    } catch (error) {
      console.error("❌ callClaude error:", error);
      if (error.code && String(error.code).startsWith("functions/")) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        `Claude request failed: ${error.message}`
      );
    }
  });