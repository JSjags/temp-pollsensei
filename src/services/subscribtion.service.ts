import apiSlice from "./config/apiSlice";

export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlan: builder.query({
      query: () => ({
        url: `/plan`,
        method: "GET",
      }),
    }),
    invite: builder.mutation({
      query: (invitee) => ({
        url: "/team/invite",
        method: "POST",
        body: invitee,
      }),
    }),
  }),
});

export const { useGetPlanQuery, useInviteMutation } = subscriptionApiSlice;
