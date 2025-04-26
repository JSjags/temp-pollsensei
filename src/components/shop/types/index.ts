export type HistoryType = "debit" | "credit";
export type HistoryStatus = "Completed" | "Pending" | "Failed";

export type TransactionHistory = {
  _id: string;
  transactionId: string;
  date: Date;
  timestamp: number; 
  type: HistoryType;
  status: HistoryStatus;
  category: string;
  amount: number;
  details?: {
    description?: string;
  };
};
// export type TransactionHistory = {
//   _id: string;
//   amount: number;
//   category: string;
//   date?: string;
//   timestamp?: number;
//   status: string;
//   transactionId: string;
//   type: "credit" | "debit";
//   details?: {
//     description?: string;
//   };
// };


export type OrderSummaryPayload = {
  currency: "NGN" | "USD";
  amount: number;
  pollcoins: number;
};

export type PollcoinOrderSummaryResponse = {
  success: boolean;
  data: {
    orderSummary: {
      userId: string;
      pollcoinsAmount: number;
      unitPrice: number;
      baseAmount: number;
      bonusCoins: number;
      vat: number;
      transactionFee: number;
      totalAmount: number;
      status: string;
      referenceId: string;
      _id: string;
      createdAt: string;
      updatedAt: string;
      expiresAt: string;
      __v: number;
    };
    breakdown: {
      unitPrice: string;
      baseAmount: string;
      pollcoins: string;
      bonusCoins: string;
      vat: string;
      transactionFee: string;
      total: string;
    };
  };
};
