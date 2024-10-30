import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyPost.css';

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
  user: UserDTO;
}

const MyPost: React.FC = () => {
  useEffect(() => {
    document.title = "View My Posts";
  }, []);

  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; postId: number | null }>({ show: false, postId: null });

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const response = await axios.get<PostDTO[]>('http://localhost:5073/post/my-posts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('No Posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleEdit = (postId: number, title: string, content: string) => {
    setEditingPostId(postId);
    setEditTitle(title);
    setEditContent(content);
  };

  const handleSave = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      await axios.put(
        `http://localhost:5073/post/${postId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId ? { ...post, title: editTitle, content: editContent } : post
        )
      );

      setEditingPostId(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post.');
    }
  };

  const openDeleteModal = (postId: number) => {
    setDeleteModal({ show: true, postId });
  };

  const handleDelete = async () => {
    if (deleteModal.postId) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found.");
          return;
        }

        await axios.delete(`http://localhost:5073/post/${deleteModal.postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== deleteModal.postId));
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post.');
      }
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
      <Link to="/forum" className="back-button">Back to Forum</Link>
      
      <h1>My Posts</h1>
      
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.postId} className="card">
            {editingPostId === post.postId ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                  placeholder="Content"
                />
                <button onClick={() => handleSave(post.postId)}>Save</button>
                <button onClick={() => setEditingPostId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <Link to={`/forum/post/${post.postId}`} className="title-link">
                  <h3>{post.title}</h3>
                </Link>
                <p>{post.content}</p>
                <p className="created-at">
                  Created At: {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="posted-by">
                  Posted by: {post.user.firstName} {post.user.lastName} ({post.user.email})
                </p>
                <button onClick={() => handleEdit(post.postId, post.title, post.content)}>Edit</button>
                <button onClick={() => openDeleteModal(post.postId)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}

      {deleteModal.show && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this post?</p>
            <button onClick={handleDelete} className="button primary">Yes, Delete</button>
            <button onClick={closeDeleteModal} className="button secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPost;
