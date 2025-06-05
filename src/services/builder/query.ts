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
import { setMessage } from "@/redux/slices/limitation.slice";
import { setIsLimited } from "@/redux/slices/limitation.slice";

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: environment.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token =
        (state as any)?.user?.access_token || (state as any)?.user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
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

  if (result?.error) {
    let statusCode = result.error.status;
    if (typeof statusCode !== "number" && "originalStatus" in result.error) {
      statusCode = result.error.originalStatus as number;
    }
    let errorData: any = result.error.data;

    if (
      typeof errorData === "string" &&
      (errorData.startsWith("{") || errorData.startsWith("["))
    ) {
      try {
        errorData = JSON.parse(errorData);
      } catch (e) {
        console.error("Failed to parse error data as JSON:", e);
      }
    }

    const errorMessage = (errorData as { message: string })?.message;

    let toastMessage = "";
    switch (statusCode) {
      case 406:
        toastMessage =
          errorMessage ||
          "Inactive for too long. Please login again to continue.";
        api.dispatch(logoutUser());
        break;
      case 409:
        api.dispatch(setIsLimited(true));
        api.dispatch(setMessage(errorMessage));
        break;
      case 403:
        api.dispatch(setIsLimited(true));
        api.dispatch(setMessage(errorMessage));
        break;
      case 401:
        toastMessage =
          errorMessage || "Unauthorized access. Please login again.";
        api.dispatch(logoutUser());
        break;
      case 503:
        toastMessage =
          errorMessage || "Unauthorized access. Please login again.";
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

    if (toastMessage) {
      toast.dismiss();
      toast.error(toastMessage, { toastId: "api-error" });
    }
  }
  return result;
};

export default customBaseQuery;
