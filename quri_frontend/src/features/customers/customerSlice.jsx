import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/customers`, {
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

// Thunk for fetching a customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (customerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_URL}/customers/${customerId}`, {
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

// Thunk for adding a customer
export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        `${BASE_URL}/customers`,
        customerData,
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

// Thunk for editing a customer
export const editCustomer = createAsyncThunk(
  'customers/editCustomer',
  async ({ customerId, customerData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(
        `${BASE_URL}/customers/${customerId}`,
        customerData,
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

// Thunk for deleting a customer
export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`${BASE_URL}/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return customerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling pending state for adding a customer
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for adding a customer
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false; // Add operation is complete
        state.customers.push(action.payload); // Add the new customer to the state
      })
      // Handling rejected state for adding a customer
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false; // Add operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for fetching customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for fetching customers
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false; // Fetch operation is complete
        state.customers = action.payload; // Update state with fetched data
      })
      // Handling rejected state for fetching customers
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false; // Fetch operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for fetching a customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for fetching a customer by ID
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false; // Fetch operation is complete
        const index = state.customers.findIndex((customer) => customer.CustomerID === action.payload.CustomerID);
        if (index !== -1) {
          state.customers[index] = action.payload; // Update the specific customer in the state
        } else {
          state.customers.push(action.payload); // Add the customer if not found
        }
      })
      // Handling rejected state for fetching a customer by ID
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false; // Fetch operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for editing a customer
      .addCase(editCustomer.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for editing a customer
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.loading = false; // Edit operation is complete
        const index = state.customers.findIndex((customer) => customer.CustomerID === action.payload.CustomerID);
        if (index !== -1) {
          state.customers[index] = action.payload; // Update the customer in the state
        }
      })
      // Handling rejected state for editing a customer
      .addCase(editCustomer.rejected, (state, action) => {
        state.loading = false; // Edit operation is complete
        state.error = action.payload; // Update state with the error
      })
      // Handling pending state for deleting a customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset any previous errors
      })
      // Handling fulfilled state for deleting a customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false; // Delete operation is complete
        state.customers = state.customers.filter(
          (customer) => customer.CustomerID !== action.payload
        ); // Remove the deleted customer from the state
      })
      // Handling rejected state for deleting a customer
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false; // Delete operation is complete
        state.error = action.payload; // Update state with the error
      });
  },
});

export default customerSlice.reducer;
