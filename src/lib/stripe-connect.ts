import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios-instance";

type ConnectPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  sort_code: string;
  account_number: string;
  account_holder_name: string;
  business_url: string;
  mcc: string;
  statement_descriptor: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  date_of_birth: {
    day: number;
    month: number;
    year: number;
  };
  ssnLast4?: string; // Optional, only for US
  routing_number?: string; // Optional, only for US
};

export const useStripeConnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payoutData: ConnectPayload) => {
      const res = await axiosInstance.post("/payout/stripe/connect-account", payoutData);
      if (!res.data) {
        throw new Error("Failed to process Stripe connect account");
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        queryClient.invalidateQueries({ queryKey: ["payout-history"] });
        queryClient.invalidateQueries({ queryKey: ["pending-paystack-payouts"] });
      }
    },
  });
};
