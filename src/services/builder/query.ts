// src/services/builder/query.ts
import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import environment from "../config/base";
import { logoutUser } from "../../redux/slices/user.slice";
import { toast } from "react-toastify";
import { RootState } from "../../redux/store";

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: environment.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state?.user?.access_token || state.user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  { maxRetries: 5 }
);

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status } = result.error;
    const errorMessage = (result.error.data as { message: string })?.message;

    // Create error message based on status
    let toastMessage = "";
    if (status === 406) {
      api.dispatch(logoutUser());
      toastMessage = `Inactive for too long. Please login again to continue. ${errorMessage}`;
    } else if (status === 401) {
      api.dispatch(logoutUser());
      toastMessage = `Error: ${errorMessage}`;
    } else if (status === 400) {
      toastMessage = `Something went wrong ${errorMessage}`;
    } else if (status === 404) {
      toastMessage = `Page not found ${errorMessage}`;
    }

    // Only show toast if we have an error message
    if (toastMessage) {
      // Dismiss existing toasts and show new one with consistent toastId
      toast.dismiss();
      toast.error(toastMessage, { toastId: "api-error" });
    }
  }
  return result;
};

export default customBaseQuery;
