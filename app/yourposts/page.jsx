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
const auth = getAuth(firebaseApp);

const Desktop5 = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const toggleComments = (index) => {
    setUserPosts((prevUserPosts) => {
      const updatedUserPosts = [...prevUserPosts];
      updatedUserPosts[index].showComments =
        !updatedUserPosts[index].showComments;
      return updatedUserPosts;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          setLoading(true);
          setError(null);

          const usersQuery = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          const usersQuerySnapshot = await getDocs(usersQuery);

          if (usersQuerySnapshot.empty) {
            setError("User not found.");
            setUserData(null);
          } else {
            const userData = usersQuerySnapshot.docs[0].data();
            console.log("Retrieved user data:", userData);
            setUserData(userData);
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
          setError("An error occurred while retrieving user data.");
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

  useEffect(() => {
    if (userData) {
      const retrieveUserPosts = async () => {
        try {
          setLoading(true);
          setError(null);

          const userPostsQuery = query(
            collection(db, "posts"),
            where("userEmail", "==", userData.email)
          );
          const userPostsQuerySnapshot = await getDocs(userPostsQuery);

          const userPostsData = [];
          userPostsQuerySnapshot.forEach((doc) => {
            const userPostData = doc.data();
            console.log("Retrieved user-specific post data:", userPostData);
            userPostsData.push(userPostData);
          });

          console.log("All User-Specific Post Data:", userPostsData);
          setUserPosts(userPostsData);
        } catch (error) {
          console.error("Error retrieving user posts:", error);
          setError("An error occurred while retrieving user posts.");
        } finally {
          setLoading(false);
        }
      };

      retrieveUserPosts();
    }
  }, [db, userData]);

  useEffect(() => {
    if (userPosts.length > 0) {
      const retrieveComments = async () => {
        try {
          setLoading(true);
          setError(null);

          const commentsQuery = query(collection(db, "comments"));
          const commentsQuerySnapshot = await getDocs(commentsQuery);

          const commentsData = [];

          commentsQuerySnapshot.forEach((doc) => {
            const commentData = doc.data();
            commentsData.push(commentData);
          });

          // Map comments to corresponding posts
          const updatedUserPosts = userPosts.map((post) => {
            const postComments = commentsData.filter(
              (comment) => comment.postId === post.text
            );
            return { ...post, comments: postComments };
          });

          setUserPosts(updatedUserPosts);
        } catch (error) {
          console.error("Error retrieving comments:", error);
          setError("An error occurred while retrieving comments.");
        } finally {
          setLoading(false);
        }
      };

      retrieveComments();
    }
  }, [db, userPosts]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {userData && (
        <div>
          <div>
            <p>{userData.name}</p>
            <div>
              <span>gmail:</span>
              <span>{userData.email}</span>
            </div>
            <div>
              <span>username:</span>
              <span>{userData.username}</span>
            </div>
            <div>
              <span>bio:</span>
              <span>{userData.bio}</span>
            </div>
            <img alt="" src={userData.profilePicture} />
          </div>
        </div>
      )}
      <div>
        <h1>Your Posts</h1>
        {error && <p>Error: {error}</p>}
        {userPosts.map((post, index) => (
          <div key={index}>
            <h2>Post {index + 1}</h2>
            <p>Text: {post.text}</p>
            <p>Like Count: {post.likeCount}</p>
            <p>Genre: {post.genre}</p>
            <p>Uploaded on: {post.timestamp?.toDate().toLocaleString()}</p>
            <img alt="" src={post.downloadURL} />
            <h1> caption: {post.caption}</h1>

            {/* Add a button to toggle comments */}
            <button onClick={() => toggleComments(index)}>
              {post.showComments ? "Hide Comments" : "Show Comments"}
            </button>

            {/* Render comments under each post */}
            {post.showComments && (
              <div>
                <h3>Comments:</h3>
                {post.comments &&
                  post.comments.map((comment, commentIndex) => (
                    <div key={commentIndex}>
                      <p>Comment {commentIndex + 1}</p>
                      <p>Text: {comment.text}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Desktop5;
