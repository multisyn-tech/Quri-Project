import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('authToken');
const resID = localStorage.getItem('RestaurantID');

// Thunk for fetching orders
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const resID = localStorage.getItem('RestaurantID');
      
      if (!token) {
        throw new Error('No token found');
      }
      if (!resID) {
        throw new Error('No RestaurantID found');
      }

      const response = await axios.get(`${BASE_URL}/customers/order?limit=${payload.limit}&page=${payload.page}&search=${payload.search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getDetailsOfOrders = createAsyncThunk(
  'orders/detailsOfOrders',
  async (orderID, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      if (!resID) {
        throw new Error('No RestaurantID found');
      }

      const response = await axios.get(`${BASE_URL}/restaurant/orderdetails/${orderID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
     
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching orders based on customers
export const getOrdersByCustomer = createAsyncThunk(
  'orders/getOrdersByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      if (!resID) {
        throw new Error('No RestaurantID found');
      }

      const response = await axios.get(`${BASE_URL}/customers/orders/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getOrdersByTableID = createAsyncThunk(
  'orders/getOrdersByTableID',
  async (tableID, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      if (!resID) {
        throw new Error('No RestaurantID found');
      }

      const response = await axios.get(`${BASE_URL}/customers/order/${tableID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for adding an order
export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers/order`, orderData);

      return response.data;
    } catch (error) {
      console.error("Error while adding order:", error.response?.data || error.message); // Log error details
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk for viewing Order
export const viewOrder = createAsyncThunk(
  'orders/viewOrder',
  async (tableId, { rejectWithValue }) => {
   
    try {
      const response = await axios.get(`${BASE_URL}/customers/order/${tableId}`);
      // dispatch(cartItems(response.data))
      //console.log("View Order Response",response.data)
      return response.data;
    } catch (error) {
      console.error("Error while fetching order:", error.response?.data || error.message); // Log error details
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateOrderStatus = createAsyncThunk(
  'orders/orderStatus',
  async ( payload , { rejectWithValue }) => {
   console.log('payload==', payload)
    try {
      const response = await axios.put(`${BASE_URL}/customers/order/changeStatus/${payload.OrderID}`,payload);
      // dispatch(cartItems(response.data))
      return response.data;
    } catch (error) {
      console.error("Error while fetching order:", error.response?.data || error.message); // Log error details
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    detailsOfOrders:[],
    orderStatus:[],
    ordersByCustomer:[],
    ordersByTableID:[],
    order: { orderDetails: [] },
    loading: false,
    status: 'idle',
    error: null,
    img: '',
    cartItems: [], // Add cartItems to the state
    totalPrice: 0, // Add totalPrice to the state

  },
  reducers: {
    addItemToCart: (state, action) => {
      const { item, quantity } = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem.MenuID === item.MenuID);
      if (existingItem) {
        existingItem.quantity += quantity; // Increment quantity if item exists
      } else {
        state.cartItems.push({ ...item, quantity }); // Add new item if it does not exist
      }
    },
    removeItemFromCart: (state, action) => {
      const MenuID = action.payload;
      state.cartItems = state.cartItems.filter(cartItem => cartItem.MenuID !== MenuID);
    },
    updateItemQuantity: (state, action) => {
      const { MenuID, quantity } = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem.MenuID === MenuID);
      if (existingItem) {
        existingItem.quantity = quantity; // Update the item's quantity
      }
    },
    resetCartItems: (state) => {
      state.cartItems = []; // Reset the cartItems to an empty array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.orders = action.payload; // Update state with fetched data
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.error = action.payload; // Update state with the error
      })
      .addCase(getOrdersByCustomer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrdersByCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordersByCustomer = action.payload; // Ensure correct data structure
      })
      .addCase(getOrdersByCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getOrdersByTableID.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrdersByTableID.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ordersByTableID = action.payload; // Ensure correct data structure
      })
      .addCase(getOrdersByTableID.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add order cases
      .addCase(addOrder.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.orders.push(action.payload); // Add new order to state
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
        console.error("Order add failed with error:", action.payload); // Log error
      })
      .addCase(viewOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(viewOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(viewOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error("Order view failed with error:", action.payload); // Log error
      })
      .addCase(getDetailsOfOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detailsOfOrders = action.payload; // Store full response in state
      })
      .addCase(getDetailsOfOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDetailsOfOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderStatus = action.payload; // Ensure correct data structure
      })
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity, resetCartItems } = orderSlice.actions;

//Memoized purposes
export const selectQrCodeDetails = (state) => state.qrcode.qrCodeDetails?.data;
export const selectOrderDetails = (state) => state.orders.order?.orderDetails || [];

// Memoized selectors
export const selectQrCode = createSelector(
  [selectQrCodeDetails],
  (qrCodeDetails) => qrCodeDetails?.QRCode
);

export const selectTableID = createSelector(
  [selectQrCodeDetails],
  (qrCodeDetails) => qrCodeDetails?.TableID
);

export const selectMemoizedOrderDetails = createSelector(
  [selectOrderDetails],
  (orderDetails) => orderDetails
);


export default orderSlice.reducer;