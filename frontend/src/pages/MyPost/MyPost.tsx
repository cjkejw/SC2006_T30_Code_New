// import React from 'react'

// const MyPost = () => {
//   return (
//     <div>MyPost</div>
//   )
// }

// export default MyPost

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface CommentDTO {
  commentId: number;
  postId: number;
  commentContent: string;
  createdAt: string;
}

interface PostDTO {
  postId: number;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  isFlagged: boolean;
  comments: CommentDTO[];
}

const MyPost: React.FC = () => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get<PostDTO[]>(
          'http://localhost:5073/post/my-posts',
          { withCredentials: true } // Ensures cookies (for auth) are included
        );
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError('Failed to fetch your posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Posts
      </Typography>

      <Button
        component={Link}
        to="/forum"
        variant="contained"
        color="primary"
        sx={{ marginBottom: 2 }}
      >
        Back to Forum
      </Button>

      {posts.length === 0 ? (
        <Typography>No posts to display.</Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.postId} variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" gutterBottom>
                {post.content}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Created At: {new Date(post.createdAt).toLocaleString()}
              </Typography>
              {post.comments.length > 0 && (
                <div>
                  <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                    Comments:
                  </Typography>
                  {post.comments.map((comment) => (
                    <Typography
                      key={comment.commentId}
                      variant="body2"
                      sx={{ marginLeft: 2 }}
                    >
                      {comment.commentContent} -{' '}
                      {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default MyPost;