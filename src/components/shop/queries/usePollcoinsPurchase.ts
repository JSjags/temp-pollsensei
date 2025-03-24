import { OrderSummaryPayload, PollcoinOrderSummaryResponse } from "@/lib/purchasePollcoins";
import rawAxiosInstance from "@/lib/rawAxiosInstance";
import { useMutation } from "@tanstack/react-query";



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
        console.log(res.data, 'summary');
        return res.data;
      },
    });
  };