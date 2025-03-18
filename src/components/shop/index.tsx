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
      <TransactionHistoryTable historyData={[]} isHistoryLoading={false} />
    </>
  );
}
