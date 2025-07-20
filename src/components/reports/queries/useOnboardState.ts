import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OnboardingData, OnboardingResponse } from "../types";
import { fetchOnboardState } from "@/services/api/getCategory";
import axiosInstance from "@/lib/axios-instance";

export const useReportOnboardState = () => {
  return useQuery<OnboardingResponse>({
    queryKey: ["report", "onboardstate"],
    queryFn: fetchOnboardState,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// export const useUpdateOnboard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (): Promise<OnboardingResponse> => {
//       const res = await axiosInstance.post("/report/update-onboard");
//       return res.data;
//     },
//     onSuccess: (data) => {
//       // Update or invalidate onboard state query
//       queryClient.setQueryData(["report", "onboardstate"], data);
//     },
//   });
// };

// export const useUpdateOnboard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (): Promise<OnboardingResponse> => {
//       try {
//         const res = await axiosInstance.post("/report/update-onboard");
//         return res.data;
//       } catch (err: any) {
//         throw new Error(err.response?.data?.message || "Failed to update onboard state");
//       }
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(["report", "onboardstate"], data);
//     },
//   });
// };
export const useUpdateOnboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData?: Partial<OnboardingData>): Promise<OnboardingResponse> => {
      try {
        const res = await axiosInstance.post("/report/update-onboard", updateData);
        return res.data;
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update onboard state");
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["report", "onboardstate"], data);
      // Optionally invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["report", "onboardstate"] });
    },
  });
};