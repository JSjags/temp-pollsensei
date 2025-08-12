import { renameReport } from "@/services/api/getCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useRenameReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ report_id, name }: { report_id: string; name: string }) =>
      renameReport(report_id, name),
    onSuccess: () => {
      toast.success("Report renamed successfully.");
      // qc.invalidateQueries({ queryKey: ["reports"], refetchType: "active" });
      qc.refetchQueries({ queryKey: ["reports"], type: "active" });

    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to rename report.");
    },
  });
};
