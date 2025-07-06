import { configureStore } from "@reduxjs/toolkit";
import rootApiSlice from "./rootApiSlice";

const store = configureStore({
  reducer: {
    [rootApiSlice.reducerPath]: rootApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware.concat(rootApiSlice.middleware),
});

export default store;
