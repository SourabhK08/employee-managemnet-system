import rootApiSlice from "../rootApiSlice";

export const roleApiSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoleList: builder.query({
      query: ({ search }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        return {
          url: `/role?${params.toString()}`,
        };
      },
      providesTags: ["roleList"],
    }),

    addRole: builder.mutation({
      query: (roleData) => ({
        url: "/role/add",
        body: roleData,
        method: "POST",
      }),
      invalidatesTags: ["roleList"],
    }),

    updateRole: builder.mutation({
      query: ({ id, updatedRole }) => ({
        url: `/role/${id}`,
        body: updatedRole,
        method: "PUT",
      }),
      invalidatesTags: ["roleList"],
    }),

    getRoleById: builder.query({
      query: (id) => ({
        url: `/role/${id}`,
        method: "GET",
      }),
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["roleList"],
    }),

    getTeamLeadersList: builder.query({
      query: () => ({
        url: "/role/teamLeadersList",
      }),
    }),
  }),
});

export const {
  useGetRoleListQuery,
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
  useGetTeamLeadersListQuery,
} = roleApiSlice;
