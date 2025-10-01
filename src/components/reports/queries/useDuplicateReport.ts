import { duplicateReport } from "@/services/api/getCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDuplicateReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => duplicateReport(reportId),
    onSuccess: () => {
      toast.success("Report duplicated successfully.");
      qc.invalidateQueries({ queryKey: ["reports"], exact: false });
    },
    onError: (err: any) => {
      toast.error(
        err?.message
          ? `Could not duplicate report: ${err.message}`
          : "Could not duplicate report."
      );
    },
  });
};