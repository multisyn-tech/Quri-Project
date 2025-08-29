import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addPerson = createAsyncThunk(
    'BillSplit/addPerson',
    async (personData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/people/add`, personData);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPeopleByTableID = createAsyncThunk(
    'BillSplit/fetchPeopleByTableID',
    async (TableID, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/people/${TableID}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }
);

export const deletePeopleByID=createAsyncThunk(
    'BillSplit/deletePeopleByID',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}/people/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message);
        }
    }

);

const billSlice = createSlice({
    name: 'BillSplit',
    initialState: {
        bill: [],
        people: [],
        peopleNames: [''],
        pendingIncrements: 0,
        pendingDecrements: 0,
        loading: false,
        error: null,
    },
    reducers: {
        incrementPerson(state) {
            state.pendingIncrements += 1;
            state.peopleNames.push('');  // Add an empty name field
        },
        decrementPerson(state) {
            if (state.peopleNames.length > 1) {
                state.pendingDecrements += 1;
                state.peopleNames.pop();  // Remove the last name field
            }
        },
        updatePersonName(state, action) {
            const { index, name } = action.payload;
            state.peopleNames[index] = name;
        },
        setPeopleNames(state, action) {
            state.peopleNames = action.payload.length > 0 ? action.payload : [''];
            state.pendingIncrements = 0;
            state.pendingDecrements = 0;
        },
        clearPeopleNames(state) {
            state.peopleNames = [''];
            state.pendingIncrements = 0;
            state.pendingDecrements = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPerson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPerson.fulfilled, (state, action) => {
                state.loading = false;
                state.bill.push(action.payload);
                state.error = null;
            })
            .addCase(addPerson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add person';
            })
            .addCase(fetchPeopleByTableID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPeopleByTableID.fulfilled, (state, action) => {
                state.loading = false;
                state.people = action.payload.data;
                state.peopleNames = action.payload.data.length > 0 ? action.payload.data.map(person => person.Name) : [''];
                state.error = null;
            })
            .addCase(fetchPeopleByTableID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch people';
                state.peopleNames = [''];
            })
            .addCase(deletePeopleByID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePeopleByID.fulfilled, (state, action) => {
                state.loading = false;
                
                // Ensure the correct property name is used
                const deletedPersonId = action.payload.id || action.payload.Id;
                
                state.people = state.people.filter(person => person.Id !== deletedPersonId);
                state.peopleNames = state.people.map(person => person.Name);
                state.error = null;
            })
            
            .addCase(deletePeopleByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete person';
            });
    },
});

export const {
    incrementPerson,
    decrementPerson,
    updatePersonName,
    setPeopleNames,
    clearPeopleNames,
} = billSlice.actions;

export default billSlice.reducer;
