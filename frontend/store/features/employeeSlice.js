import rootApiSlice from "../rootApiSlice";

export const employeeApiSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeList: builder.query({
      query: () => ({
        url: "/employee/",
      }),
      providesTags: ["empList"],
    }),

    getEmployeeById: builder.query({
      query: (empId) => ({
        url: `/employee/${empId}`,
        method: "GET",
      }),
    }),

    addEmployee: builder.mutation({
      query: (empData) => ({
        url: `/employee/add`,
        body: empData,
        method: "POST",
      }),
      invalidatesTags: ["empList"],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, updatedEmpData }) => ({
        url: `/employee/${id}`,
        body: updatedEmpData,
        method: "PUT",
      }),
      invalidatesTags: ["empList"],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["empList"],
    }),

    loginEmployee: builder.mutation({
      query: (employeeDetails) => ({
        url: "/employee/login",
        body: employeeDetails,
        method: "POST",
      }),
    }),

    logoutEmployee: builder.mutation({
      query: () => ({
        url: "/employee/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetEmployeeListQuery,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useLoginEmployeeMutation,
  useLogoutEmployeeMutation,
} = employeeApiSlice;
