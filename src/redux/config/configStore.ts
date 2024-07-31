import { configureStore } from '@reduxjs/toolkit';
import commissionSlice from '../slices/commissionSlice';
import menmbersSlice from '../slices/membersSlice';

const store = configureStore({
  reducer: {
    commission: commissionSlice,
    menmbers: menmbersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
