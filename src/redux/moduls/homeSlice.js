import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchSlice: "",
};

const homeSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    handleSearchSlice: (state, action) => {
      console.log(action.payload);
      state.searchSlice = action.payload;
    },
  },
});

export const { handleSearchSlice } = homeSlice.actions;
export default homeSlice.reducer;
