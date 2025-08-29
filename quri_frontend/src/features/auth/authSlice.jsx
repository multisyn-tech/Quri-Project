import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const token = localStorage.getItem('authToken');
const restaurantId  = localStorage.getItem('RestaurantID');

// Thunk to fetch the restaurant name by restaurant ID
export const fetchRestaurantName = createAsyncThunk(
  'auth/fetchRestaurantName',
  async (_,  rejectWithValue) => {
    try {
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/restaurant/fetch/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.RestaurantName;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    restaurantId: null,
    restaurantName: '',
    loading: false,
    error: null,
  },
  reducers: {
    setAuthData: (state, action) => {
      state.token = action.payload.token;
      state.restaurantId = action.payload.restaurantId;
    },
    clearAuthData: (state) => {
      state.token = null;
      state.restaurantId = null;
      state.restaurantName = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantName.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantName = action.payload;
      })
      .addCase(fetchRestaurantName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;