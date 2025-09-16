import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const rootApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include",
  }),
  // prepareHeaders: (headers, { getState }) => {
  //     const token = Cookies.get("accessToken");
  //     console.log("tokennnn",token);
      

  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }

  //     return headers;
  //   },
  tagTypes: ["empList", "deptList", "roleList", "taskList","chatContacts","chatHistory"],
  endpoints: () => ({}),
});

export default rootApiSlice;
