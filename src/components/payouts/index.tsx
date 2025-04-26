"use client";
import React from "react";
import { Analytics } from "./components/Analytics";
import { PayoutsHistoryTable } from "./components/table";
import { PayoutTransaction } from "./components/table/columns";

export function PayoutPage() {
  return (
    <>
      <Analytics />
      <div className="max-md:px-5 ">
        <PayoutsHistoryTable payoutData={[]} isHistoryLoading={false} />
      </div>
    </>
  );
}

function generateMockTransaction(id: number): PayoutTransaction {
  const now = new Date();
  const randomOffset = Math.floor(Math.random() * 100000000);
  const date = new Date(now.getTime() - randomOffset);

  return {
    _id: id.toString(),
    category: "some category",
    transactionId: id,
    date,
    details: [
      "Répartition des / du revenu(s)",
      "Report de solde",
      "Remise sur les frais de gestion",
      "Ajustement d'achat",
    ][Math.floor(Math.random() * 4)],
    status: ["Paid", "Pending"][Math.floor(Math.random() * 2)] as
      | "Paid"
      | "Pending",
    activity: ["Survey", "Ads"][Math.floor(Math.random() * 2)] as
      | "Survey"
      | "Ads",

    amount: Number((Math.random() * 1000).toFixed(2)),
  };
}

export const mockPayoutHistory: PayoutTransaction[] = Array.from(
  { length: 20 },
  (_, i) => generateMockTransaction(i + 1)
);
