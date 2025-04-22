// lib/rawAxiosInstance.ts
import store from "@/redux/store";
import environment from "@/services/config/base";
import axios from "axios";
import { toast } from "react-toastify";

const getToken = () => {
  return store.getState().user.token || store.getState().user?.access_token;
};

const rawAxiosInstance = axios.create({
  baseURL: environment.API_BASE_URL,
});

rawAxiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

rawAxiosInstance.interceptors.response.use(
  (response) => {
    // 🔁 Don't touch the response, return it as-is
    return response;
  },
  (error) => {
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

    if (error.request.status === 401 || error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error(formatErrorMessage(error), { toastId: "error" });
    }

    return Promise.reject(error);
  }
);

export default rawAxiosInstance;
