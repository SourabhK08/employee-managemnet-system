import rootApiSlice from "../rootApiSlice";

export const roleApiSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoleList: builder.query({
      query: () => {
        return {
          url: `/role/`,
        };
      },
    }),
  }),
});

export const {
    useGetRoleListQuery
} = roleApiSlice;
