"use client";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  query,
  collection,
  getDocs,
  where,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState("");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCommunityPosts, setSelectedCommunityPosts] = useState([]);

  const createCommunity = async () => {
    if (!communityName) return;

    try {
      // Get the currently logged-in user's information
      const user = auth.currentUser;
      const userId = user.uid;
      const username = user.displayName;

      // Add the new community to Firestore
      const docRef = await addDoc(collection(db, "communities"), {
        name: communityName,
        creatorId: userId,
        creatorUsername: username,
        members: [{ userId, username }],
      });

      console.log("Community created with ID: ", docRef.id);
      setCommunityName("");
    } catch (error) {
      console.error("Error creating community: ", error);
    }
  };
  const joinCommunity = async (communityId) => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const username = user.displayName;

      // Update the members array in the community document to add the user
      const communityRef = doc(db, "communities", communityId);
      await updateDoc(communityRef, {
        members: arrayUnion({ userId, username }),
      });

      console.log(`User ${username} joined community ${communityId}`);
    } catch (error) {
      console.error("Error joining community: ", error);
    }
  };
  const fetchCommunityPosts = async (communityId) => {
    try {
      // Query the "posts" collection for posts with the matching communityId
      const postsQuery = query(
        collection(db, "posts"),
        where("communityId", "==", communityId)
      );

      const postsQuerySnapshot = await getDocs(postsQuery);

      const communityPosts = [];
      postsQuerySnapshot.forEach((doc) => {
        communityPosts.push({ id: doc.id, ...doc.data() });
      });

      setSelectedCommunityPosts(communityPosts);
    } catch (error) {
      console.error("Error fetching community posts: ", error);
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const communitiesQuery = query(collection(db, "communities"));
        const communitiesQuerySnapshot = await getDocs(communitiesQuery);
        const communitiesData = [];
        communitiesQuerySnapshot.forEach((doc) => {
          communitiesData.push({ id: doc.id, ...doc.data() });
        });
        setCommunities(communitiesData);
      } catch (error) {
        console.error("Error fetching communities: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const copyCommunityId = (communityId) => {
    // Create a temporary input element to copy the text to the clipboard
    const tempInput = document.createElement("input");
    tempInput.value = communityId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  return (
    <div>
      <h1>Create a Community</h1>
      <input
        type="text"
        placeholder="Community Name"
        value={communityName}
        onChange={(e) => setCommunityName(e.target.value)}
      />
      <button onClick={createCommunity}>Create Community</button>

      <h1>Join a Community</h1>
      {loading ? (
        <p>Loading communities...</p>
      ) : (
        <ul>
          {communities.map((community) => (
            <li key={community.id}>
              {community.name}
              <button onClick={() => fetchCommunityPosts(community.id)}>
                Show Posts
              </button>
              <button onClick={() => joinCommunity(community.id)}>
                Join Community
              </button>
              <button onClick={() => copyCommunityId(community.id)}>
                Copy Community ID
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedCommunityPosts.length > 0 && (
        <div>
          <h1>Posts for Selected Community</h1>
          <ul>
            {selectedCommunityPosts.map((post, index) => (
              <li key={index}>
                Caption: {post.caption}
                <br />
                Genre: {post.genre}
                <br />
                Text: {post.text}
                <br />
                Comment Count: {post.commentCount}
                <br />
                Like Count: {post.likeCount}
                <br />
                User Email: {post.userEmail}
                <br />
                Timestamp:{" "}
                {new Date(post.timestamp.seconds * 1000).toLocaleString()}
                <br />
                {/* You can add more fields here */}
                <img src={post.downloadURL} alt="Post Image" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
