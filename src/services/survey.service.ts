import apiSlice from "./config/apiSlice";

export const surveyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchSurveys: builder.query({
      query: (page) => ({
        url: `survey?page=${page}&page_size=6`,
        method: "GET",
      }),
    }),
    createAiSurvey: builder.mutation({
      query: (body) => ({
        url: "survey/ai/generate-questions",
        method: "POST",
        body: body,
      }),
    }),
   duplicateSurvey: builder.mutation({
      query: (body) => ({
        url: "survey/duplicate",
        method: "POST",
        body: body,
      }),
    }),
    fetchASurvey: builder.query({
      query: (id) => ({
        url: `survey/${id}`,
        method: "GET",
      }),
    }),
    downloadPDF: builder.query({
      query: (id) => ({
        url: `survey/download/${id}`,
        method: "GET",
      }),
    }),
    shareSurvey: builder.query({
      query: (id) => ({
        url: `survey/share/${id}`,
        method: "GET",
      }),
    }),
    deleteSurvey: builder.mutation({
      query: (id) => ({
        url: `survey/${id}`,
        method: "DELETE",
      }),
    }),
    deleteSurveyResponse: builder.mutation({
      query: (id) => ({
        url: `response/delete/${id} `,
        method: "DELETE",
      }),
    }),
    closeSurveyStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `survey/status/${id} `,
        method: "PATCH",
        body: body,
      }),
    }),
    generateTopics: builder.mutation({
      query: (body) => ({
        url: "survey/ai/generate-topics",
        method: "POST",
        body: body,
      }),
    }),
    generateSingleSurvey: builder.mutation({
      query: (body) => ({
        url: "survey/ai/generate-single-question",
        method: "POST",
        body: body,
      }),
    }),
    saveProgress: builder.mutation({
      query: (body) => ({
        url: "progress",
        method: "POST",
        body: body,
      }),
    }),
    createSurvey: builder.mutation({
      query: (body) => ({
        url: "survey/create",
        method: "POST",
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
    uploadResponseOCR: builder.mutation({
      query: (body) => ({
        url: "response/submit-ocr",
        method: "POST",
        body,
      }),
    }),
    submitPublicResponse: builder.mutation({
      query: (body) => ({
        url: "ps/survey/respond",
        method: "POST",
        body,
      }),
    }),
    submitResponse: builder.mutation({
      query: (body) => ({
        url: "response/upload",
        method: "POST",
        body,
      }),
    }),
    surveySettings: builder.query({
      query: (id) => ({
        url: `survey/setting/${id}`,
        method: "GET",
      }),
    }),
    editSurveySettings: builder.mutation({
      query: ({ id, body }) => ({
        url: `survey/setting/${id}`,
        method: "PATCH",
        body: body,
      }),
    }),
    editSurvey: builder.mutation({
      query: ({ id, body }) => ({
        url: `survey/update/${id}`, 
        method: "PATCH",
        body: body,
      }),
    }),
    inviteCollaborator: builder.mutation({
      query: (body) => ({
        url: `/survey/collaborators`,
        method: "POST",
        body,
      }),
    }),
    getCollaboratorsList: builder.query({
      query: (id) => ({
        url: `survey/collaborators/${id}`,
        method: "GET",
      }),
    }),
    getSingleResponseFolder: builder.query({
      query: (id) => ({
        url: `response/folder/${id}`,
        method: "GET",
      }),
    }),
    getUserSurveyResponse: builder.query({
      query: (id) => ({
        url: `response/individual/${id}?page=1&page_size=10`,
        method: "GET",
      }),
    }),
    getRespondentName: builder.query({
      query: (id) => ({
        url: `response/respondents-names/${id}`,
        method: "GET",
      }),
    }),
    getSurveySummary: builder.query({
      query: (id) => ({
        url: `/response/summary/${id}`,
        method: "GET",
      }),
    }),
    validateSurveyResponse: builder.query({
      query: (id) => ({
        url: `response/validate/${id}`,
        method: "GET",
      }),
    }),
    validateIndividualResponse: builder.query({
      query: ({ id, pagesNumber, path_params = "" }) => ({
        url: `response/validate/individual/${id}?page=${pagesNumber}&page_size=20${
          path_params ? `&${path_params}` : ""
        }`,
        method: "GET",
      }),
    }),
    getPublicSurveyById: builder.query({
      query: (id) => ({
        url: `ps/survey/${id}`,
        method: "GET",
      }),
    }),
    getPublicSurveyByShortUrl: builder.query({
      query: (id) => ({
        url: `ps/survey/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFetchSurveysQuery,
  useCreateSurveyMutation,
  useCreateAiSurveyMutation,
  useGenerateSingleSurveyMutation,
  useAddSurveyHeaderMutation,
  useGenerateTopicsMutation,
  useSaveProgressMutation,
  useFetchASurveyQuery,
  useDownloadPDFQuery,
  useShareSurveyQuery,
  useDeleteSurveyMutation,
  useUploadResponseOCRMutation,
  useGetSingleResponseFolderQuery,
  useGetPublicSurveyByIdQuery,
  useGetPublicSurveyByShortUrlQuery,
  useSubmitPublicResponseMutation,
  useSubmitResponseMutation,
  useGetUserSurveyResponseQuery,
  useGetSurveySummaryQuery,
  useGetRespondentNameQuery,
  useValidateSurveyResponseQuery,
  useValidateIndividualResponseQuery,
  useCloseSurveyStatusMutation,
  useSurveySettingsQuery,
  useEditSurveySettingsMutation,
  useInviteCollaboratorMutation,
  useGetCollaboratorsListQuery,
  useEditSurveyMutation,
  useDuplicateSurveyMutation,
  useDeleteSurveyResponseMutation,
} = surveyApiSlice;
