import React from 'react';
import './Comment.css'; 

const Comment = ({ username, content, createdAt }) => {
  return (
    <div className="comment-card">
      <p className="comment-content">{content}</p>
      <div className="comment-meta">
        <p>By: {username}</p>
        <p>Posted on: {new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Comment;
