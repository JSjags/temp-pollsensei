import axiosInstance from "@/lib/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function usePublishReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const res = await axiosInstance.patch("/report/status-update", {
        report_id: reportId,
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate any cached report data to reflect update
      queryClient.invalidateQueries({ queryKey: ["get-report-by-id"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
