<<<<<<< HEAD
// functions/index.js - FIXED VERSION WITH STRIPE WEBHOOKS

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

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

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    console.log("🛒 createCheckoutSession called");
    console.log("📋 Request data:", JSON.stringify(data, null, 2));
    console.log("🔐 Auth context:", context.auth ? "VALID" : "MISSING");
    
    if (!context.auth) {
      console.error("❌ No authentication context");
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    if (!userId) {
      console.error("❌ No userId provided");
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    console.log("👤 Processing for user:", userId);

    // Get Firebase config
    let stripeSecretKey;
    let monthlyPriceId;
    
    try {
      const config = functions.config();
      console.log("📊 Config keys available:", Object.keys(config));
      
      if (!config.stripe) {
        throw new Error("Stripe configuration section not found");
      }
      
      stripeSecretKey = config.stripe.secret_key;
      monthlyPriceId = config.stripe.monthly_price_id;
      
      if (!stripeSecretKey) {
        throw new Error("Stripe secret key not found in config");
      }
      
      if (!monthlyPriceId) {
        throw new Error("Monthly price ID not found in config");
      }
      
      console.log("✅ Stripe config loaded successfully");
      
    } catch (configError) {
      console.error("❌ Configuration error:", configError);
      throw new functions.https.HttpsError('failed-precondition', 'Payment system configuration error');
    }

    // Initialize Stripe
    let stripeClient;
    try {
      stripeClient = stripe(stripeSecretKey);
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
      console.log("🛒 Creating checkout session...");
      console.log("💰 Using price ID:", monthlyPriceId);
      
      const session = await stripeClient.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          price: monthlyPriceId,
          quantity: 1,
        }],
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

// 🆕 NEW: CRITICAL STRIPE WEBHOOK HANDLER
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    console.log("🔔 Stripe webhook received");
    console.log("📋 Headers:", req.headers);
    console.log("🎯 Event type:", req.body?.type);
    
    // Get Stripe config
    const config = functions.config();
    const stripeSecretKey = config.stripe.secret_key;
    const webhookSecret = config.stripe.webhook_secret;
    
    if (!stripeSecretKey || !webhookSecret) {
      console.error("❌ Missing Stripe configuration");
      return res.status(500).send("Missing Stripe configuration");
    }
    
    const stripeClient = stripe(stripeSecretKey);
    
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
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
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

// 🆕 NEW: Handle successful payment
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    console.log("💰 Processing successful payment for invoice:", invoice.id);
    console.log("🔍 Invoice structure:", JSON.stringify(invoice, null, 2));
    
    // 🔧 IMPROVED: Check multiple locations for Firebase UID
    let firebaseUID = null;
    
    // Check subscription details metadata (most common)
    if (invoice.subscription_details?.metadata?.firebaseUID) {
      firebaseUID = invoice.subscription_details.metadata.firebaseUID;
      console.log("✅ Found UID in subscription_details:", firebaseUID);
    }
    
    // Check parent subscription details 
    else if (invoice.parent?.subscription_details?.metadata?.firebaseUID) {
      firebaseUID = invoice.parent.subscription_details.metadata.firebaseUID;
      console.log("✅ Found UID in parent.subscription_details:", firebaseUID);
    }
    
    // Check line items metadata
    else if (invoice.lines?.data?.[0]?.metadata?.firebaseUID) {
      firebaseUID = invoice.lines.data[0].metadata.firebaseUID;
      console.log("✅ Found UID in line items:", firebaseUID);
    }
    
    // Check line items parent metadata
    else if (invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription) {
      console.log("🔍 Checking subscription object for metadata...");
      // We'll need to fetch the subscription to get metadata
      try {
        const config = functions.config();
        const stripeClient = stripe(config.stripe.secret_key);
        const subscription = await stripeClient.subscriptions.retrieve(
          invoice.lines.data[0].parent.subscription_item_details.subscription
        );
        firebaseUID = subscription.metadata?.firebaseUID;
        console.log("✅ Found UID in subscription object:", firebaseUID);
      } catch (subError) {
        console.error("❌ Error fetching subscription:", subError);
      }
    }
    
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in any metadata location");
      console.error("❌ Available metadata paths checked:");
      console.error("   - invoice.subscription_details.metadata");
      console.error("   - invoice.parent.subscription_details.metadata");
      console.error("   - invoice.lines.data[0].metadata");
      console.error("   - subscription.metadata (via API call)");
      return;
    }
    
    console.log("👤 Updating subscription for user:", firebaseUID);
    
    // 🔧 FIX: Merge subscription data instead of overwriting
    const subscriptionUpdates = {
      'subscription.status': 'active',
      'subscription.stripeCustomerId': invoice.customer,
      'subscription.stripeSubscriptionId': invoice.subscription,
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(new Date(invoice.period_end * 1000)),
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromDate(new Date(invoice.period_start * 1000)),
      'subscription.paymentFailed': false,
      'subscription.lastPaymentDate': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': 'artisan',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(firebaseUID).update(subscriptionUpdates);
    
    console.log("✅ User subscription updated successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling payment success:", error);
  }
}

