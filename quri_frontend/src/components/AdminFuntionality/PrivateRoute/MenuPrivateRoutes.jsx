import { Navigate, Outlet } from 'react-router-dom';
import SpinnerComponent from '../../../Manage/Fallback-spinner';
import { useEffect, useState } from 'react';

const MenuPrivateRoutes = ({ children }) => {
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
    return <div><SpinnerComponent/></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default MenuPrivateRoutes