import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  },[]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/current', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // If fetching fails, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  

  if (!user) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  return (
    <div className="profile-container">
        <Navbar/>
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          {user.profile_photo ? (
            <img src={user.profile_photo} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="placeholder-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <h2 className="profile-name">{user.full_name}</h2>
        </div>
        <div className="profile-info">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Badge:</strong> {user.badgeId ? user.badgeId.position + `(${user.badgeId.description})` : 'No badge assigned'}</p>
        </div>
        <button onClick={() => navigate('/edit-profile')} className="edit-profile-button">
          Edit Profile
        </button>
      </div>
      <button onClick={() => navigate('/chats')} className="back-button">
        Back to Chats
      </button>
      <style jsx>{`
        .profile-container {
          max-width: 600px;
          margin: 80px auto 0;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .profile-title {
          color: #3498db;
          text-align: center;
          margin-bottom: 20px;
        }
        .profile-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        .profile-photo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 10px;
        }
        .profile-photo-placeholder {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }
        .placeholder-icon {
          width: 80px;
          height: 80px;
          color: #bdbdbd;
        }
        .profile-name {
          font-size: 24px;
          color: #333;
          margin: 0;
        }
        .profile-info {
          margin-bottom: 20px;
        }
        .profile-info p {
          margin: 10px 0;
          color: #555;
        }
        .edit-profile-button, .back-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .edit-profile-button:hover, .back-button:hover {
          background-color: #2980b9;
        }
        .back-button {
          display: block;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default Profile;