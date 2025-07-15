import rootApiSlice from "../rootApiSlice";

export const departmentApiSlice = rootApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepartmentList: builder.query({
            query: () => ({
                url:'/department/'
            })
        })
    })
})

export const {
    useGetDepartmentListQuery
} = departmentApiSlice