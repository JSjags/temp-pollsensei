// /payout/my-payout-banks?gateway=stripe

import {
  fetchStripePayoutBank,
  StripePayoutBank,
} from "@/services/api/getStripePayoutBanks";
import { useQuery } from "@tanstack/react-query";

export const useStripePayoutBanks = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ["stripe-banks"],
    queryFn: () => fetchStripePayoutBank({ page }),
    staleTime: 1000 * 60 * 5,
  });
};
