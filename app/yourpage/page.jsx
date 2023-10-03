"use client";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "app/yourpage/page.module.css";
import Link from "next/link";

const firebaseConfig = {
 
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const Desktop5 = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          setLoading(true);
          setError(null);

          // Retrieve the user data based on the email of the logged-in user
          const usersQuery = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          const usersQuerySnapshot = await getDocs(usersQuery);

          if (usersQuerySnapshot.empty) {
            setError("User not found.");
            setUserData(null); // Clear user data if not found
          } else {
            // Assuming there's only one user with the given email
            const userData = usersQuerySnapshot.docs[0].data();
            console.log("Retrieved user data:", userData);
            setUserData(userData);
          }
        } catch (error) {
          console.error("Error retrieving user:", error);
          setError("An error occurred while retrieving user.");
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, db]);

  return (
    <div className={styles.desktop5}>
      <div className={styles.desktop5Child} />
      <div className={styles.desktop5Item} />
      <div className={styles.wellCome}>
        <span>Well</span>
        <span className={styles.come}> come</span>
      </div>
      <p className={styles.bio2}>bio</p>
      <div className={styles.desktop5Inner} />
      <div className={styles.rectangleDiv} />
      <div className={styles.selectOneToContainer}>
        <span>select</span>
        <span className={styles.one}> one</span>
        <span>{` to `}</span>
        <span className={styles.one}>access</span>
      </div>
      <div className={styles.desktop5Child3} />
      <div className={styles.desktop5Child4} />
      <div>
        <Link href="/postpage" passHref>
          <div>
            <div>
              <div className={styles.createPosts}>Create Posts</div>
            </div>
          </div>
        </Link>
        <Link href="/yourposts" passHref>
          <div>
            <div>
              <div className={styles.yourPosts}>Your Posts</div>
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.desktop5Child1} />
      <div className={styles.desktop5Child2} />
      <div className={styles.clickOnCommunities}>
        click on communities to glide through your feed
      </div>
      <div className={styles.communities}>communities</div>
      <div className={styles.yourCommunities}>
        <span>{`manage`}</span>
        <span className={styles.one}> posts</span>
      </div>
      <div className={styles.notInOneContainer}>
        <span>{`not in one? join one of the `}</span>
        <span className={styles.one}>communities</span>
      </div>

      <div className={styles.profilePicture}></div>
      <div className={styles.clickHereToContainer}>
        <span>
          click <a href="communities">here</a> to browse
        </span>
        <span className={styles.one}> through the communities</span>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {userData && (
        <div>
          <div className={styles.userInfo}>
            <p className={styles.name}>{userData.name}</p>
            <div>
              <span className={styles.gmail4}>gmail:</span>
              <span className={styles.gmail3}>{userData.email}</span>
            </div>
            <div>
              <span className={styles.gmail}>username:</span>
              <span className={styles.gmail2}>{userData.username}</span>
            </div>
            <div>
              <span className={styles.bio}>bio:</span>
              <span className={styles.bio2}>{userData.bio}</span>
            </div>
            <img
              className={styles.profilePicture}
              alt=""
              src={userData.profilePicture}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Desktop5;
