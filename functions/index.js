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
  });
});