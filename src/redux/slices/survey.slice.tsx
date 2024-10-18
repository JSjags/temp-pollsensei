import { default_header } from "@/assets/images";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface TextStyle {
  name: string;
  size: string | number;
}

interface Question {
  question: string;
  description?: string;
  question_type: string;
  options?: string[];
  is_required: boolean;
  rows?: string[];
  columns?: string[];
}

interface Section {
  section_topic?: string;
  section_description?: string;
  questions: Question[];
}

interface SurveyState {
  survey_type: string;
  conversation_id: string;
  topic: string;
  description: string;
  sections: Section[];
  theme: string;
  header_text: TextStyle | null;
  question_text: TextStyle | null;
  body_text: TextStyle | null;
  color_theme: string ;
  logo_url: File | string | null;
  header_url: File | string | null;
  generated_by: string | null;
}

const initialState: SurveyState = {
  conversation_id: "",
  survey_type: "",
  topic: "",
  description: "",
  sections: [],
  theme: "default",
  header_text: { name: "Helvetica", size: "24" },
  question_text: { name: "Helvetica", size: "18" },
  body_text: { name: "Helvetica", size: "18" },
  color_theme: "#EEE",
  logo_url: "https://firebasestorage.googleapis.com/v0/b/pollsensei.appspot.com/o/Isaac's%20Organization_668bd242587ad115db5868ca_survey%2FFrame%201618873905.svg?alt=media&token=6b1cd848-d247-4e87-ac39-ed294201b57a",
  header_url: "https://firebasestorage.googleapis.com/v0/b/pollsensei.appspot.com/o/Isaac's%20Organization_668bd242587ad115db5868ca_survey%2FFrame%201618873905.svg?alt=media&token=6b1cd848-d247-4e87-ac39-ed294201b57a",
  generated_by: "",
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setQuestionObject: (state, action: PayloadAction<Question>) => {
      const { question, description, question_type, options, is_required, rows, columns } = action.payload;
      const newQuestion: Question = {
        question,
        description,
        question_type,
        options: options || [],
        is_required: is_required ?? false,
        rows: rows || [],
        columns: columns || [],
      };
      if (state.sections.length > 0) {
        state.sections[0].questions.push(newQuestion);
      } else {
        state.sections.push({ questions: [newQuestion] });
      }
    },
    saveLogoUrl: (state, action: PayloadAction<string>) => {
      state.logo_url = action.payload;
    },
    updateTopic: (state, action: PayloadAction<string>) => {
      state.topic = action.payload;
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    saveHeaderUrl: (state, action: PayloadAction<string>) => {
      state.header_url = action.payload;
    },
    addSection: (state, action: PayloadAction<Section>) => {
      state.sections.push(action.payload);
    },
    updateSection: (state, action: PayloadAction<{ index: number; newSection: Section }>) => {
      const { index, newSection } = action.payload;
      if (state.sections[index]) {
        state.sections[index] = newSection;
      }
    },
    updateSurveyType: (state, action: PayloadAction<string>) => {
      state.survey_type = action.payload;
    },
    updateConversationId: (state, action: PayloadAction<string>) => {
      state.conversation_id = action.payload;
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.sections.splice(action.payload, 1);
    },
    saveTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    saveHeaderText: (state, action: PayloadAction<TextStyle>) => {
      state.header_text = action.payload;
    },
    saveQuestionText: (state, action: PayloadAction<TextStyle>) => {
      state.question_text = action.payload;
    },
    saveBodyText: (state, action: PayloadAction<TextStyle>) => {
      state.body_text = action.payload;
    },
    saveColorTheme: (state, action: PayloadAction<string>) => {
      state.color_theme = action.payload;
    },
    saveGeneratedBy: (state, action: PayloadAction<string>) => {
      state.generated_by = action.payload;
    },
    resetSurvey: (_state) => {
      return initialState;  
    },
    deleteQuestionFromSection: (
      state,
      action: PayloadAction<{ sectionIndex: number; questionIndex: number }>
    ) => {
      const { sectionIndex, questionIndex } = action.payload;
      const section = state.sections[sectionIndex];

      if (section && section.questions[questionIndex]) {
        section.questions.splice(questionIndex, 1);
      }
    },
  },
});

export const {
  saveTheme,
  updateTopic,
  saveHeaderText,
  saveQuestionText,
  saveBodyText,
  saveColorTheme,
  saveLogoUrl,
  saveHeaderUrl,
  saveGeneratedBy,
  addSection,
  updateSection,
  deleteSection,
  updateSurveyType,
  updateConversationId,
  setQuestionObject,
  updateDescription,
  resetSurvey,
  deleteQuestionFromSection
} = surveySlice.actions;

export default surveySlice.reducer;
