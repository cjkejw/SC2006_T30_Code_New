import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserDTO {
  firstName: string;
  lastName: string;
  email: string;
}

interface PostDTO {
  postId: number;
  title: string;
  content: string;
  createdAt: string;
  isFlagged: boolean;
  user: UserDTO; // Include user info
}

const MyPost: React.FC = () => {
  useEffect(() => {
    document.title = "View My Posts";
  }, []);

  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token for authorization

        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const response = await axios.get<PostDTO[]>('http://localhost:5073/post/my-posts', {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
        });

        // Sort posts by createdAt date in descending order
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(sortedPosts); // Set the sorted posts
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts.'); // Error handling
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchMyPosts(); // Call the fetch function
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="error">{error}</div>; // Show error message
  }

  return (
    <div className="container">
      <h1>My Posts</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p> // Message for no posts
      ) : (
        posts.map((post) => (
          <div key={post.postId} className="card">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p className="created-at">Created At: {new Date(post.createdAt).toLocaleString()}</p>
            <p className="posted-by">
              Posted by: {post.user.firstName} {post.user.lastName} ({post.user.email})
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPost;
