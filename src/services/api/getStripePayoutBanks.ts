import axiosInstance from "@/lib/axios-instance";

export type StripePayoutBank ={
  _id: string;
  account_name: string;
  account_number: string;
  stripe_account_id: string;
  country: string;
  sort_code: string;
  payout_method: "stripe";
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface StripePayoutBankResponse {
  success: boolean;
  message: string;
  data: {
    data: StripePayoutBank[];
    total?: number;
    page?: number;
    page_size?: number;
  };
}


export const fetchStripePayoutBank = async ({ page = 1 }) => {
  try {
    const response = await axiosInstance.get(
      "/payout/my-payout-banks?gateway=stripe",
      {
        params: {
          page,
          page_size: 20,
        },
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Stripe payout bank details:", error);
    throw error;
  }
};

