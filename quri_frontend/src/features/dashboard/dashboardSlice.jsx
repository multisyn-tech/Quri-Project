import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('authToken');
const resID = localStorage.getItem('RestaurantID');

export const getDashboardDetails = createAsyncThunk(
  'qrcode/getDashboardDetails',
  async (payload, { rejectWithValue }) => {
    try {
      // Retrieve token inside the thunk to ensure the latest token is used
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${BASE_URL}/sales/sales-report?startDate=${payload.startDate}&endDate=${payload.endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('response', response);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboardDetails: {}, // Changed to an object assuming a single QR code details
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardDetails = action.payload; 
        state.error = null;
      })
      .addCase(getDashboardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(getDashboardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export default dashboardSlice.reducer;