// 🆕 NEW: Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  try {
    console.log("🆕 Processing new subscription:", subscription.id);
    console.log("🔍 Subscription metadata:", subscription.metadata);
    
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in subscription metadata");
      return;
    }
    
    console.log("👤 Creating subscription for user:", firebaseUID);
    
    // 🔧 FIX: Merge subscription data instead of overwriting
    const subscriptionUpdates = {
      'subscription.status': subscription.status,
      'subscription.stripeCustomerId': subscription.customer,
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_start * 1000)),
      'subscription.paymentFailed': false,
      'subscription.createdAt': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': subscription.status === 'active' ? 'artisan' : 'free',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(firebaseUID).update(subscriptionUpdates);
    
    console.log("✅ Subscription created successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling subscription creation:", error);
  }
}

// 🆕 NEW: Handle subscription updates
async function handleSubscriptionUpdated(subscription) {
  try {
    console.log("🔄 Processing subscription update:", subscription.id);
    
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in subscription metadata");
      return;
    }
    
    console.log("👤 Updating subscription for user:", firebaseUID);
    
    // 🔧 FIX: Merge subscription data instead of overwriting
    const tier = ['active', 'trialing'].includes(subscription.status) ? 'artisan' : 'free';
    
    const subscriptionUpdates = {
      'subscription.status': subscription.status,
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_start * 1000)),
      'subscription.paymentFailed': false,
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': tier,
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(firebaseUID).update(subscriptionUpdates);
    
    console.log("✅ Subscription updated successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling subscription update:", error);
  }
}

// 🆕 NEW: Handle subscription deletion/cancellation
async function handleSubscriptionDeleted(subscription) {
  try {
    console.log("❌ Processing subscription cancellation:", subscription.id);
    
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in subscription metadata");
      return;
    }
    
    console.log("👤 Canceling subscription for user:", firebaseUID);
    
    // 🔧 FIX: Merge subscription data instead of overwriting
    const subscriptionUpdates = {
      'subscription.status': 'canceled',
      'subscription.canceledAt': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': 'free',
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(firebaseUID).update(subscriptionUpdates);
    
    console.log("✅ Subscription canceled successfully for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling subscription cancellation:", error);
  }
}

