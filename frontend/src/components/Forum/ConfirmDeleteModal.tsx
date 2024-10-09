import React from 'react';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this post?</p>
        <button onClick={onConfirm}>Yes, Delete</button>
        <button className="close-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
