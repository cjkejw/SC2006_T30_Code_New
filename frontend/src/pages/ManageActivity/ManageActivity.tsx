import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ManageActivity.css'; // Add any necessary styles here

const ManageActivity: React.FC = () => {
  useEffect(() => {
    document.title = "Manage Activity";
  }, []);

  return (
    <div className="container">
      <h1>Manage Activity</h1>
      <div className="button-group">
        <Link to="/forum/flagged-posts" className="button flagged-posts-button">
          View Flagged Posts
        </Link>
      </div>
    </div>
  );
};

export default ManageActivity;
