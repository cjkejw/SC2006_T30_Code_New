// src/pages/ForumPage.tsx
import React from 'react';
import Post from '../components/Forum/Post';
import CreatePost from './CreatePost/CreatePost';
import ConfirmDeleteModal from '../components/Forum/ConfirmDeleteModal';
import { PostProps,CommentProps } from '../components/Forum/constants';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

interface ForumPageProps {
  posts: PostProps[];
  showModal: boolean;
  showSuccessMessage: boolean;
  newPost: Omit<PostProps, 'time' | 'comments' | 'reported' | 'reportReason'>;
  showConfirmDeleteModal: boolean;
  handleDeletePost: (index: number) => void;
  handleEditPost: (index: number, updatedPost: PostProps) => void;
  handleAddComment: (index: number, newComment: CommentProps) => void;
  handleReportPost: (index: number, reason: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreatePost: () => void;
  confirmDeletePost: () => void;
  cancelDeletePost: () => void;
  setShowModal: (value: boolean) => void;
}

const ForumPage: React.FC<ForumPageProps> = ({
  posts,
  showModal,
  showSuccessMessage,
  newPost,
  showConfirmDeleteModal,
  handleDeletePost,
  handleEditPost,
  handleAddComment,
  handleReportPost,
  handleInputChange,
  handleCreatePost,
  confirmDeletePost,
  cancelDeletePost,
  setShowModal,
}) => {
  return (
    <>
        <Router>
            <Routes>
                <Route path="/createpost" element={<CreatePost 
                newPost={newPost}
                handleInputChange={handleInputChange}
                handleCreatePost={handleCreatePost}
                closeModal={() => setShowModal(false)}
                />} />
            </Routes>
        </Router>
    <div className="forum">
      <h1>Forum</h1>
      <Link to = "/createpost" className="create-post-btn" onClick={() => setShowModal(true)}>
        Create Post
      </Link>
      <button className="see-mypost-btn">See my Posts</button>

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

      {showModal && (
        <CreatePost
          newPost={newPost}
          handleInputChange={handleInputChange}
          handleCreatePost={handleCreatePost}
          closeModal={() => setShowModal(false)}
        />
      )}

      {showConfirmDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={confirmDeletePost}
          onCancel={cancelDeletePost}
        />
      )}

      {showSuccessMessage && (
        <div className="success-message">
          <div className="message-content">
            <h2>Post successfully reported!</h2>
          </div>
        </div>
      )}
    
        
        
    </div>
    </>
  );
  
};

export default ForumPage;
