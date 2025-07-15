import rootApiSlice from "../rootApiSlice";

export const employeeApiSlice = rootApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeeList: builder.query({
            query: () => ({
                url:'/employee/'
            })
        })
    })
})

export const { useGetEmployeeListQuery } = employeeApiSlice;