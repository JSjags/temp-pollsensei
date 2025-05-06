"use client";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RespondentFormData } from "@/types/survey";

export function useSubmitRespondentForm() {
  const pollsenseiAPIEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}`;
  const accessToken = useSelector(
    (state: RootState) => state.user.access_token
  );

  return useMutation({
    mutationFn: async ({
      tab,
      formData,
    }: {
      tab: string;
      formData: Partial<RespondentFormData>;
    }) => {
      const url = `${pollsenseiAPIEndpoint}paid-respondent`;
      if (!accessToken) {
        throw new Error("No access token available");
      }

      try {
        const response = await axios.post(url, formData, {
          params: {
            section: tab,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        // console.log("API Response:", response.data);
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
