import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [imageBase64, setImageBase64] = useState(null); // Base64 for the profile photo
  const [previewPhoto, setPreviewPhoto] = useState(null); // For displaying the photo preview

  const navigate = useNavigate();

  // Function to handle image upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    const reader = new FileReader(); // FileReader to read the file content

    if (file) {
      reader.readAsDataURL(file); // Convert to base64
      reader.onloadend = () => {
        setImageBase64(reader.result); // Save the base64 encoded image
        setPreviewPhoto(reader.result); // Set preview to display it
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      full_name: fullName,
      profile_photo: imageBase64, // Send the base64 encoded image
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/signup',
        userData, // Send the data as JSON, including the image in base64 format
        { withCredentials: true }
      );
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Full error object:', error);  // Log the full error object
    
      // Try to access the error details safely
      const errorMessage = error.response?.data?.errors || error.response?.data?.message || error.message;
    
      console.error('Error message:', errorMessage);  // Log the error message extracted
      alert(errorMessage || 'Signup failed');  // Show user-friendly error
    }
    
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Signup</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
          />

          {/* Custom file upload button */}
          <div className="image-upload">
            <label htmlFor="image-upload" className="custom-file-upload">
              Upload Profile Photo
            </label>
            <input id="image-upload" type="file" onChange={handleImageUpload} accept="image/*" style={styles.fileInput} />
            {previewPhoto && (
              <img
                src={previewPhoto}
                alt="Profile Preview"
                style={styles.imagePreview}
              />
            )}
          </div>

          <button type="submit" style={styles.button}>Signup</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  formWrapper: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1.5rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '250px',
    padding: '12px',
    margin: '10px 0',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  fileInput: {
    display: 'none', // Hidden file input
  },
  imagePreview: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
  },
};

export default SignUp;
