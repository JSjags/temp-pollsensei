import { fetchPreviousPayoutBank } from "@/services/api/getPreviousPayoutBank";
import { useQuery } from "@tanstack/react-query";

export const usePreviousPayoutBank = () => {
  return useQuery({
    queryKey: ["previous-payout-bank"],
    queryFn: fetchPreviousPayoutBank,
    staleTime: 1000 * 60 * 5,
  });
};
