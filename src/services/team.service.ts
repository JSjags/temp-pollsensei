// import apiSlice from "./api/apiSlice";
import apiSlice from "./config/apiSlice";

export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query({
      query: (page) => ({
        url: `/team/members?page=1&page_size=${page}`,
        method: 'GET',
      }),
    }),
    invite: builder.mutation({
      query: (invitee) => ({
        url: '/team/invite',
        method: 'POST',
        body: invitee,
      }),
    }),
  }),
});

export const { useGetTeamMembersQuery, useInviteMutation } = teamApiSlice
