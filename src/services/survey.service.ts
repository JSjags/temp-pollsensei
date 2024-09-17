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
    fetchASurvey: builder.query({
      query: (id) => ({
        url: `survey/${id}`,
        method: 'GET',
      }),
    }),
  downloadPDF: builder.query({
      query: (id) => ({
        url: `survey/download/${id}`,
        method: 'GET',
      }),
    }),
  shareSurvey: builder.query({
      query: (id) => ({
        url: `survey/share/${id}`,
        method: 'GET',
      }),
    }),
  deleteSurvey: builder.mutation({
      query: (id) => ({
        url: `survey/${id}`,
        method: 'DELETE',
      }),
    }),
    generateTopics: builder.mutation({
      query: (body) => ({
        url: 'survey/ai/generate-topics',
        method: 'POST',
        body: body,
      }),
    }),
    generateSingleSurvey: builder.mutation({
      query: (body) => ({
        url: 'survey/ai/generate-single-question',
        method: 'POST',
        body: body,
      }),
    }),
    saveProgress: builder.mutation({
      query: (body) => ({
        url: 'progress',
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
    addSurveyHeader: builder.mutation({
      query: (body) => ({
        url: "/survey/file",
        method: "POST",
        body,
      }),
    }),
  }),
});



export const { useFetchSurveysQuery, useCreateSurveyMutation, useCreateAiSurveyMutation, useGenerateSingleSurveyMutation, useAddSurveyHeaderMutation, useGenerateTopicsMutation, useSaveProgressMutation, useFetchASurveyQuery, useDownloadPDFQuery, useShareSurveyQuery, useDeleteSurveyMutation } = surveyApiSlice
