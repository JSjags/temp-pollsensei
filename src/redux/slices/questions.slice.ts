import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  title: '',
  conversation_id: '',
  questions: [],
  description:'',
  section:[],
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestionObject: (_state, action) => {
      return {
        title: action.payload.title,
        conversation_id: action.payload.conversation_id,
        questions: action.payload.questions,
        description: action.payload.description,
        section: action.payload.section,
      };
    },
    updateTitle: (state, action) => {
      state.title = action.payload;
    },
    updateDescription: (state, action) => {
      state.description = action.payload;
    },
    updateConversationId: (state, action) => {
      state.conversation_id = action.payload;
    },
    updateQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload as never);
    },
    addNewSection: (state, action) => {
      state.section.push(action.payload as never);
    },
    deleteQuestion: (state, action) => {
      state.questions.splice(action.payload, 1);
    },
  },
});

export const {
  setQuestionObject,
  updateTitle,
  updateConversationId,
  updateQuestions,
  addQuestion,
  addNewSection,
  deleteQuestion,
  updateDescription,
} = questionSlice.actions;

export default questionSlice.reducer;
