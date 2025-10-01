import rawAxiosInstance from "@/lib/rawAxiosInstance";
import {
  fetchServicesBalance,
  fetchUserBalance,
} from "@/services/api/getUserBalance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PurchaseCreditsPayload {
  amount: number;
  serviceType: string;
}

interface PurchaseCreditsResponse {
  success: boolean;
  data: {
    purchase: {
      _id: string;
      userId: string;
      amount: number;
      credits: number;
      serviceType: string;
      status: string;
      transactionReference: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    credits: number;
  };
}

export const useCreditPurchase = (serviceType: string) => {
  const queryClient = useQueryClient();
  return useMutation<PurchaseCreditsResponse, Error, PurchaseCreditsPayload>({
    mutationFn: async (payload) => {
      const res = await rawAxiosInstance.post(
        `/purchases/service/purchase/${serviceType}`,
        payload
      );

      return res.data;
    },

    onSuccess: (data) => {
      if (data.success) {
        // Invalidate balance queries to refetch them
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        queryClient.invalidateQueries({ queryKey: ["services-balance"] });
        queryClient.invalidateQueries({ queryKey: ["shop-history"] });
      }
    },
  });
};
