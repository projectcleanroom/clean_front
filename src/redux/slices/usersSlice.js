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
    async ({ email, nickName, phoneNumber }) => {
        const response = await axios.patch(`${serverUrl}/users/${email}`, {
            nickName,
            phoneNumber
        });
        return response.data;
    }
);

// 사용자 삭제 (회원 탈퇴)
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (email, thunkAPI) => {
        try {
            await axios.delete(`${serverUrl}/users/${email}`);
            return email;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
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
        // 필요한 경우 여기에 동기 액션을 추가할 수 있습니다.
    },
    extraReducers: (builder) => {
        builder
            // 전체 사용자 목록 가져오기
            .addMatcher(
                (action) => action.type.startsWith('users/fetchUsers') && action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('users/fetchUsers') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.isLoading = false;
                    state.users = action.payload;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('users/fetchUsers') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                }
            )
            // 현재 사용자 정보 가져오기
            .addMatcher(
                (action) => action.type.startsWith('users/fetchCurrentUser') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.currentUser = action.payload;
                }
            )
            // 사용자 정보 수정
            .addMatcher(
                (action) => action.type.startsWith('users/updateUser') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.currentUser = action.payload;
                    // 전체 목록에서도 해당 사용자 정보 업데이트
                    const index = state.users.findIndex(user => user.email === action.payload.email);
                    if (index !== -1) {
                        state.users[index] = action.payload;
                    }
                }
            )
            // 사용자 삭제 (회원 탈퇴)
            .addMatcher(
                (action) => action.type.startsWith('users/deleteUser') && action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('users/deleteUser') && action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.isLoading = false;
                    // 전체 사용자 목록에서 삭제된 사용자 제거
                    state.users = state.users.filter(user => user.email !== action.payload);
                    // 삭제된 사용자가 현재 로그인한 사용자였다면 currentUser를 null로 설정
                    if (state.currentUser && state.currentUser.email === action.payload) {
                        state.currentUser = null;
                    }
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('users/deleteUser') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload || '사용자 삭제 중 오류가 발생했습니다.';
                }
            )
            // 공통 에러 처리
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload || '오류가 발생하였습니다.';
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
