import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

interface DialogState {
  isSurveyFormDialogOpen: boolean;
  isAdsDialogOpen: boolean;
  isSurveyTabsOpen: boolean;
  adsWatched: number;
  totalAds: number;
  lastResetTime: number | null;
  surveyID: string | null;
  screenerSurvey: any;
}

const initialState: DialogState = {
  isSurveyFormDialogOpen: false,
  isAdsDialogOpen: false,
  isSurveyTabsOpen: false,
  adsWatched: 0,
  totalAds: 3,
  lastResetTime: Date.now(),
  surveyID: null,
  screenerSurvey: null,
};

export const earnDialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openSurveyFormDialog: (state) => {
      state.isSurveyFormDialogOpen = true;
    },
    closeSurveyFormDialog: (state) => {
      state.isSurveyFormDialogOpen = false;
    },
    openSurveyTabs: (state) => {
      state.isSurveyTabsOpen = true;
    },
    closeSurveyTabs: (state) => {
      state.isSurveyTabsOpen = false;
    },
    openAdsDialog: (state) => {
      state.isAdsDialogOpen = true;
    },
    closeAdsDialog: (state) => {
      state.isAdsDialogOpen = false;
    },
    incrementAdsWatched: (state) => {
      state.adsWatched += 1;
    },
    resetAdsWatched: (state) => {
      state.adsWatched = 0;
      state.lastResetTime = Date.now();
    },
    forceResetAds: (state) => {
      state.adsWatched = 0;
      state.lastResetTime = Date.now();
    },
    setLastResetTime: (state, action: PayloadAction<number>) => {
      state.lastResetTime = action.payload;
    },
    setSurveyID: (state, action: PayloadAction<string>) => {
      state.surveyID = action.payload;
    },
    setScreenerSurvey: (state, action: PayloadAction<any>) => {
      state.screenerSurvey = action.payload;
    },
  },
});

export const selectLastResetTime = (state: RootState) =>
  state.earnDialogSlice.lastResetTime;

export const selectSurveyID = (state: RootState) =>
  state.earnDialogSlice.surveyID;
export const screenerSurvey = (state: RootState) =>
  state.earnDialogSlice.screenerSurvey;

export const {
  openSurveyFormDialog,
  closeSurveyFormDialog,
  openAdsDialog,
  closeAdsDialog,
  openSurveyTabs,
  closeSurveyTabs,
  incrementAdsWatched,
  resetAdsWatched,
  forceResetAds,
  setLastResetTime,
  setSurveyID,
  setScreenerSurvey,
} = earnDialogSlice.actions;

export const selectAdsState = (state: RootState) => state.earnDialogSlice;
export const selectHasNextVideo = (state: RootState) =>
  state.earnDialogSlice.adsWatched < state.earnDialogSlice.totalAds;
export const selectScreenerSurvey = (state: RootState) =>
  state.earnDialogSlice.screenerSurvey;

export default earnDialogSlice.reducer;
