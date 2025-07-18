import rootApiSlice from "../rootApiSlice";

export const departmentApiSlice = rootApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepartmentList: builder.query({
            query: () => ({
                url:'/department/'
            }),
            providesTags:['deptList']
        }),

        addDepartment: builder.mutation({
            query:(deptData) => ({
                url:'/department/add',
                body: deptData,
                method:'POST'
            }),
            invalidatesTags:['deptList']
        }),

        updateDepartment: builder.mutation({
            query: ({id,updatedDept}) => ({
                url:`/department/${id}`,
                body:updatedDept,
                method:'PUT'
            }),
            invalidatesTags:['deptList']
        }),
        
        getDepartmentById: builder.query({
            query:(id) => ({
                url:`/department/${id}`,
                method:'GET'
            })
        }),

        deleteDepartment: builder.mutation({
            query: (id) => ({
                url:`/department/${id}`,
                method:'DELETE'
            }),
            invalidatesTags:['deptList']
        })
    })
})

export const {
    useGetDepartmentListQuery,
    useAddDepartmentMutation,
    useDeleteDepartmentMutation,
    useGetDepartmentByIdQuery,
    useUpdateDepartmentMutation
} = departmentApiSlice