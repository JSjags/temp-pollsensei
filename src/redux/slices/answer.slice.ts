import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for survey structure
interface HeaderText {
  name: string;
  size: number;
}

interface Survey {
  creator: string;
  organization_id: string;
  survey_type: string;
  topic: string;
  description: string;
  status: string;
  theme: string;
  color_theme: string;
  logo_url: string;
  header_url: string;
  header_text: HeaderText;
  question_text: HeaderText;
  body_text: HeaderText;
  public_id: string;
  shorturl: string;
  generated_by: string;
  conversation_id: string;
}

interface Answer {
  question: string;
  question_type: string;
  description: string;
  is_required: boolean;
  options: string[];
  selected_options: string[];
}

interface OCRResponse {
  survey: Survey;
  extracted_answers: Answer[];
  uploaded_files?: string[];
}

// Define initial state
interface AnswerState {
  survey: Survey | null;
  extracted_answers: Answer[];
  uploaded_files: string[];
}

const initialState: AnswerState = {
  survey: null, 
  extracted_answers: [],
  uploaded_files: [],
};

const answerSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    setSurvey: (state, action: PayloadAction<OCRResponse>) => {
      const { survey, extracted_answers, uploaded_files } = action.payload;
      state.survey = survey;
      state.extracted_answers = extracted_answers;
      state.uploaded_files = uploaded_files || [];
    },

  
    addAnswer: (state, action: PayloadAction<Answer>) => {
      state.extracted_answers.push(action.payload);
    },

    // Replace all answers (extracted_answers)
    replaceAnswers: (state, action: PayloadAction<Answer[]>) => {
      state.extracted_answers = action.payload;
    },

    updateAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; updatedAnswer: Answer }>
    ) => {
      const { questionIndex, updatedAnswer } = action.payload;
      if (state.extracted_answers[questionIndex]) {
        state.extracted_answers[questionIndex] = updatedAnswer;
      }
    },

    resetAnswers: (state) => {
      state.survey = null;
      state.extracted_answers = [];
      state.uploaded_files = [];
    },
  },
});

export const { setSurvey, addAnswer, replaceAnswers, updateAnswer, resetAnswers } =
  answerSlice.actions;

export default answerSlice.reducer;
