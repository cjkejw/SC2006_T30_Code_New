import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Forum.css';
import {jwtDecode} from 'jwt-decode';

interface CustomJwtPayload {
  role?: string;
}

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
  useEffect(() => {
    document.title = "Forum";
  }, []);

const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return decoded.role == "Admin";
  } catch (error) {
      console.error("Error decoding token:", error);
      return false;
  }
};

  const [posts, setPosts] = useState<UserPostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportModal, setReportModal] = useState<{ show: boolean; postId: number | null }>({ show: false, postId: null });
  const [reportReason, setReportReason] = useState<string>('');


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<UserPostDTO[]>(
          'http://localhost:5073/post/postswithcreatordetails'
        );

        const sortedPosts = response.data
          .map(userPost => ({
            ...userPost,
            posts: userPost.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          }))
          .sort((a, b) => {
            const aMostRecentPostDate = new Date(a.posts[0]?.createdAt || 0).getTime();
            const bMostRecentPostDate = new Date(b.posts[0]?.createdAt || 0).getTime();
            return bMostRecentPostDate - aMostRecentPostDate;
          });

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleReportClick = (postId: number) => {
    setReportModal({ show: true, postId });
  };

  const handleReportSubmit = async () => {
    if (reportModal.postId && reportReason) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `http://localhost:5073/post/${reportModal.postId}/report`,
          { reason: reportReason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setPosts(prevPosts =>
          prevPosts.map(userPost => ({
            ...userPost,
            posts: userPost.posts.map(post =>
              post.postId === reportModal.postId ? { ...post, isFlagged: true } : post
            )
          }))
        );
  
        // Close the modal and reset reason input without alert
        setReportModal({ show: false, postId: null });
        setReportReason('');
      } catch (error) {
        console.error('Error submitting report:', error);
        setError('Failed to submit report.');
      }
    }
  };
  
  const closeModal = () => {
    setReportModal({ show: false, postId: null });
    setReportReason('');
  };

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
        {isAdmin() && (
        <Link to="/manage-activity" className="button tertiary">
          Manage Activity
        </Link>
        )}
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
              {!post.isFlagged && (
                <button onClick={() => handleReportClick(post.postId)} className="report-button">
                  Report
                </button>
              )}
            </div>
          ))}
        </div>
      ))}

      {reportModal.show && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Report Post</h2>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter reason for reporting"
            />
            <button onClick={handleReportSubmit} className="button primary">
              Submit Report
            </button>
            <button onClick={closeModal} className="button secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
