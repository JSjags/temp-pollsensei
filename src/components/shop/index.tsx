import React from "react";
import { Analytics } from "./components/Analytics";
import { InAppPurchases } from "./components/InAppPurchases";
import { TransactionHistoryTab } from "./components/TransactionHistory";

export default function Shop() {
  return (
    <div className="w-full">
      <Analytics />
      <InAppPurchases />
      <TransactionHistoryTab />
    </div>
  );
}
