import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // State to store the selected file
  const navigate = useNavigate();

  // Function to convert the file to a base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the profile photo to a base64 string
    let profilePhotoBase64 = null;
    if (profilePhoto) {
      profilePhotoBase64 = await fileToBase64(profilePhoto);
    }

    // Create the data object
    const userData = {
      username,
      email,
      password,
      full_name: fullName,
      profile_photo: profilePhotoBase64, // Include the base64 image
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/signup',
        userData, // Send the data as JSON
        { withCredentials: true }
      );
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      // Logging the error response to debug
      console.error(error.response?.data?.errors || error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Signup failed');
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
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.inputFile} 
          />
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
    ':focus': {
      borderColor: '#4a90e2',
      boxShadow: '0 0 8px rgba(74, 144, 226, 0.8)',
    },
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
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: '#357abd',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  ':hover': {
    transform: 'scale(1.05)',
  },
};

export default SignUp;


