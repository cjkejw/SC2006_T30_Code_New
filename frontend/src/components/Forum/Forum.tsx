import React, { useState } from 'react';
import Post from './Post';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Link } from 'react-router-dom';

interface CommentProps {
  username: string;
  content: string;
}

interface PostProps {
  title: string;
  content: string;
  time: string;
  comments: CommentProps[];
  reported?: boolean;
  reportReason?: string;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [postToDeleteIndex, setPostToDeleteIndex] = useState<number | null>(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);

  const [newPost, setNewPost] = useState<Omit<PostProps, 'time' | 'comments' | 'reported' | 'reportReason'>>({
    title: '',
    content: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const time = new Date().toLocaleString();
      const newPostWithTime: PostProps = { ...newPost, time, comments: [], reported: false, reportReason: '' };
      setPosts([...posts, newPostWithTime]); // Update the posts state
    }
  };

  const handleEditPost = (index: number, updatedPost: PostProps) => {
    const updatedPosts = posts.map((post, i) => (i === index ? updatedPost : post));
    setPosts(updatedPosts);
  };

  const handleAddComment = (index: number, newComment: CommentProps) => {
    const updatedPosts = posts.map((post, i) =>
      i === index ? { ...post, comments: [...post.comments, newComment] } : post
    );
    setPosts(updatedPosts);
  };

  const handleReportPost = (index: number, reason: string) => {
    const updatedPosts = posts.map((post, i) =>
      i === index ? { ...post, reported: true, reportReason: reason } : post
    );
    setPosts(updatedPosts);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeletePost = (index: number) => {
    setPostToDeleteIndex(index);
    setShowConfirmDeleteModal(true);
  };

  const confirmDeletePost = () => {
    if (postToDeleteIndex !== null) {
      setPosts(posts.filter((_, i) => i !== postToDeleteIndex));
      setPostToDeleteIndex(null);
    }
    setShowConfirmDeleteModal(false);
  };

  const cancelDeletePost = () => {
    setPostToDeleteIndex(null);
    setShowConfirmDeleteModal(false);
  };

  return (
    <div className="forum">
      <h1>Forum</h1>
      <Link to="/forum/createpost" className="create-post-btn">
        Create Post
      </Link>
      <button className='see-mypost-btn'>See my Posts</button>

      {posts.map((post, index) => (
        <Post
          key={index}
          post={post}
          onDelete={() => handleDeletePost(index)}
          onEdit={(updatedPost) => handleEditPost(index, updatedPost)}
          onAddComment={(newComment) => handleAddComment(index, newComment)}
          onReport={(reason) => handleReportPost(index, reason)}
        />
      ))}

      {/* Confirmation Delete Modal */}
      {showConfirmDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={confirmDeletePost}
          onCancel={cancelDeletePost}
        />
      )}

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div className="success-message">
          <div className="message-content">
            <h2>Post successfully reported!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
