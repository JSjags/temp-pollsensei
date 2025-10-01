import axiosInstance from "@/lib/axios-instance";

export const fetchPayoutConverionRate = async () => {
    try {
      const response = await axiosInstance.get("/payout/conversion-rate");
      return response.data
    } catch (error) {
      console.error("Error fetching payout conversion rate:", error);
      throw error;
    }
  };
  