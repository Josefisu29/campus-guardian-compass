
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP-nikiUzj3P-Ss7HOoeQeb_AJa7U2MMg",
  authDomain: "camp-642be.firebaseapp.com",
  projectId: "camp-642be",
  storageBucket: "camp-642be.firebasestorage.app",
  messagingSenderId: "205587009075",
  appId: "1:205587009075:web:aedcdb038df20d4f605d46",
  measurementId: "G-Y6JQYFKV5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
