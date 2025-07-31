import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../features/menu/menuSlice';
import restaurantReducer from '../features/restaurants/restaurantSlice'
import tableReducer from '../features/tables/tableSlice';
import customerReducer from '../features/customers/customerSlice';
import settingReducer from '../features/settings/settingSlice';
import orderReducer from '../features/orders/orderSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import qrcodeSlice from '../features/qrcode/qrcodeSlice';
import billReducer from '../features/billSplit/billSlice';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import superMenuReducer from '../features/SuperAdmin/superAdminSlice';
import superOrderReducer from '../features/SuperAdmin/superAdminSlice';
import paymentReducer from '../features/payments/paymentSlice';

// import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
// import storageSession from 'redux-persist/lib/storage/session'
import storage from 'redux-persist/lib/storage';

import rootReducer from './rootReducer';


const persistConfig = {
  key: 'root',
  // storage:storageSession,
  storage: storage,
  // whitelist: ['qrCodeDetails', 'cartItems', 'menus', 'BillSplit', 'auth', 'ordersByTableID'],
  whitelist: ['qrcode', 'menus', 'BillSplit', 'auth', 'orders'],

}

const persistedOrderReducer = persistReducer(persistConfig, orderReducer);
const persistedMenuReducer = persistReducer(persistConfig, menuReducer);
const persistedQRCodeReducer = persistReducer(persistConfig, qrcodeSlice);
const persistedBillSplitReducer = persistReducer(persistConfig, billReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);


// export const store = configureStore({
//   reducer: {
//     menus: persistedMenuReducer,
//     tables: tableReducer,
//     customers: customerReducer,
//     settings: settingReducer,
//     orders: persistedOrderReducer,
//     categories: categoriesReducer,
//     reviews: reviewReducer,
//     BillSplit: persistedBillSplitReducer,
//     // auth:persistedAuthReducer,
//     qrcode: persistedQRCodeReducer,
//     dashboard: dashboardReducer,
//     restaurants: restaurantReducer,
//     superMenus: superMenuReducer,
//     superOrder:superOrderReducer, 
//     payments:paymentReducer,


//   },
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     })
// });

const persistedReducer = persistReducer(persistConfig, rootReducer); 


export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


export const persistor = persistStore(store);