import { create } from "zustand";

type DialogStep = "buy" | "checkout" | "success";

type ShopState = {
  aiAmount: string;
  pollAmount: string;
  pollcoins: string;
  credits: string;
  aiErrors: {
    amount?: string;
    quantity?: string;
  };
  pollErrors: {
    amount?: string;
    quantity?: string;
  };
  loading: boolean;
  pollstep: DialogStep;
  aiStep: DialogStep;
  pollDialogOpen: boolean;
  aiDialogOpen: boolean;
  setAIDialogOpen: (open: boolean) => void;
  setPollDialogOpen: (open: boolean) => void;
  setAIStep: (step: DialogStep) => void;
  setPollStep: (step: DialogStep) => void;
  setAiAmount: (value: string) => void;
  setPollAmount: (value: string) => void;
  setCredits: (value: string) => void;
  setPollcoins: (value: string) => void;
  setAiErrors: (errors: { amount?: string; quantity?: string }) => void;
  setPollErrors: (errors: { amount?: string; quantity?: string }) => void;
  clearAiError: (field: "amount" | "quantity") => void;
  clearPollError: (field: "amount" | "quantity") => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useShopStore = create<ShopState>((set) => ({
  aiAmount: "",
  pollAmount: "",
  credits: "",
  pollcoins: "",
  aiErrors: {},
  pollErrors: {},
  loading: false,
  aiStep: "buy",
  pollstep: "buy",
  aiDialogOpen: false,
  pollDialogOpen: false,

  setAIDialogOpen: (open) => set({ aiDialogOpen: open }),
  setPollDialogOpen: (open) => set({ pollDialogOpen: open }),
  setAIStep: (step) => set({ aiStep: step }),
  setPollStep: (step) => set({ pollstep: step }),

  setAiAmount: (value) => set({ aiAmount: value }),
  setPollAmount: (value) => set({ pollAmount: value }),
  setCredits: (value) => set({ credits: value }),
  setPollcoins: (value) => set({ pollcoins: value }),

  setAiErrors: (errors) => set({ aiErrors: errors }),
  setPollErrors: (errors) => set({ pollErrors: errors }),
  clearAiError: (field) =>
    set((state) => ({
      aiErrors: { ...state.aiErrors, [field]: undefined },
    })),
  clearPollError: (field) =>
    set((state) => ({
      pollErrors: { ...state.pollErrors, [field]: undefined },
    })),

  setLoading: (loading) => set({ loading }),

  reset: () =>
    set({
      aiAmount: "",
      pollAmount: "",
      credits: "",
      pollcoins: "",
      aiErrors: {},
      pollErrors: {},
      loading: false,
      aiStep: "buy",
      pollstep: "buy",
    }),
}));
