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
  });
});