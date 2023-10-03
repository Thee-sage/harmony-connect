"use client";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import Link from "next/link";

import {
  getFirestore,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut, // Import signOut function
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYlyB4ppiTZJ4PIeCHrg7FRGN9wQDP8n4",
  authDomain: "harmony-connect-a47ec.firebaseapp.com",
  projectId: "harmony-connect-a47ec",
  storageBucket: "harmony-connect-a47ec.appspot.com",
  messagingSenderId: "998376996522",
  appId: "1:998376996522:web:19d25511bc569c60d41ad3",
  measurementId: "G-4QCHFQL992",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

const Onboarding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    profilePicture: null,
    bio: "",
  });

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // New state to store user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "profilePicture") {
      if (files.length > 0) {
        setFormData({
          ...formData,
          [name]: files[0],
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.name.trim() === "" || formData.email.trim() === "") {
        return;
      }

      // Check if the email already exists in the database
      const q = query(
        collection(db, "users"),
        where("email", "==", formData.email)
      );
      const emailExistsSnapshot = await getDocs(q);

      if (!emailExistsSnapshot.empty) {
        console.log(
          "Email already exists. Please log in with your Gmail account."
        );
        return;
      }

      // Create a new user in Firebase Authentication
      const { email, password } = formData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile (name)
      await updateProfile(user, { displayName: formData.name });

      // Initialize profilePictureURL to null
      let profilePictureURL = null;

      if (formData.profilePicture) {
        const profilePictureRef = ref(
          storage,
          `profilePictures/${formData.profilePicture.name}`
        );
        await uploadBytes(profilePictureRef, formData.profilePicture);
        profilePictureURL = await getDownloadURL(profilePictureRef);
      }

      // Create a reference to the "users" collection and add a new user document
      await addDoc(collection(db, "users"), {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        profilePicture: profilePictureURL,
        bio: formData.bio,
        timestamp: serverTimestamp(),
      });

      console.log("User data written to Firestore.");
    } catch (error) {
      console.error("Error adding user data:", error);
    }
  };

  const redirectToUserData = async () => {
    if (user) {
      // Get the user's document based on their email
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        // Assuming only one document matches the email
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        // Set the user data to the state
        setUserData(userData);

        // You can implement the redirection or display logic here
        console.log("User data:", userData);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Onboarding</h1>
      {error && <p className="error-message">{error}</p>}
      {user ? (
        <div>
          <h2>Welcome, {user.email}!</h2>
          <button onClick={redirectToUserData}>View Your Data</button>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              name="profilePicture"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type="submit">Continue</button>
        </form>
      )}

      {/* Display user data if available */}
      {userData && (
        <div className="user-data">
          <h2>Your Profile</h2>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Bio: {userData.bio}</p>
          <p>username: {userData.username}</p>
          {userData.profilePicture && (
            <img
              src={userData.profilePicture}
              alt={`${userData.name}'s Profile`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
