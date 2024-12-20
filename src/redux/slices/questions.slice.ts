import { createSlice } from '@reduxjs/toolkit';


const initialState:  {
    questions: any;
    sectionTopic: string;
    sectionDescription: string;
  } = {
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
    updateQuestion: (state, action: { payload: { index: number; updatedQuestion: any } }) => {
      const { index, updatedQuestion } = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.questions[index] = updatedQuestion;
      } else {
        console.error('Invalid index for updating question');
      }
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
  updateQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// interface Question {
//   question: string;
//   options?: string[];
//   question_type: string;
//   is_required: boolean;
// }

// const initialState: {
//   questions: Question[];
//   sectionTopic: string;
//   sectionDescription: string;
// } = {
//   questions: [],
//   sectionTopic: '',
//   sectionDescription: '',
// };

// const questionSlice = createSlice({
//   name: 'questions',
//   initialState,
//   reducers: {
//     setQuestionObject: (_state, action) => {
//       return {
//         questions: action.payload.questions,
//         sectionTopic: action.payload.sectionTopic,
//         sectionDescription: action.payload.sectionDescription,
//       };
//     },
//     updateSectionDescription: (state, action) => {
//       state.sectionDescription = action.payload;
//     },
//     updateSectionTopic: (state, action) => {
//       state.sectionTopic = action.payload;
//     },
//     updateQuestions: (state, action) => {
//       state.questions = action.payload;
//     },
//     // addQuestion: (state, action) => {
//     //   state.questions.push(action.payload);
//     // },
//       //   addQuestion: (state, action) => {
//       // state.questions.push(action.payload as never);},
//       addQuestion: (state, action) => {
//         state.questions = [...state.questions, action.payload]; // Ensure immutability
//       },
//     deleteQuestion: (state, action) => {
//       state.questions.splice(action.payload, 1);
//     },
//     updateQuestion: (state, action: { payload: { index: number; updatedQuestion: any } }) => {
//       const { index, updatedQuestion } = action.payload;
//       if (index >= 0 && index < state.questions.length) {
//         state.questions[index] = updatedQuestion;
//       } else {
//         console.error('Invalid index for updating question');
//       }
//     },
//     resetQuestion: () => {
//       return initialState;
//     },
//   },
// });

// export const {
//   setQuestionObject,
//   updateQuestions,
//   addQuestion,
//   deleteQuestion,
//   updateSectionDescription,
//   updateSectionTopic,
//   updateQuestion,
//   resetQuestion,
// } = questionSlice.actions;

// export default questionSlice.reducer;
