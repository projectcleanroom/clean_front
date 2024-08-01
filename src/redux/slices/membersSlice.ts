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

const handleApiRequest = async <T>(
  apiCall: () => Promise<T>,
  authAxios: AxiosInstance,
  thunkAPI: any,
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.response?.status === 401) {
      // 토큰 갱신 로직은 AuthContext에서 자동으로 처리되도록 수정
      const retryResponse = await apiCall();
      return retryResponse;
    }
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
};

// 전체 사용자 목록 가져오기
export const fetchMembers = createAsyncThunk<
  Member[],
  AxiosInstance,
  AsyncThunkConfig
>('MEMBER_ACTION_TYPES/FETCH_MEMBERS', async (authAxios, thunkAPI) => {
  return handleApiRequest(
    () =>
      authAxios
        .get<Member[]>(`${serverUrl}/members`)
        .then((response) => response.data),
    authAxios,
    thunkAPI,
  );
});

// 현재 로그인한 사용자 정보 가져오기
export const fetchCurrentMember = createAsyncThunk<
  Member,
  AxiosInstance,
  AsyncThunkConfig
>('MEMBER_ACTION_TYPES/FETCH_CURRENT_MEMBER', async (authAxios, thunkAPI) => {
  return handleApiRequest(
    () =>
      authAxios
        .get<Member>(`${serverUrl}/members/me`)
        .then((response) => response.data),
    authAxios,
    thunkAPI,
  );
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
    return handleApiRequest(
      () =>
        authAxios
          .patch<Member>(`${serverUrl}/members/${email}`, { nick, phoneNumber })
          .then((response) => response.data),
      authAxios,
      thunkAPI,
    );
  },
);

interface DeleteMemberPayload {
  email: string;
  authAxios: AxiosInstance;
}

export const deleteMember = createAsyncThunk<
  string,
  DeleteMemberPayload,
  AsyncThunkConfig
>(MEMBER_ACTION_TYPES.DELETE_MEMBER, async ({ email, authAxios }, thunkAPI) => {
  return handleApiRequest(
    async () => {
      await authAxios.delete(`${serverUrl}/members/${email}`);
      return email;
    },
    authAxios,
    thunkAPI,
  );
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
      .addCase(
        fetchMembers.fulfilled,
        (state, action: PayloadAction<Member[]>) => {
          state.members = action.payload.reduce<Record<string, Member>>(
            (acc, member) => {
              acc[member.email] = member;
              return acc;
            },
            {},
          );
          state.isLoading = false;
        },
      )
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
      .addCase(
        updateMember.fulfilled,
        (state, action: PayloadAction<Member>) => {
          state.members[action.payload.email] = action.payload;
          state.isLoading = false;
        },
      )
      // deleteMember
      .addCase(
        deleteMember.fulfilled,
        (state, action: PayloadAction<string>) => {
          delete state.members[action.payload];
          if (state.currentMemberEmail === action.payload) {
            state.currentMemberEmail = null;
          }
          state.isLoading = false;
        },
      )
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
        (action) => action.type.endsWith(`/rejected`),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
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
