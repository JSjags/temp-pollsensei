import axiosInstance from "@/lib/axios-instance";

export const fetchPreviousPayoutBank = async () => {
  try {
    const response = await axiosInstance.get("/payout/my-payout-banks");

    return response.data;
  } catch (error) {
    console.error("Error fetching voice rate:", error);
    throw error;
  }
};
