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

    toast.dismiss(); // Dismiss any existing toasts before showing a new one

    if (status === 406) {
      api.dispatch(logoutUser());
      toast.error(
        `Inactive for too long. Please login again to continue. ${errorMessage}`
      );
    } else if (status === 401) {
      api.dispatch(logoutUser());
      toast.error(`Error: ${errorMessage}`);
    } else if (status === 400) {
      toast.error(`Something went wrong ${errorMessage}`);
    } else if (status === 404) {
      toast.error(`Page not found ${errorMessage}`);
    }
  }
  return result;
};

export default customBaseQuery;
