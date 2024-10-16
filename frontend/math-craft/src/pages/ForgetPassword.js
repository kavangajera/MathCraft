import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);  // Controls the current step
  const [email, setEmail] = useState('');  // Store user's email
  const [otp, setOtp] = useState('');  // Store the entered OTP
  const [otpToken, setOtpToken] = useState('');  // Store OTP token received from server
  const [newPassword, setNewPassword] = useState('');  // Store the new password

  const navigate = useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.otpToken) {
        setOtpToken(data.otpToken);  // Store OTP token in state
        setStep(2);  // Move to the OTP step
      }
      else{
        alert("Email is not exist")
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleOtpSubmit = async (e) => {
    console.log("onverfiy clik")
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, otpToken }),
      });
      const data = await response.json();

      if (data.message === 'OTP verified') {
        console.log("verified");
        setStep(3);  // Move to the password reset step
      }
      else{
        alert("OTP is not valid!!")
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      console.log("hello")
      if (data.message === 'Password reset successfully.') {
        alert('Password reset successful! You can now log in with your new password.');

        setTimeout(() => {
            navigate('/login'); 
          }, 2000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  // Inline styles for the component
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      margin: '10px 0',
      padding: '8px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      fontSize: '16px',
      marginTop: '10px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    label: {
      marginBottom: '8px',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <h1>Forgot Password</h1>
      
      {/* Step 1: Request OTP (Email Submission) */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} style={styles.form}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Send OTP</button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={handleOtpSubmit} style={styles.form}>
          <label style={styles.label}>Enter OTP sent to your email:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Verify OTP</button>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <form onSubmit={handlePasswordReset} style={styles.form}>
          <label style={styles.label}>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
