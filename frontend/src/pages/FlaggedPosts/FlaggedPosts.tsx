import React, { useEffect, useState } from 'react';
import axios from 'axios';


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
  reportReason: string;
  comments: CommentDTO[];
}

interface UserPostDTO {
  firstName: string;
  lastName: string;
  email: string;
  posts: PostDTO[];
}

const FlaggedPosts: React.FC = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<UserPostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlaggedPosts = async () => {
      try {
        const response = await axios.get<UserPostDTO[]>('http://localhost:5073/post/flaggedposts');
        setFlaggedPosts(response.data);
      } catch (error) {
        console.error('Error fetching flagged posts:', error);
        setError('Failed to fetch flagged posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Flagged Posts</h1>
      {flaggedPosts.length === 0 ? (
        <p>No flagged posts found.</p>
      ) : (
        flaggedPosts.map((userPost, index) => (
          <div key={index} className="user-post">
            <h2>Posts by: {userPost.firstName} {userPost.lastName} ({userPost.email})</h2>
            {userPost.posts.map((post) => (
              <div key={post.postId} className="card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p><strong>Report Reason:</strong> {post.reportReason}</p>
                <p className="created-at">Created At: {new Date(post.createdAt).toLocaleString()}</p>
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
        ))
      )}
    </div>
  );
};

export default FlaggedPosts;
