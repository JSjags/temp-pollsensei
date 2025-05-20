import axiosInstance from "@/lib/axios-instance";

export const fetchReferralStats = async () => {
  try {
    const response = await axiosInstance.get("/referral/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching daily rate:", error);
    throw error;
  }
};
