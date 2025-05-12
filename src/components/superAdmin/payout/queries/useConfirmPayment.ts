import rawAxiosInstance from "@/lib/rawAxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface ConfirmPayoutOtpPayload {
  transfer_code: string;
  otp: string;
}

interface ConfirmPayoutOtpResponse {
  success: boolean;
  status: number;
  message: string;
}

export const useConfirmPayout = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ConfirmPayoutOtpResponse,
    AxiosError,
    ConfirmPayoutOtpPayload
  >({
    mutationFn: async (payload) => {
      const response = await rawAxiosInstance.post(
        "/superadmin/finalize-payout",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Payment completed successfully");
        queryClient.invalidateQueries({
          queryKey: ["pending-paystack-payouts"],
        });
      }
    },
    onError: (error) => {
      const backendMessage = (error.response?.data as { message?: string })
        ?.message;
      const message =
        backendMessage || error.message || "Failed to confirm payout";

      console.log(error, "super admin error");
      toast.error(message);
    },
  });
};
