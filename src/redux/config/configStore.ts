import { configureStore } from '@reduxjs/toolkit';
import commissionSlice from '../slices/commissionSlice';
import membersSlice from '../slices/membersSlice';

const store = configureStore({
  reducer: {
    commission: commissionSlice,
    members: membersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
