import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "../moduls/homeSlice";

const store = configureStore({
  reducer: {
    homeSlice,
  },
});

export default store;
