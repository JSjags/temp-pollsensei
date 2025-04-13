import axiosInstance from "@/lib/axios-instance";
import rawAxiosInstance from "@/lib/rawAxiosInstance";

export const fetchUserBalance = async () => {
  try {
    const response = await rawAxiosInstance.get("/wallet/user-balance");
    return response.data;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    throw error;
  }
};

export const fetchServicesBalance = async () => {
  try {
    const response = await rawAxiosInstance.get("purchases/service/balance");
    return response.data
  } catch (error) {
    console.error("Error fetching user services balance:", error);
    throw error;
  }
};
