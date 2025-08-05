import { OnboardingData, OnboardingResponse, ReportCategory } from "@/components/reports/types";
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


export const fetchOnboardState = async (): Promise<OnboardingData> => {
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

  console.log(params, "Params for fetching reports");
  
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

export const duplicateReport = async <T = unknown>(reportId: string): Promise<T> => {
  try {
    const payload = { report_id: reportId };
    const res = await axiosInstance.post<T>(`/report/duplicate`, payload);
    return res.data;
  } catch (error: any) {
    console.error(`Error duplicating report ${reportId}:`, error);
    let message = "Failed to duplicate report.";
    if (error?.response?.data) {
      const data = error.response.data as any;
      message =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.message) ||
        message;
    } else if (error?.message) {
      message = error.message;
    }
    throw new Error(message);
  }
};


export const renameReport = async (report_id: string, newName: string): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/report`, { 
      report_id: report_id,
      name: newName 
    });
    return res.data;
  } catch (error) {
    console.error(`Error renaming report ${report_id}:`, error);
    throw error;
  }
};

export const fetchSearchReports = async (term: string, page: number,) => {
  const { data } = await axiosInstance.get(`/report/search`, {
    params: { search_term: term, page, page_size: 20 },
  });
  console.log("Search results:", data);
  return data.data; 
};


export const fetchAiSummary = async (reportId: string) => {
  try {
    const response = await axiosInstance.get(`/report/ai-summary/${reportId}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(
        (error.response.data as any)?.message ||
          "Failed to generate AI summary"
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

export const fetchPreviewReportById = async (reportId: string) => {
  try {
    const response = await axiosInstance.get(`/report/${reportId}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error("Backend error:", error.response.data);
      throw new Error(
        (error.response.data as any)?.message || "Failed to fetch report"
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