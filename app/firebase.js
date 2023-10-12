// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {

};

let auth, database;

// Check if the code is running in a browser environment
if (typeof window !== "undefined") {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  auth = getAuth(app);
  database = getFirestore(app);
  // Rest of your Firebase-related code can go here
}

export { auth, database };
