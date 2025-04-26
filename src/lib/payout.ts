import { useMutation, useQueryClient } from "@tanstack/react-query";
import rawAxiosInstance from "./rawAxiosInstance";
import axiosInstance from "./axios-instance";



export type PayoutPayload = {
  account_name: string;
  account_number: string;
  bank_code: number;
  amount: number;
  payout_bank_id: number
};

export const usePaystackPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payoutData: PayoutPayload) => {
      const res = await axiosInstance.post("/payout/paystack", {
        payoutData,
      });

      if (!res.data) {
        throw new Error("Failed to process payout");
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Refetch the user balance after a successful payout
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      }
    },
  });
};
