
// Firebase Configuration and Initialization
const firebaseConfig = {
  apiKey: "AIzaSyBKyJyDQUZ57D1aIj4NV2kv1nWv82mjO1k",
  authDomain: "campnav-66eaa.firebaseapp.com",
  databaseURL: "https://campnav-66eaa-default-rtdb.firebaseio.com/",
  projectId: "campnav-66eaa",
  storageBucket: "campnav-66eaa.firebasestorage.app",
  messagingSenderId: "762836324985",
  appId: "1:762836324985:web:aadf3bfe6413cd100dbaa8",
  measurementId: "G-H4H9Y6LV1X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();
let messaging = null;

// Initialize messaging if supported
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
  
  // Request notification permission
  messaging.requestPermission().then(() => {
    console.log('Notification permission granted');
    return messaging.getToken();
  }).then((token) => {
    console.log('FCM Token:', token);
    // Store token in user profile
    if (auth.currentUser) {
      db.collection('users').doc(auth.currentUser.uid).update({
        fcmToken: token
      });
    }
  }).catch((err) => {
    console.log('Unable to get permission or token', err);
  });

  // Handle foreground messages
  messaging.onMessage((payload) => {
    console.log('Message received:', payload);
    showNotification(payload.notification.title, payload.notification.body);
  });
}

// Firestore offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

// Export for global use
window.firebaseApp = {
  auth,
  db,
  rtdb,
  messaging,
  firebase
};
