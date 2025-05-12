import { fetchPayoutHistory } from "@/services/api/getPayoutHistory";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PayoutStatus } from "../components/table/columns";

// Define allowed status values

export const usePayoutHistory = ({
  page = 1,
  // status = "paid",
}: {
  page: number;
  // status?: PayoutStatus;
}) => {
  return useQuery({
    queryKey: ["payout-history", page],
    queryFn: () => fetchPayoutHistory({ page }),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
};
