import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import serverUrl from '../config/serverUrl';

// 액션 타입 상수
export const USER_ACTION_TYPES = {
  FETCH_USERS: 'users/fetchUsers',
  FETCH_CURRENT_USER: 'users/fetchCurrentUser',
  UPDATE_USER: 'users/updateUser',
  DELETE_USER: 'users/deleteUser',
};

// 전체 사용자 목록 가져오기
export const fetchUsers = createAsyncThunk(
  'USER_ACTION_TYPES/FETCH_USERS',
  async (authAxios, thunkAPI) => {
    try {
      const response = await authAxios.get(`${serverUrl}/users`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        //토큰 갱신 로직 호출 ( AuthContext에서 제공하는 함수)
        await thunkAPI.dispatch(refreshToken());
        //토큰 갱신 후 재시도
        const retryResponse = await authAxios.get(`${serverUrl}/users`);
        return retryResponse.data;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 현재 로그인한 사용자 정보 가져오기
export const fetchCurrentUser = createAsyncThunk(
  'USER_ACTION_TYPES/FETCH_CURRENT_USER',
  async (authAxios, thunkAPI) => {
    try {
      const response = await authAxios.get(`${serverUrl}/users/me`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await thunkAPI.dispatch(refreshToken());
        const retryResponse = await authAxios.get(` ${serverUrl}/users/me`);
        return retryResponse.data;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 사용자 정보 수정 (PATCH 사용)
export const updateUser = createAsyncThunk(
  USER_ACTION_TYPES.UPDATE_USER,
  async ({ email, nick, phone_number, authAxios }, { rejectWithValue }) => {
    try {
      const response = await authAxios.patch(`${serverUrl}/users/${email}`, {
        nick,
        phone_number,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // 토큰 갱신 로직 (AuthContext에서 제공하는 함수 사용)
        await dispatch(refreshToken());
        // 토큰 갱신 후 재시도
        const retryResponse = await authAxios.patch(
          `${serverUrl}/users/${email}`,
          {
            nick,
            phone_number,
          },
        );
        return retryResponse.data;
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 사용자 삭제 (회원 탈퇴)
export const deleteUser = createAsyncThunk(
  USER_ACTION_TYPES.DELETE_USER,
  async ({ email, authAxios }, { rejectWithValue }) => {
    try {
      await authAxios.delete(`${serverUrl}/users/${email}`);
      return email;
    } catch (error) {
      if (error.response?.status === 401) {
        await dispatch(refreshToken());
        await authAxios.delete(`${serverUrl}/users/${email}`);
        return email;
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 초기 상태
const initialState = {
  users: {}, // 사용자 정보를 이메일을 키로 하는 객체로 저장
  currentUserEmail: null, // 현재 로그인한 사용자의 이메일
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUserEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.reduce((acc, user) => {
          acc[user.email] = user;
          return acc;
        }, {});
        state.isLoading = false;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.users[action.payload.email] = action.payload;
        state.currentUserEmail = action.payload.email;
        state.isLoading = false;
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users[action.payload.email] = action.payload;
        state.isLoading = false;
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        delete state.users[action.payload];
        if (state.currentUserEmail === action.payload) {
          state.currentUserEmail = null;
        }
        state.isLoading = false;
      })
      // 모든 pending 액션 처리
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      // 모든 rejected 액션 처리
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export default usersSlice.reducer;

// 선택자 함수들
export const selectAllUsers = (state) => Object.values(state.users.users);
export const selectCurrentUser = (state) =>
  state.users.users[state.users.currentUserEmail];
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;
export const { clearCurrentUser } = usersSlice.actions;
