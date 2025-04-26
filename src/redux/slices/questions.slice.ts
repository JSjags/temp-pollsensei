import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateScreenerSurvey } from "@/services/api/apiRequest";

interface Question {
  question: string;
  options?: string[];
  question_type: string;
  is_required: boolean;
}

interface QuestionState {
  questions: Question[];
  sectionTopic: string;
  sectionDescription: string;
  isLoading: boolean;
}

const initialState: QuestionState = {
  questions: [],
  sectionTopic: "",
  sectionDescription: "",
  isLoading: false,
};

export const createScreenerSurvey = createAsyncThunk(
  "questions/createScreenerSurvey",
  async (
    { userToken, payload }: { userToken: any; payload: any },
    { dispatch }
  ) => {
    try {
      const response = await CreateScreenerSurvey(userToken, payload);
      dispatch(setSurveyCreated(true));
      return response.data;
    } catch (e) {
      console.error("Failed to save and continue:", e);
      dispatch(setSurveyCreated(false));
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestionObject: (_state, action) => {
      return {
        questions: action.payload.questions,
        sectionTopic: action.payload.sectionTopic,
        sectionDescription: action.payload.sectionDescription,
        isLoading: false,
      };
    },
    updateSectionDescription: (state, action) => {
      state.sectionDescription = action.payload;
    },
    updateSectionTopic: (state, action) => {
      state.sectionTopic = action.payload;
    },
    updateQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload as never);
    },
    deleteQuestion: (state, action) => {
      state.questions.splice(action.payload, 1);
    },
    updateQuestion: (
      state,
      action: { payload: { index: number; updatedQuestion: any } }
    ) => {
      const { index, updatedQuestion } = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.questions[index] = updatedQuestion;
      } else {
        console.error("Invalid index for updating question");
      }
    },
    resetQuestion: (_state) => {
      return initialState;
    },
    setSurveyCreated: (state, action: PayloadAction<boolean>) => {
      state.isLoading = !action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createScreenerSurvey.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createScreenerSurvey.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createScreenerSurvey.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setQuestionObject,
  updateQuestions,
  addQuestion,
  deleteQuestion,
  updateSectionDescription,
  updateSectionTopic,
  resetQuestion,
  updateQuestion,
  setSurveyCreated,
} = questionSlice.actions;

export default questionSlice.reducer;
