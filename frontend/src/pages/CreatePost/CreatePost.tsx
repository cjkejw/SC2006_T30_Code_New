import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface CreatePostProps {
  newPost: {
    title: string;
    content: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreatePost: (newPost: { title: string; content: string }) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ newPost, handleInputChange, handleCreatePost }) => {
  const [isPostCreated, setIsPostCreated] = useState(false);

  const handlePostCreation = () => {
    handleCreatePost(newPost);
    setIsPostCreated(true); // After creating the post, mark it as created
  };

  return (
    <div className="create-post-page">
      <h2>Create a New Post</h2>

      {/* Title Input */}
      <div className="title-form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
          placeholder="Title"
        />
      </div>

      {/* Content Text Area */}
      <div className="content-form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={newPost.content}
          onChange={handleInputChange}
          placeholder="Write your post content here..."
        />
      </div>

      <div className="actions">
      
        
        <Link to="/forum">
          <button onClick={handlePostCreation} className="create-btn">Create Post</button>
        </Link>
        <Link to="/forum">
          <button className="cancel-btn">Cancel</button>
        </Link>
      </div>
    </div>
  );
};

export default CreatePost;
