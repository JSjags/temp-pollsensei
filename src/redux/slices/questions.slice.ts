import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  title: '',
  conversation_id: '',
  questions: [],
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
      };
    },
    updateTitle: (state, action) => {
      state.title = action.payload;
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
  },
});

export const {
  setQuestionObject,
  updateTitle,
  updateConversationId,
  updateQuestions,
  addQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;
