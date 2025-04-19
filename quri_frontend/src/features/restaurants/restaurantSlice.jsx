import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for creating a restaurant
export const createRestaurant = createAsyncThunk(
    'restaurants/createRestaurant',
    async (restaurantData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post(
                `${BASE_URL}/restaurant/createRestaurant`,
                restaurantData, // FormData with image and other restaurant details
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Ensure file upload handling
                    },
                }
            );

            return response.data; // Return the response data on successful creation
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


// Thunk for fetching all restaurants
export const fetchAllRestaurants = createAsyncThunk(
    'restaurants/fetchAllRestaurants',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${BASE_URL}/restaurant/fetchRestaurant`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data; // Return the fetched restaurants data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


// Thunk for fetching restaurant by ID
export const fetchRestaurantById = createAsyncThunk(
    'restaurants/fetchRestaurantById',
    async (restaurantId, { rejectWithValue }) => {
        try {
            if (!restaurantId) {
                throw new Error('Restaurant ID is required');
            }

            const response = await axios.get(`${BASE_URL}/restaurant/fetch/${restaurantId}`);
            return response.data; // Return the fetched restaurant data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Thunk for editing a restaurant
export const editRestaurantById = createAsyncThunk(
    'restaurants/editRestaurantById',
    async ({ restaurantId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/restaurant/edit/${restaurantId}`,
                updatedData, // FormData with updated details and image if applicable
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data; // Return the response data on successful update
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


// Thunk for deleting a restaurant by ID
export const deleteRestaurantById = createAsyncThunk(
    'restaurants/deleteRestaurantById',
    async (restaurantId, { rejectWithValue }) => {
        try {
            if (!restaurantId) {
                throw new Error('Restaurant ID is required');
            }

            const response = await axios.delete(`${BASE_URL}/restaurant/delete/${restaurantId}`);
            return response.data; // Return the response data on successful deletion
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);



// Initial state for the slice
const initialState = {
    restaurants: [],
    restaurant: null,
    loading: false,
    error: null,
    addSuccess: false,
    deleteSuccess: false,
    editSuccess: false,
};

// Create restaurant slice
const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        resetAddSuccess: (state) => {
            state.addSuccess = false;
        },
        resetDeleteSuccess: (state) => {
            state.deleteSuccess = false;
        },
        resetEditSuccess: (state) => {
            state.editSuccess = false;
        },
        

    },
    extraReducers: (builder) => {
        builder
            // Pending state for creating restaurant
            .addCase(createRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.addSuccess = false;
            })
            // Fulfilled state for successful creation
            .addCase(createRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.addSuccess = true;
                state.error = null; // Reset any previous errors
            })
            // Rejected state for error handling
            .addCase(createRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled state for successful fetching
            .addCase(fetchAllRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurants = action.payload; // Set the fetched restaurants data
                state.error = null;
            })
            // Rejected state for error handling
            .addCase(fetchAllRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Pending state for fetching restaurant by ID
            .addCase(fetchRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled state for successful fetching by ID
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurant = action.payload; // Set the fetched restaurant data
                state.error = null;
            })
            // Rejected state for error handling
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Pending state for editing restaurant by ID
            .addCase(editRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.editSuccess = false;
            })
            // Fulfilled state for successful editing
            .addCase(editRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.editSuccess = true; 
                state.error = null;
            })
            // Rejected state for error handling
            .addCase(editRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.editSuccess = false;
            })
            // Pending state for deleting restaurant by ID
            .addCase(deleteRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.deleteSuccess = false;
            })
            // Fulfilled state for successful deletion
            .addCase(deleteRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.deleteSuccess = true;
                state.error = null;
                // Remove the deleted restaurant from the list
                state.restaurants = state.restaurants.filter(
                    (restaurant) => restaurant.RestaurantID !== action.meta.arg
                );
            })
            // Rejected state for error handling
            .addCase(deleteRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

// Export the reducer and action
export const { resetAddSuccess, resetDeleteSuccess,resetEditSuccess } = restaurantSlice.actions;
export default restaurantSlice.reducer;
