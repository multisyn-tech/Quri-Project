import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// paymentsSlice.js
export const getStripePayments = createAsyncThunk(
  'payments/getStripePayments',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const resID = localStorage.getItem('RestaurantID');

      if (!token) throw new Error('No token found');
      if (!resID) throw new Error('No RestaurantID found');

      const response = await axios.get(
        `${BASE_URL}/bill/stripe-payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: payload
        }
      );


      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    records: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStripePayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStripePayments.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getStripePayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;

