import { combineReducers } from '@reduxjs/toolkit';

import menuReducer from '../features/menu/menuSlice';
import restaurantReducer from '../features/restaurants/restaurantSlice'
import tableReducer from '../features/tables/tableSlice';
import customerReducer from '../features/customers/customerSlice';
import settingReducer from '../features/settings/settingSlice';
import orderReducer from '../features/orders/orderSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import qrcodeReducer from '../features/qrcode/qrcodeSlice';
import billReducer from '../features/billSplit/billSlice';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import superMenuReducer from '../features/SuperAdmin/superAdminSlice';
import superOrderReducer from '../features/SuperAdmin/superAdminSlice';
import paymentReducer from '../features/payments/paymentSlice';
import activityReducer  from '../features/activity/activitySlice';

const rootReducer = combineReducers({
  menus: menuReducer,
  tables: tableReducer,
  customers: customerReducer,
  settings: settingReducer,
  orders: orderReducer,
  categories: categoriesReducer,
  reviews: reviewReducer,
  qrcode: qrcodeReducer,
  BillSplit: billReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  restaurants: restaurantReducer,
  superMenus: superMenuReducer,
  superOrder: superOrderReducer,
  payments: paymentReducer,
  activity:activityReducer,
});

export default rootReducer;
