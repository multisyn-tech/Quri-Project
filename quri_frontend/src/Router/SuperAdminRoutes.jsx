import { BiHomeSmile,BiFoodMenu,BiSolidFoodMenu } from "react-icons/bi";
import { MdViewList, MdReviews } from 'react-icons/md';
import { SiHomeassistantcommunitystore } from "react-icons/si";
import AllRestaurants from "../pages/SuperAdminNavigation/AllRestaurants/AllRestaurants";
import SuperDashboard from "../pages/SuperAdminNavigation/Dashboard/SuperDashboard";
import AllMenu from "../pages/SuperAdminNavigation/AllMenu/AllMenu";
import AllOrders from "../pages/SuperAdminNavigation/AllOrders/AllOrders";
import AllReviews from "../pages/SuperAdminNavigation/AllReviews/AllReviews";

const SuperAdminRoutes = [
  {
    name: "Dashboard",
    layout: "/superadmin",
    path: "manage/dashboard",
    icon: <BiHomeSmile  className="h-6 w-6" />,
    component: <SuperDashboard />,
  },

  {
    name: "Restaurants Details",
    layout: "/superadmin",
    path: "manage/allrestaurants",
    icon: <SiHomeassistantcommunitystore className="h-6 w-6" />,
    component: <AllRestaurants />,
  },

  {
    name: "Restaurants Menu",
    layout: "/superadmin",
    path: "manage/restaurants/menu",
    icon: <BiSolidFoodMenu className="h-6 w-6" />,
    component: <AllMenu />,
  },
  {
    name: "Restaurants Orders",
    layout: "/superadmin",
    path: "manage/restaurants/orders",
    icon: <MdViewList className="h-6 w-6" />,
    component: <AllOrders />,
  },
  {
    name: "Restaurants Reviews",
    layout: "/superadmin",
    path: "manage/restaurants/reviews",
    icon: < MdReviews className="h-6 w-6" />,
    component: <AllReviews />,
  },
 
];

export default SuperAdminRoutes;
