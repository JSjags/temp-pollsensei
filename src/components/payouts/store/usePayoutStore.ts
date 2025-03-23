import { create } from "zustand";

type DialogStep = "buy" | "checkout" | "success";

type PayoutState = {
  coinAmount: string;
  coinQuantity: string;
  errors: {
    amount?: string;
    quantity?: string;
  };
  loading: boolean;
  step: DialogStep;
  dialogOpen: boolean;
  overallEarnings: number;
  coinsObtained: number;
  redeemableCoins: number;
  coinsRedeemed: number;
  threshold: number
  setAnalytics: (
    data: Partial<
      Pick<
        PayoutState,
        | "overallEarnings"
        | "coinsObtained"
        | "redeemableCoins"
        | "coinsRedeemed"
      >
    >
  ) => void;
  setDialogOpen: (open: boolean) => void;
  setStep: (step: DialogStep) => void;
  setCoinAmount: (value: string) => void;
  setCoinQuantity: (value: string) => void;
  setErrors: (errors: { amount?: string; quantity?: string }) => void;
  clearError: (field: "amount" | "quantity") => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const usePayoutStore = create<PayoutState>((set) => ({
  coinAmount: "",
  coinQuantity: "",
  errors: {},
  loading: false,
  step: "buy",
  dialogOpen: false,
  overallEarnings: 0,
  coinsObtained: 0,
  redeemableCoins: 5000,
  coinsRedeemed: 0,
  threshold:1000,


  setDialogOpen: (open) => set({ dialogOpen: open }),
  setStep: (step) => set({ step }),

  setCoinAmount: (value) => set({ coinAmount: value }),
  setCoinQuantity: (value) => set({ coinQuantity: value }),

  setErrors: (errors) => set({ errors }),

  clearError: (field) =>
    set((state) => ({
      errors: { ...state.errors, [field]: undefined },
    })),

  setLoading: (loading) => set({ loading }),
  setAnalytics: (data) => set(data),
  reset: () =>
    set({
      coinAmount: "",
      coinQuantity: "",
      errors: {},
      loading: false,
      step: "buy",
      dialogOpen: false,
    }),
}));
