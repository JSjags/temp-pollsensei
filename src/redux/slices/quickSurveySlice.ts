import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogState {
  showQuickSurveyFlow: boolean;
  currentDialog:
    | "initial"
    | "form"
    | "purchase"
    | "confirm"
    | "congratulations"
    | null;
  selectedRespondentsNumber: number;
  quickSurveyId: string | null;
  surveyId: string | null;
  formData: {
    surveyTopic: string;
    respondentsNumber: number;
    duration: string;
    conditions: {
      durationElapsed: boolean;
      respondentsNumberMet: boolean;
    };
  };
  allowFilterRespondentsAccess: boolean;
  filterBy: string | null;
  quickSurveyQualifyingTemplateId: string | null;
  quickSurveyScreenerId: string | null;
}

const initialState: DialogState = {
  showQuickSurveyFlow: false,
  currentDialog: null,
  selectedRespondentsNumber: 0,
  quickSurveyId: null,
  surveyId: null,
  formData: {
    surveyTopic: "",
    respondentsNumber: 0,
    duration: "",
    conditions: {
      durationElapsed: false,
      respondentsNumberMet: true, // Default to true
    },
  },
  allowFilterRespondentsAccess: false,
  filterBy: null,
  quickSurveyQualifyingTemplateId: null,
  quickSurveyScreenerId: null,
};

const quickSurveySlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    // Start the quick survey flow - show the initial dialog
    startQuickSurveyFlow: (state) => {
      state.showQuickSurveyFlow = true;
      state.currentDialog = "initial";
    },

    // Navigate between dialogs
    setCurrentDialog: (
      state,
      action: PayloadAction<
        "initial" | "form" | "purchase" | "confirm" | "congratulations" | null
      >
    ) => {
      state.currentDialog = action.payload;
    },

    // Close the entire flow
    closeQuickSurveyFlow: (state) => {
      state.showQuickSurveyFlow = false;
      state.currentDialog = null;
    },

    // Proceed from initial to form dialog
    proceedToForm: (state) => {
      state.currentDialog = "form";
    },

    // Proceed from form to purchase dialog
    proceedToPurchase: (state) => {
      state.currentDialog = "purchase";
    },

    // Proceed from purchase to confirm dialog
    proceedToConfirm: (state) => {
      state.currentDialog = "confirm";
    },

    proceedToCongratulations: (state) => {
      state.currentDialog = "congratulations";
    },

    setQuickSurveyId: (state, action: PayloadAction<string | null>) => {
      state.quickSurveyId = action.payload;
    },

    setSurveyId: (state, action: PayloadAction<string | null>) => {
      state.surveyId = action.payload;
    },
    setSelectedRespondentsNumber: (state, action: PayloadAction<number>) => {
      state.selectedRespondentsNumber = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<{
        surveyTopic: string;
        respondentsNumber: number;
        duration: string;
        conditions: {
          durationElapsed: boolean;
          respondentsNumberMet: boolean;
        };
      }>
    ) => {
      state.formData = action.payload;
    },
    setDuration: (state, action: PayloadAction<string>) => {
      state.formData.duration = action.payload;
    },
    setConditions: (
      state,
      action: PayloadAction<{
        durationElapsed: boolean;
        respondentsNumberMet: boolean;
      }>
    ) => {
      state.formData.conditions = action.payload;
    },
    setAllowFilterRespondentsAccess: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.allowFilterRespondentsAccess = action.payload;
    },
    setFilterBy: (state, action: PayloadAction<string | null>) => {
      state.filterBy = action.payload;
    },
    setQuickSurveyQualifyingTemplateId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.quickSurveyQualifyingTemplateId = action.payload;
    },
    setQuickSurveyScreenerId: (state, action: PayloadAction<string | null>) => {
      state.quickSurveyScreenerId = action.payload;
    },
    resetDialogState: (state) => {
      state.showQuickSurveyFlow = false;
      state.currentDialog = null;
      state.selectedRespondentsNumber = 0;
      state.quickSurveyId = null;
      state.surveyId = null;
      state.formData = {
        surveyTopic: "",
        respondentsNumber: 0,
        duration: "",
        conditions: {
          durationElapsed: false,
          respondentsNumberMet: true, // Default to true
        },
      };
      state.allowFilterRespondentsAccess = false;
      state.filterBy = null;
      state.quickSurveyQualifyingTemplateId = null;
      state.quickSurveyScreenerId = null;
    },
  },
});

export const {
  startQuickSurveyFlow,
  setCurrentDialog,
  closeQuickSurveyFlow,
  proceedToForm,
  proceedToPurchase,
  proceedToConfirm,
  proceedToCongratulations,
  setQuickSurveyId,
  setSurveyId,
  setSelectedRespondentsNumber,
  setFormData,
  setDuration,
  setConditions,
  setAllowFilterRespondentsAccess,
  setFilterBy,
  setQuickSurveyQualifyingTemplateId,
  setQuickSurveyScreenerId,
  resetDialogState,
} = quickSurveySlice.actions;

export default quickSurveySlice.reducer;
