import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios-instance";

type OnboardingData = {
  organization_id: string;
  categories: string[];
  fields_of_interest: string[];
  accepted_terms: boolean;
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

// Main response type
type OnboardingResponse = {
  success: boolean;
  message: string;
  data: OnboardingData;
};

export type OnboardingPayload = {
  categories: string[];
  fields_of_interest: string[];
  accepted_terms: boolean;
};

export const useOnboardingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      onboardingData: OnboardingPayload
    ): Promise<OnboardingResponse> => {
      const res = await axiosInstance.post("/onboarding", onboardingData);
      if (!res.data) {
        throw new Error("Failed to complete onboarding");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
    },
  });
};



export const postOnboardData = async (
  payload: OnboardingPayload
): Promise<OnboardingResponse> => {
  const response = await axiosInstance.post("/report/onboard", payload);
  return response.data;
};
