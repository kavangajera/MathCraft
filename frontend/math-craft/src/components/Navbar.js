import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ badgeMessage , onProfileClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const location = useLocation();
  const [hasViewedProfile, setHasViewedProfile] = useState(false);

  useEffect(() => {
    // Reset hasViewedProfile when new badgeMessage comes in
    if (badgeMessage !== 'No changes') {
      setHasViewedProfile(false);
    }
    
    const shouldShowNotification = 
      badgeMessage && 
      badgeMessage.trim() !== '' && 
      badgeMessage !== 'No changes' &&
      !hasViewedProfile;  // Only show if profile hasn't been viewed
      
    setIsUpdated(shouldShowNotification);
    fetchUserData();
  }, [badgeMessage, hasViewedProfile]);

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } // Call the passed handler if it exists
    console.log(badgeMessage)
    navigate('/profile');
    setIsUpdated(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/current', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <span className="navbar-logo">∑</span>
            <span className="navbar-title">MathCraft</span>
          </div>
          <div className="navbar-right">
            <button
              onClick={() => navigate('/math-tools')}
              className="nav-button"
              aria-label="MathTools"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                <path d="M22 16.7L15.3 10l6.7-6.7L22 3l-7 7-7-7-0.3 0.3L14.4 10l-6.7 6.7L8 17l7-7 7 7z" />
              </svg>
              <span className="nav-label">MathTools</span>
            </button>

            <button
              onClick={() => navigate('/chats')}
              className="nav-button"
              aria-label="Chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="nav-label">Chat</span>
            </button>
            <button
              onClick={() => navigate('/questions')}
              className="nav-button"
              aria-label="Ask"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              <span className="nav-label">Ask</span>
            </button>
            <button
              onClick={handleProfileClick}
              className="nav-button"
              aria-label="Profile"
            >
              {user.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              <span className="nav-label">Profile</span>
              {isUpdated && location.pathname !== '/profile' && (
                <span className="notification-badge" aria-label="New Notifications">
                  ∞
                </span>
              )}
            </button>
            <button onClick={handleLogout} className="nav-button" aria-label="Logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="nav-label">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="navbar-wave"></div>
    </nav>
  );
}

export default Navbar;