import rootApiSlice from "../rootApiSlice";

export const employeeApiSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeList: builder.query({
      query: () => ({
        url: "/employee/",
      }),
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
        body: { empData },
        method: "POST",
      }),
    }),

    updateEmployee: builder.mutation({
      query: ({ id, updatedEmpData }) => ({
        url: `/employee/${id}`,
        body: { updatedEmpData },
        method: "PUT",
      }),
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employee/${id}`,
        body: { id },
        method: "DELETE",
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
} = employeeApiSlice;
