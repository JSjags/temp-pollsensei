// lib/axiosInstance.ts
import store from "@/redux/store";
import environment from "@/services/config/base";
import axios from "axios";
import { toast } from "react-toastify";

// Assuming you have a function to get the token from storage or some other source
const getToken = () => {
  const token =
    store.getState().user.access_token || store.getState().user.token;
  // Replace with actual logic to retrieve the token
  return store.getState().user.token || store.getState().user?.access_token;
};

console.log(environment.API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: environment.API_BASE_URL,
});

// Interceptor to add the Bearer token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // return response.data.data;
    return response?.data ?? response;
  },
  function (error) {
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
            "You are not Authorized. Log in to continue";
    };

    if (error.request.status === 401 || error.response.status === 401) {
      localStorage.removeItem("token");
      toast.error(formatErrorMessage(error), { toastId: "error" });
      // return window.location.assign("/login");
    } else if (
      (error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message) &&
      !error?.response?.data?.message?.includes("Survey milestone not found")
    ) {
      // toast.error(formatErrorMessage(error), { toastId: "error" });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
