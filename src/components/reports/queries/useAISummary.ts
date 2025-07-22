import { fetchAiSummary } from "@/services/api/getCategory";
import { useMutation } from "@tanstack/react-query";

export const useAiSummary = () => {
  return useMutation({
    mutationFn: (reportId: string) => fetchAiSummary(reportId),
  });
};
