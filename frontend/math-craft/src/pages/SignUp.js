// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const SignUp = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [imageBase64, setImageBase64] = useState(null); // Base64 for the profile photo
//   const [previewPhoto, setPreviewPhoto] = useState(null); // For displaying the photo preview

//   const navigate = useNavigate();

//   // Function to handle image upload and convert to base64
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]; // Get the selected file
//     const reader = new FileReader(); // FileReader to read the file content

//     if (file) {
//       reader.readAsDataURL(file); // Convert to base64
//       reader.onloadend = () => {
//         setImageBase64(reader.result); // Save the base64 encoded image
//         setPreviewPhoto(reader.result); // Set preview to display it
//       };
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const userData = {
//       username,
//       email,
//       password,
//       full_name: fullName,
//       profile_photo: imageBase64, // Send the base64 encoded image
//     };

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/user/signup',
//         userData, // Send the data as JSON, including the image in base64 format
//         { withCredentials: true }
//       );
//       alert(response.data.message);
//       navigate('/login');
//     } catch (error) {
//       console.error('Full error object:', error);  // Log the full error object
    
//       // Try to access the error details safely
//       const errorMessage = error.response?.data?.errors || error.response?.data?.message || error.message;
    
//       console.error('Error message:', errorMessage);  // Log the error message extracted
//       alert(errorMessage || 'Signup failed');  // Show user-friendly error
//     }
    
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.formWrapper}>
//         <h2 style={styles.title}>Signup</h2>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             style={styles.input}
//           />

//           {/* Custom file upload button */}
//           <div className="image-upload">
//             <label htmlFor="image-upload" className="custom-file-upload">
//               Upload Profile Photo
//             </label>
//             <input id="image-upload" type="file" onChange={handleImageUpload} accept="image/*" style={styles.fileInput} />
//             {previewPhoto && (
//               <img
//                 src={previewPhoto}
//                 alt="Profile Preview"
//                 style={styles.imagePreview}
//               />
//             )}
//           </div>

//           <button type="submit" style={styles.button}>Signup</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     height: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f8ff',
//   },
//   formWrapper: {
//     backgroundColor: 'white',
//     padding: '40px',
//     borderRadius: '10px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     textAlign: 'center',
//     animation: 'fadeIn 0.5s ease',
//   },
//   title: {
//     fontSize: '2rem',
//     color: '#333',
//     marginBottom: '1.5rem',
//     textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   input: {
//     width: '250px',
//     padding: '12px',
//     margin: '10px 0',
//     fontSize: '1rem',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     outline: 'none',
//     transition: 'all 0.3s ease',
//   },
//   fileInput: {
//     display: 'none', // Hidden file input
//   },
//   imagePreview: {
//     width: '150px',
//     height: '150px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     marginBottom: '10px',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//   },
//   button: {
//     padding: '12px 24px',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     backgroundColor: '#4a90e2',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     transition: 'all 0.3s ease',
//   },
// };

// export default SignUp;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const symbols = ['∑', '∫', '∏', '√', 'π', '∞'];
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 15;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = 'rgba(74, 144, 226, 0.5)';
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.symbol, this.x, this.y);
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const animateForm = (form, delay) => {
      setTimeout(() => {
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
      }, delay);
    };

    animateForm(formRef.current, 300);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setPreviewPhoto(reader.result);
      };
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      username,
      email,
      password,
      full_name: fullName,
      profile_photo: imageBase64,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/signup',
        userData,
        { withCredentials: true }
      );
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Full error object:', error);
      const errorMessage = error.response?.data?.errors || error.response?.data?.message || error.message;
      console.error('Error message:', errorMessage);
      alert(errorMessage || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <div style={styles.content}>
        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Sign Up</h2>
          <div style={styles.photoContainer} onClick={handlePhotoClick}>
            {previewPhoto ? (
              <img src={previewPhoto} alt="Profile" style={styles.photoPreview} />
            ) : (
              <div style={styles.photoPlaceholder}>
                <span style={styles.photoPlaceholderText}>Add Photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            style={styles.hiddenFileInput}
          />
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="fullName" style={styles.label}>Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          <div style={styles.links}>
            <Link to="/login" style={styles.link}>Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#f0f8ff',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: '5px 40px 10px 40px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '300px',
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '1.0rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  photoContainer: {
    width: '120px',
    height: '120px',
    margin: '0 auto 20px',
    cursor: 'pointer',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    color: '#757575',
    fontSize: '0.9rem',
  },
  hiddenFileInput: {
    display: 'none',
  },
  inputGroup: {
    marginBottom: '10px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '0.9rem',
    color: '#666',
  },
  input: {
    width: '90%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1) inset',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#4a90e2',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  links: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
};

export default SignUp;