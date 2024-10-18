// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ForgetPassword = () => {
//   const [step, setStep] = useState(1);  // Controls the current step
//   const [email, setEmail] = useState('');  // Store user's email
//   const [otp, setOtp] = useState('');  // Store the entered OTP
//   const [otpToken, setOtpToken] = useState('');  // Store OTP token received from server
//   const [newPassword, setNewPassword] = useState('');  // Store the new password

//   const navigate = useNavigate()

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/user/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (data.otpToken) {
//         setOtpToken(data.otpToken);  // Store OTP token in state
//         setStep(2);  // Move to the OTP step
//       }
//       else{
//         alert("Email is not exist")
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     console.log("onverfiy clik")
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/user/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp, otpToken }),
//       });
//       const data = await response.json();

//       if (data.message === 'OTP verified') {
//         console.log("verified");
//         setStep(3);  // Move to the password reset step
//       }
//       else{
//         alert("OTP is not valid!!")
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//     }
//   };

//   const handlePasswordReset = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/user/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, newPassword }),
//       });
//       const data = await response.json();
//       console.log("hello")
//       if (data.message === 'Password reset successfully.') {
//         alert('Password reset successful! You can now log in with your new password.');

//         setTimeout(() => {
//             navigate('/login'); 
//           }, 2000);
//       }
//     } catch (error) {
//       console.error('Error resetting password:', error);
//     }
//   };

//   // Inline styles for the component
//   const styles = {
//     container: {
//       maxWidth: '400px',
//       margin: '0 auto',
//       padding: '20px',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       backgroundColor: '#f9f9f9',
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//     },
//     input: {
//       margin: '10px 0',
//       padding: '8px',
//       fontSize: '16px',
//       borderRadius: '4px',
//       border: '1px solid #ccc',
//     },
//     button: {
//       padding: '10px',
//       backgroundColor: '#007bff',
//       color: 'white',
//       border: 'none',
//       cursor: 'pointer',
//       borderRadius: '5px',
//       fontSize: '16px',
//       marginTop: '10px',
//     },
//     buttonHover: {
//       backgroundColor: '#0056b3',
//     },
//     label: {
//       marginBottom: '8px',
//       fontWeight: 'bold',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Forgot Password</h1>
      
//       {/* Step 1: Request OTP (Email Submission) */}
//       {step === 1 && (
//         <form onSubmit={handleEmailSubmit} style={styles.form}>
//           <label style={styles.label}>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <button type="submit" style={styles.button}>Send OTP</button>
//         </form>
//       )}

//       {/* Step 2: Verify OTP */}
//       {step === 2 && (
//         <form onSubmit={handleOtpSubmit} style={styles.form}>
//           <label style={styles.label}>Enter OTP sent to your email:</label>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <button type="submit" style={styles.button}>Verify OTP</button>
//         </form>
//       )}

//       {/* Step 3: Reset Password */}
//       {step === 3 && (
//         <form onSubmit={handlePasswordReset} style={styles.form}>
//           <label style={styles.label}>New Password:</label>
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <button type="submit" style={styles.button}>Reset Password</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ForgetPassword;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ForgetPassword = () => {
//   const [step, setStep] = useState(1);  // Controls the current step
//   const [email, setEmail] = useState('');  // Store user's email
//   const [otp, setOtp] = useState('');  // Store the entered OTP
//   const [otpToken, setOtpToken] = useState('');  // Store OTP token received from server
//   const [newPassword, setNewPassword] = useState('');  // Store the new password

//   const navigate = useNavigate()

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/user/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (data.otpToken) {
//         setOtpToken(data.otpToken);  // Store OTP token in state
//         setStep(2);  // Move to the OTP step
//       }
//       else{
//         alert("Email is not exist")
//       }
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     console.log("onverfiy clik")
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/user/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp, otpToken }),
//       });
//       const data = await response.json();

//       if (data.message === 'OTP verified') {
//         console.log("verified");
//         setStep(3);  // Move to the password reset step
//       }
//       else{
//         alert("OTP is not valid!!")
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//     }
//   };

//   const handlePasswordReset = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/user/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, newPassword }),
//       });
//       const data = await response.json();
//       console.log("hello")
//       if (data.message === 'Password reset successfully.') {
//         alert('Password reset successful! You can now log in with your new password.');

//         setTimeout(() => {
//             navigate('/login'); 
//           }, 2000);
//       }
//     } catch (error) {
//       console.error('Error resetting password:', error);
//     }
//   };

