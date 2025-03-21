import { create } from "zustand";

type DialogStep = "buy" | "checkout" | "success";

type ShopState = {
  coinAmount: string;
  coinQuantity: string;
  errors: {
    amount?: string;
    quantity?: string;
  };
  loading: boolean;
  step: DialogStep;
  dialogOpen: boolean;

  setDialogOpen: (open: boolean) => void;
  setStep: (step: DialogStep) => void;
  setCoinAmount: (value: string) => void;
  setCoinQuantity: (value: string) => void;
  setErrors: (errors: { amount?: string; quantity?: string }) => void;
  clearError: (field: "amount" | "quantity") => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const usePayoutStore = create<ShopState>((set) => ({
  coinAmount: "",
  coinQuantity: "",
  errors: {},
  loading: false,
  step: "buy",
  dialogOpen: false,

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
