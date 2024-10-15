import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

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
        navigate('/'); // Navigate to the home page
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return null; // Don't render the navbar if the user is not logged in
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
              onClick={() => navigate('/chats')}  // Correct navigate method
              className="nav-button"
              aria-label="Chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                <path d="M8 2h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" />
                <path d="M6 6h12" />
                <path d="M6 10h12" />
                <path d="M6 14h8" />
              </svg>
              <span className="nav-label">Chat</span>
            </button>
            <button
              onClick={() => navigate('/questions')}  // Correct navigate method
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
              onClick={() => navigate('/profile')}  // Correct navigate method
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
