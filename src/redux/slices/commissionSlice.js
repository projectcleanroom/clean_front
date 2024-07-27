import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import serverUrl from '../config/serverUrl';

// commission 추가
export const __addcommission = createAsyncThunk(
  '__addcommission',
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${serverUrl}/commissions`, payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// commission 목록 가져오기 thunk
export const __fetchcommission = createAsyncThunk(
  '__fetchcommission',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${serverUrl}/commissions`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// commission 삭제 thunk
export const __deletecommission = createAsyncThunk(
  '__deletecommission',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${serverUrl}/commissions/${id}`);
      if (response.status === 200) {
        return id;
      } else {
        return thunkAPI.rejectWithValue('Delete operation failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const __updatecommission = createAsyncThunk(
  '__updatecommission',
  async (commission, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${serverUrl}/commissions/${commission.id}`,
        commission,
      );
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue('Update operation failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  commissions: [],
  users: [],
  isLoading: false,
  error: null,
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 개별 액션 처리
    builder
      .addCase(__fetchcommission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions = action.payload;
      })
      .addCase(__addcommission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions.push(action.payload);
      })
      .addCase(__deletecommission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions = state.commissions.filter(
          (commission) => commission.id !== action.payload,
        );
      })
      .addCase(__updatecommission.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.commissions.findIndex(
          (commission) => commission.id === action.payload.id,
        );
        if (index !== -1) {
          state.commissions[index] = action.payload;
        }
      })
      // pending, rejected 공통 패턴 처리
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || '오류가 발생하였습니다.';
        },
      );
  },
});

export default commissionSlice.reducer;
