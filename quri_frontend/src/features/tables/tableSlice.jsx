import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching tables
export const fetchTables = createAsyncThunk(
  'tables/fetchTables',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/restaurant/table`, {
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

// Thunk for adding a table
export const addTable = createAsyncThunk(
  'tables/addTable',
  async (tableData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        `${BASE_URL}/restaurant/table`,
        tableData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for removing a table
export const removeTable = createAsyncThunk(
    'tables/removeTable',
    async (TableID, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found');
        }
  
        await axios.delete(
          `${BASE_URL}/restaurant/removeTable/${TableID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
  
        return TableID;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    tables: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling pending state for fetching tables
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for fetching tables
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false; // Fetch operation is complete
        state.tables = action.payload; // Update state with fetched data
      })
      // Handling rejected state for fetching tables
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false; // Fetch operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for adding a table
      .addCase(addTable.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for adding a table
      .addCase(addTable.fulfilled, (state, action) => {
        state.loading = false; // Add operation is complete
        state.tables.push(action.payload); // Add the new table to the state
      })
      // Handling rejected state for adding a table
      .addCase(addTable.rejected, (state, action) => {
        state.loading = false; // Add operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for removing a table
      .addCase(removeTable.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for removing a table
      .addCase(removeTable.fulfilled, (state, action) => {
        state.loading = false; // Remove operation is complete
        state.tables = state.tables.filter(table => table.TableID !== action.payload); // Remove the table from the state
      })
      // Handling rejected state for removing a table
      .addCase(removeTable.rejected, (state, action) => {
        state.loading = false; // Remove operation is complete
        state.error = action.payload; // Update state with the error
      });
  },
});

export default tableSlice.reducer;
