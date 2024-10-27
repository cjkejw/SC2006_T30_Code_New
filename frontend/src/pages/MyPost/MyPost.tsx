// import React from 'react'

// const MyPost = () => {
//   return (
//     <div>MyPost</div>
//   )
// }
//  export default MyPost

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';

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

        setPosts(response.data); // Set the fetched posts
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
    return <CircularProgress />; // Show loading spinner
  }

  if (error) {
    return <Typography color="error">{error}</Typography>; // Show error message
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Posts
      </Typography>
      {posts.length === 0 ? (
        <Typography>No posts available.</Typography> // Message for no posts
      ) : (
        posts.map((post) => (
          <Card key={post.postId} variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2">{post.content}</Typography>
              <Typography variant="caption" color="textSecondary">
                Created At: {new Date(post.createdAt).toLocaleString()}
              </Typography>
              {/* <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                Flagged: {post.isFlagged ? "Yes" : "No"}
              </Typography> */}
              <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                Posted by: {post.user.firstName} {post.user.lastName} ({post.user.email})
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MyPost;

