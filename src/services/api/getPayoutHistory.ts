import axiosInstance from "@/lib/axios-instance";

export const fetchPayoutHistory = async ({ page = 1}) => {
  try {
    const response = await axiosInstance.get("/payout/history", {
      params: {
        page,
        page_size: 20,
        // status,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching payout history:", error);
    throw error;
  }
};
