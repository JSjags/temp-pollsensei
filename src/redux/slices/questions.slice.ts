import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  questions: [],
  sectionTopic:'',
  sectionDescription:'',
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestionObject: (_state, action) => {
      return {
        questions: action.payload.questions,
        sectionTopic: action.payload.sectionTopic,
        sectionDescription: action.payload.sectionDescription,
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
    resetQuestion:(_state)=>{
      return initialState
    }
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
} = questionSlice.actions;

export default questionSlice.reducer;
