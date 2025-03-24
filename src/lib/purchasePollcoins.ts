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
