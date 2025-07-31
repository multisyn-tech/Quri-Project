import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const resID = localStorage.getItem('RestaurantID'); // Assuming the RestaurantID is stored in local storage

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching settings
export const getSettings = createAsyncThunk(
  'settings/getSettings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const resID = localStorage.getItem('RestaurantID'); 
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/setting?RestaurantID=${resID}`, {
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

// Thunk for fetching settings
export const getRestaurantSettings = createAsyncThunk(
  'settings/getRestaurantSettings',
  async (_, { rejectWithValue }) => { // No need to pass resID here
    try {
      const token = localStorage.getItem('authToken');
      const resID = localStorage.getItem('RestaurantID');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/setting/fetch/${resID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(resID);
      console.log(response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for adding a setting (image upload)
export const addSettings = createAsyncThunk(
  'settings/addSettings',
  async ({ key, selectedImage, resID }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('RestaurantID', resID);
      formData.append('KeyID', key);
      formData.append('Value', '');

      const response = await axios.post(`${BASE_URL}/setting`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Thunk for creating or updating settings
export const createOrUpdateSettings = createAsyncThunk(
  'settings/createOrUpdateSettings',
  async ({ settings, resID }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${BASE_URL}/setting/data`, { settings, RestaurantID: resID }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWorkingHours = createAsyncThunk(
  'settings/updateWorkingHours',
  async ({ RestaurantID, workingHours }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${BASE_URL}/setting/working-hours`, { RestaurantID, workingHours }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching working hours
export const fetchWorkingHours = createAsyncThunk(
  'settings/fetchWorkingHours',
  async ({ RestaurantID }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/setting/working-hours/${RestaurantID}`, {
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

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: [],
    restaurantSettings: [],
    loading: false,
    error: null,
    success: null, // Added success to the initial state
    img: '',
  },
  reducers: {
    clearSuccess(state) {
      state.success = null; // Clear the success message
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.settings = action.payload; // Update state with fetched data
        const imageSetting = action.payload.find(setting => setting.KeyID === 'image');
        if (imageSetting) {
          state.img = imageSetting.Value;
        }
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.error = action.payload; // Update state with the error
      })
      .addCase(getRestaurantSettings.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(getRestaurantSettings.fulfilled, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.restaurantSettings = action.payload; // Update state with fetched data
      })
      .addCase(getRestaurantSettings.rejected, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.error = action.payload; // Update state with the error
      })
      .addCase(addSettings.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(addSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.img = action.payload.result.filePath;
      })
      .addCase(addSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Update state with the error
      })
      .addCase(createOrUpdateSettings.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(createOrUpdateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantSettings = action.payload;
      })
      .addCase(createOrUpdateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Update state with the error
      })
      .addCase(updateWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(updateWorkingHours.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Working hours updated successfully';
      })
      .addCase(updateWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Update state with the error
      })
      .addCase(fetchWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      .addCase(fetchWorkingHours.fulfilled, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.workingHours = action.payload; // Update state with fetched data
      })
      .addCase(fetchWorkingHours.rejected, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.error = action.payload; // Update state with the error
      });
  },
});

export const { clearSuccess } = settingSlice.actions;


export default settingSlice.reducer;
