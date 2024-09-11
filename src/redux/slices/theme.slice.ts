import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextStyle {
  name: string;
  size: string | number;
}



interface SurveyState {
  theme: string;
  headerText: TextStyle | null;
  questionText: TextStyle | null;
  bodyText: TextStyle | null;
  colorTheme: string;
  logoUrl: File | string | null;
  headerUrl: File | string | null;
  generatedBy: string | null;
}



const initialState: SurveyState = {
  theme: 'default',
  headerText: {name:"Helvetica", size:"18"},
  questionText: null,
  bodyText: null,
  colorTheme: '#EB144C',
  logoUrl: null,
  headerUrl: null,
  generatedBy: null,
};

const themeSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    saveTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    saveHeaderText: (state, action: PayloadAction<TextStyle>) => {
      state.headerText = action.payload;
    },
    saveQuestionText: (state, action: PayloadAction<TextStyle>) => {
      state.questionText = action.payload;
    },
    saveBodyText: (state, action: PayloadAction<TextStyle>) => {
      state.bodyText = action.payload;
    },
    saveColorTheme: (state, action: PayloadAction<string>) => {
      state.colorTheme = action.payload;
    },
    saveLogoUrl: (state, action: PayloadAction<string>) => {
      state.logoUrl = action.payload;
    },
    saveHeaderUrl: (state, action: PayloadAction<string>) => {
      state.headerUrl = action.payload;
    },
    saveGeneratedBy: (state, action: PayloadAction<string>) => {
      state.generatedBy = action.payload;
    },
  },
});


export const {
  saveTheme,
  saveHeaderText,
  saveQuestionText,
  saveBodyText,
  saveColorTheme,
  saveLogoUrl,
  saveHeaderUrl,
  saveGeneratedBy,
} = themeSlice.actions;

export default themeSlice.reducer;
