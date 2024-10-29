// PostDetails.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
      {post.comments.length > 0 && (
        <div className="comments">
          <h3>Comments:</h3>
          {post.comments.map((comment) => (
            <p key={comment.commentId}>{comment.commentContent} - {new Date(comment.createdAt).toLocaleString()}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetails;
