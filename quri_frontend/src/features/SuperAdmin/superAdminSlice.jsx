import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching all restaurants' menus
export const fetchAllRestaurantsMenus = createAsyncThunk(
    'superAdmin/fetchAllRestaurantsMenus',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${BASE_URL}/superAdmin/fetchAllMenus`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

           

            return response.data; // Return the fetched menus data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Thunk for fetching all restaurant orders
export const fetchAllRestaurantOrders = createAsyncThunk(
    'superAdmin/fetchAllRestaurantOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${BASE_URL}/superAdmin/AllOrders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data; // Return the fetched orders data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Thunk for fetching menu by restaurant ID
export const fetchMenuByRestaurantID = createAsyncThunk(
    'menu/fetchMenuByRestaurantID',
    async (restaurantID, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${BASE_URL}/superAdmin/menu/${restaurantID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data; // Return the fetched menu data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Thunk for editing a menu item
export const editMenuItem = createAsyncThunk(
    'superAdmin/editMenuItem',
    async ({ menuId, data, file }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const formData = new FormData();
            formData.append('ItemName', data.ItemName);
            formData.append('ItemDescription', data.ItemDescription);
            formData.append('Price', data.Price);
            formData.append('MenuStatus', data.MenuStatus);
            if (file) {
                formData.append('image', file);
            } else if (data.Image) {
                formData.append('Image', data.Image);
            }

            const response = await axios.put(
                `${BASE_URL}/superAdmin/menu/edit/${menuId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log("Response from redux : ",response.data)

            return response.data; // Return the updated menu data
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);




// Initial state for the slice
const initialState = {
    superMenus: [],
    allOrders: [],
    menu: null,
    loading: false,
    error: null,
    editMenuLoading: false, // Loading state for editing menu
    editMenuError: null,    // Error state for editing menu
};


// Create superAdmin slice
const superAdminSlice = createSlice({
    name: 'superAdmin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Pending state for fetching all menus
            .addCase(fetchAllRestaurantsMenus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled state for successful fetching
            .addCase(fetchAllRestaurantsMenus.fulfilled, (state, action) => {
                state.loading = false;
                state.superMenus = action.payload; // Set the fetched menus data
                state.error = null;
            })
            // Rejected state for error handling
            .addCase(fetchAllRestaurantsMenus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Pending state for fetching all orders
            .addCase(fetchAllRestaurantOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled state for successful fetching
            .addCase(fetchAllRestaurantOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders = action.payload; // Set the fetched orders data
                state.error = null;
            })
            // Rejected state for error handling
            .addCase(fetchAllRestaurantOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMenuByRestaurantID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuByRestaurantID.fulfilled, (state, action) => {
                state.loading = false;
                state.menu = action.payload; // Set the fetched menu data
                state.error = null;
            })
            .addCase(fetchMenuByRestaurantID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editMenuItem.pending, (state) => {
                state.editMenuLoading = true;
                state.editMenuError = null;
            })
            .addCase(editMenuItem.fulfilled, (state) => {
                state.editMenuLoading = false;
                state.editMenuError = null;
            })
            .addCase(editMenuItem.rejected, (state, action) => {
                state.editMenuLoading = false;
                state.editMenuError = action.payload;
            });
    },
});

export default superAdminSlice.reducer;