import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const restaurantId = localStorage.getItem('RestaurantID');

// Thunk for fetching reviews
export const fetchReviewsByRestaurant = createAsyncThunk(
    'reviews/fetchByRestaurant',
    async (_, { rejectWithValue }) => {
        
        const token = localStorage.getItem('authToken');
       
        if (!token) {
          return rejectWithValue('No token found');
        }
        
        try {
          const response = await axios.get(`${BASE_URL}/reviews?restaurantId=${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response.data);
        }
      }
    );

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByRestaurant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsByRestaurant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByRestaurant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
