// stores/useOnboardingStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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

export type SummaryMethod = "ai" | "manual" | null;

export interface StoredReportDraft {
  reportId: string;
  title: string;
  description: string;
  category: string;
  interests: string[];
  thumbnailUrl?: string | null;
  body: string;
  summaryMethod: SummaryMethod;
  summaryContent: string;
  lastSavedAt?: number;
}

const emptyDraft = (reportId: string): StoredReportDraft => ({
  reportId,
  title: "",
  description: "",
  category: "",
  interests: [],
  thumbnailUrl: null,
  body: "",
  summaryMethod: null,
  summaryContent: "",
});

interface ReportDraftStore {
  drafts: Record<string, StoredReportDraft>;
  activeReportId: string | null;

  setActiveReportId: (reportId: string | null) => void;
  upsertDraft: (reportId: string, partial: Partial<StoredReportDraft>) => void;
  getDraft: (reportId: string) => StoredReportDraft | undefined;
  resetDraft: (reportId: string) => void;
  deleteDraft: (reportId: string) => void;

  summaryMethod: SummaryMethod;
  summaryContent: string;
  body: string;
  setSummaryMethod: (method: "ai" | "manual") => void;
  setSummaryContent: (content: string) => void;
  setBody: (body: string) => void;
  reset: () => void;
}

export const useReportDraftStore = create<ReportDraftStore>()(
  persist(
    (set, get) => ({
      drafts: {},
      activeReportId: null,
      setActiveReportId: (reportId) =>
        set((state) => {
          const nextId = reportId ?? null;
          const active = nextId ? state.drafts[nextId] : undefined;
          return {
            activeReportId: nextId,
            summaryMethod: active?.summaryMethod ?? null,
            summaryContent: active?.summaryContent ?? "",
            body: active?.body ?? "",
          };
        }),
      upsertDraft: (reportId, partial) =>
        set((state) => {
          const prev = state.drafts[reportId] ?? emptyDraft(reportId);
          const next: StoredReportDraft = {
            ...prev,
            ...partial,
            reportId,
            lastSavedAt: Date.now(),
          };
          return {
            drafts: { ...state.drafts, [reportId]: next },
            ...(state.activeReportId === reportId
              ? {
                  summaryMethod: next.summaryMethod,
                  summaryContent: next.summaryContent,
                  body: next.body,
                }
              : null),
          };
        }),
      getDraft: (reportId) => get().drafts[reportId],
      resetDraft: (reportId) =>
        set((state) => {
          const next = emptyDraft(reportId);
          const isActive = state.activeReportId === reportId;
          return {
            drafts: { ...state.drafts, [reportId]: next },
            ...(isActive
              ? { summaryMethod: null, summaryContent: "", body: "" }
              : null),
          };
        }),
      deleteDraft: (reportId) =>
        set((state) => {
          const { [reportId]: _, ...rest } = state.drafts;
          const isActive = state.activeReportId === reportId;
          return {
            drafts: rest,
            ...(isActive
              ? {
                  activeReportId: null,
                  summaryMethod: null,
                  summaryContent: "",
                  body: "",
                }
              : null),
          };
        }),
      summaryMethod: null,
      summaryContent: "",
      body: "",
      setSummaryMethod: (method) => {
        const { activeReportId } = get();
        if (activeReportId) get().upsertDraft(activeReportId, { summaryMethod: method });
        set({ summaryMethod: method });
      },
      setSummaryContent: (content) => {
        const { activeReportId } = get();
        if (activeReportId) get().upsertDraft(activeReportId, { summaryContent: content });
        set({ summaryContent: content });
      },
      setBody: (body) => {
        const { activeReportId } = get();
        if (activeReportId) get().upsertDraft(activeReportId, { body });
        set({ body });
      },
      reset: () => {
        const { activeReportId } = get();
        if (activeReportId) get().resetDraft(activeReportId);
        else set({ summaryMethod: null, summaryContent: "", body: "" });
      },
    }),
    {
      name: "report-drafts-store-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, version) => {
        if (version < 2 && persisted) {
          const legacy = persisted as any;
          const legacyDraft = {
            ...emptyDraft("__legacy__"),
            summaryMethod: legacy.summaryMethod ?? null,
            summaryContent: legacy.summaryContent ?? "",
            body: legacy.body ?? "",
          };
          return {
            drafts: { __legacy__: legacyDraft },
            activeReportId: null,
            summaryMethod: legacy.summaryMethod ?? null,
            summaryContent: legacy.summaryContent ?? "",
            body: legacy.body ?? "",
          };
        }
        return persisted;
      },
    }
  )
);