// 🆕 NEW: Handle failed payments
async function handleInvoicePaymentFailed(invoice) {
  try {
    console.log("💸 Processing failed payment for invoice:", invoice.id);
    
    // 🔧 IMPROVED: Check multiple locations for Firebase UID (same as success handler)
    let firebaseUID = null;
    
    if (invoice.subscription_details?.metadata?.firebaseUID) {
      firebaseUID = invoice.subscription_details.metadata.firebaseUID;
    } else if (invoice.parent?.subscription_details?.metadata?.firebaseUID) {
      firebaseUID = invoice.parent.subscription_details.metadata.firebaseUID;
    } else if (invoice.lines?.data?.[0]?.metadata?.firebaseUID) {
      firebaseUID = invoice.lines.data[0].metadata.firebaseUID;
    }
    
    if (!firebaseUID) {
      console.error("❌ No Firebase UID found in invoice metadata");
      return;
    }
    
    console.log("👤 Updating payment failure for user:", firebaseUID);
    
    // 🔧 FIX: Update specific fields instead of nested object syntax
    const failureUpdates = {
      'subscription.paymentFailed': true,
      'subscription.lastFailedPayment': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(firebaseUID).update(failureUpdates);
    
    console.log("✅ Payment failure recorded for:", firebaseUID);
    
  } catch (error) {
    console.error("❌ Error handling payment failure:", error);
  }
}

// 🆕 NEW: Get customer portal URL for subscription management
exports.getCustomerPortalUrl = functions.https.onCall(async (data, context) => {
  try {
    console.log("🏪 getCustomerPortalUrl called");
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    // Get Firebase config
    const config = functions.config();
    const stripeSecretKey = config.stripe.secret_key;
    
    if (!stripeSecretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration missing');
    }

    const stripeClient = stripe(stripeSecretKey);

    // Get user's Stripe customer ID
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    
    // 🔧 DEBUG: Log ALL user data to see what's actually there
    console.log("🔍 Complete user document:", JSON.stringify(userData, null, 2));
    console.log("🔍 Available fields:", Object.keys(userData));
    console.log("🔍 Looking for stripeCustomerId...");
    
    // 🔧 FIX: Look in the correct location (inside subscription map)
    let customerId = userData.subscription?.stripeCustomerId || userData.stripeCustomerId;
    console.log("🔍 Raw customerId from database:", JSON.stringify(customerId, null, 2));
    console.log("🔍 CustomerId type:", typeof customerId);

    // 🔧 FIX: Check alternative field names and locations
    if (!customerId) {
      console.log("❌ stripeCustomerId not found, checking alternatives...");
      customerId = userData.stripe_customer_id || 
                   userData.subscription?.stripe_customer_id ||
                   userData.customerid || 
                   userData.customer_id ||
                   userData.customerId;
      console.log("🔍 Alternative customerId found:", customerId);
    }

    // 🔧 FIX: Handle if customerId is stored as object OR has extra quotes
    if (typeof customerId === 'object' && customerId !== null) {
      // If it's an object, try to extract the string value
      if (customerId.value || customerId.id || customerId.customerId) {
        customerId = customerId.value || customerId.id || customerId.customerId;
        console.log("🔧 Extracted customerId from object:", customerId);
      } else {
        console.error("❌ CustomerId is object but no valid string property found:", customerId);
        throw new functions.https.HttpsError('failed-precondition', 'Invalid customer ID format in database');
      }
    }

    // 🔧 FIX: Clean up extra quotes if present
    if (customerId && typeof customerId === 'string') {
      // Remove extra quotes like ""cus_SUByIomCPNbv2L""
      customerId = customerId.replace(/^["']+|["']+$/g, '').trim();
      console.log("🧹 Cleaned customerId:", customerId);
    }

    // Ensure it's a string
    if (customerId) {
      customerId = String(customerId).trim();
    }

    if (!customerId || customerId === 'null' || customerId === 'undefined') {
      console.error("❌ No valid customer ID found in any field");
      console.error("❌ User document keys:", Object.keys(userData));
      console.error("❌ Subscription keys:", userData.subscription ? Object.keys(userData.subscription) : 'No subscription object');
      throw new functions.https.HttpsError('failed-precondition', 'No valid Stripe customer ID found in user document');
    }

    console.log("✅ Final customerId to use:", customerId);

    // 🔧 FIX: Verify customer exists and has subscription in Stripe
    try {
      const customer = await stripeClient.customers.retrieve(customerId);
      console.log("✅ Customer verified in Stripe:", customer.id);
      
      // Check if customer has subscriptions
      const subscriptions = await stripeClient.subscriptions.list({
        customer: customerId,
        limit: 1
      });
      
      console.log("📊 Customer subscriptions found:", subscriptions.data.length);
      
      if (subscriptions.data.length === 0) {
        // Customer has no subscriptions - can't access billing portal
        throw new functions.https.HttpsError(
          'failed-precondition', 
          'Customer must have an active or past subscription to access billing portal'
        );
      }
      
    } catch (stripeError) {
      console.error("❌ Stripe customer verification failed:", stripeError);
      throw new functions.https.HttpsError(
        'not-found', 
        `Invalid customer: ${stripeError.message}`
      );
    }

    console.log("🔗 Creating customer portal session for verified customer:", customerId);

    // Create customer portal session with error handling
    try {
      const portalSession = await stripeClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: 'https://reflection-writer.web.app/profile',
      });

      console.log("✅ Customer portal URL created successfully");
      console.log("🔗 Portal URL:", portalSession.url);

      return {
        url: portalSession.url
      };
      
    } catch (portalError) {
      console.error("❌ Portal creation failed:", JSON.stringify(portalError, null, 2));
      throw new functions.https.HttpsError(
        'internal', 
        `Portal creation failed: ${portalError.message || 'Unknown error'}`
      );
    }

  } catch (error) {
    console.error("❌ Error in getCustomerPortalUrl:", error);
    
    // Re-throw HttpsError as-is
    if (error.code && error.code.startsWith('functions/')) {
      throw error;
    }
    
    // Wrap other errors
    throw new functions.https.HttpsError('internal', `Portal creation failed: ${error.message}`);
  }
});

// 🆕 NEW: Cancel user subscription
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  try {
    console.log("❌ cancelSubscription called");
    
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { userId } = data;
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
    }

    // Get Firebase config
    const config = functions.config();
    const stripeSecretKey = config.stripe.secret_key;
    
    if (!stripeSecretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration missing');
    }

    const stripeClient = stripe(stripeSecretKey);

    // Get user's subscription ID
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

    // Cancel the subscription at period end
    const subscription = await stripeClient.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    console.log("✅ Subscription cancellation scheduled");

    // Update user record with cancellation info
    const cancellationUpdates = {
      'subscription.cancelAtPeriodEnd': true,
      'subscription.canceledAt': admin.firestore.Timestamp.now(),
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'updatedAt': admin.firestore.Timestamp.now()
    };
    
    await db.collection('users').doc(userId).update(cancellationUpdates);

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

// 🔧 Keep existing test webhook
exports.testWebhook = functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
    console.log("🔔 Test webhook called");
    res.status(200).json({ 
      message: "Webhook endpoint is working",
      timestamp: new Date().toISOString()
    });
=======
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY);
const cors = require("cors")({ origin: true });

