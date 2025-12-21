// Quick script to manually update subscription status in Firestore
// Run this with: node fix-subscription.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You'll need to download this from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateSubscription() {
  try {
    // Replace with your actual user ID
    const userId = 'YOUR_USER_ID_HERE';
    
    console.log('🔧 Updating subscription for user:', userId);
    
    await db.collection('users').doc(userId).update({
      'subscription.status': 'active',
      'subscription.paymentFailed': false,
      'subscription.updatedAt': admin.firestore.Timestamp.now(),
      'subscriptionTier': 'artisan',
      'updatedAt': admin.firestore.Timestamp.now()
    });
    
    console.log('✅ Subscription updated successfully!');
    console.log('🔄 Please refresh your app to see the changes');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating subscription:', error);
    process.exit(1);
  }
}

updateSubscription();
