import { useMutation } from "@tanstack/react-query";
import rawAxiosInstance from "./rawAxiosInstance";

type PurchasePayload = {
  paymentGateway: "paystack" | "stripe";
  currency: "NGN" | "USD";
  amount: number;
  pollcoins: number;
  orderReferenceId: string;
  redirect_url: string;
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
      authorization_url?: string; 
      client_secret?: string;
      access_code?: string;
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
          amount: Number(payload.amount),
          pollcoins: Number(payload.pollcoins),
        }
      );

      return res.data;
    },
  });
};
