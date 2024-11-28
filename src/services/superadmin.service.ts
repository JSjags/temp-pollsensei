// /superadmin/users?page=1&page_size=20
import apiSlice from "./config/apiSlice";

export const surveyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRegistry: builder.query({
      query: ({pagesNumber, path_params = "" }) => ({
        url: `superadmin/users?page=${pagesNumber}&page_size=20${
          path_params ? `&${path_params}` : ""
        }`,
        method: "GET",
      }),
    }),
    superadminOverview: builder.query({
      query: () => ({
        url: `/superadmin/overview`, // 
        method: "GET",
      }),
    }),
    surveyCreationDistribution: builder.query({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('&year', year);
        return {
          url: `superadmin/survey-creation-distribution?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    surveyTypeDistribution: builder.query({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('&year', year);
        return {
          url: `superadmin/survey-type-distribution?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    allFAQs: builder.query({
      query: ({pagesNumber, filter_by }) => {
        const params = new URLSearchParams();
        if (filter_by) params.append('filter_by', filter_by);
        return {
          url: `superadmin/faq?page=${pagesNumber}&page_size=20&${params.toString()}`,
          method: "GET",
        }
      }, // 
    }),
    createFAQs: builder.mutation({
      query: (body) => ({
        url: "superadmin/faq",
        method: "POST",
        body: body,
      }),
    }), 
    unpublishFAQs: builder.mutation({
      query: ({id, body}) => ({
        url: `superadmin/faq-status/${id}?status=unpublish`,
        method: "PATCH",
        body: body,
      }),
    }), 
    publishFAQs: builder.mutation({
      query: ({id, body}) => ({
        url: `superadmin/faq-status/${id}?status=publish`,
        method: "PATCH",
        body: body,
      }),
    }), 
    deleteFAQs: builder.mutation({
      query: (id) => ({
        url: `/superadmin/faq/${id}`,
        method: "DELETE",
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
    downloadSingleResponse: builder.query({
      query: ({response_id, format}) => ({
        url: `response/export?response_id=${response_id}&format=${format}`, // 
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUserRegistryQuery,
  useSuperadminOverviewQuery,
  useSurveyCreationDistributionQuery,
  useAllFAQsQuery,
  useSurveyTypeDistributionQuery,
  useDeleteFAQsMutation,
  useCreateFAQsMutation,
  usePublishFAQsMutation,
  useUnpublishFAQsMutation,
  useValidateIndividualResponseQuery,
  useDownloadSingleResponseQuery,
  useLazyDownloadSingleResponseQuery
} = surveyApiSlice;
