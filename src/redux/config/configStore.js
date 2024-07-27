import { configureStore } from '@reduxjs/toolkit';
import commissionSlice from '../slices/commissionSlice';
import usersSlice from '../slices/usersSlice';

const store = configureStore({
  reducer: {
    commission: commissionSlice,
    users: usersSlice,
  },
});

export default store;
