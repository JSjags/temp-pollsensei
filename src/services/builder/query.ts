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
import store, { RootState } from "../../redux/store";

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
    responseHandler: async (response) => {
      // Handle 401 Unauthorized responses
      if (response.status === 401) {
        // Return early to let the customBaseQuery handle the 401 error
        // This will allow proper logout and error messaging
        toast.error("Unauthorized access. Please login again.", {
          toastId: "api-error",
        });
        return store.dispatch(logoutUser());
      }

      // Handle 204 No Content explicitly
      if (response.status === 204) {
        return null;
      }

      let responseData;
      const responseText = await response.text();

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { message: responseText };
      }

      // If response is not ok, throw error for RTK Query to handle
      if (!response.ok) {
        throw {
          status: response.status,
          data: responseData,
        };
      }

      return responseData;
    },
  }),
  { maxRetries: 0 }
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
    switch (status) {
      case 406:
        toastMessage = "Inactive for too long. Please login again to continue.";
        api.dispatch(logoutUser());
        break;
      case 401:
        toastMessage = "Unauthorized access. Please login again.";
        api.dispatch(logoutUser());
        break;
      case 503:
        toastMessage = "Unauthorized access. Please login again.";
        api.dispatch(logoutUser());
        break;
      case 400:
        toastMessage =
          errorMessage || "Something went wrong with your request.";
        break;
      case 404:
        toastMessage = errorMessage || "Page not found";
        break;
      default:
        toastMessage = errorMessage || "An error occurred";
    }

    // Show toast message
    if (toastMessage) {
      toast.dismiss();
      toast.error(toastMessage, { toastId: "api-error" });
    }
  }
  return result;
};

export default customBaseQuery;
