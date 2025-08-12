import rawAxiosInstance from "@/lib/rawAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface RequestPayoutOtpPayload {
  transfer_code: string;
}

interface RequestPayoutOtpResponse {
  success: boolean;
  message: string;
  data?: {
    status: boolean;
    message: string;
  };
}

export const useRequestPayoutOtp = () => {
  return useMutation<RequestPayoutOtpResponse, Error, RequestPayoutOtpPayload>({
    mutationFn: async (payload) => {
      const response = await rawAxiosInstance.post(
        "/superadmin/request-payout-otp",
        payload
      );
      
      return response.data;
    },
    onSuccess: (responseData) => {
      toast.success(responseData.message || "OTP sent successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request OTP");
    },
  });
};