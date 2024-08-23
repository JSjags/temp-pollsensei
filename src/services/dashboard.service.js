// import apiSlice from "./api/apiSlice";
import apiSlice from "./config/apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    formResponseRate: builder.query({
      query: (period) => ({
        url: `/dashboard/surveys/response-rate?period=${period}`,
        method: "GET",
      }),
    }),
    dataCollectorCount: builder.query({
      query: () => ({
        url: "/dashboard/data-collector/count",
        method: "GET",
      }),
    }),
    survey: builder.query({
      query: () => ({
        url: "/dashboard/surveys",
        method: "GET",
      }),
    }),
    surveysCount: builder.query({
      query: () => ({
        url: "/dashboard/surveys/count",
        method: "GET",
      }),
    }),
    surveyLeaderboard: builder.query({
      query: () => ({
        url: "/dashboard/surveys/leaderboard",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useFormResponseRateQuery,
  useDataCollectorCountQuery,
  useSurveysCountQuery,
  useSurveyLeaderboardQuery,
  useSurveyQuery,
} = dashboardApiSlice;
