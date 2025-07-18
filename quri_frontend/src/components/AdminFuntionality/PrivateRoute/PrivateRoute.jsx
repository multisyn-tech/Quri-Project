import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenValid } from './utils';
import SpinnerComponent from '../../../Manage/Fallback-spinner';

// const PrivateRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/admins/login" replace />;
//   }

//   return children;
// };


const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {    
    const token = localStorage.getItem('authToken');
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div><SpinnerComponent/> </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admins/login" replace />;
  }

  return children;
};

export default PrivateRoute;
