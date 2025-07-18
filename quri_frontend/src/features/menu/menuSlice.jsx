import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching menus
export const fetchMenus = createAsyncThunk(
  'menus/fetchMenus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/restaurant/fetchMenu`, {
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

// Thunk for adding a menu
export const addMenu = createAsyncThunk(
  'menus/addMenu',
  async (menuData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Validate MenuStatus
      const validMenuStatuses = ['active', 'inactive'];
      if (!validMenuStatuses.includes(menuData.get('MenuStatus'))) {
        throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
      }

      const response = await axios.post(
        `${BASE_URL}/restaurant/addMenu`,
        menuData, // This is the FormData object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Do not set 'Content-Type', Axios will handle this for FormData automatically
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Thunk for deleting a menu
export const deleteMenu = createAsyncThunk(
  'menus/deleteMenu',
  async (menuId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`${BASE_URL}/restaurant/menu/delete/${menuId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return menuId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Thunk for fetching a single menu
export const fetchMenu = createAsyncThunk(
  'menus/fetchMenu',
  async (menuId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/restaurant/menu/${menuId}`, {
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

// Thunk for editing a menu
export const editMenu = createAsyncThunk(
  'menus/editMenu',
  async ({ menuId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Sending FormData (which may include image/file)
      const response = await axios.put(`${BASE_URL}/restaurant/menu/edit/${menuId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure that this is set to allow file upload
        },
      });

      return response.data; // Return the response from the backend
    } catch (error) {
      console.error("Error in editMenu thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);



export const fetchMenuByTableID = createAsyncThunk(
  'menus/fetchMenuByTableID',
  async (tableId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/menu/${tableId}`);
     // console.log('My redux response: ', response)
      if (response.data ) {
        return response.data; // Return the entire response data
      } else {
        return rejectWithValue("Menu data not found");
      }
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


/**
 * //Extra Reducers with addCase is prefferable.
 * It keeps the sideffects separate from reducers. 
 * Ensures reducers stay pure. 
 */
const menuSlice = createSlice({
  name: 'menus',
  initialState: {
    menus: [],
    menu: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling pending state for fetching menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;   // Reset any previous errors
      })
      // Handling fulfilled state for fetching menus
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.menus = action.payload; // Update state with fetched data
      })
      // Handling rejected state for fetching menus
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false; // Data fetching is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for deleting a menu
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;   // Reset any previous errors
      })
      // Handling fulfilled state for deleting a menu
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false; // Delete operation is complete
        state.menus = state.menus.filter(menu => menu.MenuID !== action.payload); // Remove the deleted menu from the state
      })
      // Handling rejected state for deleting a menu
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false; // Delete operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for fetching a single menu
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.menu = null; // Reset the single menu state
      })
      // Handling fulfilled state for fetching a single menu
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      // Handling rejected state for fetching a single menu
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling pending state for editing a menu
      .addCase(editMenu.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for editing a menu
      .addCase(editMenu.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.menus.findIndex(menu => menu.MenuID === action.payload.MenuID);
        if (index !== -1) {
          state.menus[index] = action.payload;
        }
      })
      // Handling rejected state for editing a menu
      .addCase(editMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Update state with the error
      })
      .addCase(fetchMenuByTableID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuByTableID.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload; 
      })
      .addCase(fetchMenuByTableID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default menuSlice.reducer;


