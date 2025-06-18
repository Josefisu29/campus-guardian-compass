
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnNj7hLoVHMOsTKJ5YulMAr3xF050HwLg",
  authDomain: "mycampus-aeeb6.firebaseapp.com",
  databaseURL: "https://mycampus-aeeb6-default-rtdb.firebaseio.com/",
  projectId: "mycampus-aeeb6",
  storageBucket: "mycampus-aeeb6.firebasestorage.app",
  messagingSenderId: "365444920677",
  appId: "1:365444920677:web:0d5cdf575fdc1463d01d8c",
  measurementId: "G-BHSMF8KY90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Initialize messaging if supported
let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { messaging };
export default app;

console.log('Firebase initialized successfully');
