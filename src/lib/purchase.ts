
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "./axios-instance";
import rawAxiosInstance from "./rawAxiosInstance";

type PurchasePayload = {
  paymentGateway: "paystack" | "stripe";
  currency: "NGN" | "USD";
  amount: number;
  pollcoins: number; // Number of pollcoins to purchase
  orderReferenceId: string;
};

type PurchaseResponse = {
  success: boolean;
  message: string;
  data: {
    purchase: {
      id: string;
      amount: number;
      pollcoins: number;
      bonusCoins: number;
      status: string;
    };
    payment: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  };
};

export const usePollcoinPurchase = () => {
  return useMutation({
    mutationFn: async (payload: PurchasePayload) => {
      const res = await rawAxiosInstance.post<PurchaseResponse>(
        "/purchases/pollcoins/purchase",
        {

          ...payload,
          // Ensure amount is a number rather than a string
          amount: Number(payload.amount),
          // Make sure pollcoins is included
          pollcoins: Number(payload.pollcoins)
        }
      );
      console.log(res.data);
      
      return res.data;
    },
  });
};
