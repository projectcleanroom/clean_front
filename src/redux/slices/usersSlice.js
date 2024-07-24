import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import serverUrl from '../config/serverUrl';

// Comission 추가
export const __signUp = createAsyncThunk(
    '__signUp',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.post(`${serverUrl}/users`, payload);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// Users 삭제 thunk
export const __deleteUser = createAsyncThunk(
    '__deleteUser',
    async (email, thunkAPI) => {
        try {
            await axios.delete(`${serverUrl}/Users/${email}`);
            return email;
        } catch (error) {
            console.error('Delete error:', error);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// Users 목록 가져오기 thunk
export const __fetchUsers = createAsyncThunk(
    '__fetchUsers',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${serverUrl}/Users`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const __updateUsers = createAsyncThunk(
    '__updateUsers',
    async (users, thunkAPI) => {
        try {
            const response = await axios.patch(
                `${serverUrl}/Users/${users.email}`,
                users
            );
            return response.data;
        } catch (error) {
            console.error('Update error:', error);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const initialState = {
    comissions: [],
    users: [],
    isLoading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 개별 액션 처리
        builder
            .addCase(__fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(__signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users.push(action.payload);
            })
            .addCase(__deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = state.users.filter(
                    (user) => user.email !== action.payload
                );
            })
            .addCase(__updateUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(
                    (user) => user.email === action.payload.email
                );
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // pending, rejected 공통 패턴 처리
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
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
