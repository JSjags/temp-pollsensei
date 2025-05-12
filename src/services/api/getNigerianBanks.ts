
import { Bank } from "@/components/payouts/queries/useNigerianBanks";
import axiosInstance from "@/lib/axios-instance";

export const fetchNigeriaBanks = async (): Promise<Bank[]> => {
  try {
    const response = await axiosInstance.get<Bank[]>("/payout/banks?currency=NGN");
    return response.data;
  } catch (error) {
    console.error("Error fetching Nigerian Banks:", error);
    throw error;
  }
};
