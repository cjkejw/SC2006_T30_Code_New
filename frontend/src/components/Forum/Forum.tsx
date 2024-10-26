import * as React from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
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

interface UserPostDTO {
  firstName: string;
  lastName: string;
  email: string;
  posts: PostDTO[];
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<UserPostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<UserPostDTO[]>(
          'http://localhost:5073/post/postswithcreatordetails'
        );
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Forum
      </Typography>

      {/* Buttons */}
      <div style={{ marginBottom: '16px' }}>
        <Button
          component={Link}
          to="/forum/createpost"
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
        >
          Create Post
        </Button>
        <Button
          component={Link}
          to="/forum/mypost"
          variant="contained"
          color="secondary"
        >
          View My Posts
        </Button>
      </div>

      {posts.map((userPost, index) => (
        <div key={index}>
          <Typography variant="h5" sx={{ marginTop: 3 }}>
            Posts by: {userPost.firstName} {userPost.lastName}
          </Typography>
          {userPost.posts.map((post) => (
            <Card key={post.postId} variant="outlined" sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2">{post.content}</Typography>
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
          ))}
        </div>
      ))}
    </Container>
  );
};

export default Forum;
