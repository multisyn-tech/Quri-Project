import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching menus
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/restaurant/categories`, {
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


// Thunk for adding a category
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${BASE_URL}/restaurant/categories`, categoryData, {
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

// Thunk for editing a category
export const editCategory = createAsyncThunk(
  'categories/editCategory',
  async ({ CategoryID, updatedCategoryData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(`${BASE_URL}/restaurant/categories/${CategoryID}`, updatedCategoryData, {
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

// Thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (CategoryID, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.delete(`${BASE_URL}/restaurant/categories/${CategoryID}`, {
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



/**
 * //Extra Reducers with addCase is prefferable.
 * It keeps the sideffects separate from reducers. 
 * Ensures reducers stay pure. 
 */
const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
      menus: [],
      menu: null,
      loading: false,
      error: null,
      resetCategories:[], //Future use
    },
    reducers: {
      /**
       * 
       * For future use 
       */
      resetCategories:state=>{
        state.menus=[]
        state.menu=[]
      },
    },
    extraReducers: (builder) => {
      builder
        // Handling pending state for fetching categories
        .addCase(fetchCategories.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        // Handling fulfilled state for fetching categories
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.loading = false;
          state.menus = action.payload;
        })
        // Handling rejected state for fetching categories
        .addCase(fetchCategories.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Handling pending state for adding a category
        .addCase(addCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        // Handling fulfilled state for adding a category
        .addCase(addCategory.fulfilled, (state, action) => {
          state.loading = false;
          state.menus.push(action.payload);
        })
        // Handling rejected state for adding a category
        .addCase(addCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Handling pending state for editing a category
        .addCase(editCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        // Handling fulfilled state for editing a category
        .addCase(editCategory.fulfilled, (state, action) => {
          state.loading = false;
          const index = state.menus.findIndex((category) => category.CategoryID === action.meta.arg.CategoryID);
          if (index !== -1) {
            state.menus[index] = action.payload;
          }
        })
        // Handling rejected state for editing a category
        .addCase(editCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Handling pending state for deleting a category
        .addCase(deleteCategory.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        // Handling fulfilled state for deleting a category
        .addCase(deleteCategory.fulfilled, (state, action) => {
          state.loading = false;
          state.menus = state.menus.filter((category) => category.CategoryID !== action.meta.arg);
        })
        // Handling rejected state for deleting a category
        .addCase(deleteCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  

  export default categoriesSlice.reducer;
  

