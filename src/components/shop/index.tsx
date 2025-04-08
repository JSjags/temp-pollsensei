import React from "react";
import { Analytics } from "./components/Analytics";
import { InAppPurchases } from "./components/InAppPurchases";
import { mockTransactionHistory } from "./components/TransactionHistory";
import { TransactionHistoryTable } from "./components/table";

export default function Shop() {
  return (
    <>
      <Analytics />
      <InAppPurchases />
      <div className="max-md:px-4">
        <TransactionHistoryTable historyData={[]} isHistoryLoading={false} />
      </div>
    </>
  );
}
