// functions/index.js - FIXED: Handles undefined values properly

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

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

// 🆕 FIXED: STRIPE WEBHOOK HANDLER
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

    const config = functions.config();
    const stripeSecretKey = config.stripe.secret_key;
    
    if (!stripeSecretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration missing');
    }

    const stripeClient = stripe(stripeSecretKey);

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

    const config = functions.config();
    const stripeSecretKey = config.stripe.secret_key;
    
    if (!stripeSecretKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe configuration missing');
    }

    const stripeClient = stripe(stripeSecretKey);

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