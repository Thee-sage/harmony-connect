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
  apiKey: "AIzaSyAYlyB4ppiTZJ4PIeCHrg7FRGN9wQDP8n4",
  authDomain: "harmony-connect-a47ec.firebaseapp.com",
  projectId: "harmony-connect-a47ec",
  storageBucket: "harmony-connect-a47ec.appspot.com",
  messagingSenderId: "998376996522",
  appId: "1:998376996522:web:19d25511bc569c60d41ad3",
  measurementId: "G-4QCHFQL992",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getFirestore(app);
