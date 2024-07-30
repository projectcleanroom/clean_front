import { configureStore } from '@reduxjs/toolkit';
import commissionSlice from '../slices/commissionSlice';
import usersSlice from '../slices/usersSlice';

const store = configureStore({
  reducer: {
    commission: commissionSlice,
    users: usersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
