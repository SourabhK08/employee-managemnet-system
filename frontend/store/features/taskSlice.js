import rootApiSlice from "../rootApiSlice";

export const taskApiSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedTaskList: builder.query({
      query: ({ search, page = 1, limit = 10, status, priority }) => {
        const params = new URLSearchParams({
          page: page?.toString(),
          limit: limit?.toString(),
        });

        if (search) params.append("search", search);
        return { url: `/task/assignedTaskList?${params.toString()}` };
      },
      providesTags: ["taskList"],
    }),

    addTask: builder.mutation({
      query: (taskData) => ({
        url: "/task/add",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["taskList"],
    }),

    getMyTaskList: builder.query({
      query: ({ search, page = 1, limit = 10, status, priority }) => {
        const params = new URLSearchParams({
          page: page?.toString(),
          limit: limit?.toString(),
        });

        if (search) params.append("search", search);
        return { url: `/task/myTaskList?${params.toString()}` };
      },
      providesTags: ["taskList"],
    }),

    updateTask: builder.mutation({
      query: ({ id, updatedTask }) => ({
        url: `/task/${id}`,
        body: updatedTask,
        method: "PUT",
      }),
      invalidatesTags: ["taskList"],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["taskList"],
    }),

    getTaskById: builder.query({
      query: (id) => ({
        url: `/task/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddTaskMutation,
  useGetAssignedTaskListQuery,
  useDeleteTaskMutation,
  useGetMyTaskListQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
} = taskApiSlice;
