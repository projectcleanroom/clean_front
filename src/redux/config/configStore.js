import { configureStore } from '@reduxjs/toolkit';
import comissionSlice from '../slices/comissionSlice';
import usersSlice from '../slices/usersSlice';

const store = configureStore({
    reducer: {
        comission: comissionSlice,
        users: usersSlice,
    },
});

export default store;
