import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import serverUrl from '../config/serverUrl';

// Commission 인터페이스 정의
interface Commission {
  commissionId: number;
  memberNick: string;
  size: number;
  houseType: 'A' | 'B' | 'C' | 'D'; // 실제 enum 값에 따라 수정
  cleanType: '일반' | '특수'; // 실제 enum 값에 따라 수정
  address: string;
  desiredDate: string;
  significant: string;
}

// Commission 생성/수정 요청 인터페이스
interface CommissionRequest {
  membersId?: number;
  image: string;
  size: number;
  houseType: 'A' | 'B' | 'C' | 'D';
  cleanType: '일반' | '특수';
  addressId: number;
  desiredDate: string;
  significant: string;
}

// 상태 인터페이스 정의
interface CommissionState {
  commissions: Commission[];
  isLoading: boolean;
  error: string | null;
}

// commission 추가
export const __addCommission = createAsyncThunk<
  Commission[],
  CommissionRequest
>('__addCommission', async (payload, thunkAPI) => {
  try {
    const response = await axios.post<Commission[]>(
      `${serverUrl}/commissions`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// commission 목록 가져오기 thunk
export const __fetchCommissions = createAsyncThunk<Commission[]>(
  '__fetchCommissions',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Commission[]>(
        `${serverUrl}/commissions`,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// commission 수정 thunk
export const __updateCommission = createAsyncThunk<
  Commission[],
  CommissionRequest & { commissionId: number }
>('__updateCommission', async (commission, thunkAPI) => {
  try {
    const response = await axios.patch<Commission[]>(
      `${serverUrl}/commissions/${commission.commissionId}`,
      commission,
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// commission 삭제(취소) thunk
export const __deleteCommission = createAsyncThunk<{ message: string }, number>(
  '__deleteCommission',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete<{ message: string }>(
        `${serverUrl}/commissions/${id}`,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState: CommissionState = {
  commissions: [],
  isLoading: false,
  error: null,
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        __fetchCommissions.fulfilled,
        (state, action: PayloadAction<Commission[]>) => {
          state.isLoading = false;
          state.commissions = action.payload;
        },
      )
      .addCase(
        __addCommission.fulfilled,
        (state, action: PayloadAction<Commission[]>) => {
          state.isLoading = false;
          state.commissions = action.payload;
        },
      )
      .addCase(
        __updateCommission.fulfilled,
        (state, action: PayloadAction<Commission[]>) => {
          state.isLoading = false;
          state.commissions = action.payload;
        },
      )
      .addCase(
        __deleteCommission.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.isLoading = false;
          // 여기서는 삭제된 commission을 state에서 제거하는 로직이 필요할 수 있습니다.
          // 예: state.commissions = state.commissions.filter(commission => commission.commissionId !== deletedId);
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
        (state, action) => {
          state.isLoading = false;
          state.error = (action.payload as string) || '오류가 발생하였습니다.';
        },
      );
  },
});

export default commissionSlice.reducer;
