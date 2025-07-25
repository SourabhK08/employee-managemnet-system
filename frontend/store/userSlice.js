import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    permissions: [],
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.user = action.payload.data;
      state.permissions = action.payload.data?.role?.permissions || [];
    },
    logoutUser: (state) => {
      state.user = null;
      state.permissions = [];
    },
  },
});

export const { setUserProfile, logoutUser } = userSlice.actions;
export default userSlice.reducer;
