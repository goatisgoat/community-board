import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userSlice: {},
  isUser: false,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    handleUserSlice: (state, action) => {
      state.userSlice = action.payload;
      state.isUser = true;
    },
  },
});

export const { handleUserSlice } = userSlice.actions;
export default userSlice.reducer;
