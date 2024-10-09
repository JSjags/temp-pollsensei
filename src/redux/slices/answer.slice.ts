import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  answers: [],
};

const answerSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    addAnswers: (state, action) => {
      state.answers.push(action.payload as never);
    },
    resetAnswers:(_state)=>{
      return initialState
    },
    replaceAnswers: (state, action) => {
      state.answers = action.payload; 
    },
  },
});

export const {
  addAnswers,
  resetAnswers, 
  replaceAnswers
} = answerSlice.actions;

export default answerSlice.reducer;
