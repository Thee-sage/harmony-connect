"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import {
  getFirestore,
  query,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { getDocs, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

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
const musicGenres = [
  "Rock",
  "Pop",
  "Hip Hop",
  "R&B",
  "Country",
  "Jazz",
  "Electronic",
  "Classical",
  // Add more genres as needed
];

function Post() {
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [qrCodeText, setQRCodeText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [text, setText] = useState("");
  const [qrCodeData, setQRCodeData] = useState("");
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [downloadURL, setDownloadURL] = useState("");
  const [caption, setCaption] = useState("");
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [communityId, setCommunityId] = useState(""); // State variable to capture the community ID input

  const handleCommunityIdChange = (e) => {
    setCommunityId(e.target.value);
  };

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userEmail = user.email;
        const userId = user.uid;
        // You can now use userEmail and userId as needed
      } else {
        // User is signed out
        // Handle this case as needed
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const generateQRCode = () => {
    setQRCodeData(text);
    setQRCodeText(text);
  };

  const generateQRCodeImage = async () => {
    try {
      const canvas = await html2canvas(
        document.getElementById("qrcode-container")
      );
      const imgData = canvas.toDataURL("image/png");
      setQRCodeImage(imgData);
    } catch (error) {
      console.error("Error generating QR Code image:", error);
    }
  };
  const handleAddCaption = async () => {
    try {
      // Add the caption to the Firestore database
      await addDoc(collection(db, "captions"), {
        text: qrCodeText,
        likeCount,
        commentCount,
        downloadURL,

        genre: selectedGenre,
        timestamp: serverTimestamp(),
        caption: caption, // Add the caption here
      });

      console.log("Caption added.");
    } catch (error) {
      console.error("Error adding caption:", error);
    }
  };
  const uploadQRCodeToFirebase = async () => {
    if (qrCodeImage) {
      const qrCodeRef = ref(storage, "qr-codes/qrcode.png");

      try {
        // Upload the image
        await uploadString(qrCodeRef, qrCodeImage, "data_url");

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(qrCodeRef);
        setDownloadURL(downloadURL);

        // Add the download URL and timestamp to Firestore
        const qrcodeDocRef = await addDoc(collection(db, "qrcodes"), {
          url: downloadURL,
          timestamp: serverTimestamp(),
          text: qrCodeText,
        });

        console.log(
          "QR Code image uploaded to Firebase Storage and added to Firestore with ID:",
          qrcodeDocRef.id
        );
      } catch (error) {
        console.error(
          "Error uploading QR Code image to Firebase Storage:",
          error
        );
      }
    }
  };

  useEffect(() => {
    if (qrCodeData) {
      generateQRCodeImage();
    } else {
      setQRCodeImage(null);
    }
  }, [qrCodeData]);

  useEffect(() => {
    async function fetchQRCodeText() {
      try {
        const qrCodeDocRef = doc(db, "qrcodes");
        const qrCodeDocSnapshot = await getDoc(qrCodeDocRef);

        if (qrCodeDocSnapshot.exists()) {
          const qrCodeData = qrCodeDocSnapshot.data();
          if (qrCodeData.text) {
            setQRCodeText(qrCodeData.text);
            console.log("QR Code text retrieved:", qrCodeData.text);
          } else {
            console.log("QR Code text is empty or undefined.");
          }
        } else {
          console.log("QR Code document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching QR Code text:", error);
      }
    }

    fetchQRCodeText();
  }, []);

  const addPostToDatabase = async () => {
    try {
      if (qrCodeText.trim() === "") {
        return;
      }
      if (!userId) {
        console.error("User not authenticated.");
        return;
      }
      const user = auth.currentUser;
      const userEmail = user ? user.email : null;

      await addDoc(collection(db, "posts"), {
        text: qrCodeText,
        likeCount,
        commentCount,
        downloadURL,
        userId,
        userEmail, // Use the downloadURL obtained from storage
        genre: selectedGenre,
        caption,
        communityId: communityId,
        timestamp: serverTimestamp(),
      });

      console.log("Post written.");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  useEffect(() => {
    // Create a query for comments sorted by timestamp
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", qrCodeText),
      orderBy("timestamp")
    );

    // Create a listener to fetch and update comments in real-time
    const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
      const updatedComments = [];
      querySnapshot.forEach((doc) => {
        updatedComments.push({ id: doc.id, ...doc.data() });
      });

      // Update the comments state with the new comments
      setComments(updatedComments);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [qrCodeText]);
  const handleComment = async () => {
    try {
      if (newComment.trim() === "") {
        return;
      }

      const commentRef = await addDoc(collection(db, "comments"), {
        text: newComment,
        postId: qrCodeText,
        userId,

        timestamp: serverTimestamp(),
      });
      setCommentCount(commentCount + 1);

      setComments([...comments, { text: newComment, id: commentRef.id }]);

      // You don't need to manually update the comments state here anymore
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this post?"
      );

      if (confirmation) {
        const postQuery = query(collection(db, "posts"));
        const postQuerySnapshot = await getDocs(postQuery);

        const matchingPost = postQuerySnapshot.docs.find(
          (doc) => doc.data().text === qrCodeText
        );

        if (matchingPost) {
          const postDocRef = doc(db, "posts", matchingPost.id);
          await deleteDoc(postDocRef);
          console.log("Post deleted successfully.");
        } else {
          console.error("No matching document found for text:", qrCodeText);
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  useEffect(() => {
    async function fetchLikeData() {
      try {
        const postDocRef = doc(db, "posts", qrCodeText);
        const postDocSnapshot = await getDoc(postDocRef);

        if (postDocSnapshot.exists()) {
          const postData = postDocSnapshot.data();
          if (postData) {
            setLikeCount(postData.likeCount || 0);

            // Check if the current user has liked this post
            const user = auth.currentUser;
            if (user) {
              setLiked(postData.likes && postData.likes[user.uid]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    }

    fetchLikeData();
  }, [qrCodeText]);

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this comment?"
      );

      if (confirmation) {
        const commentDocRef = doc(db, "comments", commentId);
        await deleteDoc(commentDocRef);
        setComments(comments.filter((comment) => comment.id !== commentId));
        setCommentCount(commentCount - 1);
        console.log("Comment deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (qrCodeText.trim() !== "") {
          console.log("Deleting post with ID:", qrCodeText);
          const postDocRef = doc(db, "posts", qrCodeText);

          const postDoc = await getDoc(postDocRef);

          if (postDoc.exists()) {
            await deleteDoc(postDocRef);
            console.log("Post deleted successfully.");
          } else {
            console.error("Document does not exist:", qrCodeText);
          }
        } else {
          console.log("qrCodeText is empty. No post deleted.");
        }

        const q = query(collection(db, "posts"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsArr = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data && doc.id) {
              postsArr.push({ ...data, id: doc.id });
            }
          });
          setPosts(postsArr);
          console.log("Posts updated:", postsArr);
        });

        return () => {
          unsubscribe();
          console.log("Firestore listener unsubscribed.");
        };
      } catch (error) {
        console.error("Error deleting or fetching posts:", error);
      }
    };

    fetchData();
  }, [db, qrCodeText]);

  return (
    <div className="post">
      <div className="post-header">
        <img
          src="user-profile-image.jpg"
          alt="User Profile"
          className="profile-picture"
        />
        <span className="user-name">Username</span>
      </div>
      <div>
        <input
          type="text"
          placeholder="Community ID"
          value={communityId}
          onChange={handleCommunityIdChange}
        />
      </div>
      <div className="post-content">
        <div className="qr-code-generator">
          <input
            type="text"
            placeholder="Text for QR code"
            value={text}
            onChange={handleTextChange}
          />
          <button onClick={generateQRCode}>Generate QR Code</button>
          {qrCodeText && <QRCode value={qrCodeText} />}
        </div>

        <p className="post-text">This is the post text.</p>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="" disabled>
            Select a genre
          </option>
          {musicGenres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div className="post-actions">
        <button onClick={handleComment}>
          <i className="fas fa-comment"></i> Comment ({commentCount})
        </button>
        <input
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Button to add caption */}
        <button onClick={handleAddCaption}>Add Caption</button>
        <button onClick={addPostToDatabase}>Add Post</button>
        <button onClick={handleDeletePost}>Delete Post</button>
        {qrCodeData && (
          <div id="qrcode-container">
            <QRCode value={qrCodeData} size={128} />
          </div>
        )}
        {qrCodeImage && (
          <div>
            <button onClick={uploadQRCodeToFirebase}>
              Upload QR Code to Firebase
            </button>
          </div>
        )}
        <div>
          <h3>Comments</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                {comment.text}
                <button onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleComment();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Post;
