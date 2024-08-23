// import apiSlice from "./api/apiSlice";
import { updateUser } from "../redux/slices/user.slice";
import apiSlice from "./config/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userCredietials) => ({
        url: "/auth/login",
        method: "POST",
        body: userCredietials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const data = await queryFulfilled;
          console.log("GULAG");
          console.log(data);
          const accessToken = data?.data?.access_token;
          const user = data?.data?.user;

          dispatch(
            updateUser({
              token: accessToken,
              user,
            })
          );
        } catch (error) {
          console.log(error);
          return;
        }
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/auth/register",
        method: "POST",
        body: newUser,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (credientials) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: credientials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credientials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credientials,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    userProfile: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (body) => ({
        url: "/user/me",
        method: "PATCH",
        body,
      }),
    }),
    updateProfileImage: builder.mutation({
      query: (body) => ({
        url: "/user/me/image",
        method: "PATCH",
        body,
      }),
    }),
    updateUserPassword: builder.mutation({
      query: (body) => ({
        url: "/user/update-password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation,
  useLoginUserMutation,
  useUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useUpdateProfileImageMutation,
} = userApiSlice;
