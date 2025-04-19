import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer/Footer";
import AdminRoutes from '../../../../Router/AdminRoutes.jsx';  // Import admin routes
import SuperAdminRoutes from '../../../../Router/SuperAdminRoutes.jsx';  // Import superadmin routes

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();

  // Get the user's role from localStorage and normalize it to lowercase
  const role = localStorage.getItem('role')?.toLowerCase();
  // console.log("Role is: ", role);

  // Initialize open state from localStorage or default to true
  const [open, setOpen] = React.useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState ? JSON.parse(savedState) : true;
  });

  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      const shouldOpen = window.innerWidth >= 1200;
      setOpen(shouldOpen);
      localStorage.setItem('sidebarOpen', JSON.stringify(shouldOpen));
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  React.useEffect(() => {
    getActiveRoute(role === 'admin' ? SuperAdminRoutes : AdminRoutes);  // Load correct routes based on role
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      // Load routes based on the role (admin or restaurant)
      if (prop.layout === (role === 'admin' ? "/superadmin" : "/admin")) {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  const handleSidebarToggle = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newOpenState));
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={handleSidebarToggle} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={handleSidebarToggle}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(role === 'admin' ? SuperAdminRoutes : AdminRoutes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {/* Pass the routes based on the user's role */}
                {getRoutes(role === 'admin' ? SuperAdminRoutes : AdminRoutes)}
                <Route
                  path="/"
                  element={<Navigate to={role === 'admin' ? "/superadmin/dashboard" : "/admin/default"} replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
