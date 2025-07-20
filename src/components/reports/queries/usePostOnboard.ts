import { postOnboardData } from "@/lib/report";
import { useMutation } from "@tanstack/react-query";

export const usePostOnboard = () => {
  return useMutation({
    mutationFn: postOnboardData,
  });
};