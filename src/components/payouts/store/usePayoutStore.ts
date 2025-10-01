import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  nonRedeemableCoins: number;
  coinsRedeemed: number;
  threshold: number;
  selectedOption: string | null;
  wasRedirected: boolean;
  gateway: string | null,
  setWasRedirected: (value: boolean) => void;
  setGateway: (option: string | null) => void;
  setAnalytics: (
    data: Partial<
      Pick<
        PayoutState,
        | "overallEarnings"
        | "coinsObtained"
        | "redeemableCoins"
        | "coinsRedeemed"
        | "nonRedeemableCoins"
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
  setSelectedOption: (option: string | null) => void;
  reset: () => void;
};

export const usePayoutStore = create<PayoutState>()(
  persist(
    (set) => ({
      coinAmount: "",
      coinQuantity: "",
      errors: {},
      loading: false,
      step: "buy",
      dialogOpen: false,
      overallEarnings: 0,
      coinsObtained: 0,
      redeemableCoins: 5000,
      nonRedeemableCoins: 0,
      coinsRedeemed: 0,
      threshold: 1000,
      selectedOption: "Paystack",
      wasRedirected: false,
      gateway: '',

      setWasRedirected: (value) => set({ wasRedirected: value }),
      setGateway: (gateway) => set({ gateway }),
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
      setSelectedOption: (option) => set({ selectedOption: option }),
      setAnalytics: (data) => set(data),
      reset: () =>
        set({
          coinAmount: "",
          coinQuantity: "",
          errors: {},
          loading: false,
          step: "buy",
          dialogOpen: false,
          selectedOption: "Card",
        }),
    }),
    {
      name: "payout-store",
      partialize: (state) => ({
        coinAmount: state.coinAmount,
        coinQuantity: state.coinQuantity,
        step: state.step,
        selectedOption: state.selectedOption,
      }),
    }
  )
);