// Set global options for all functions (including region)
setGlobalOptions({ 
  region: "europe-west1"
  // Removed secrets: ["STRIPE_SECRET_KEY"] as we're using functions.config() instead
});

admin.initializeApp();

// Simple test function
exports.helloWorld = onRequest((request, response) => {
  cors(request, response, () => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }
    
    response.status(200).send("Hello from Firebase Functions in europe-west1!");
  });
});

// HTTP version of createCheckoutSession for full Stripe integration
exports.createCheckoutSession = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Handle CORS preflight
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }
      
      // Check if request is POST
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      
      // Get data from request body (support both formats)
      const data = req.body.data || req.body;
      const { userId, plan, pathId, successUrl, cancelUrl } = data;
      
      // Log the request for debugging
      console.log('Checkout request received:', {
        userId, plan, pathId,
        timestamp: new Date().toISOString()
      });
      
      // Validate required parameters
      if (!userId || !plan || !successUrl || !cancelUrl) {
        return res.status(400).json({ 
          error: { 
            message: 'Missing required parameters', 
            status: 'INVALID_ARGUMENT' 
          } 
        });
      }
      
      // Get or create the customer
      let customerId;
      
      try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        
        if (userDoc.exists && userDoc.data().stripeCustomerId) {
          customerId = userDoc.data().stripeCustomerId;
          console.log('Using existing customer ID:', customerId);
        } else {
          // Create a new customer in Stripe
          console.log('Creating new Stripe customer for user:', userId);
          const customer = await stripe.customers.create({
            metadata: {
              userId: userId
            }
          });
          
          customerId = customer.id;
          console.log('Created new customer ID:', customerId);
          
          // Save the customer ID to the user's document
          await admin.firestore().collection('users').doc(userId).update({
            stripeCustomerId: customerId
          });
        }
      } catch (customerError) {
        console.error('Error managing customer:', customerError);
        return res.status(500).json({ 
          error: { 
            message: `Customer management error: ${customerError.message}`,
            status: 'INTERNAL'
          } 
        });
      }
      
      // Get price IDs from Firebase config
      const priceIds = {
        monthly: functions.config().stripe?.monthly_price_id || 'price_monthly_id',
        yearly: functions.config().stripe?.yearly_price_id || 'price_yearly_id'
      };
      
      console.log('Available price IDs:', priceIds);
      
      // Determine price ID based on plan
      let priceId;
      if (plan === 'month' || plan === 'monthly') {
        priceId = priceIds.monthly;
      } else if (plan === 'year' || plan === 'yearly') {
        priceId = priceIds.yearly;
      } else {
        return res.status(400).json({ 
          error: { 
            message: 'Invalid subscription plan', 
            status: 'INVALID_ARGUMENT' 
          } 
        });
      }
      
      console.log('Using price ID:', priceId, 'for plan:', plan);
      
      try {
        // Create the checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1
            }
          ],
          mode: 'subscription',
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            userId: userId,
            pathId: pathId
          }
        });
        
        console.log('Checkout session created:', session.id);
        
        // Log the session to Firestore
        await admin.firestore().collection('users').doc(userId).collection('checkoutSessions').add({
          sessionId: session.id,
          plan,
          pathId,
          status: 'created',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Return session data in both result and direct format for compatibility
        return res.status(200).json({
          sessionId: session.id,
          url: session.url,
          result: {
            sessionId: session.id,
            url: session.url
          }
        });
      } catch (stripeError) {
        console.error('Stripe error creating session:', stripeError);
        return res.status(500).json({ 
          error: { 
            message: `Stripe error: ${stripeError.message}`,
            type: stripeError.type,
            code: stripeError.code,
            status: 'INTERNAL'
          } 
        });
      }
    } catch (error) {
      console.error('Unhandled error in createCheckoutSession:', error);
      return res.status(500).json({ 
        error: { 
          message: error.message,
          status: 'INTERNAL'
        } 
      });
    }
  });
});

