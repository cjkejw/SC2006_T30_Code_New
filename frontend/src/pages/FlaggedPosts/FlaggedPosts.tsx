import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FlaggedPosts.css';

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
  useEffect(() => {
    document.title = "Flagged Posts";
  }, []);

  const [flaggedPosts, setFlaggedPosts] = useState<UserPostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; postId: number | null }>({ show: false, postId: null });

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

  const openDeleteModal = (postId: number) => {
    setDeleteModal({ show: true, postId });
  };

  const handleDeletePost = async () => {
    if (deleteModal.postId) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5073/post/${deleteModal.postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlaggedPosts(prevPosts =>
          prevPosts.map(userPost => ({
            ...userPost,
            posts: userPost.posts.filter(post => post.postId !== deleteModal.postId)
          })).filter(userPost => userPost.posts.length > 0)
        );
        setDeleteModal({ show: false, postId: null });
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post.');
      }
    }
  };

  const handleUnflagPost = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5073/post/${postId}/unflag`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFlaggedPosts(prevPosts =>
        prevPosts
          .map(userPost => ({
            ...userPost,
            posts: userPost.posts.filter(post => post.postId !== postId)
          }))
          .filter(userPost => userPost.posts.length > 0)
      );
    } catch (error) {
      console.error('Error unflagging post:', error);
      setError('Failed to unflag post.');
    }
  };

  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5073/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFlaggedPosts(prevPosts =>
        prevPosts.map(userPost => ({
          ...userPost,
          posts: userPost.posts.map(post => 
            post.postId === postId
              ? { ...post, comments: post.comments.filter(comment => comment.commentId !== commentId) }
              : post
          ),
        }))
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment.');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, postId: null });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Flagged Posts</h1>
      <Link to="/forum" className="back-button">Back to Forum</Link>
      {flaggedPosts.length === 0 ? (
        <p className="error">No flagged posts found.</p>
      ) : (
        flaggedPosts.map((userPost, index) => (
          <div key={index} className="user-post">
            <h2>Posts by: {userPost.firstName} {userPost.lastName} ({userPost.email})</h2>
            {userPost.posts.map((post) => (
              <div key={post.postId} className="card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <Link to={`/forum/post/${post.postId}`} className="title-link">
                  <button className="go-to-post-button">Go to Post</button>
                </Link>

                <p><strong>Report Reason:</strong> {post.reportReason}</p>
                <p className="created-at">Created At: {new Date(post.createdAt).toLocaleString()}</p>

                {post.comments.length > 0 && (
                  <div className="comments">
                    <h4>Comments:</h4>
                    {post.comments.map((comment) => (
                      <div key={comment.commentId} className="comment">
                        <p>{comment.commentContent} - {new Date(comment.createdAt).toLocaleString()}</p>
                        <button onClick={() => handleDeleteComment(comment.commentId, post.postId)} className="delete-comment-button">
                          Delete Comment
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => openDeleteModal(post.postId)} className="delete-button">
                  Delete Post
                </button>
                <button onClick={() => handleUnflagPost(post.postId)} className="unflag-button">
                  Unflag Post
                </button>
              </div>
            ))}
          </div>
        ))
      )}

      {deleteModal.show && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this post?</p>
            <button onClick={handleDeletePost} className="button primary">Yes, Delete</button>
            <button onClick={closeDeleteModal} className="button secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedPosts;
