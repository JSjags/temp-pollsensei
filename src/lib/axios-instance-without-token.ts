// lib/axiosInstance.ts
import axios from "axios";
import { cn } from "./utils";
import { toast } from "react-toastify";
import environment from "@/services/config/base";

const axiosInstanceWithoutToken = axios.create({
  // baseURL: "https://pollsensei-api-a0e832048911.herokuapp.com/api/v1",
  baseURL: environment.API_BASE_URL,
});

axiosInstanceWithoutToken.interceptors.response.use(
  function (response) {
    return response?.data ?? response;
  },
  function (error) {
    const errorMessage = error?.response?.data?.errors
      ? (error?.response?.data?.errors as { [key: string]: unknown }[]).reduce(
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

    if (error.request.status === 401 || error.response.status === 401) {
      localStorage.removeItem("token");
      toast.error(errorMessage);
    } else if (
      (error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message) &&
      !error?.response?.data?.message?.includes("Survey milestone not found")
    ) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstanceWithoutToken;
