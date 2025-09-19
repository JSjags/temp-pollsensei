import axiosInstance from "@/lib/axios-instance";

export interface Country {
  _id: string;
  name: string;
}

export interface Region {
  _id: string;
  name: string;
}

export interface UserPollcoinBundle {
  _id: string;
  name: string;
  amount: number; // pollcoin amount
  price: number; // cost of pollcoin
  discount_type: string; // none | percentage | bonus
  percentage?: number; // if discount_type is percentage this is required
  bonus?: number; // if discount_type is bonus this is required
  region: Region;
  countries_to_exempt: Country[];
  countries_to_include: Country[];
  tag: string; // early bird, popular, etc.
  currency: string; // USD | NGN
  status: string; // published | unpublished
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserBundlesResponse {
  success: boolean;
  message: string;
  data: UserPollcoinBundle[];
  total: number;
  page: number;
  page_size: number;
}

export const fetchUserBundles = async (params?: {
  page?: number;
  page_size?: number;
  currency?: string;
  region?: string;
}): Promise<UserBundlesResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params?.currency && params.currency !== "all")
      queryParams.append("currency", params.currency);
    if (params?.region && params.region !== "all")
      queryParams.append("region", params.region);

    const response = await axiosInstance.get(
      `/pricing/pollcoin/bundles?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching user bundles:", error);
    throw error;
  }
};
