import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveySettings {
  isSettings: boolean;
}

const initialState: SurveySettings = {
  isSettings: false,
};

const surveySettingsSlice = createSlice({
  name: "survey_settings",
  initialState,
  reducers: {
    toggleSurveySettings: (state: SurveySettings) => {
      state.isSettings = !state.isSettings;
    },
    openSurveySettings: (state: SurveySettings) => {
      state.isSettings = true;
    },
    closeSurveySettings: (state: SurveySettings) => {
      state.isSettings = false;
    },
  },
});

export const { toggleSurveySettings, openSurveySettings, closeSurveySettings } =
  surveySettingsSlice.actions;
export default surveySettingsSlice.reducer;
