import { fetchUserBalance } from "@/services/api/getUserBalance";
import { useQuery } from "@tanstack/react-query";

export const useUserBalance = () => {
  return useQuery({
    queryKey: ["balance"],
    queryFn: fetchUserBalance,
    staleTime: 1000 * 60 * 5,
  });
};
