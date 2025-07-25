import { configureStore } from "@reduxjs/toolkit";
import rootApiSlice from "./rootApiSlice";
import userReducer from "./userSlice.js";

const store = configureStore({
  reducer: {
    [rootApiSlice.reducerPath]: rootApiSlice.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    rootApiSlice.middleware,
  ],
});

export default store;
