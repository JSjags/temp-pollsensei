import apiSlice from "./config/apiSlice";

export const surveyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchSurveys: builder.query({
      query: (page) => ({
        url: `survey?page=${page}&page_size=6`,
        method: 'GET',
      }),
    }),
    createAiSurvey: builder.mutation({
      query: (body) => ({
        url: 'survey/ai/generate-questions',
        method: 'POST',
        body: body,
      }),
    }),
    regenerateSingleSurvey: builder.mutation({
      query: (body) => ({
        url: 'survey/ai/regenerate-single-option',
        method: 'POST',
        body: body,
      }),
    }),
    createSurvey: builder.mutation({
      query: (body) => ({
        url: 'survey/create',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const { useFetchSurveysQuery, useCreateSurveyMutation, useCreateAiSurveyMutation, useRegenerateSingleSurveyMutation } = surveyApiSlice
