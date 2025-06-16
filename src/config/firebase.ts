
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;
