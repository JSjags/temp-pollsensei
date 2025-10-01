import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios-instance";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export type PayoutPayload = {
  account_name: string;
  account_number: string;
  bank_code: string;
  amount: number;
  gateway: string;
};
export type PreviousPayoutPayload = {
  payout_bank_id: string;
  amount: number;
};

export type StripePayload = {
  amount: number;
  payout_bank_id: string;
};

type StripePayoutOtpResponse = {
  success: boolean;
  status: number;
  message: string;
};

type ErrorResponse = {
  message: string;
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
        queryClient.invalidateQueries({
          queryKey: ["pending-paystack-payouts"],
        });
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
        queryClient.invalidateQueries({
          queryKey: ["pending-paystack-payouts"],
        });
      }
    },
  });
};

export const useStripePayout = () => {
  const queryClient = useQueryClient();
  return useMutation<
    StripePayoutOtpResponse,
    AxiosError<ErrorResponse>,
    StripePayload
  >({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/payout/stripe", payload);
      if (!res.data) {
        throw new Error("Failed to process payout");
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        queryClient.invalidateQueries({ queryKey: ["payout-history"] });
        queryClient.invalidateQueries({
          queryKey: ["pending-paystack-payouts"],
        });
      }
    },
    onError: (error) => {
      const backendMessage = error.response?.data?.message || "";
      const message =
        backendMessage || error.message || "Failed to confirm payout";
      console.log(error, "stripe error");
      toast.error(message);
    },
  });
};
