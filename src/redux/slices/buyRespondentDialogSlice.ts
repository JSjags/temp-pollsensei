import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogState {
  surveyDialog: boolean;
  purchaseDialog: boolean;
  confirmDialog: boolean;
  congratulationsDialog: boolean;
  selectedSurvey: string;
  selectedRespondentsNumber: number;
  formData: {
    survey: string;
    respondentsNumber: number;
  };
  allowFilterRespondentsAccess: boolean;
}

const initialState: DialogState = {
  surveyDialog: false,
  purchaseDialog: false,
  confirmDialog: false,
  congratulationsDialog: false,
  selectedSurvey: "",
  selectedRespondentsNumber: 0,
  formData: {
    survey: "",
    respondentsNumber: 0,
  },
  allowFilterRespondentsAccess: false,
};

const buyRespondentDialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setSurveyDialog: (state, action: PayloadAction<boolean>) => {
      state.surveyDialog = action.payload;
    },
    setPurchaseDialog: (state, action: PayloadAction<boolean>) => {
      state.purchaseDialog = action.payload;
    },
    setConfirmDialog: (state, action: PayloadAction<boolean>) => {
      state.confirmDialog = action.payload;
    },
    setCongratulationsDialog: (state, action: PayloadAction<boolean>) => {
      state.congratulationsDialog = action.payload;
    },
    setSelectedSurvey: (state, action: PayloadAction<string>) => {
      state.selectedSurvey = action.payload;
    },
    setSelectedRespondentsNumber: (state, action: PayloadAction<number>) => {
      state.selectedRespondentsNumber = action.payload;
    },
    setFormData: (
      state,
      action: PayloadAction<{ survey: string; respondentsNumber: number }>
    ) => {
      state.formData = action.payload;
    },
    setAllowFilterRespondentsAccess: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.allowFilterRespondentsAccess = action.payload;
    },
    resetDialogState: (state) => {
      state.surveyDialog = false;
      state.purchaseDialog = false;
      state.confirmDialog = false;
      state.congratulationsDialog = false;
      state.selectedSurvey = "";
      state.selectedRespondentsNumber = 0;
      state.formData = { survey: "", respondentsNumber: 0 };
      state.allowFilterRespondentsAccess = false;
    },
  },
});

export const {
  setSurveyDialog,
  setPurchaseDialog,
  setConfirmDialog,
  setCongratulationsDialog,
  setSelectedSurvey,
  setSelectedRespondentsNumber,
  setFormData,
  setAllowFilterRespondentsAccess,
  resetDialogState,
} = buyRespondentDialogSlice.actions;

export default buyRespondentDialogSlice.reducer;
