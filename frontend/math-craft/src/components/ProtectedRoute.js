import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for authentication with an API call
        const response = await axios.get('http://localhost:5000/api/user/check-auth', { withCredentials: true });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error during auth check:', err);
        setIsAuthenticated(false);
      }
    };
    
    if (isAuthenticated === null) {
      checkAuth();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <div>Loading, please wait...</div>;  // You could replace this with a loader/spinner
  }

  
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
