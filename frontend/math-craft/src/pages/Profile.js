import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Profile.css';
import { baseUrl } from '../Urls';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchUserData();
    
    // Set a timeout to show content after 2 seconds
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/current`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeSymbol = (position) => {
    switch (position) {
      case 'Beginner':
        return "🌱";
      case 'Rookie':
        return "🪖";
      case 'Intermediate':
        return "🎖️";
      case 'Expert':
        return "⭐";
      default:
        return '?';
    }
  };

  if (loading || !showContent) {
    return (
      <div className="loading-container">
        <div className="math-loading">
          <span>∫</span>
          <span>∑</span>
          <span>∂</span>
          <span>∞</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="error">Error loading profile. Please try again later.</div>;
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <h1 className="profile-title">User Profile</h1>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-photo-container">
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
            </div>
            <h2 className="profile-name">{user.full_name}</h2>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Username:</span>
              <span className="info-value">{user.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Badge:</span>
              <span className={`info-value badge ${user.badgeId ? user.badgeId.position.toLowerCase() : ''}`}>
                {user.badgeId ? (
                  <>
                    <span className="badge-symbol">{getBadgeSymbol(user.badgeId.position)}</span> {user.badgeId.position}
                  </>
                ) : (
                  'No badge assigned'
                )}
              </span>
            </div>
          </div>
          <button onClick={() => navigate('/edit-profile')} className="edit-profile-button">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;