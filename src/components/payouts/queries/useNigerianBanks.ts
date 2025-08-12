import { fetchNigeriaBanks } from "@/services/api/getNigerianBanks";
import { useQuery } from "@tanstack/react-query";

export type Bank = {
  bank_code: string;
  bank_name: string;
  country: string;
  currency: string;
  is_active: boolean;
};

export const useNigerianBanks = () => {
  return useQuery<Bank[]>({
    queryKey: ["nigerian-banks"],
    queryFn: fetchNigeriaBanks,
    staleTime: 1000 * 60 * 5,
  });
};

