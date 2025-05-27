import axiosInstance from "@/lib/axios-instance";

export const fetchPreviousPayoutBank = async () => {
  try {
    const response = await axiosInstance.get("/payout/my-payout-banks?gateway=paystack");

    return response.data;
  } catch (error) {
    console.error("Error fetching previous payout banks:", error);
    throw error;
  }
};
