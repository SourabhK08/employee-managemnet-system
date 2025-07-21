import rootApiSlice from "../rootApiSlice";

export const permissionApiSlice = rootApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissionList : builder.query({
            query: () => ({
                url:'/permissions/'
            })
        })
    })
})

export const { useGetPermissionListQuery} = permissionApiSlice