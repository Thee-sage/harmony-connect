"use react";
import React, { useState } from "react";
import Post from "./post";
import styles from "app/postpage/page.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineRollback } from "react-icons/ai";
import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
function PostList() {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleToggleCreatePost = () => {
    // Toggle the state to show/hide the Create Post content
    setShowCreatePost(!showCreatePost);
  };

  return (
    <div className={styles.postlist}>
      <div className={styles.whitebox} />
      <button
        style={{
          fontSize: "24px",
          outline: "none",
          border: "none",
          marginRight: "35px",
          textDecoration: "none", // Remove underline
        }}
        className={styles.cc}
      >
        <Link href="/yourpage">
          profile <AiOutlineRollback />
        </Link>
      </button>
      <button
        className={styles.pp}
        style={{ fontSize: "24px", outline: "none", border: "none" }}
        onClick={handleToggleCreatePost}
      >
        {showCreatePost ? (
          <span>
            Close Post <AiOutlineClose />
          </span>
        ) : (
          <span>
            Create Post <AiOutlinePlus />
          </span>
        )}
      </button>

      {showCreatePost && <Post postId={1} />}
    </div>
  );
}

export default PostList;
