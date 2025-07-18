import { useEffect, useState } from 'react';
import { useLocation, Outlet, Navigate } from 'react-router-dom';

const CheckRole = () => {
  const [isSuperAdminRoute, setIsSuperAdminRoute] = useState(false);
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    checkRole();
  }, [location]);

  const checkRole = () => {
    const path = location.pathname;
    const userRole = path.split('/')[1];

    if (userRole === 'admin') {
      setIsSuperAdminRoute(false);
    } else if (userRole === 'superadmin') {
      setIsSuperAdminRoute(true);
      if (path === '/superadmin') {
        setShouldRedirect(true);
      }
    }
  };

  if (shouldRedirect) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return <Outlet />;
};

export default CheckRole;
