import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CreatePostProps {
  newPost: {
    title: string;
    content: string;
    username: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreatePost: () => void;
  closeModal: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ newPost, handleInputChange, handleCreatePost, closeModal }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePostCreation = () => {
    handleCreatePost(); // Call the handleCreatePost to create the post
    navigate('/forum'); // Navigate to the forum page
  };

  return (
    <div className="create-post-page">
      <h2>Create a New Post</h2>

      <div className="title-form-group">
        <label htmlFor="title"></label>
        <input
          type="text"
          id="title"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
      </div>

      <div className="text-form-group">
        <label htmlFor="content"></label>
        <textarea
          id="content"
          name="content"
          value={newPost.content}
          onChange={handleInputChange}
          placeholder="Text"
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={newPost.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
        />
      </div>

      <div className="actions">
        <button onClick={handlePostCreation} className="create-btn">Create Post</button>
        <button onClick={closeModal} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default CreatePost;
