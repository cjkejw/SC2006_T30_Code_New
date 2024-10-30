import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Forum.css';

interface CommentDTO {
  commentId: number;
  postId: number;
  commentContent: string;
  createdAt: string;
}

interface PostDTO {
  postId: number;
  userId: number;
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
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Forum</h1>
      <div className="button-group">
        <Link to="/forum/createpost" className="button primary">
          Create Post
        </Link>
        <Link to="/forum/mypost" className="button secondary">
          View My Posts
        </Link>
      </div>

      {posts.map((userPost, index) => (
        <div key={index}>
          <h2>Posts by: {userPost.firstName} {userPost.lastName}</h2>
          {userPost.posts.map((post) => (
            <div key={post.postId} className="card">
              <Link to={`/forum/post/${post.postId}`} className="title-link">
                <h3>{post.title}</h3>
              </Link>
              <p>{post.content}</p>
              <p className="created-at">
                Created At: {new Date(post.createdAt).toLocaleString()}
              </p>
              {post.comments.length > 0 && (
                <div className="comments">
                  <h4>Comments:</h4>
                  {post.comments.map((comment) => (
                    <p key={comment.commentId} className="comment">
                      {comment.commentContent} - {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Forum;
