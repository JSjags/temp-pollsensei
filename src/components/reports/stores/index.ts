// stores/useOnboardingStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Step, stepOrder } from "../types";

interface OnboardingState {
  step: Step;
  setStep: (step: Step) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  selectedCategories: string[];
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleInterest: (interestId: string) => void;

  toggleCategory: (categoryId: string) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      step: "category",
      setStep: (step) => set({ step }),
      nextStep: () => {
        const currentIndex = stepOrder.indexOf(get().step);
        const next = stepOrder[currentIndex + 1] || "finish";
        set({ step: next });
      },
      prevStep: () => {
        const currentIndex = stepOrder.indexOf(get().step);
        const prev = stepOrder[currentIndex - 1] || "category";
        set({ step: prev });
      },
      reset: () =>
        set({
          step: "category",
          selectedCategories: [],
        }),

      selectedCategories: [],
      selectedInterests: [],
      setSelectedInterests: (interests) =>
        set({ selectedInterests: interests }),
      toggleInterest: (interestId) => {
        const current = get().selectedInterests;
        const isSelected = current.includes(interestId);

        // Allow deselecting anytime
        if (isSelected) {
          set({ selectedInterests: current.filter((id) => id !== interestId) });
        } else {
          // Only allow adding if under the limit
          if (current.length < 10) {
            set({ selectedInterests: [...current, interestId] });
          }
        }
      },

      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),
      toggleCategory: (categoryId) => {
        const current = get().selectedCategories;
        const updated = current.includes(categoryId)
          ? current.filter((id) => id !== categoryId)
          : [...current, categoryId];
        set({ selectedCategories: updated });
      },
    }),
    {
      name: "onboarding-step",
    }
  )
);


interface ReportDraftState {
  summaryMethod: "ai" | "manual" | null;
  summaryContent: string;
  setSummaryMethod: (method: "ai" | "manual") => void;
  setSummaryContent: (content: string) => void;

  // For autosave
  body: string;
  setBody: (body: string) => void;

  reset: () => void;
}

export const useReportDraftStore = create<ReportDraftState>()(
  persist(
    (set) => ({
      summaryMethod: null,
      summaryContent: "",
      body: "",

      setSummaryMethod: (method) => set({ summaryMethod: method }),
      setSummaryContent: (content) => set({ summaryContent: content }),
      setBody: (body) => set({ body }),

      reset: () => set({ summaryMethod: null, summaryContent: "", body: "" }),
    }),
    {
      name: "report-draft-store", // key in localStorage
    }
  )
);
