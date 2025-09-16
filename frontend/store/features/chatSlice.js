
import rootApiSlice from "../rootApiSlice";

export const chatSlice = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatContacts: builder.query({
      query: () => ({
        url: "/chat/contacts",
        method: "GET",
      }),
      providesTags: ["chatContacts"],
    }),

    getChatHistory: builder.query({
      query: ({ senderId, receiverId }) => ({
        url: `/chat/${senderId}/${receiverId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "chatHistory", id: `${arg.senderId}-${arg.receiverId}` },
      ],
    }),

    // Optional: Fallback API to send message (if needed)
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: "/chat/send",
        method: "POST",
        body: messageData,
      }),
      invalidatesTags: ["chatHistory"],
    }),
  }),
});

export const {
  useGetChatContactsQuery,
  useGetChatHistoryQuery,
  useSendMessageMutation,
} = chatSlice;
