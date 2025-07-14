import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rootApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  }),
  endpoints: () => ({}),
});

export default rootApiSlice;
