import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  // title: '',
  // conversation_id: '',
  questions: [],
  // description:'',
  // survey_type:'',
  // section:[],
  sectionTopic:'',
  sectionDescription:'',
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestionObject: (_state, action) => {
      return {
        // title: action.payload.title,
        // conversation_id: action.payload.conversation_id,
        questions: action.payload.questions,
        // description: action.payload.description,
        // survey_type: action.payload.survey_type,
        // section: action.payload.section || [],
        sectionTopic: action.payload.sectionTopic,
        sectionDescription: action.payload.sectionDescription,
      };
    },
    // updateTitle: (state, action) => {
    //   state.title = action.payload;
    // },
    // updateDescription: (state, action) => {
    //   state.description = action.payload;
    // },
    // updateSurveyType: (state, action) => {
    //   state.survey_type = action.payload;
    // },
    updateSectionDescription: (state, action) => {
      state.sectionDescription = action.payload;
    },
    updateSectionTopic: (state, action) => {
      state.sectionTopic = action.payload;
    },
    // updateConversationId: (state, action) => {
    //   state.conversation_id = action.payload;
    // },
    updateQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload as never);
    },
    // addNewSection: (state, action) => {
    //   // state.section.push(action.payload as never);
    //   if (!state.section) {
    //     state.section = [];
    //   }
    //   state.section.push(action.payload as never);

    // },
    deleteQuestion: (state, action) => {
      state.questions.splice(action.payload, 1);
    },
  },
});

export const {
  setQuestionObject,
  // updateTitle,
  // updateConversationId,
  updateQuestions,
  addQuestion,
  addNewSection,
  deleteQuestion,
  // updateDescription,
  // updateSurveyType,
  updateSectionDescription,
  updateSectionTopic,
} = questionSlice.actions;

export default questionSlice.reducer;
