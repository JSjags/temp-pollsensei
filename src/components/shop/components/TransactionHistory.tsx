import { TransactionHistory } from "../types";

function generateMockTransaction(id: number): TransactionHistory {
  const now = new Date();
  const randomOffset = Math.floor(Math.random() * 100000000);
  const date = new Date(now.getTime() - randomOffset);

  return {
    transactionId: id,
    date,
    timestamp: date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    type: Math.random() > 0.5 ? "Credit" : "Debit",
    status: ["Completed", "Pending", "Failed"][
      Math.floor(Math.random() * 3)
    ] as "Completed" | "Pending" | "Failed",
    activity: ["Referral Bonus", "Withdrawal", "NFT Purchase", "Reward"][
      Math.floor(Math.random() * 4)
    ],
    amount: Number((Math.random() * 1000).toFixed(2)),
  };
}

export const mockTransactionHistory: TransactionHistory[] = Array.from(
  { length: 20 },
  (_, i) => generateMockTransaction(i + 1)
);
