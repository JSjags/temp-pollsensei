import { useMutation, useQueryClient } from "@tanstack/react-query";
import rawAxiosInstance from "./rawAxiosInstance";
import axiosInstance from "./axios-instance";

export type PurchasePayload = {
  paymentGateway: string;
  orderReferenceId: string;
  redirect_url?: string; // required for paystack but optional for stripe
  bundleId?: string; // bundle ID for bundle purchases
  // Optional fields for backward compatibility
  currency?: string;
  amount?: number;
  pollcoins?: number;
  orderSummaryId?: string;
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PurchasePayload) => {
      // Create the request payload with only the required fields
      const requestPayload: Record<string, any> = {
        paymentGateway: payload.paymentGateway,
        orderReferenceId: payload.orderReferenceId,
      };

      // Add redirect_url if provided (required for paystack, optional for stripe)
      if (payload.redirect_url) {
        requestPayload.redirect_url = payload.redirect_url;
      }

      // Add optional fields if they exist (for backward compatibility)
      if (payload.bundleId) {
        requestPayload.bundleId = payload.bundleId;
      }
      if (payload.currency) {
        requestPayload.currency = payload.currency;
      }
      if (payload.amount !== undefined) {
        requestPayload.amount = Number(payload.amount);
      }
      if (payload.pollcoins !== undefined) {
        requestPayload.pollcoins = Number(payload.pollcoins);
      }
      if (payload.orderSummaryId) {
        requestPayload.orderSummaryId = payload.orderSummaryId;
      }

      const res = await rawAxiosInstance.post<PurchaseResponse>(
        "/purchases/pollcoins/purchase",
        requestPayload
      );

      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Refetch the user balance after a successful purchase
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      }
    },
  });
};
