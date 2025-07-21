import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OnboardingData, OnboardingResponse } from "../types";
import { fetchOnboardState } from "@/services/api/getCategory";
import axiosInstance from "@/lib/axios-instance";

export const useReportOnboardState = () => {
  return useQuery<OnboardingData>({
    queryKey: ["report", "onboardstate"],
    queryFn: fetchOnboardState,
  });
};


export const useUpdateOnboard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updateData: Partial<OnboardingData>) => {
      const res = await axiosInstance.patch("/report/update-onboard", updateData);
      return res.data;
    },
    onSuccess: (data) => {
      qc.refetchQueries({ queryKey: ["report", "onboardstate"] });
    },
  });
};