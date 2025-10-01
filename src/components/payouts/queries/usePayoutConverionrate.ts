import { fetchPayoutConverionRate } from "@/services/api/getPayoutConversionRate";
import { useQuery } from "@tanstack/react-query";

export const usePayoutConversionRate = () => {
  return useQuery({
    queryKey: ["payout-conversion-rate"],
    queryFn: fetchPayoutConverionRate,
    staleTime: 1000 * 60 * 5,
  });
};