//   // Inline styles for the component
//   const styles = {
//     outerContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh', // Full viewport height for vertical centering
//       backgroundColor: '#f0f0f0', // Optional background color for the page
//     },
//     container: {
//       maxWidth: '400px',
//       width: '100%',  // Ensure form doesn't overflow the viewport on small screens
//       padding: '30px',
//       borderRadius: '12px',
//       backgroundColor: '#fff',
//       boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
//     },
//     form: {
//       display: 'flex',
//       flexDirection: 'column',
//     },
//     input: {
//       margin: '10px 0',
//       padding: '12px',
//       fontSize: '16px',
//       borderRadius: '8px',
//       border: '1px solid #ccc',
//       outline: 'none',
//       transition: 'border-color 0.3s ease',
//     },
//     inputFocus: {
//       borderColor: '#007bff',
//     },
//     button: {
//       padding: '12px',
//       background: 'linear-gradient(45deg, #007bff, #0056b3)',
//       color: 'white',
//       border: 'none',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       fontSize: '16px',
//       marginTop: '10px',
//       transition: 'background 0.3s ease',
//     },
//     buttonHover: {
//       background: 'linear-gradient(45deg, #0056b3, #004085)',
//     },
//     label: {
//       marginBottom: '8px',
//       fontWeight: 'bold',
//       color: '#333',
//     },
//     title: {
//       textAlign: 'center',
//       fontSize: '24px',
//       marginBottom: '20px',
//       color: '#333',
//       fontWeight: '600',
//     },
//   };
  
  

//   return (
//     <div style={styles.outerContainer}>
//       <div style={styles.container}>
//         <h1 style={styles.title}>Forgot Password</h1>
        
//         {/* Step 1: Request OTP (Email Submission) */}
//         {step === 1 && (
//           <form onSubmit={handleEmailSubmit} style={styles.form}>
//             <label style={styles.label}>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={styles.input}
//             />
//             {/* <button type="submit" style={styles.button}>Send OTP</button> */}
//             <button
//               type="submit"
//               style={Object.assign({}, styles.button, styles.buttonHover)}
//               onMouseEnter={(e) => e.target.style.background = styles.buttonHover.background}
//               onMouseLeave={(e) => e.target.style.background = styles.button.background}
//             >
//               {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
//             </button>

//           </form>
//         )}
  
//         {/* Step 2: Verify OTP */}
//         {step === 2 && (
//           <form onSubmit={handleOtpSubmit} style={styles.form}>
//             <label style={styles.label}>Enter OTP sent to your email:</label>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               style={styles.input}
//             />
//             {/* <button type="submit" style={styles.button}>Verify OTP</button> */}
//             <button
//               type="submit"
//               style={Object.assign({}, styles.button, styles.buttonHover)}
//               onMouseEnter={(e) => e.target.style.background = styles.buttonHover.background}
//               onMouseLeave={(e) => e.target.style.background = styles.button.background}
//             >
//               {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
//             </button>

//           </form>
//         )}
  
//         {/* Step 3: Reset Password */}
//         {step === 3 && (
//           <form onSubmit={handlePasswordReset} style={styles.form}>
//             <label style={styles.label}>New Password:</label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               style={styles.input}
//             />
//             {/* <button type="submit" style={styles.button}>Reset Password</button> */}
//             <button
//               type="submit"
//               style={Object.assign({}, styles.button, styles.buttonHover)}
//               onMouseEnter={(e) => e.target.style.background = styles.buttonHover.background}
//               onMouseLeave={(e) => e.target.style.background = styles.button.background}
//             >
//               {step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
//             </button>

//           </form>
//         )}
//       </div>
//     </div>
//   );
  
// };

// export default ForgetPassword;


///////////////////////
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const formRef = useRef(null);

  // Similar background effect as in Login.js
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // API logic here...
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    // API logic here...
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    // API logic here...
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <div style={styles.content}>
        <form ref={formRef} onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handlePasswordReset} style={styles.form}>
          <h2 style={styles.title}>Forgot Password</h2>
          {step === 1 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>Send OTP</button>
            </div>
          )}
          {step === 2 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>Verify OTP</button>
            </div>
          )}
          {step === 3 && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button}>Reset Password</button>
            </div>
          )}
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
    backgroundColor: '#f0f0f0',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    opacity: 0,
    transform: 'translateY(-50px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '94%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
};

export default ForgetPassword;
