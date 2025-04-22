import axiosInstance from "@/lib/axios-instance";

export const fetchShopTransactions = async ({ page = 1 }) => {
  try {
    const response = await axiosInstance.get("/audit/shop-transactions/history", {
      params: { page },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

