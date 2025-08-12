import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveyState {
  isBecomeRespondentSurveyCompleted: boolean;
  isPhoneVerified: boolean;
}

const initialState: SurveyState = {
  isBecomeRespondentSurveyCompleted: false,
  isPhoneVerified: false,
};

export const becomePaidRespondentSlice = createSlice({
  name: "becomePaidRespondentSlice",
  initialState,
  reducers: {
    setIsPhoneVerified: (state, action: PayloadAction<boolean>) => {
      state.isPhoneVerified = action.payload;
    },
    setBecomePaidRespondentSurveyCompleted: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isBecomeRespondentSurveyCompleted = action.payload;
    },
  },
});

export const { setIsPhoneVerified, setBecomePaidRespondentSurveyCompleted } =
  becomePaidRespondentSlice.actions;

export default becomePaidRespondentSlice.reducer;
