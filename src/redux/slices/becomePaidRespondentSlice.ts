import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveyState {
  isSurveyCompleted: boolean;
}

const initialState: SurveyState = {
  isSurveyCompleted: false,
};

export const becomePaidRespondentSlice = createSlice({
  name: "becomePaidRespondentSlice",
  initialState,
  reducers: {
    setSurveyCompleted: (state, action: PayloadAction<boolean>) => {
      state.isSurveyCompleted = action.payload;
    },
  },
});

export const { setSurveyCompleted } = becomePaidRespondentSlice.actions;

export default becomePaidRespondentSlice.reducer;
