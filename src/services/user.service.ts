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
          console.log(data);
          const accessToken = data?.data?.data?.access_token;
          const user = data?.data?.data?.user;

          console.log(accessToken);
          console.log(user);

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
    completeInvitedMemberSetup: builder.mutation({
      query: (credentials) => ({
        url: "/team/auth",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const data = await queryFulfilled;
          console.log(data);
          const accessToken = data?.data?.data?.access_token;
          const user = data?.data?.data?.user;

          console.log(accessToken);
          console.log(user);

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
    verifyOTP: builder.mutation({
      query: (credentials) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: credentials,
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
    changePswdCode: builder.query({
      query: () => ({
        url: "/user/password-reset-code",
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
    gooleRegister: builder.mutation({
      query: (body) => ({
        url: "/social/google/register",
        method: "POST",
        body,
      }),
    }),
    googleLogin: builder.mutation({
      query: (body) => ({
        url: "/social/google/login",
        method: "POST",
        body,
      }),
    }),
    facebookRegister: builder.mutation({
      query: (body) => ({
        url: "/social/facebook/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCompleteInvitedMemberSetupMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation,
  useLoginUserMutation,
  useUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPasswordMutation,
  useUpdateProfileImageMutation,
  useGooleRegisterMutation,
  useFacebookRegisterMutation,
  useGoogleLoginMutation,
  useLazyChangePswdCodeQuery,
} = userApiSlice;
