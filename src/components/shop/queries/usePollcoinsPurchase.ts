import rawAxiosInstance from "@/lib/rawAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { OrderSummaryPayload, PollcoinOrderSummaryResponse } from "../types";

export const usePollcoinOrderSummary = () => {
  return useMutation({
    mutationFn: async (payload: OrderSummaryPayload) => {
      const res = await rawAxiosInstance.post<PollcoinOrderSummaryResponse>(
        "/purchases/pollcoins/order-summary",
        {
          amount: Number(payload.amount),
          pollcoins: Number(payload.pollcoins),
          currency: payload.currency,
        }
      );
      return res.data;
    },
  });
};
