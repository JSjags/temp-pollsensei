import { fetchShopTransactions } from "@/services/api/getShopTransactions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useShopTransactionsHistory = ({ page = 1 }: { page: number }) => {
  return useQuery({
    queryKey: ["shop-history", page],
    queryFn: () => fetchShopTransactions({ page }),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
