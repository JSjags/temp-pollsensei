export type HistoryType = "Debit" | "Credit";
export type HistoryStatus = "Completed" | "Pending" | "Failed";

export type TransactionHistory = {
  transactionId: number;
  date: Date;
  timestamp: string; 
  type: HistoryType;
  status: HistoryStatus;
  activity: string;
  amount: number;
};
