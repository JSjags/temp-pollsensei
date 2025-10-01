import axiosInstance from "@/lib/axios-instance";

export type OtpPayout = {
  _id: string;
  transaction_id: string;
  status: otpPayoutStatus;
  amount: number;
  transfer_code: string;
  gateway: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type otpPayoutStatus = "otp" | "completed" | "failed"| 'paid'|'abandoned'| 'pending';
export type OtpPayoutResponse = {
  success: boolean;
  message: string;
  data: {
    data: OtpPayout[];
    total?: number;
    page?: number;
    page_size?: number;
  };
};

export const fetchPendingPayouts = async ({ page = 1 }) => {
  try {
    const response = await axiosInstance.get(
      "/superadmin/paystack-otp-payouts",
      {
        params: {
          page,
          page_size: 20,
        },
      }
    );
    console.log(response.data, 'Response')
    return response.data;
  } catch (error) {
    console.error("Error fetching payout history:", error);
    throw error;
  }
};
