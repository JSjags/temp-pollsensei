/* eslint-disable no-unused-vars */
import {
  createApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../builder/query";
// import { updateUser } from "../../redux/slices/user.slice";

const apiSlice = createApi({
  reducerPath: "api" as const,
  baseQuery: customBaseQuery as BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  >,
  tagTypes: ["User"] as const,
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 50000,
});

// export const { useRegisterUserMutation, useLoginUserMutation, useForgetPasswordMutation, useFormResponseRateQuery, useGetAllUserQuery } = apiSlice

export default apiSlice;
