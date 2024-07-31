import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import serverUrl from '../config/serverUrl';

// Member 인터페이스 정의
interface Member {
  email: string;
  nick: string;
  phoneNumber: string;
}

// 상태 인터페이스 정의
interface MemberState {
  members: Record<string, Member>;
  currentMemberEmail: string | null;
  isLoading: boolean;
  error: string | null;
}

// 액션 타입 상수
export const MEMBER_ACTION_TYPES = {
  FETCH_MEMBERS: 'members/fetchMembers',
  FETCH_CURRENT_MEMBER: 'members/fetchCurrentMember',
  UPDATE_MEMBER: 'members/updateMember',
  DELETE_MEMBER: 'members/deleteMember',
} as const;

// createAsyncThunk의 타입 정의
type AsyncThunkConfig = {
  rejectValue: string;
};

// 전체 사용자 목록 가져오기
export const fetchMembers = createAsyncThunk<
  Member[],
  AxiosInstance,
  AsyncThunkConfig
>('MEMBER_ACTION_TYPES/FETCH_MEMBERS', async (authAxios, thunkAPI) => {
  try {
    const response = await authAxios.get<Member[]>(`${serverUrl}/members`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      //토큰 갱신 로직 호출 ( AuthContext에서 제공하는 함수)
      await thunkAPI.dispatch(refreshToken());
      //토큰 갱신 후 재시도
      const retryResponse = await authAxios.get<Member[]>(`${serverUrl}/members`);
      return retryResponse.data;
    }
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 현재 로그인한 사용자 정보 가져오기
export const fetchCurrentMember = createAsyncThunk<
  Member,
  AxiosInstance,
  AsyncThunkConfig
>('MEMBER_ACTION_TYPES/FETCH_CURRENT_MEMBER', async (authAxios, thunkAPI) => {
  try {
    const response = await authAxios.get<Member>(`${serverUrl}/Members/me`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await thunkAPI.dispatch(refreshToken());
      const retryResponse = await authAxios.get<Member>(`${serverUrl}/Members/me`);
      return retryResponse.data;
    }
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 사용자 정보 수정 (PATCH 사용)
interface UpdateMemberPayload {
  email: string;
  nick: string;
  phoneNumber: string;
  authAxios: AxiosInstance;
}

export const updateMember = createAsyncThunk<
  Member,
  UpdateMemberPayload,
  AsyncThunkConfig
>(
  MEMBER_ACTION_TYPES.UPDATE_MEMBER,
  async ({ email, nick, phoneNumber, authAxios }, thunkAPI) => {
    try {
      const response = await authAxios.patch<Member>(
        `${serverUrl}/members/${email}`,
        {
          nick,
          phoneNumber,
        },
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        await thunkAPI.dispatch(refreshToken());
        const retryResponse = await authAxios.patch<Member>(
          `${serverUrl}/members/${email}`,
          {
            nick,
            phoneNumber,
          },
        );
        return retryResponse.data;
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 사용자 삭제 (회원 탈퇴)

interface DeleteMemberPayload {
  email: string;
  authAxios: AxiosInstance;
}

export const deleteMember = createAsyncThunk<
  string,
  DeleteMemberPayload,
  AsyncThunkConfig
>(MEMBER_ACTION_TYPES.DELETE_MEMBER, async ({ email, authAxios }, thunkAPI) => {
  try {
    await authAxios.delete(`${serverUrl}/members/${email}`);
    return email;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await thunkAPI.dispatch(refreshToken());
      await authAxios.delete(`${serverUrl}/members/${email}`);
      return email;
    }
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// 초기 상태
const initialState: MemberState = {
  members: {},
  currentMemberEmail: null,
  isLoading: false,
  error: null,
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    clearCurrentMember: (state) => {
      state.currentMemberEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMembers
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<Member[]>) => {
        state.members = action.payload.reduce<Record<string, Member>>(
          (acc, member) => {
            acc[member.email] = member;
            return acc;
          },
          {},
        );
        state.isLoading = false;
      })
      // fetchCurrentMember
      .addCase(
        fetchCurrentMember.fulfilled,
        (state, action: PayloadAction<Member>) => {
          state.members[action.payload.email] = action.payload;
          state.currentMemberEmail = action.payload.email;
          state.isLoading = false;
        },
      )
      // updateMember
      .addCase(updateMember.fulfilled, (state, action: PayloadAction<Member>) => {
        state.members[action.payload.email] = action.payload;
        state.isLoading = false;
      })
      // deleteMember
      .addCase(deleteMember.fulfilled, (state, action: PayloadAction<string>) => {
        delete state.members[action.payload];
        if (state.currentMemberEmail === action.payload) {
          state.currentMemberEmail = null;
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
        (action): action is RejectedAction<string> =>
          action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const { clearCurrentMember } = membersSlice.actions;

export default membersSlice.reducer;

// 선택자 함수들
export const selectAllMembers = (state: { members: MemberState }) =>
  Object.values(state.members.members);
export const selectCurrentMember = (state: { members: MemberState }) =>
  state.members.currentMemberEmail
    ? state.members.members[state.members.currentMemberEmail]
    : null;
export const selectMembersLoading = (state: { members: MemberState }) =>
  state.members.isLoading;
export const selectMembersError = (state: { members: MemberState }) =>
  state.members.error;
