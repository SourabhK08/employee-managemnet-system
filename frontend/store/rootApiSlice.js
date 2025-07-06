import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rootApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "dummyjson",
  }),
  endpoints: () => ({}),
});

export default rootApiSlice;
