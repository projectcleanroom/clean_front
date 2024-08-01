import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import serverUrl from '../config/serverUrl';

interface Commission {
  commissionId: number;
  memberNick: string;
  size: number;
  houseType: '원룸' | '빌라' | '아파트' | '주택' | '오피스텔' | '주상복합' | '전원주택' | '기타(직접 입력)';
  cleanType: '일반' | '특수' | '창문';
  address: string;
  desiredDate: string;
  significant: string;
}

interface CommissionRequest {
  membersId?: number;
  image: string;
  size: number;
  houseType: Commission['houseType'];
  cleanType: '일반' | '특수';
  addressId: number;
  desiredDate: string;
  significant: string;
}

interface CommissionState {
  commissions: Commission[];
  isLoading: boolean;
  error: string | null;
}

// commission 추가
export const __addCommission = createAsyncThunk<Commission[], CommissionRequest>(
  '__addCommission',
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post<Commission[]>(`${serverUrl}/commissions`, payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// commission 목록 가져오기 thunk
export const __fetchCommissions = createAsyncThunk<Commission[]>(
  '__fetchCommissions',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Commission[]>(`${serverUrl}/commissions`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

// commission 삭제 thunk
export const __deleteCommission = createAsyncThunk<number, number>(
  '__deleteCommission',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete<{message: string}>(`${serverUrl}/commissions/${id}`);
      if (response.status === 200) {
        return id;
      } else {
        return thunkAPI.rejectWithValue('Delete operation failed');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const __updateCommission = createAsyncThunk<Commission, CommissionRequest & {commissionId: number}>(
  '__updateCommission',
  async (commission, thunkAPI) => {
    try {
      const response = await axios.patch<Commission>(
        `${serverUrl}/commissions/${commission.commissionId}`,
        commission,
      );
      if (response.status === 200) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue('Update operation failed');
      }
    } catch (error: any) {
      console.error('Update error:', error);
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
      .addCase(__fetchCommissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions = action.payload;
      })
      .addCase(__addCommission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commissions = action.payload;
      })
      .addCase(__deleteCommission.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.commissions = state.commissions.filter(
          (commission) => commission.commissionId !== action.payload,
        );
      })
      .addCase(__updateCommission.fulfilled, (state, action: PayloadAction<Commission>) => {
        state.isLoading = false;
        const index = state.commissions.findIndex(
          (commission) => commission.commissionId === action.payload.commissionId,
        );
        if (index !== -1) {
          state.commissions[index] = action.payload;
        }
      })
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
          state.error = action.payload as string || '오류가 발생하였습니다.';
        },
      );
  },
});

export default commissionSlice.reducer;