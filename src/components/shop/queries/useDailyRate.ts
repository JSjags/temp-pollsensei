// hooks/useDailyRate.ts
import { fetchDailyRate } from "@/services/api/getDailyRate";
import { useQuery } from "@tanstack/react-query";

export const useDailyRate = () => {
  return useQuery({
    queryKey: ["pollcoin", "dailyRate"],
    queryFn: fetchDailyRate,
    staleTime: 1000 * 60 * 5,
  });
};
