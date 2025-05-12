import axiosInstance from "@/lib/axios-instance";

export const fetchUserBalance = async () => {
  try {
    const response = await axiosInstance.get("/wallet/user-balance");
    return response.data;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    throw error;
  }
};

export const fetchServicesBalance = async () => {
  try {
    const response = await axiosInstance.get("/purchases/service/balance");
    return response.data
  } catch (error) {
    console.error("Error fetching user services balance:", error);
    throw error;
  }
};
