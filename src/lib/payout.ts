import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios-instance";

export type PayoutPayload = {
  account_name: string;
  account_number: string;
  bank_code: string;
  amount: number;
};
export type PreviousPayoutPayload = {
  payout_bank_id: string;
  amount: number;
};
export const usePaystackPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payoutData: PayoutPayload) => {
      const res = await axiosInstance.post("/payout/paystack", payoutData);
      if (!res.data) {
        throw new Error("Failed to process payout");
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        queryClient.invalidateQueries({ queryKey: ["payout-history"] });
        queryClient.invalidateQueries({queryKey: ["pending-paystack-payouts"]});
      }
    },
  });
};

export const usePaystackPreviousPayoutBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payoutData: PreviousPayoutPayload) => {
      const res = await axiosInstance.post("/payout/paystack", {
        payout_bank_id: payoutData.payout_bank_id,
        amount: payoutData.amount,
      });

      if (!res.data) {
        throw new Error("Failed to process payout");
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        queryClient.invalidateQueries({ queryKey: ["payout-history"] });
        queryClient.invalidateQueries({queryKey: ["pending-paystack-payouts"]});
      }
    },
  });
};
