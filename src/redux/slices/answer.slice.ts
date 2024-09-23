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
    }
  },
});

export const {
  addAnswers,
  resetAnswers
} = answerSlice.actions;

export default answerSlice.reducer;
