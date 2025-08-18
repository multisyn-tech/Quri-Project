import MainDashboard from "../pages/AdminNavigation/views/admin/default";
import Tables from "../pages/AdminNavigation/views/admin/marketplace";
import Menu from "../pages/AdminNavigation/views/admin/profile";
import Orders from "../pages/AdminNavigation/views/admin/tables";
import Logs from "../pages/AdminNavigation/views/admin/activity";
import Customers from "../pages/AdminNavigation/views/admin/customers";
import Settings from "../pages/AdminNavigation/views/admin/settings";
import Categories from "../pages/AdminNavigation/views/admin/categories";
import Reviews from "../pages/AdminNavigation/views/admin/reviews";
import Payments from "../pages/AdminNavigation/views/admin/payments";
import { MdHome, MdRestaurantMenu, MdTableRestaurant, MdOutlineEventNote,MdReviews, MdPayment  } from "react-icons/md";
import { FaPeopleGroup,FaClipboardList  } from "react-icons/fa6";
import FoodBankIcon from '@mui/icons-material/FoodBank';
import { SettingsAccessibilitySharp } from "@mui/icons-material";
import FirstTimeSettings from "../pages/AdminNavigation/views/FirstTimeSettings";

const AdminRoutes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Tables",
    layout: "/admin",
    path: "manage/tables",
    icon: <MdTableRestaurant className="h-6 w-6" />,
    component: < Tables />,
    secondary: true,
  },
  {
    name: "Orders",
    layout: "/admin",
    icon: <MdOutlineEventNote className="h-6 w-6" />,
    path: "manage/orders",
    component: <Orders />,
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "manage/category",
    icon: <FoodBankIcon  className="h-6 w-6" />,
    component: < Categories/>,
  },
  {
    name: "Menu",
    layout: "/admin",
    path: "manage/menu",
    icon: <MdRestaurantMenu className="h-6 w-6" />,
    component: <Menu/>,
  },
  {
    name: "Logs",
    layout: "/admin",
    path: "manage/logs",
    icon: <FaClipboardList  className="h-5 w-5" />,
    component: <Logs />,
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "manage/customers",
    icon: <FaPeopleGroup className="h-6 w-6" />,
    component: <Customers />,
  },
  {
    name: "Customer Reviews",
    layout: "/admin",
    path: "manage/reviews",
    icon: <MdReviews className="h-6 w-6" />,
    component: <Reviews />,
  },
  // {
  //   name: "Payments",
  //   layout: "/admin",
  //   path: "manage/payments",
  //   icon: <MdPayment className="h-6 w-6" />,
  //   component: <Payments />,
  // },
  {
    name: "Settings",
    layout: "/admin",
    path: "manage/settings",
    icon: <SettingsAccessibilitySharp className="h-6 w-6" />,
    component: <Settings />,
  },  
  

];


export default AdminRoutes;
