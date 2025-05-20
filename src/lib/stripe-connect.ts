import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios-instance";
import  { AxiosError } from "axios";
import { toast } from "react-toastify";


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
  ssnLast4?: string;
  routing_number?: string;
};

type ConnectResponse = {
  success: boolean;
  message: string;
  data: {
    account: {
      stripe_account_id: string;
      account_name: string;
      account_number: string;
      sort_code: string;
      is_verified: boolean;
    };
    account_setup_url: string;
  };
};


type ErrorResponse = {
  message: string;
};

export const useStripeConnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<ConnectResponse, AxiosError<ErrorResponse>, ConnectPayload>({
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
    onError: (error) => {
      const backendMessage = error.response?.data?.message || "";
      const message = backendMessage || error.message || "Failed to confirm payout";
      console.log(error, "stripe error");
      toast.error(message);
    },
  });
};
