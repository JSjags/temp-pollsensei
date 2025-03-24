// services/pollcoinService.ts

import axiosInstance from "@/lib/axios-instance";


export const fetchDailyRate = async () => {
  const response = await axiosInstance.get("/purchases/pollcoins/daily-rate");
  console.log(response.data);
  
  return response.data;
};
