import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Urls';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoSuccessMessage, setPhotoSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/current`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setNewName(data.user.full_name);
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

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (e.target.id === 'currentPassword') {
      setCurrentPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/user/edit-name/${user.id}/${newName}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!response.ok) {
        setErrorMessage('Failed to update name.');
      } else {
        setSuccessMessage('Name updated successfully!');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setErrorMessage('Error updating name.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (currentPassword && newPassword) {
      try {
        const response = await fetch(`${baseUrl}/api/user/${user.id}/update-password`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!response.ok) {
          setErrorMessage('Failed to update password.');
        } else {
          setSuccessMessage('Password updated successfully!');
          setCurrentPassword('');
          setNewPassword('');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        setErrorMessage('Error updating password.');
      }
    } else {
      setErrorMessage('Please fill in all fields for password update.');
    }
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setPhotoSuccessMessage('');
    setErrorMessage('');

    if (!profilePhoto) {
      setErrorMessage('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto);

    try {
      const response = await fetch(`${baseUrl}/api/user/${user.id}/update-photo`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Failed to update profile photo: ${response.status} ${errorText}`);
        return;
      }

      setPhotoSuccessMessage('Profile photo updated successfully!');
      setProfilePhoto(null);
    } catch (error) {
      console.error('Error updating profile photo:', error);
      setErrorMessage('Error updating profile photo. Please check your network connection or try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-title">Edit Profile</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {photoSuccessMessage && <p className="success-message">{photoSuccessMessage}</p>}
      
      {user && user.profilePhoto && (
        <div className="profile-photo-container">
          <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
        </div>
      )}
      
        <form onSubmit={handlePhotoSubmit} className="edit-profile-form classic-photo-upload">
          <h2>Upload Profile Photo</h2>
          <div className="form-group">
            <label htmlFor="profilePhoto" className="photo-label">Choose a Profile Picture</label>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handlePhotoChange}
              className="form-input photo-input"
            />
        </div>
        <button type="submit" className="classic-upload-button">Upload Photo</button>
      </form>

      <form onSubmit={handleNameSubmit} className="edit-profile-form">
        <h2>Change Full Name</h2>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={newName}
            onChange={handleNameChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="edit-profile-form">
        <h2>Change Password</h2>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={handlePasswordChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="save-button">Update Password</button>
      </form>

      <button type="button" onClick={() => navigate('/profile')} className="cancel-button">Cancel</button>
      
      <style jsx>{`
        .edit-profile-container {
          max-width: 500px;
          margin: 100px auto;
          padding: 40px;
          background-color: #f7f9fc;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        .edit-profile-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 30px;
          font-size: 40px;
          font-weight: 600;
        }
        .edit-profile-form {
          // margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-input {
          width: 95%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
          margin-top: 8px;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          border-color: #3498db;
          outline: none;
        }
        .save-button {
          width: 100%;
          background-color: #3498db;
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          border: none;
          cursor: pointer;
          margin-top: 10px;
        }
        .save-button:hover {
          background-color: #2980b9;
        }
        .cancel-button {
          width: 100%;
          background-color: #e74c3c;
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }
        .cancel-button:hover {
          background-color: #c0392b;
        }
        .error-message, .success-message {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 20px;
        }
        .profile-photo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .profile-photo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .classic-photo-upload {
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #f9f9f9;
        }

        .photo-label {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          display: block;
          color: #333;
        }

        .photo-input {
          display: block;
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          font-size: 14px;
          margin-top: 8px;
        }

        .classic-upload-button {
          background-color: #3498db;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
        }

        .classic-upload-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
