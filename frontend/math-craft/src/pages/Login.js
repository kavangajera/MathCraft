/*
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/login',
        { email, password },
        { withCredentials: true }
      );
      alert(response.data.message); 
      navigate('/questions');
    } catch (error) {
      console.error(error);
      alert(error.response?.data.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
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
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <div style={styles.forgotPassword}>
          <Link to="forget-password" style={styles.link}>Forgot Password?</Link>
        </div>
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
    opacity: '1',
    transform: 'translateY(0)',
    ':hover': {
      backgroundColor: '#357abd',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    },
    forgotPassword: {
      marginTop: '20px',
    },
    link: {
      color: '#4a90e2',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '0.9rem',
    },
  },
};

export default Login;
*/


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const loginButtonRef = useRef(null);

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
        this.size = Math.random() * 30 + 10;
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

    // Button animation on page load
    const animateButton = (button, delay) => {
      setTimeout(() => {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
      }, delay);
    };

    animateButton(loginButtonRef.current, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/login',
        { email, password },
        { withCredentials: true }
      );
      alert(response.data.message); 
      navigate('/questions');
    } catch (error) {
      console.error(error);
      alert(error.response?.data.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <div style={styles.content}>
        <div style={styles.formWrapper}>
          <h2 style={styles.title}>Login</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
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
            <button ref={loginButtonRef} type="submit" style={styles.button}>Login</button>
          </form>
          <div style={styles.forgotPassword}>
            <Link to="/forget-password" style={styles.link}>Forgot Password?</Link>
          </div>
        </div>
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
  formWrapper: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '1.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
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
    opacity: '0',
    transform: 'translateY(20px)',
  },
  forgotPassword: {
    marginTop: '20px',
  },
  link: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
};

export default Login;