// Process subscription webhook events
exports.stripeWebhook = onRequest(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
    response.status(204).send('');
    return;
  }
  
  let event;
  
  try {
    // Get the webhook secret from config
    const webhookSecret = functions.config().stripe?.webhook_secret;
    
    // Verify the event with the signature if we have a secret
    if (webhookSecret && request.headers['stripe-signature']) {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        request.headers['stripe-signature'],
        webhookSecret
      );
    } else {
      // If we don't have a secret or signature, just use the body
      event = request.body;
    }
    
    console.log('Webhook received:', event.type);
    
    // Handle different types of events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
        
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    response.status(200).send({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Process subscription checkout completion
async function handleCheckoutSessionCompleted(session) {
  try {
    // Get the user ID from the session metadata
    const userId = session.metadata.userId;
    
    if (!userId) {
      console.error('No userId found in session metadata');
      return;
    }
    
    // Get the subscription ID from the session
    const subscriptionId = session.subscription;
    
    if (!subscriptionId) {
      console.error('No subscription found in completed session');
      return;
    }
    
    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Get the price details
    const priceId = subscription.items.data[0].price.id;
    const priceInterval = subscription.items.data[0].price.recurring.interval;
    
    // Determine the plan based on the interval
    const plan = priceInterval === 'year' ? 'yearly' : 'monthly';
    
    // Store the subscription details in Firestore
    await admin.firestore().collection('users').doc(userId).update({
      subscription: {
        subscriptionId: subscriptionId,
        status: subscription.status,
        plan: plan,
        priceId: priceId,
        currentPeriodStart: admin.firestore.Timestamp.fromMillis(subscription.current_period_start * 1000),
        currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        createdAt: admin.firestore.Timestamp.fromMillis(subscription.created * 1000),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    });
    
    // Update any relevant checkout sessions
    const sessionsRef = admin.firestore().collection('users').doc(userId).collection('checkoutSessions');
    const sessionsSnapshot = await sessionsRef.where('sessionId', '==', session.id).get();
    
    if (!sessionsSnapshot.empty) {
      const batch = admin.firestore().batch();
      sessionsSnapshot.forEach(doc => {
        batch.update(doc.ref, {
          status: 'completed',
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
          subscriptionId: subscriptionId
        });
      });
      await batch.commit();
    }
    
    console.log(`Subscription ${subscriptionId} processed for user ${userId}`);
  } catch (error) {
    console.error('Error processing checkout session completion:', error);
  }
}

// Process invoice payments
async function handleInvoicePaid(invoice) {
  try {
    // Get the subscription
    const subscriptionId = invoice.subscription;
    
    if (!subscriptionId) {
      console.error('No subscription found in invoice');
      return;
    }
    
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Get the customer
    const customerId = invoice.customer;
    
    // Find the user with this customer ID
    const usersSnapshot = await admin.firestore().collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.error(`No user found with customer ID: ${customerId}`);
      return;
    }
    
    const userId = usersSnapshot.docs[0].id;
    
    // Update subscription data
    await admin.firestore().collection('users').doc(userId).update({
      'subscription.status': subscription.status,
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromMillis(subscription.current_period_start * 1000),
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
      'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Invoice payment processed for subscription ${subscriptionId}, user ${userId}`);
  } catch (error) {
    console.error('Error processing invoice payment:', error);
  }
}

// Process subscription changes
async function handleSubscriptionChange(subscription) {
  try {
    // Get the customer
    const customerId = subscription.customer;
    
    // Find the user with this customer ID
    const usersSnapshot = await admin.firestore().collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.error(`No user found with customer ID: ${customerId}`);
      return;
    }
    
    const userId = usersSnapshot.docs[0].id;
    
    // Update subscription data
    await admin.firestore().collection('users').doc(userId).update({
      'subscription.status': subscription.status,
      'subscription.currentPeriodStart': admin.firestore.Timestamp.fromMillis(subscription.current_period_start * 1000),
      'subscription.currentPeriodEnd': admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
      'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Subscription ${subscription.id} updated for user ${userId}`);
  } catch (error) {
    console.error('Error processing subscription change:', error);
  }
}

// Handle subscription cancellation
exports.cancelSubscription = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Handle CORS preflight
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }
      
      // Check if request is POST
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      
      // Get data from request body (support both formats)
      const data = req.body.data || req.body;
      const { userId } = data;
      
      if (!userId) {
        return res.status(400).json({ 
          error: { 
            message: 'Missing userId parameter', 
            status: 'INVALID_ARGUMENT' 
          } 
        });
      }
      
      // Get the user's subscription
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ 
          error: { 
            message: 'User not found', 
            status: 'NOT_FOUND' 
          } 
        });
      }
      
      const userData = userDoc.data();
      
      if (!userData.subscription || !userData.subscription.subscriptionId) {
        return res.status(404).json({ 
          error: { 
            message: 'No active subscription found', 
            status: 'NOT_FOUND' 
          } 
        });
      }
      
      // Cancel the subscription at period end
      const subscriptionId = userData.subscription.subscriptionId;
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
      
      // Update the subscription in Firestore
      await admin.firestore().collection('users').doc(userId).update({
        'subscription.cancelAtPeriodEnd': true,
        'subscription.updatedAt': admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Return success
      return res.status(200).json({
        success: true,
        result: {
          success: true,
          message: 'Subscription will be canceled at the end of the current billing period'
        }
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return res.status(500).json({ 
        error: { 
          message: error.message,
          status: 'INTERNAL'
        } 
      });
    }
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  });
});