import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

interface DialogState {
  isSurveyFormDialogOpen: boolean;
  isAdsDialogOpen: boolean;
  isSurveyTabsOpen: boolean;
  adsWatched: number;
  totalAds: number;
  lastResetTime: number | null;
}

const initialState: DialogState = {
  isSurveyFormDialogOpen: false,
  isAdsDialogOpen: false,
  isSurveyTabsOpen: false,
  adsWatched: 0,
  totalAds: 3,
  lastResetTime: Date.now(),
};

export const earnDialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    // earnDialogSlice.js
    openSurveyFormDialog: (state) => {
      // console.log("Opening SurveyFormDialog");
      state.isSurveyFormDialogOpen = true;
    },
    closeSurveyFormDialog: (state) => {
      // console.log("Closing SurveyFormDialog");
      state.isSurveyFormDialogOpen = false;
    },
    openSurveyTabs: (state) => {
      // console.log("Opening SurveyTabs");
      state.isSurveyTabsOpen = true;
    },
    closeSurveyTabs: (state) => {
      // console.log("Closing SurveyTabs");
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
  },
});
export const selectLastResetTime = (state: RootState) =>
  state.earnDialogSlice.lastResetTime;

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
} = earnDialogSlice.actions;

export const selectAdsState = (state: RootState) => state.earnDialogSlice;
export const selectHasNextVideo = (state: RootState) =>
  state.earnDialogSlice.adsWatched < state.earnDialogSlice.totalAds;

export default earnDialogSlice.reducer;
