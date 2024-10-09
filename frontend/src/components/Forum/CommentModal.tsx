import React from 'react';

interface CommentProps {
  newComment: {
    username: string;
    content: string;
  };
  setNewComment: React.Dispatch<React.SetStateAction<{ username: string; content: string }>>;
  handleAddComment: () => void;
  closeModal: () => void;
}

const CommentModal: React.FC<CommentProps> = ({ newComment, setNewComment, handleAddComment, closeModal }) => {
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Comment</h2>
        <input
          type="text"
          name="username"
          placeholder="Your Name"
          value={newComment.username}
          onChange={handleCommentChange}
        />
        <textarea
          name="content"
          placeholder="Your Comment"
          value={newComment.content}
          onChange={handleCommentChange}
        />
        <button onClick={handleAddComment}>Submit Comment</button>
        <button className="close-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CommentModal;
