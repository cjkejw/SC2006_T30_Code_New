import React, { useState } from 'react';
import CommentModal from './CommentModal';
import ReportModal from './ReportModal';

interface CommentProps {
  username: string;
  content: string;
}

interface PostProps {
  title: string;
  content: string;
  username: string;
  time: string;
  comments: CommentProps[];
  reported?: boolean;
  reportReason?: string;
}

const Post: React.FC<{
  post: PostProps;
  onDelete: () => void;
  onEdit: (newPost: PostProps) => void;
  onAddComment: (newComment: CommentProps) => void;
  onReport: (reason: string) => void;
}> = ({ post, onDelete, onEdit, onAddComment, onReport }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<PostProps>(post);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState<CommentProps>({ username: '', content: '' });
  const [showReportModal, setShowReportModal] = useState(false);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPost({ ...editedPost, [name]: value });
  };

  const handleSaveEdit = () => {
    onEdit(editedPost);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.username && newComment.content) {
      onAddComment(newComment);
      setNewComment({ username: '', content: '' });
      setShowCommentModal(false);
    }
  };

  return (
    <div className={`post ${post.reported ? 'reported' : ''}`}>
      {isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleEditInputChange}
          />
          <textarea
            name="content"
            value={editedPost.content}
            onChange={handleEditInputChange}
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2 className="post-title">{post.title}</h2>
          <p className="post-group">{post.content}</p>
          <p>
            <strong>user:</strong> {post.username} <br />
            <strong>Time:</strong> {post.time}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={onDelete}>Delete</button>
          <button onClick={() => setShowCommentModal(true)}>Add Comment</button>
          <button onClick={() => setShowReportModal(true)}>Report</button>

          {/* Comments Section */}
          <div>
            <h3>Comments:</h3>
            {post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.username}:</strong> {comment.content}
              </div>
            ))}
          </div>

          {/* Add Comment Modal */}
          {showCommentModal && (
            <CommentModal
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              closeModal={() => setShowCommentModal(false)}
            />
          )}

          {/* Report Post Modal */}
          {showReportModal && (
            <ReportModal
              onReport={onReport}
              closeModal={() => setShowReportModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
