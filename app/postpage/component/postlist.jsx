import React, { useState } from "react";
import Post from "./post"; // Import the Post component from the correct path

function PostList() {
  const [posts, setPosts] = useState([]);

  const handleAddPost = () => {
    // Create a new post and add it to the list
    const newPost = {
      id: posts.length + 1,
    };
    setPosts([...posts, newPost]);
  };

  const handlePostDelete = (postId) => {
    // Remove the deleted post from the list
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="post-list">
      <button onClick={handleAddPost}>Create Post</button>
      {posts.map((post) => (
        <Post key={post.id} postId={post.id} onDelete={handlePostDelete} />
      ))}
    </div>
  );
}

export default PostList;
