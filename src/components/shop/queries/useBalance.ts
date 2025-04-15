import {
  fetchServicesBalance,
  fetchUserBalance,
} from "@/services/api/getUserBalance";
import { useQuery } from "@tanstack/react-query";

export const useUserBalance = () => {
  return useQuery({
    queryKey: ["balance"],
    queryFn: fetchUserBalance,
    staleTime: 0,
  });
};

export const useUserServicesBalance = () => {
  return useQuery({
    queryKey: ["servicesbalance"],
    queryFn: fetchServicesBalance,
    staleTime: 1000 * 60 * 5,
  });
};
