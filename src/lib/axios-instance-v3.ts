// lib/axiosInstance.ts
import { logoutUser } from "@/redux/slices/user.slice";
import store from "@/redux/store";
import environment from "@/services/config/base";
import axios from "axios";
import { toast } from "react-toastify";
import { setIsLimited, setMessage } from "@/redux/slices/limitation.slice";

// Assuming you have a function to get the token from storage or some other source
const getToken = () => {
  const token =
    store.getState().user.access_token || store.getState().user.token;
  // Replace with actual logic to retrieve the token
  return store.getState().user.token || store.getState().user?.access_token;
};

console.log(environment.API_BASE_URL);

const axiosInstancev3 = axios.create({
  baseURL: "https://api-staging.pollsensei.ai/api/v1",
});

// Interceptor to add the Bearer token to each request
axiosInstancev3.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstancev3.interceptors.response.use(
  function (response) {
    // return response.data.data;
    return response?.data ?? response;
  },
  function (error) {
    // Debug log to inspect error structure
    console.log("AXIOS ERROR:", JSON.stringify(error, null, 2));
    // Dismiss any existing error toasts
    toast.dismiss();

    const formatErrorMessage = (error: any) => {
      return error?.response?.data?.errors
        ? (
            error?.response?.data?.errors as { [key: string]: unknown }[]
          ).reduce(
            (prev, curr, i, arr) =>
              i < arr.length - 1
                ? prev + `${i === 0 ? "" : ", "}${curr.msg}`
                : `${prev}, ${curr.msg}.`,
            ""
          )
        : error?.response?.data?.msg ??
            error?.response?.data?.message ??
            error?.message ??
            "You need to be logged in to continue. Please log in.";
    };

    const status = error.response?.status;

    if (status === 401) {
      if (store.getState().user.user) {
        localStorage.removeItem("token");
        store.dispatch(logoutUser());
        return window.location.assign("/login");
      }
      toast.error(formatErrorMessage(error), { toastId: "error" });
    } else if (status === 409) {
      // Set limitation state in redux
      store.dispatch(setIsLimited(true));
      store.dispatch(setMessage(formatErrorMessage(error)));
      // Optionally show a toast for 409
      // toast.error(formatErrorMessage(error), { toastId: "error-409" });
    } else if (
      (error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message) &&
      !error?.response?.data?.message?.includes("Survey milestone not found")
    ) {
      // Optionally show a toast for other errors
      // toast.error(formatErrorMessage(error), { toastId: "error" });
    }

    return Promise.reject(error);
  }
);

export default axiosInstancev3;
