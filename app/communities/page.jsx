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
  getDoc,
  addDoc,
  increment,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import styles from "app/communities/page.module.css";
import { BiShow } from "react-icons/bi";
import { AiOutlineCopy } from "react-icons/ai";
import { FaHandsHelping } from "react-icons/fa";
const firebaseConfig = {

};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState("");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCommunityPosts, setSelectedCommunityPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState({});
  const [superlikes, setSuperlikes] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [communityDescription, setCommunityDescription] = useState("");
  const [selectedCommunityImage, setSelectedCommunityImage] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPostText, setSelectedPostText] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0); // Initialize currentIndex
  const communitiesPerPage = 1;

  const presetCommunityImages = [
    "https://i.pinimg.com/564x/75/d0/09/75d0099d355b411ff8502b8a2eaacb62.jpg",
    "https://i.pinimg.com/564x/dc/4f/21/dc4f21932a6a6453c91585f514f8d73f.jpg",
    "https://i.pinimg.com/564x/72/ac/b8/72acb88ce53cb8dc1dee27b0df4d2187.jpg",
    "https://i.pinimg.com/474x/44/73/61/4473618e46d3ea6074ffea41cc51cc10.jpg",
    "https://i.pinimg.com/736x/98/c7/cc/98c7cc1060fea49def69449c5d56b485.jpg",
    "https://i.pinimg.com/736x/60/06/24/60062448e1d64dcfe0650e73eb550a0b.jpg",
  ];

  const presetImageDescriptions = {
    "https://i.pinimg.com/564x/75/d0/09/75d0099d355b411ff8502b8a2eaacb62.jpg":
      "music",
    "https://i.pinimg.com/564x/dc/4f/21/dc4f21932a6a6453c91585f514f8d73f.jpg":
      "scenery",
    "https://i.pinimg.com/564x/72/ac/b8/72acb88ce53cb8dc1dee27b0df4d2187.jpg":
      "forests",
    "https://i.pinimg.com/474x/44/73/61/4473618e46d3ea6074ffea41cc51cc10.jpg":
      "beach",
    "https://i.pinimg.com/736x/98/c7/cc/98c7cc1060fea49def69449c5d56b485.jpg":
      "pond",
    "https://i.pinimg.com/736x/60/06/24/60062448e1d64dcfe0650e73eb550a0b.jpg":
      "train tracks",
  };
  const handlePresetImageChange = (e) => {
    const imageUrl = e.target.value;
    setSelectedPresetImage(imageUrl);

    // Set image preview
    if (presetImageDescriptions.hasOwnProperty(imageUrl)) {
      setImagePreview(presetImageDescriptions[imageUrl]);
    } else {
      setImagePreview(null);
    }
  };
  const createCommunity = async () => {
    if (!communityName || !communityDescription || !selectedPresetImage) return;

    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const username = user.displayName;

      const docRef = await addDoc(collection(db, "communities"), {
        name: communityName,
        description: communityDescription,
        creatorId: userId,
        creatorUsername: username,
        members: [{ userId, username }],
        imageURL: selectedPresetImage, // Use the selected preset image URL
      });

      console.log("Community created with ID: ", docRef.id);
      setCommunityName("");
      setCommunityDescription("");
      setSelectedPresetImage(""); // Clear the selected preset image
      setImagePreview(null); // Clear the image preview
    } catch (error) {
      console.error("Error creating community: ", error);
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const username = user.displayName;

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
    const tempInput = document.createElement("input");
    tempInput.value = communityId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  };

  const fetchAndUpdateComments = async (postId) => {
    try {
      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", postId)
      );

      const commentsQuerySnapshot = await getDocs(commentsQuery);

      const comments = [];
      commentsQuerySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });

      return comments;
    } catch (error) {
      console.error("Error fetching comments: ", error);
      return [];
    }
  };

  const handleCommentSubmit = async (postId, post) => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const username = user.displayName;

      const docRef = await addDoc(collection(db, "comments"), {
        postId: post.text,
        userId,
        username,
        text: commentText,
        timestamp: new Date(),
      });

      console.log("Comment created with ID: ", docRef.id);

      setCommentText("");

      const updatedComments = await fetchAndUpdateComments(post.text);
      setPostComments((prevComments) => ({
        ...prevComments,
        [post.text]: updatedComments,
      }));
    } catch (error) {
      console.error("Error creating comment: ", error);
    }
  };

  const handleSuperlike = async (postId) => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;

      console.log("Liked Posts:", likedPosts);

      // Check if the post is already liked
      if (likedPosts.includes(postId)) {
        console.log("Unsuperliking post:", postId);

        // Post is already liked, so perform "Unsuperlike"
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          superlikesCount: increment(-1), // Decrement the superlikes count
        });

        // Remove the post from the likedPosts state
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.filter((id) => id !== postId)
        );
      } else {
        console.log("Superliking post:", postId);

        // Post is not yet liked, perform "Superlike"

        // Get the post's creator email
        const post = selectedCommunityPosts.find((post) => post.id === postId);
        const postCreatorEmail = post?.userEmail;

        // Make sure the post has a creator email
        if (!postCreatorEmail) {
          console.error("Error: Post creator email not found.");
          return;
        }

        // Update Firestore to record the superlike
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          superlikesCount: increment(1),
        });

        // Transfer the like to the post's creator (using email)
        const usersQuery = query(
          collection(db, "users"),
          where("email", "==", postCreatorEmail)
        );
        const usersQuerySnapshot = await getDocs(usersQuery);
        if (!usersQuerySnapshot.empty) {
          // Assuming there's only one user with the same email
          const userDoc = usersQuerySnapshot.docs[0];
          const userRef = doc(db, "users", userDoc.id);
          await updateDoc(userRef, {
            likesGiven: increment(1),
            likesReceived: increment(1),
          });
        } else {
          console.error(
            `Error: User with email ${postCreatorEmail} not found.`
          );
        }

        // Add the post to the likedPosts state
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
      }

      console.log(`User ${userId} (un)superliked post ${postId}`);
    } catch (error) {
      console.error("Error (un)superliking post: ", error);
    }
  };
  const user = auth.currentUser;
  const userId = user?.uid;

  useEffect(() => {
    // Fetch the user's liked posts from the database and update the likedPosts state.
    const fetchLikedPosts = async () => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (userData && userData.likedPosts) {
        setLikedPosts(userData.likedPosts);
      }
    };

    fetchLikedPosts();
  }, [userId]);
  useEffect(() => {
    // Ensure userId is defined and not null before calling fetchLikedPosts
    if (userId) {
      fetchLikedPosts();
    }
  }, [userId]);

  const handlePostTextLoad = (postId, text) => {
    setSelectedPostText((prevSelectedPostText) => ({
      ...prevSelectedPostText,
      [postId]: text,
    }));
  };
  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - communitiesPerPage);
    }
  };

  const scrollRight = () => {
    if (currentIndex + communitiesPerPage < communities.length) {
      setCurrentIndex(currentIndex + communitiesPerPage);
    }
  };

  return (
    <div className={styles.desktop11}>
      <div className={styles.desktop11Child} />
      <div className={styles.createCommunities}>create communities</div>
      <div className={styles.existingCommunities}>existing communities</div>
      <div className={styles.orJoin}>or join</div>
      <div className={styles.desktop11Item} />
      <div className={styles.desktop11Inner} />
      <input
        type="text"
        placeholder="Community Name.."
        className={styles.nameTheCommunity}
        value={communityName}
        onChange={(e) => setCommunityName(e.target.value)}
      />
      <textarea
        placeholder="Community Description (max 200 words)"
        value={communityDescription}
        className={styles.description1}
        onChange={(e) => {
          // Limit the input to 200 characters (words are separated by spaces)
          const inputValue = e.target.value;
          const words = inputValue.split(/\s+/);
          if (words.length <= 200) {
            setCommunityDescription(inputValue);
          }
        }}
        maxLength={900} // Optional: Set a maximum character limit (adjust as needed)
      ></textarea>

      <select
        className={styles.selectAnImage}
        value={selectedPresetImage}
        onChange={handlePresetImageChange}
      >
        <option value="">Select an image</option>
        {presetCommunityImages.map((url, index) => (
          <option key={index} value={url}>
            {presetImageDescriptions[url]}
          </option>
        ))}
      </select>

      {/* Image Preview */}
      {imagePreview && (
        <img
          className={styles.rectangleDiv}
          src={selectedPresetImage}
          alt={imagePreview}
        />
      )}

      <button className={styles.createCommunity} onClick={createCommunity}>
        Create Community
      </button>
      {loading ? (
        <p>Loading communities...</p>
      ) : (
        <div>
          <div>
            <div className={styles.desktop11Child6} />
            <div className={styles.desktop11Child7} />
            <div className={styles.desktop11Child8} />
            <div className={`${styles.div}`} onClick={scrollLeft}></div>
            <div className={styles.scrollableList}>
              <ul>
                {communities
                  .slice(currentIndex, currentIndex + communitiesPerPage)
                  .map((community) => (
                    <div key={community.id} className={styles.communityItem}>
                      <div className={styles.communityCard}>
                        <div className={styles.description}>description</div>
                        <img
                          className={styles.desktop11Child1}
                          src={community.imageURL}
                          alt={community.name}
                        />
                        <div className={styles.name}>{community.name}</div>

                        <p className={styles.theDescription}>
                          {community.description}
                        </p>
                        <div
                          className={styles.showPosts}
                          onClick={() => fetchCommunityPosts(community.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <BiShow />
                          Show Posts
                        </div>
                        <div
                          className={styles.joinCommunity}
                          onClick={() => joinCommunity(community.id)}
                          style={{ cursor: "pointer" }}
                        >
                          Join Community
                          <FaHandsHelping />
                        </div>
                        <div
                          className={styles.communityId}
                          onClick={() => copyCommunityId(community.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <AiOutlineCopy />
                          Copy Community ID
                        </div>
                      </div>
                    </div>
                  ))}
              </ul>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={scrollRight}
              className={styles.div1}
            ></div>
          </div>
        </div>
      )}

      {selectedCommunityPosts.length > 0 && (
        <div>
          <div
            className={styles.desktop11Child2}
            style={{ maxHeight: "1000px", overflowY: "scroll" }}
          >
            <ul>
              {selectedCommunityPosts.map((post, index) => (
                <div key={index}>
                  <div>
                    <p>
                      ////////////////////////newpost////////////////////////
                    </p>
                    <p>post by:{post.userEmail}</p>
                    <p className={styles.genre}>Genre: {post.genre}</p>
                    <p>Caption: {post.caption}</p>
                    <button
                      className={styles.scan2listen}
                      onClick={() => handlePostTextLoad(post.id, post.text)}
                    >
                      scan2listen
                    </button>
                    {selectedPostText[post.id] && (
                      <div>
                        <h2>qr code data</h2>
                        <p>{selectedPostText[post.id]}</p>
                      </div>
                    )}
                    <p>
                      Timestamp:{" "}
                      {new Date(post.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                    <img
                      className={styles.desktop11Child3}
                      src={post.downloadURL}
                      alt="Post Image"
                    />
                    <div>
                      <input
                        className={styles.submitComment}
                        type="text"
                        placeholder="Enter your comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        className={styles.submitComment1}
                        onClick={() => handleCommentSubmit(post.text, post)}
                      >
                        Submit Comment
                      </button>
                    </div>
                    <button onClick={() => handleSuperlike(post.id)}>
                      {likedPosts.includes(post.id)
                        ? "Unsuperlike"
                        : "Superlike"}
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCommunity;
