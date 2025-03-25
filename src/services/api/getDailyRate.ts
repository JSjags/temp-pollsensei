import axiosInstance from "@/lib/axios-instance";

export const fetchDailyRate = async () => {
  try {
    const response = await axiosInstance.get("/purchases/pollcoins/daily-rate");
    return response.data;
  } catch (error) {
    console.error("Error fetching daily rate:", error);
    throw error; // or handle it as appropriate for your use case
  }
};
