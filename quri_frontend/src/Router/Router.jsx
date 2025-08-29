import { Navigate, Outlet } from "react-router-dom";
import HomeScreen from "../pages/BillingNavigation/HomeScreen";
import Billing from "../pages/BillingNavigation/Billing";

import Waiting from "../pages/BillingNavigation/Waiting";

import QuriFeeDetails from "../pages/BillingNavigation/QuriFeeDetails";
import TotalBillings from "../pages/BillingNavigation/TotalBillings";
import QuriFeeDetail from "../components/BillingFuntionality/TotalBill/FeeDetails";
import BillSplit from "../components/BillingFuntionality/SplitBill";
import SplitQuri from "../pages/BillingNavigation/SplitQuri";
import CashPayment from "../pages/BillingNavigation/CashPayment";
import PaymentSuccessful from "../pages/BillingNavigation/PaymentSuccessful";
import SignUp from "../components/AdminFuntionality/AdminCredentials/SignUp";
import CheckRole from "../components/AdminFuntionality/AdminCredentials/CheckRole";
import Login from "../components/AdminFuntionality/AdminCredentials/Login";
import AdminRoutes from './AdminRoutes';
import SuperAdminRoutes from "./SuperAdminRoutes";
import AuthLayout from '../components/AdminFuntionality/layouts/auth';
import AdminLayout from "../components/AdminFuntionality/layouts/admin";

import SuperAdminLogin from "../components/AdminFuntionality/AdminCredentials/SuperAdminLogin";
import SuperAdminSignup from "../components/AdminFuntionality/AdminCredentials/SuperAdminSignUp";
import RestaurantRegisteration from "../pages/SuperAdminNavigation/AllRestaurants/RestaurantRegisterationPage";




import PrivateRoute from '../components/AdminFuntionality/PrivateRoute/PrivateRoute';
import Menu from "../pages/MenuNavigation/views/Menu";

import OrderPlaced from "../pages/MenuNavigation/views/OrderPlaced";
import VerifyEmail from "../components/AdminFuntionality/AdminCredentials/VerifyEmail";
import MenuPrivateRoutes from "../components/AdminFuntionality/PrivateRoute/MenuPrivateRoutes";
import NotAuthorized from "../components/NotAuthorized";
import OrderSummary from "../pages/MenuNavigation/views/OrderDetails/OrderSummary";

import AdminVerifyOtp from "../components/AdminFuntionality/AdminCredentials/AdminVerifyOtp";

import FirstTimeSettings from "../pages/AdminNavigation/views/FirstTimeSettings";

const ThemeRoutes = [
  {
    path: "/",
    element: <Navigate to="/admin" />,
  },
  { path: "/unauthorized", element: <NotAuthorized /> },
  {
    path: "/admins",
    children: [
      // { path: "SignUp", exact: true, element: <SignUp /> },
      { path: "Login", exact: true, element: <Login /> },
      { path: "VerifyEmail/:token", exact: true, element: <VerifyEmail /> },
      { path: "VerificationEmail", exact: true, element: <AdminVerifyOtp /> },
    ],
  },
  {
    path: "/admin/*",
    element: (
      <PrivateRoute>
         {/* <FirstTimeSettings> */}
        <AdminLayout />
        {/* </FirstTimeSettings> */}
      </PrivateRoute>
    ),
    children: [
      ...AdminRoutes.map(route => ({
        path: route.path,
        element: route.component,
      })),
    ],
  },

  // super admin login
  {
    path: "/superadmin",
    element: <CheckRole/>,
    children: [
      { path: "login", exact: true, element: <SuperAdminLogin /> },
      { path: "SignUp", exact: true, element: <SuperAdminSignup /> },

      { path: "restaurant/registeration", exact: true, element: <RestaurantRegisteration /> },
      
      { path: "VerifyEmail/:token", exact: true, element: <VerifyEmail /> },
      { path: "VerificationEmail", exact: true, element: <AdminVerifyOtp /> },
    ],
  },

  {
    path: "/superadmin/*",
    element: (
      <PrivateRoute>
          <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      ...SuperAdminRoutes.map(route => ({
        path: route.path,
        element: route.component,
      })),
    ],
  },

  {
    path: "/auth/*",
    element: (
      <PrivateRoute>
          <AuthLayout />
      </PrivateRoute>
    ),
    children: [],
  },
 
  {
    path: "/quri",
    
    // element: <MenuPrivateRoutes ><Outlet /></MenuPrivateRoutes>,
    children: [
      { path: "home/:qrCode", exact: true, element: <HomeScreen /> },
      { path: "home/bill", exact: true, element: <Billing /> },
      { path: "home/waiting", exact: true, element: <Waiting /> },
      { path: "quriFeeDetails", exact: true, element: <QuriFeeDetails /> },
      { path: "bill/checkout", exact: true, element: <TotalBillings /> },
      { path: "fee", exact: true, element: <QuriFeeDetail /> },
      { path: "bill/split", exact: true, element: <BillSplit /> },
      { path: "split/qurifee", exact: true, element: <SplitQuri /> },
      { path: "paycash", exact: true, element: <CashPayment /> },
      { path: "bill/success", exact: true, element: <PaymentSuccessful /> },
    ],
  },
  {
    path: "/quri/menu",
    children: [
      { path: "home", exact: true, element: <Menu /> },
      { path: "orderSummary", exact: true, element: <OrderSummary /> },
      { path: "orderPlaced", exact: true, element: <OrderPlaced /> },
    ],
  },
];

export default ThemeRoutes;
