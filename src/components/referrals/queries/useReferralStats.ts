import { fetchReferralStats } from "@/services/api/getReferralStats";
import { useQuery } from "@tanstack/react-query";

export const useReferralStats = () => {
  return useQuery({
    queryKey: ["referral-stats"],
    queryFn: fetchReferralStats,
    staleTime: 1000 * 60 * 5,
  });
};
