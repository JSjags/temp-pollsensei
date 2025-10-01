"use client";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { RespondentFormData } from "@/types/survey";

export function useSubmitRespondentForm() {
  return useMutation({
    mutationFn: async ({
      tab,
      formData,
    }: {
      tab: string;
      formData: Partial<RespondentFormData>;
    }) => {
      try {
        const response = await axiosInstance.post(
          "/paid-respondent",
          formData,
          {
            params: {
              section: tab,
            },
          }
        );

        console.log("API Response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Request failed:", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message || "Failed to submit form data"
        );
      }
    },
  });
}
