// src/redux/slices/comissionSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import serverUrl from "../config/serverUrl";

// Comission 추가
export const __addComission = createAsyncThunk(
  "__addComission",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${serverUrl}`, payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Comission 삭제 thunk
export const __deleteComission = createAsyncThunk(
  "__deleteComission",
  async (comissionId, thunkAPI) => {
    try {
      await axios.delete(`${serverUrl}/${comissionId}`);
      return comissionId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Comission 목록 가져오기 thunk
export const __fetchComission = createAsyncThunk(
  "__fetchComission",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${serverUrl}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const __updateComission = createAsyncThunk(
  "__updateComission",
  async (comission, thunkAPI) => {
    try {
      const response = await axios.patch(`${serverUrl}/${comission.id}`, comission);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  comissions: [],
  isLoading: false,
  error: null,
};

const comissionSlice = createSlice({
  name: "comission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 개별 액션 처리
    builder
      .addCase(__fetchComission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comissions = action.payload;
      })
      .addCase(__addComission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comissions.push(action.payload);
      })
      .addCase(__deleteComission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comissions = state.comissions.filter(
          (comission) => comission.id !== action.payload
        );
      })
      .addCase(__updateComission.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.comissions.findIndex((comission) => comission.id === action.payload.id);
        if (index !== -1) {
          state.comissions[index] = action.payload;
        }
      })
      // pending, rejected 공통 패턴 처리
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || "오류가 발생하였습니다.";
        }
      );
  },
});

export default comissionSlice.reducer;
