import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk to save activity in DB
export const addStage = createAsyncThunk(
  "activity/addStage",
  async (stage, { getState, rejectWithValue }) => {
    const { userId } = getState().activity;
    if (!userId) return rejectWithValue("User ID not set");

    try {
      await axios.post(`${BASE_URL}/customers/activity`, { userId, stage });
      return stage; // return for reducer to store locally
    } catch (err) {
      console.error("Error saving stage:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    userId: null,
    stages: [],
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload;
      state.stages = [];
    },
    resetActivity: (state) => {
      state.userId = null;
      state.stages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStage.fulfilled, (state, action) => {
        state.loading = false;
        const stage = action.payload;
        // Avoid duplicate if same as last stage
        if (state.stages[state.stages.length - 1] !== stage) {
          state.stages.push(stage);
        }
      })
      .addCase(addStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save stage";
      });
  }
});

export const { setUser, resetActivity } = activitySlice.actions;
export default activitySlice.reducer;
