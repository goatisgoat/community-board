import { configureStore } from "@reduxjs/toolkit";
import homeSlice from "../moduls/homeSlice";
import userSlice from "../moduls/userSlice";

const store = configureStore({
  reducer: {
    homeSlice,
    userSlice,
  },
});

export default store;
