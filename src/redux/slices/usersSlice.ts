import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import serverUrl from '../config/serverUrl';

// User 인터페이스 정의
interface User {
  email: string;
  nick: string
  phone_number: string
}


// 상태 인터페이스 정의
interface UserState {
  users: Record<string, User>;
  currentUserEmail: string | null
  isLoading: boolean
  error: string | null
}

// 액션 타입 상수
export const USER_ACTION_TYPES = {
  FETCH_USERS: 'users/fetchUsers',
  FETCH_CURRENT_USER: 'users/fetchCurrentUser',
  UPDATE_USER: 'users/updateUser',
  DELETE_USER: 'users/deleteUser',
} as const;

// createAsyncThunk의 타입 정의
type AsyncThunkConfig ={
  rejectValue: string
}

// 전체 사용자 목록 가져오기
export const fetchUsers = createAsyncThunk<User[], AxiosInstance, AsyncThunkConfig>(
  'USER_ACTION_TYPES/FETCH_USERS',
  async (authAxios, thunkAPI) => {
    try {
      const response = await authAxios.get<User[]>(`${serverUrl}/users`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        //토큰 갱신 로직 호출 ( AuthContext에서 제공하는 함수)
        await thunkAPI.dispatch(refreshToken());
        //토큰 갱신 후 재시도
        const retryResponse = await authAxios.get<User[]>(`${serverUrl}/users`);
        return retryResponse.data;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 현재 로그인한 사용자 정보 가져오기
export const fetchCurrentUser = createAsyncThunk<User, AxiosInstance, AsyncThunkConfig>(
  'USER_ACTION_TYPES/FETCH_CURRENT_USER',
  async (authAxios, thunkAPI) => {
    try {
      const response = await authAxios.get<User>(`${serverUrl}/users/me`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        await thunkAPI.dispatch(refreshToken());
        const retryResponse = await authAxios.get<User>(`${serverUrl}/users/me`);
        return retryResponse.data;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 사용자 정보 수정 (PATCH 사용)
interface UpdateUserPayload {
  email: string
  nick: string
  phone_number: string
  authAxios: AxiosInstance
}

export const updateUser = createAsyncThunk<User, UpdateUserPayload, AsyncThunkConfig>(
  USER_ACTION_TYPES.UPDATE_USER,
  async ({ email, nick, phone_number, authAxios }, thunkAPI) => {
    try {
      const response = await authAxios.patch<User>(`${serverUrl}/users/${email}`, {
        nick,
        phone_number,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        await thunkAPI.dispatch(refreshToken());
        const retryResponse = await authAxios.patch<User>(
          `${serverUrl}/users/${email}`,
          {
            nick,
            phone_number,
          },
        );
        return retryResponse.data;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 사용자 삭제 (회원 탈퇴)

interface DeleteUserPayload {
  email: string
  authAxios: AxiosInstance
}

export const deleteUser = createAsyncThunk<string, DeleteUserPayload, AsyncThunkConfig>(
  USER_ACTION_TYPES.DELETE_USER,
  async ({ email, authAxios }, thunkAPI) => {
    try {
      await authAxios.delete(`${serverUrl}/users/${email}`);
      return email;
    } catch (error: any) {
      if (error.response?.status === 401) {
        await thunkAPI.dispatch(refreshToken());
        await authAxios.delete(`${serverUrl}/users/${email}`);
        return email;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 초기 상태
const initialState: UserState = {
  users: {},
  currentUserEmail: null,
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
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload.reduce<Record<string, User>>((acc, user) => {
          acc[user.email] = user;
          return acc;
        }, {});
        state.isLoading = false;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users[action.payload.email] = action.payload;
        state.currentUserEmail = action.payload.email;
        state.isLoading = false;
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users[action.payload.email] = action.payload;
        state.isLoading = false;
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
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
        (action): action is RejectedAction<string> => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const { clearCurrentUser } = usersSlice.actions;

export default usersSlice.reducer;

// 선택자 함수들
export const selectAllUsers = (state: { users: UserState }) => Object.values(state.users.users);
export const selectCurrentUser = (state: { users: UserState }) =>
  state.users.currentUserEmail ? state.users.users[state.users.currentUserEmail] : null;
export const selectUsersLoading = (state: { users: UserState }) => state.users.isLoading;
export const selectUsersError = (state: { users: UserState }) => state.users.error;
