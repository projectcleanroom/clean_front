import { configureStore } from "@reduxjs/toolkit";
import comissionSlice from "../slices/comissionSlice";

const store = configureStore({
  reducer: {
    comission: comissionSlice,
  },
});

export default store;
