import { createSlice } from "@reduxjs/toolkit";

const initialState: [
  {
    questions: any;
    sectionTopic: string;
    sectionDescription: string;
  }
] = [
  {
    questions: [],
    sectionTopic: "",
    sectionDescription: "",
  },
];

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestionObject: (_state, action) => {
      return [
        {
          questions: action.payload.questions || [],
          sectionTopic: action.payload.sectionTopic || "",
          sectionDescription: action.payload.sectionDescription || "",
        },
      ];
    },
    updateSectionDescription: (state, action) => {
      state[action.payload.index].sectionDescription = action.payload.data;
    },
    updateSectionTopic: (state, action) => {
      state[action.payload.index].sectionTopic = action.payload.data;
    },

    updateQuestions: (state, action) => {
      state[action.payload.index].questions = action.payload.data;
    },
    addQuestion: (state, action) => {
      state[action.payload.index].questions.push(action.payload.data as never);
    },
    deleteQuestion: (state, action) => {
      state[action.payload.index].questions.splice(
        action?.payload?.editIndex ?? action.payload.data,
        1
      );
    },
    updateQuestion: (
      state,
      action: {
        payload: { index: number; updatedQuestion: any; sectionIndex: number };
      }
    ) => {
      const { index, updatedQuestion } = action.payload;
      if (
        index >= 0 &&
        index < state[action.payload.sectionIndex].questions.length
      ) {
        state[action.payload.sectionIndex].questions[index] = updatedQuestion;
      } else {
        console.error("Invalid index for updating question");
      }
    },
    resetQuestion: (_state) => {
      return initialState;
    },
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
