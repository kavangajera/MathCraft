import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Profile.css'
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        return "🌱"; // Sparkle
      case 'Rookie':
        return "🪖"; // Star
      case 'Intermediate':
        return "🎖️"; // White Star
      case 'Expert':
        return "⭐"; // Pinwheel Star
      default:
        return '?';
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'loading' }, 'Loading...');
  }

  if (!user) {
    return React.createElement('div', { className: 'error' }, 'Error loading profile. Please try again later.');
  }

  return React.createElement(
    'div',
    { className: 'profile-container' },
    React.createElement(Navbar, null),
    React.createElement(
      'div',
      { className: 'profile-content' },
      React.createElement('h1', { className: 'profile-title' }, 'User Profile'),
      React.createElement(
        'div',
        { className: 'profile-card' },
        React.createElement(
          'div',
          { className: 'profile-header' },
          React.createElement(
            'div',
            { className: 'profile-photo-container' },
            user.profile_photo
              ? React.createElement('img', { src: user.profile_photo, alt: 'Profile', className: 'profile-photo' })
              : React.createElement(
                  'div',
                  { className: 'profile-photo-placeholder' },
                  React.createElement(
                    'svg',
                    { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', className: 'placeholder-icon' },
                    React.createElement('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
                    React.createElement('circle', { cx: '12', cy: '7', r: '4' })
                  )
                )
          ),
          React.createElement('h2', { className: 'profile-name' }, user.full_name)
        ),
        React.createElement(
          'div',
          { className: 'profile-info' },
          React.createElement(
            'div',
            { className: 'info-item' },
            React.createElement('span', { className: 'info-label' }, 'Username:'),
            React.createElement('span', { className: 'info-value' }, user.username)
          ),
          React.createElement(
            'div',
            { className: 'info-item' },
            React.createElement('span', { className: 'info-label' }, 'Email:'),
            React.createElement('span', { className: 'info-value' }, user.email)
          ),
          React.createElement(
            'div',
            { className: 'info-item' },
            React.createElement('span', { className: 'info-label' }, 'Badge:'),
            React.createElement(
              'span',
              { className: `info-value badge ${user.badgeId ? user.badgeId.position.toLowerCase() : ''}` },
              user.badgeId
                ? [
                    React.createElement('span', { key: 'symbol', className: 'badge-symbol' }, getBadgeSymbol(user.badgeId.position)),
                    ' ',
                    user.badgeId.position
                  ]
                : 'No badge assigned'
            )
          )
        ),
        React.createElement(
          'button',
          { onClick: () => navigate('/edit-profile'), className: 'edit-profile-button' },
          'Edit Profile'
        )
      )
    )
  );
};

export default Profile;