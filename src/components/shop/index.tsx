import React, { useState } from "react";
import { Analytics } from "./components/Analytics";
import { InAppPurchases } from "./components/InAppPurchases";
import { TransactionHistoryTable } from "./components/table";
import { useShopTransactionsHistory } from "./queries/useShopTransactions";

export default function Shop() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useShopTransactionsHistory({ page });
  const paginationData = data?.pagination;
  
  return (
    <>
      <Analytics />
      <InAppPurchases />
      <div className="max-md:px-4">
        <TransactionHistoryTable
          historyData={data?.transactions || []}
          isHistoryLoading={isLoading}
          pagination={
            paginationData && {
              page: paginationData.page,
              totalPages: paginationData.pages,
              setPage,
            }
          }
        />
      </div>
    </>
  );
}
