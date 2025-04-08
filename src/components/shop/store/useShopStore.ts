import { create } from "zustand";

type DialogStep = "buy" | "checkout" | "success";

type ShopState = {
  aiAmount: string;
  pollAmount: string;
  pollcoins: string;
  credits: string;
  totalPollcoins: string; // Added missing type
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
  setTotalPollcoins: (value: string) => void; // Added missing function
  addPollcoinsToTotal: (amount: string) => void; // Added missing function
  setAiErrors: (errors: { amount?: string; quantity?: string }) => void;
  setPollErrors: (errors: { amount?: string; quantity?: string }) => void;
  clearAiError: (field: "amount" | "quantity") => void;
  clearPollError: (field: "amount" | "quantity") => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};
export const useShopStore = create<ShopState>((set, get) => ({
  aiAmount: "",
  pollAmount: "",
  credits: "",
  pollcoins: "", // This is for the input/current transaction
  totalPollcoins: "0", // New state for tracking total owned pollcoins
  aiErrors: {},
  pollErrors: {},
  loading: false,
  aiStep: "buy",
  pollstep: "buy",
  aiDialogOpen: false,
  pollDialogOpen: false,

  // Existing setters
  setAIDialogOpen: (open) => set({ aiDialogOpen: open }),
  setPollDialogOpen: (open) => set({ pollDialogOpen: open }),
  setAIStep: (step) => set({ aiStep: step }),
  setPollStep: (step) => set({ pollstep: step }),

  setAiAmount: (value) => set({ aiAmount: value }),
  setPollAmount: (value) => set({ pollAmount: value }),
  setCredits: (value) => set({ credits: value }),
  setPollcoins: (value) => set({ pollcoins: value }),
  
  // New setter for total pollcoins
  setTotalPollcoins: (value) => set({ totalPollcoins: value }),
  
  // New function to add pollcoins to total
  addPollcoinsToTotal: (amount) => {
    const current = parseInt(get().totalPollcoins) || 0;
    const amountToAdd = parseInt(amount) || 0;
    set({ totalPollcoins: (current + amountToAdd).toString() });
  },

  // Existing error handlers
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

  // Modified reset to preserve totalPollcoins
  reset: () =>
    set((state) => ({
      aiAmount: "",
      pollAmount: "",
      credits: "",
      pollcoins: "",
      aiErrors: {},
      pollErrors: {},
      loading: false,
      aiStep: "buy",
      pollstep: "buy",
      // totalPollcoins is NOT reset here
    })),
}));
// export const useShopStore = create<ShopState>((set) => ({
//   aiAmount: "",
//   pollAmount: "",
//   credits: "",
//   pollcoins: "",
//   aiErrors: {},
//   pollErrors: {},
//   loading: false,
//   aiStep: "buy",
//   pollstep: "buy",
//   aiDialogOpen: false,
//   pollDialogOpen: false,

//   setAIDialogOpen: (open) => set({ aiDialogOpen: open }),
//   setPollDialogOpen: (open) => set({ pollDialogOpen: open }),
//   setAIStep: (step) => set({ aiStep: step }),
//   setPollStep: (step) => set({ pollstep: step }),

//   setAiAmount: (value) => set({ aiAmount: value }),
//   setPollAmount: (value) => set({ pollAmount: value }),
//   setCredits: (value) => set({ credits: value }),
//   setPollcoins: (value) => set({ pollcoins: value }),

//   setAiErrors: (errors) => set({ aiErrors: errors }),
//   setPollErrors: (errors) => set({ pollErrors: errors }),
//   clearAiError: (field) =>
//     set((state) => ({
//       aiErrors: { ...state.aiErrors, [field]: undefined },
//     })),
//   clearPollError: (field) =>
//     set((state) => ({
//       pollErrors: { ...state.pollErrors, [field]: undefined },
//     })),

//   setLoading: (loading) => set({ loading }),

//   reset: () =>
//     set({
//       aiAmount: "",
//       pollAmount: "",
//       credits: "",
//       // pollcoins: "",
//       aiErrors: {},
//       pollErrors: {},
//       loading: false,
//       aiStep: "buy",
//       pollstep: "buy",
//     }),
// }));

