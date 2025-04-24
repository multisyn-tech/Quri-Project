import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('authToken');
const resID = localStorage.getItem('RestaurantID');

export const getQRDetails = createAsyncThunk(
  'qrcode/getQRDetails',
  async (qrcode, { rejectWithValue }) => {
    try {

      const response = await axios.get(`${BASE_URL}/restaurant/QRDetails/${qrcode}`);
    
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const qrcodeSlice = createSlice({
  name: 'qrcode',
  initialState: {
    // qrCodeDetails: {}, // Changed to an object assuming a single QR code details
    qrCodeDetails: JSON.parse(localStorage.getItem('backupQrCodeDetails')) || {}, // Load from localStorage if needed
    ordersByTableID: null,
    cartItems:[],
    loading: false,
    error: null,
  },
  reducers: {
    // Reset the state to its initial value
    reset: (state) => {
      state.qrCodeDetails = {};
      state.ordersByTableID = null;
      state.cartItems=[];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQRDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCodeDetails = action.payload; 
        state.error = null;
      })
      .addCase(getQRDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(getQRDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { reset } = qrcodeSlice.actions;
export default qrcodeSlice.reducer;
