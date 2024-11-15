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

const baseQuery = retry(fetchBaseQuery({
  baseUrl: environment.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state?.user?.access_token || state.user?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      console.log(token)
    }
    return headers;
  },
}), { maxRetries: 3 });

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status } = result.error;
    if (status === 406) {
      api.dispatch(logoutUser());
      toast.error(
        "Inactive for too long. Please login again to continue. " +
          (result.error.data as { message: string })?.message
      );
      return result;
    } else if (status === 401) {
      api.dispatch(logoutUser());
      toast.error(
        "Error: " + (result.error.data as { message: string })?.message
      );
    } else if (status === 400) {
      // api.dispatch(logoutUser());
      toast.error(
        "Something went wrong " +
          (result.error.data as { message: string })?.message
      );
    }else if (status === 404) {
      toast.error(
        "Page not found" +
          (result.error.data as { message: string })?.message
      );
    }
  }
  return result;
};

export default customBaseQuery;
