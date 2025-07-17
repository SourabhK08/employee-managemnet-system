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
  }),
});

export const {
  useGetEmployeeListQuery,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} = employeeApiSlice;
