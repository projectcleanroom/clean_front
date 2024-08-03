import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { AxiosResponse, AxiosInstance } from 'axios';
import { RootState } from '../config/configStore';

// Commission 인터페이스 정의
interface Commission {
  commissionId: number;
  memberNick: string;
  size: number;
  houseType: 'O' | 'A' | 'H' | 'T';
  cleanType: '일반' | '특수';
  addressId: number;
  image: string;
  desiredDate: string;
  significant: string;
}

// 상태 인터페이스 정의
interface CommissionState {
  commissions: Record<number, Commission>;
  currentCommissionId: number | null;
  isLoading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: CommissionState = {
  commissions: {},
  currentCommissionId: null,
  isLoading: false,
  error: null,
};

// 에러 처리 함수
const handleError = (error: any) => {
  if (error.response?.status === 401) {
    // 401 에러(토큰 갱신)
    console.error('Authentication error', error);
    return (
      error.response?.data?.message ||
      error.message ||
      'An unknown error occured'
    );
  }
};

// Thunk 생성 함수
const createCommissionThunk = <ReturnType, ArgType = void>(
  typePrefix: string,
  apiCall: (
    arg: ArgType,
    authAxios: AxiosInstance,
  ) => Promise<AxiosResponse<ReturnType>>,
) => {
  return createAsyncThunk<
    ReturnType,
    { arg: ArgType; authAxios: AxiosInstance },
    { rejectValue: string }
  >(typePrefix, async ({ arg, authAxios }, thunkAPI) => {
    try {
      const response = await apiCall(arg, authAxios);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(handleError(error));
    }
  });
};

// 액션 생성자들 수정
export const fetchCommissions = createAsyncThunk<
  Commission[],
  void,
  {
    rejectValue: string;
    extra: { authAxios: AxiosInstance };
  }
>(
  'commissions/fetchCommissions',
  async (_, { extra: { authAxios }, rejectWithValue }) => {
    try {
      const response = await authAxios.get<Commission[]>(
        `/commissions`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const fetchCommission = createCommissionThunk<Commission, number>(
  'commissions/fetchCommission',
  (id, authAxios) =>
    authAxios.get<Commission>(`/commission/${id}`),
);

export const createCommission = createAsyncThunk<
  Commission,
  { arg: Omit<Commission, 'commissionId' | 'memberNick'>, authAxios: AxiosInstance },
  { rejectValue: string }
>(
  'commissions/createCommission',
  async ({ arg, authAxios }, { rejectWithValue }) => {
    try {
      console.log('Sending request to:', `/commission`);
      const response = await authAxios.post<Commission>(`/api/commission`, arg);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const updateCommission = createCommissionThunk<
  Commission,
  { id: number; commission: Partial<Commission> }
>('commissions/updateCommission', ({ id, commission }, authAxios) =>
  authAxios.patch<Commission>(`/commissions/${id}`, commission),
);

export const deleteCommission = createAsyncThunk<
  number,
  number,
  {
    rejectValue: string;
    extra: { authAxios: AxiosInstance };
  }
>(
  'commissions/deleteCommission',
  async (id, { extra: { authAxios }, rejectWithValue }) => {
    try {
      await authAxios.delete(`/commissions/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(handleError(error));
    }
  },
);

const commissionsSlice = createSlice({
  name: 'commissions',
  initialState,
  reducers: {
    clearCurrentCommission: (state) => {
      state.currentCommissionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCommissions.fulfilled,
        (state, action: PayloadAction<Commission[]>) => {
          state.commissions = action.payload.reduce<Record<number, Commission>>(
            (acc, commission) => {
              acc[commission.commissionId] = commission;
              return acc;
            },
            {},
          );
          state.isLoading = false;
        },
      )
      .addCase(
        fetchCommission.fulfilled,
        (state, action: PayloadAction<Commission>) => {
          state.commissions[action.payload.commissionId] = action.payload;
          state.currentCommissionId = action.payload.commissionId;
          state.isLoading = false;
        },
      )
      .addCase(
        createCommission.fulfilled,
        (state, action: PayloadAction<Commission>) => {
          state.commissions[action.payload.commissionId] = action.payload;
          state.currentCommissionId = action.payload.commissionId;
          state.isLoading = false;
        },
      )
      .addCase(
        updateCommission.fulfilled,
        (state, action: PayloadAction<Commission>) => {
          state.commissions[action.payload.commissionId] = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(
        deleteCommission.fulfilled,
        (state, action: PayloadAction<number>) => {
          delete state.commissions[action.payload];
          if (state.currentCommissionId === action.payload) {
            state.currentCommissionId = null;
          }
          state.isLoading = false;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearCurrentCommission } = commissionsSlice.actions;
export default commissionsSlice.reducer;

// 선택자 함수들
export const selectCommissionState = (state: RootState) => state.commission;

export const selectAllCommissions = createSelector(
  selectCommissionState,
  (commissionState) => Object.values(commissionState.commissions),
);
export const selectCurrentCommission = (state: RootState) =>
  state.commission.currentCommissionId
    ? state.commission.commissions[state.commission.currentCommissionId]
    : null;
export const selectCommissionsLoading = (state: RootState) =>
  state.commission.isLoading;
export const selectCommissionsError = (state: RootState) =>
  state.commission.error;
