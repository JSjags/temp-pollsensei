import { OnboardingResponse, ReportCategory } from "@/components/reports/types";
import axiosInstance from "@/lib/axios-instance";
import { AxiosError } from "axios";

export const fetchReportCategory = async (): Promise<ReportCategory[]> => {
  try {
    const response = await axiosInstance.get("/report/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching report categories:", error);
    throw error;
  }
};

export const fetchReportInterests = async (): Promise<ReportCategory[]> => {
  try {
    const response = await axiosInstance.get("/report/interests");
    return response.data;
  } catch (error) {
    console.error("Error fetching report interests:", error);
    throw error;
  }
};


export const fetchOnboardState = async (): Promise<OnboardingResponse> => {
  try {
    const response = await axiosInstance.get("/report/onboard");
    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    // Optional: Log or format backend error message
    if (error.response) {
      console.error("Backend error:", error.response.data);
      // You can optionally throw a clearer message here
      throw new Error(
        (error.response.data as any)?.message || "Failed to fetch onboarding state"
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from server");
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchAllSurveys = async (page = 1, pageSize = 9) => {
  try {
    const response = await axiosInstance.get("/report/surveys", {
      params: {
        page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(
        (error.response.data as any)?.message || "Failed to fetch surveys"
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from server");
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An unexpected error occurred");
    }
  }
};

 // adjust path to your axios instance

export const fetchAllReports = async (
  surveyId: string,
  status: string = "all",
  page: number = 1,
  pageSize: number = 9
) => {
  try {
    const params: Record<string, any> = {
      page,
      page_size: pageSize,
    };

    if (status !== "all") {
      params.status = status;
    }

    const response = await axiosInstance.get(`/report/list/${surveyId}`, {
      params,
    });

  
    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(
        (error.response.data as any)?.message || "Failed to fetch reports"
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("No response from server");
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An unexpected error occurred");
    }
  }
};


/**
 * Delete a report by ID.
 * Returns whatever the backend responds with (often {message: string} or 204/empty).
 */
export const deleteReport = async <T = unknown>(reportId: string): Promise<T> => {
  try {
    const response = await axiosInstance.delete<T>(`/report/${reportId}`);
    return response.data;
  } catch (error: any) {
    // Log for debugging
    console.error(`Error deleting report ${reportId}:`, error);

    // Normalize error message for callers / toast
    let message = "Failed to delete report.";
    if (error?.response?.data) {
      // Try common API shapes
      const data = error.response.data as any;
      message =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.message) ||
        message;
    } else if (error?.message) {
      message = error.message;
    }

    // Throw a real Error so React Query's onError receives a clean message
    throw new Error(message);
  }
};
