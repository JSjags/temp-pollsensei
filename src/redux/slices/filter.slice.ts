import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  question: string;
  questionType: string;
  answer: string;
}

const initialState: FilterState = {
  question: '',
  questionType: '',
  answer: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setQuestion(state, action: PayloadAction<string>) {
      state.question = action.payload;
    },
    setQuestionType(state, action: PayloadAction<string>) {
      state.questionType = action.payload;
    },
    setAnswer(state, action: PayloadAction<string>) {
      state.answer = action.payload;
    },
    resetFilters(state) {
      state.question = '';
      state.questionType = '';
      state.answer = '';
    },
  },
});

export const { setQuestion, setQuestionType, setAnswer, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
