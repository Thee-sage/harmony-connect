"use client";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import Link from "next/link";
import styles from "app/signup/page.module.css";
import { GrFormViewHide, GrFormClose } from "react-icons/gr";
import { HiLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
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

  useEffect(() => {
    // Clean up the URL when the component unmounts
    return () => {
      if (formData.profilePicture) {
        URL.revokeObjectURL(formData.profilePicture);
      }
    };
  }, [formData.profilePicture]);

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
  const closeProfile = () => {
    setUserData(null);
  };
  const toggleProfileButton = () => {
    if (userData) {
      // If userData is available, show the "Close Profile" button
      return (
        <button
          style={{
            border: "none",
            outline: "none",
            fontSize: "18px",
          }}
          className={styles.closeProfile}
          onClick={closeProfile}
        >
          <GrFormClose />
          Close Profile
        </button>
      );
    } else {
      // If userData is not available, show the "View your profile" button
      return (
        <button
          style={{
            border: "none",
            outline: "none",
            fontSize: "18px",
          }}
          className={styles.viewYourProfile}
          onClick={redirectToUserData}
        >
          <GrFormViewHide />
          View your profile
        </button>
      );
    }
  };
  return (
    <div className={styles.desktop7}>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <div className={styles.desktop10Child} />
          <div className={styles.welcomeJojojojogmailcom}>
            <p className={styles.welcome}>welcome,</p>
            <p className={styles.welcome}>&nbsp;</p>
            <p className={styles.welcome}>&nbsp;</p>
            <p className={styles.welcome}> {user.email}</p>
          </div>
          <div className={styles.rectangleDivxx}>{toggleProfileButton()}</div>
          <div className={styles.logdout}>
            <button
              style={{
                border: "none",
                outline: "none",
                fontSize: "25px",
              }}
              onClick={handleLogout}
            >
              <HiLogout /> Logout
            </button>
          </div>
          {userData && (
            <div className="user-data">
              <div className={styles.namesYoshikagekira}>
                <span>name:</span>
                <span className={styles.yoshikagekira}> {userData.name}</span>
              </div>
              <div className={styles.bisoYoshikagekira}>
                <span>
                  <span>bio:</span>
                </span>
                <span className={styles.yoshikagekira2}>
                  <span>{` `}</span>
                  <span>{userData.bio}</span>
                </span>
              </div>
              <div className={styles.usernasmeYoshikagekira}>
                <span>username:</span>
                <span className={styles.yoshikagekira}>
                  {" "}
                  {userData.username}
                </span>
              </div>
              <div className={styles.desktop10Inner} />
              {userData.profilePicture && (
                <img
                  className={styles.desktop10Inner}
                  src={userData.profilePicture}
                  alt={`${userData.name}'s Profile`}
                />
              )}
              <div className={styles.desktop10Item} />
              <div>
                <li>
                  <Link className={styles.profilde} href="/yourpage">
                    <p>
                      go to your profile
                      <CgProfile />
                    </p>
                  </Link>
                </li>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <div className={styles.desktop7Child} />
          <div className={styles.desktop7Item} />
          <div className={styles.rectangleDiv} />
          <div className={styles.desktop7Child1} />
          <div className={styles.desktop7Child2} />
          <div className={styles.desktop7Child3} />
          <div className={styles.desktop7Child9} />
          <div className={styles.desktop7Child6} />
          <div>
            <div className={styles.inputYourInformationContainer}>
              <p className={styles.inputYourInformation}>
                input your information
              </p>
              <p className={styles.inputYourInformation}>&nbsp;</p>
              <p className={styles.inputYourInformation}>
                note: the information being inputted can’t be changed
              </p>
            </div>
            <div className={styles.onboarding}>
              <p className={styles.inputYourInformation}>onboarding</p>
              <p className={styles.blankLine}>&nbsp;</p>
            </div>
          </div>
          <div className="form-group">
            <label className={styles.name}>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="your name.."
              value={formData.name}
              className={`${styles.desktop7Inner} ${
                formData.name ? styles.inputWithValue : ""
              } ${styles.inputField}`}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className={styles.password}>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="your password.."
              className={`${styles.desktop7Child6} ${
                formData.name ? styles.inputWithValue : ""
              } ${styles.inputField}`}
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className={styles.gmail}>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="your email.."
              className={`${styles.desktop7Child4} ${
                formData.email ? styles.inputWithValue : ""
              } ${styles.inputField}`}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className={styles.username}>username:</label>
            <input
              type="text"
              name="username"
              placeholder="your username.."
              className={`${styles.desktop7Child9} ${
                formData.email ? styles.inputWithValue : ""
              } ${styles.inputField}`}
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label className={styles.profilePicture}>Profile Picture:</label>
            <input
              style={{
                border: "none",
                outline: "none",
                fontSize: "30px",
              }}
              className={styles.desktop7Child2}
              fontSize="10px"
              type="file"
              accept="image/*"
              name="profilePicture"
              onChange={handleInputChange}
            />
            {formData.profilePicture && (
              <img
                className={`${styles.desktop7Child1} ${styles.inputField}`}
                src={URL.createObjectURL(formData.profilePicture)}
                alt="Selected Profile Picture"
              />
            )}
          </div>
          <div className="form-group">
            <label className={styles.bio}>Bio:</label>
            <input
              name="bio"
              fontSize="10px"
              placeholder="your bio.."
              value={formData.bio}
              onChange={handleInputChange}
              className={`${styles.rectangleDiv} ${
                formData.bio ? styles.inputWithValue : ""
              } ${styles.inputField}`}
            />
          </div>
          <button
            style={{
              border: "none",
              outline: "none",
              fontSize: "30px",
            }}
            className={styles.submitForm}
            type="submit"
          >
            Continue
          </button>
        </form>
      )}
    </div>
  );
};

export default Onboarding;
