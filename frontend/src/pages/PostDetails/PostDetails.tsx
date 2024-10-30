import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PostDetails.css';

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

const PostDetails: React.FC = () => {
  useEffect(() => {
    document.title = "Post Details";
  }, []);

  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<PostDTO>(`http://localhost:5073/post/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post<CommentDTO>(`http://localhost:5073/comment/${postId}`, {
          commentContent: newComment,
      });
  
      // Update the post state with the new comment
      setPost((prev) => prev && {
          ...prev,
          comments: [...prev.comments, response.data] // Add new comment to comments array
      });
      setNewComment(""); // Clear the input field
      setError(null); // Reset error if successful
    } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error("Error response data:", error.response?.data);
          console.error("Error response status:", error.response?.status);
          console.error("Error response headers:", error.response?.headers);
          setError(error.response?.data || "Failed to add comment.");
      } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred.");
      }
    }
  };

  if (loading) {
    return <div className="post-details__loading">Loading...</div>;
  }

  if (error) {
    return <div className="post-details__error">{error}</div>;
  }

  if (!post) {
    return <div className="post-details__not-found">Post not found.</div>;
  }

  return (
    <div className="post-details">
      <h1 className="post-details__title">{post.title}</h1>
      <p className="post-details__content">{post.content}</p>
      <p className="post-details__created-at">Created At: {new Date(post.createdAt).toLocaleString()}</p>
      {post.comments.length > 0 ? (
        <div className="post-details__comments">
          <h3 className="post-details__comments-header">Comments:</h3>
          {post.comments.map((comment) => (
            <p key={comment.commentId} className="post-details__comment">
              {comment.commentContent} - <span className="post-details__comment-timestamp">{new Date(comment.createdAt).toLocaleString()}</span>
            </p>
          ))}
        </div>
      ) : (
        <p className="post-details__no-comments">No comments available.</p>
      )}
      <form className="post-details__form" onSubmit={handleCommentSubmit}>
        <textarea
          className="post-details__commentbox"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit" className="post-details__submit-button">Submit</button>
      </form>
    </div>
  );
};

export default PostDetails;
