import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import serverUrl from '../config/serverUrl';

// 전체 사용자 목록 가져오기
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/users`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 현재 로그인한 사용자 정보 가져오기
export const fetchCurrentUser = createAsyncThunk(
    'users/fetchCurrentUser',
    async (email, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/users?email=${email}`);
            if (response.data.length === 0) {
                throw new Error('User not found');
            }
            return response.data[0];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 사용자 정보 수정 (PATCH 사용)
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, nickName, phoneNumber }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${serverUrl}/users/${id}`, {
                nickName,
                phoneNumber
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 사용자 삭제 (회원 탈퇴)
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${serverUrl}/users/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// 초기 상태
const initialState = {
    users: [],           // 전체 사용자 목록
    currentUser: null,   // 현재 로그인한 사용자
    isLoading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearCurrentUser: (state) => {
            state.currentUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchUsers
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.currentUser = null;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.isLoading = false;
      })
      // 모든 pending 액션 처리
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      // 모든 rejected 액션 처리
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export default usersSlice.reducer;

// 선택자 함수들
export const selectAllUsers = (state) => state.users.users;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;
export const { clearCurrentUser } = usersSlice.actions;