import {
  fetchAllReports,
  fetchAllSurveys,
  fetchPreviewReportById,
  fetchReportCategory,
  fetchReportInterests,
} from "@/services/api/getCategory";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReportCategory } from "../types";

export const useReportCategory = () => {
  return useQuery<ReportCategory[]>({
    queryKey: ["report", "category"],
    queryFn: fetchReportCategory,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
export const useReportInterests = () => {
  return useQuery<ReportCategory[]>({
    queryKey: ["report", "interests"],
    queryFn: fetchReportInterests,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useAllSurveys = (page: number, pageSize: number = 9) => {
  return useQuery({
    queryKey: ["surveys", page, pageSize],
    queryFn: () => fetchAllSurveys(page, pageSize),
    staleTime: 1000 * 60 * 1, // 5 minutes
  });
};

export const useReports = (surveyId: string, tab: string, page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["reports", surveyId, tab, page, pageSize],
    queryFn: () => fetchAllReports(surveyId, tab, page, pageSize),
  });
};

export const usePreviewReportById = (reportId: string) => {
  return useQuery({
    queryKey: ["get-report-by-id", reportId],
    queryFn: () => fetchPreviewReportById(reportId),
    enabled: !!reportId,
  });
};