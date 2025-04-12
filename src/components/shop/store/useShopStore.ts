import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { PollcoinOrderSummaryResponse } from "../types";

export type DialogStep = "buy" | "checkout" | "success";

type ShopState = {
  aiAmount: string;
  pollAmount: string;
  pollcoins: string;
  credits: string;
  ocrCredits: string;
  totalPollcoins: string;
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
  ocrStep:DialogStep;
  pollDialogOpen: boolean;
  aiDialogOpen: boolean;
  servicesStep: DialogStep;
  ocrDialogOpen: boolean;
  orderSummary: PollcoinOrderSummaryResponse["data"]["orderSummary"] | null;
  ocrAmount: string;
  setOCRAmount: (value: string) => void;
  setAIDialogOpen: (open: boolean) => void;
  setPollDialogOpen: (open: boolean) => void;
  setOCRDialogOpen: (open: boolean) => void;
  setAIStep: (step: DialogStep) => void;
  setOCRStep: (step: DialogStep) => void;
  setServicesStep: (step: DialogStep) => void;
  setPollStep: (step: DialogStep) => void;
  setAiAmount: (value: string) => void;
  setPollAmount: (value: string) => void;
  setCredits: (value: string) => void;
  setOCRCredits: (value: string) => void;
  setPollcoins: (value: string) => void;
  setOrderSummary: (summary: PollcoinOrderSummaryResponse["data"]["orderSummary"]) => void;
  setTotalPollcoins: (value: string) => void;
  addPollcoinsToTotal: (amount: string) => void;
  setAiErrors: (errors: { amount?: string; quantity?: string }) => void;
  setPollErrors: (errors: { amount?: string; quantity?: string }) => void;
  clearAiError: (field: "amount" | "quantity") => void;
  clearPollError: (field: "amount" | "quantity") => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};


type ShopPersist = {
  totalPollcoins: string;
};


const persistOptions: PersistOptions<ShopState, ShopPersist> = {
  name: "shop-store",
  partialize: (state) => ({
    totalPollcoins: state.totalPollcoins, 
  }),
};


export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      aiAmount: "",
      pollAmount: "",
      credits: "",
      ocrCredits: "",
      pollcoins: "",
      totalPollcoins: "0", 
      aiErrors: {},
      pollErrors: {},
      loading: false,
      aiStep: "buy",
      pollstep: "buy",
      ocrStep: "buy",
      aiDialogOpen: false,
      pollDialogOpen: false,
      ocrDialogOpen: false,
      orderSummary: null,
      servicesStep: "buy",
      ocrAmount: "",

  
      setOCRAmount: (value) => set({ ocrAmount: value }),
      setAIDialogOpen: (open) => set({ aiDialogOpen: open }),
      setPollDialogOpen: (open) => set({ pollDialogOpen: open }),
      setOCRDialogOpen: (open) => set({ ocrDialogOpen: open }),
      setAIStep: (step) => set({ aiStep: step }),
      setOCRStep: (step) => set({ ocrStep: step }),
      setPollStep: (step) => set({ pollstep: step }),
      setServicesStep: (step) => set({ servicesStep: step }),

      setAiAmount: (value) => set({ aiAmount: value }),
      setPollAmount: (value) => set({ pollAmount: value }),
      setCredits: (value) => set({ credits: value }),
      setOCRCredits: (value) => set({ ocrCredits: value }),
      setPollcoins: (value) => set({ pollcoins: value }),
      setOrderSummary: (summary) => set({ orderSummary: summary }),
      setTotalPollcoins: (value) => set({ totalPollcoins: value }),


      addPollcoinsToTotal: (amount) => {
        const current = parseInt(get().totalPollcoins) || 0;
        const amountToAdd = parseInt(amount) || 0;
        set({ totalPollcoins: (current + amountToAdd).toString() });
      },

      setAiErrors: (errors) => set({ aiErrors: errors }),
      setPollErrors: (errors) => set({ pollErrors: errors }),
      clearAiError: (field) => set((state) => ({
        aiErrors: { ...state.aiErrors, [field]: undefined },
      })),
      clearPollError: (field) => set((state) => ({
        pollErrors: { ...state.pollErrors, [field]: undefined },
      })),


      setLoading: (loading) => set({ loading }),


      reset: () => set({
        aiAmount: "",
        pollAmount: "",
        credits: "",
        pollcoins: "",
        aiErrors: {},
        pollErrors: {},
        loading: false,
        aiStep: "buy",
        pollstep: "buy",
        servicesStep: "buy",
      }),
    }),
    persistOptions
  )
);




