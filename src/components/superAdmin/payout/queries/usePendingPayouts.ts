import { fetchPendingPayouts } from "@/services/api/getPendingPaystackPayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePendingPayouts = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ["pending-paystack-payouts", page, pageSize],
    queryFn: () => fetchPendingPayouts({ page }),
    staleTime: 0,
    refetchInterval: 1000,
    // placeholderData: keepPreviousData,
  });
};
