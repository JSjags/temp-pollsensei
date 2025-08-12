import { deleteReport } from "@/services/api/getCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => deleteReport(reportId),
    onSuccess: () => {
      toast.success("Report successfully deleted.");
      qc.invalidateQueries({ queryKey: ["reports"], exact: false });
    },
    onError: (err: any) => {
      toast.error(
        err?.message
          ? `Could not delete report: ${err.message}`
          : "Could not delete report."
      );
    },
  });
};
