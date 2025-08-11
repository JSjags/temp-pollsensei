"use client";
import axiosInstance from "@/lib/axios-instance";
import { BuyPaidRespondentResponse, SurveyData } from "@/types/survey";
import { AnyBuyerError } from "@stripe/stripe-js";

/************** BECOME PAID RESPONDENT ***********/

export const fetchOTP = async (phone: string) => {
  try {
    const response = await axiosInstance.post("/auth/send-phone-verification", {
      phone_number: phone,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Error fetching OTP";
    throw new Error(errorMessage);
  }
};

export const confirmOTP = async (phone: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify-phone", {
      phone_number: phone,
      otp,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Error confirming OTP";
    throw new Error(errorMessage);
  }
};

/************** BUY PAID RESPONDENT ***********/
export const GetUserSurveyData =
  async (): Promise<BuyPaidRespondentResponse> => {
    try {
      const response = await axiosInstance.get("/survey", {
        params: {
          page: 1,
          page_size: 6,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error fetching user survey data";
      throw new Error(errorMessage);
    }
  };

export const GetUserSurveysArray = async (): Promise<SurveyData[]> => {
  try {
    const response = await GetUserSurveyData();
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching user survey Array";
    throw new Error(errorMessage);
  }
};

export const PurchasePaidRespondent = async (
  surveyId: string,
  selectedRespondentsNumber: number
) => {
  try {
    const response = await axiosInstance.post(
      "/purchases/respondents/standard",
      {
        surveyId,
        numberOfRespondents: selectedRespondentsNumber,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error purchasing paid respondent";
    throw new Error(errorMessage);
  }
};

export const PurchaseQualifiedPaidRespondent = async (
  surveyId: string,
  selectedRespondentsNumber: number,
  qualifyingTemplateId: string | null
) => {
  try {
    const response = await axiosInstance.post(
      "/purchases/respondents/qualifying",
      {
        surveyId,
        numberOfRespondents: selectedRespondentsNumber,
        qualifyingTemplateId,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error purchasing qualified paid respondent";
    throw new Error(errorMessage);
  }
};

export const ScreenerSurveyPurchase = async (
  surveyId: string,
  selectedRespondentsNumber: number,
  screenerId: string | null
) => {
  try {
    const response = await axiosInstance.post("/screener-survey/purchase", {
      screenerId,
      surveyId,
      numberOfRespondents: selectedRespondentsNumber,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error purchasing screener survey";
    throw new Error(errorMessage);
  }
};

export const FilterPaidRespondent = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      "/purchases/respondents/criteria",
      payload
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error filtering paid respondent";
    throw new Error(errorMessage);
  }
};

export const GetRespondentData = async (activeTab: string) => {
  try {
    const response = await axiosInstance.get(
      `/paid-respondent/section/${activeTab}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching respondent data";
    throw new Error(errorMessage);
  }
};

export const GetRespondentSectionData = async (section: string) => {
  try {
    const response = await axiosInstance.get(
      `/paid-respondent/section/${section}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching respondent section data";
    throw new Error(errorMessage);
  }
};

export const fetchPaidRespondentStatus = async () => {
  try {
    const response = await axiosInstance.get("/paid-respondent/check-status");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching paid respondent status";
    throw new Error(errorMessage);
  }
};

export const CreateScreenerSurvey = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/screener-survey", payload, {
      params: {
        page: 1,
        page_size: 10,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating screener survey";
    throw new Error(errorMessage);
  }
};

export const fetchPurchasedRespondentsStats = async () => {
  try {
    const response = await axiosInstance.get("/paid-respondent/stats");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching purchased respondents stats";
    throw new Error(errorMessage);
  }
};

/************** EARN ***********/
export const fetchDailyReward = async () => {
  try {
    const response = await axiosInstance.get("/daily-login");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching daily reward";
    throw new Error(errorMessage);
  }
};

export const fetchLoginStreak = async () => {
  try {
    const response = await axiosInstance.get("/daily-login/streak");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching login streak";
    throw new Error(errorMessage);
  }
};

export const fetchAvailableSurveys = async (
  page: number = 1,
  limit: number = 8
) => {
  try {
    const response = await axiosInstance.get("/survey-apply/recommendations", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching available surveys";
    throw new Error(errorMessage);
  }
};

export const fetchApplySurveys = async (
  page: number = 1,
  limit: number = 8
) => {
  try {
    const response = await axiosInstance.get(
      "/screener-survey/screened-surveys",
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching apply surveys";
    throw new Error(errorMessage);
  }
};

export const fetchApplicationSurveys = async (
  page: number = 1,
  limit: number = 8
) => {
  try {
    const response = await axiosInstance.get("/survey-apply/applications", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching application surveys";
    throw new Error(errorMessage);
  }
};

export const fetchScreenerSurveyById = async (screenerId: string | null) => {
  try {
    const response = await axiosInstance.get(`/screener-survey/${screenerId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching screener survey by ID";
    throw new Error(errorMessage);
  }
};

export const fetchScreenerSurveyBySurveyId = async (
  surveyId: string | null
) => {
  try {
    const response = await axiosInstance.get(
      `/screener-survey/survey/${surveyId}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching screener survey by survey ID";
    throw new Error(errorMessage);
  }
};

export const submitScreenerSurvey = async (payload: any, surveyId: string) => {
  try {
    const response = await axiosInstance.post(
      `/survey-apply/submit-screener/${surveyId}`,
      payload
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error submitting screener survey";
    throw new Error(errorMessage);
  }
};

export const submitPaidSurvey = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/ps/survey/respond", payload);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error submitting paid survey";
    throw new Error(errorMessage);
  }
};

export const startPaidSurvey = async (
  surveyId: string | null,
  screenerId: string | null
) => {
  try {
    const response = await axiosInstance.post(
      `/survey-apply/start/${surveyId}`,
      {
        screenerId: screenerId,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error starting paid survey";
    throw new Error(errorMessage);
  }
};

export const fetchSurveyById = async (surveyId: string | null) => {
  try {
    const response = await axiosInstance.get(`/survey/public/${surveyId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching survey by ID";
    throw new Error(errorMessage);
  }
};

/************** SHOP ***********/
export const fetchTotalPurchasedRespondents = async () => {
  try {
    const response = await axiosInstance.get("/purchases/respondents/history");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching total purchased respondents";
    throw new Error(errorMessage);
  }
};

/************** SURVEY BOARD ***********/
export const fetchScreenerParticipants = async (
  surveyId: string | null,
  screenerId: string | null
) => {
  try {
    const response = await axiosInstance.get(
      `/screener-survey/participant-review/${surveyId}/${screenerId}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching screener participants";
    throw new Error(errorMessage);
  }
};

export const fetchParticipantById = async (participantId: string | null) => {
  try {
    const response = await axiosInstance.get(
      `/paid-respondent/${participantId}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching participant by ID";
    throw new Error(errorMessage);
  }
};

export const submitReviewedParticipant = async (
  participantID: any,
  status: string
) => {
  try {
    const response = await axiosInstance.patch(
      "/screener-survey/applications/bulk-update",
      {
        applicationIds: participantID,
        status,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error submitting reviewed participant";
    throw new Error(errorMessage);
  }
};

/************** QUICK SURVEY ***********/

export const CreateQuickSurvey = async (surveyId: string | null) => {
  try {
    const response = await axiosInstance.post("/quick-survey", {
      survey_id: surveyId,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating quick survey";
    throw new Error(errorMessage);
  }
};

export const DirectQuickSurvey = async (
  quickSurveyId: string | null,
  numberOfRespondents: number,
  duration: number,
  targetReached: boolean,
  durationReached: boolean
) => {
  try {
    const response = await axiosInstance.post("/quick-survey/purchase", {
      quick_survey_id: quickSurveyId,
      numberOfRespondents,
      duration,
      close_on_targetReached: targetReached,
      close_on_duration_reached: durationReached,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating quick survey";
    throw new Error(errorMessage);
  }
};

export const QuickSurveyQualifyingPurchase = async (
  quickSurveyId: string | null,
  numberOfRespondents: number,
  duration: number,
  targetReached: boolean,
  durationReached: boolean,
  qualifyingTemplateId: string | null
) => {
  try {
    const response = await axiosInstance.post(
      `/quick-survey/purchase/${quickSurveyId}/qualifying`,
      {
        quick_survey_id: quickSurveyId,
        numberOfRespondents,
        duration,
        close_on_targetReached: targetReached,
        close_on_duration_reached: durationReached,
        qualifying_template_id: qualifyingTemplateId,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating quick survey";
    throw new Error(errorMessage);
  }
};

export const QuickSurveyScreenerPurchase = async (
  quickSurveyId: string | null,
  numberOfRespondents: number,
  duration: number,
  targetReached: boolean,
  durationReached: boolean,
  screenerId: string | null
) => {
  try {
    const response = await axiosInstance.post(
      `/quick-survey/purchase/screener`,
      {
        quick_survey_id: quickSurveyId,
        numberOfRespondents,
        duration,
        close_on_targetReached: targetReached,
        close_on_duration_reached: durationReached,
        screener_id: screenerId,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating quick survey";
    throw new Error(errorMessage);
  }
};

/************** REPORTS ***********/

export const GetUserReportsCategories = async () => {
  try {
    const response = await axiosInstance.get(`/report/categories`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports data";
    throw new Error(errorMessage);
  }
};

export const GetUserReportsInterest = async () => {
  try {
    const response = await axiosInstance.get(`/report/interests`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports data";
    throw new Error(errorMessage);
  }
};

export const ReportOnboarding = async (
  selectedRole: string[],
  selectedFields: string[]
) => {
  try {
    const response = await axiosInstance.post("/report/onboard", {
      categories: selectedRole,
      fields_of_interest: selectedFields,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating reports onboarding";
    throw new Error(errorMessage);
  }
};

export const GetLatestReport = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/latest`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching latest reports data";
    throw new Error(errorMessage);
  }
};

export const GetMostRecentReport = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/recent`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching most recent reports data";
    throw new Error(errorMessage);
  }
};

export const GetPopularReport = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/popular`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching popular reports data";
    throw new Error(errorMessage);
  }
};

export const GetReportDetailsById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/report/blog/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports details data";
    throw new Error(errorMessage);
  }
};

export const GetReportCommentsAndReplies = async (
  id: string,
  page = 1,
  pageSize = 20
) => {
  try {
    const response = await axiosInstance.get(`/report/blog/${id}/comments`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports comments";
    throw new Error(errorMessage);
  }
};

export const GetReportBookmark = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `/report/blog/bookmark-status/${id}`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports bookmarks";
    throw new Error(errorMessage);
  }
};

export const GetReportStats = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/stats`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports stats";
    throw new Error(errorMessage);
  }
};

export const GetReportBookmarksCount = async () => {
  try {
    const response = await axiosInstance.get(
      `/report/blog/my-bookmarked-count`
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports stats";
    throw new Error(errorMessage);
  }
};

export const GetSearchResults = async (params: any) => {
  try {
    const response = await axiosInstance.get(`/report/blog/search`, {
      params: {
        search_term: params.search_term,
        page: params.page || 1,
        page_size: params.page_size || 20,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching search reports data";
    throw new Error(errorMessage);
  }
};

export const ReportBookmark = async (reportId: string) => {
  try {
    const response = await axiosInstance.post(`/report/blog/bookmark`, {
      report_id: reportId,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error toggling reports bookmark";
    throw new Error(errorMessage);
  }
};

export const ReportEcho = async (
  report_id: string,
  number_of_echoes: number | undefined
) => {
  try {
    const response = await axiosInstance.post("/report/echo", {
      report_id,
      number_of_echoes,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error toggling reports echo";
    throw new Error(errorMessage);
  }
};

export const ReportComment = async (
  report_id: string,
  content: string,
  media?: any
) => {
  try {
    const response = await axiosInstance.post("/report/comment", {
      report_id,
      content,
      media,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error toggling reports comment";
    throw new Error(errorMessage);
  }
};

export const EditReportComment = async (
  comment_id: string,
  content: string,
  media?: any
) => {
  try {
    const response = await axiosInstance.patch("/report/comment", {
      comment_id,
      content,
      media,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error editing reports comment";
    throw new Error(errorMessage);
  }
};

export const DeleteReportComment = async (comment_id: string) => {
  try {
    const response = await axiosInstance.delete("/report/comment", {
      data: {
        comment_id,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error deleting reports comment";
    throw new Error(errorMessage);
  }
};

export const EchoReportComment = async (comment_id: string) => {
  try {
    const response = await axiosInstance.post("/report/comment/echo", {
      comment_id,
      number_of_echoes: 1,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Error echoing reports";
    throw new Error(errorMessage);
  }
};

export const NestedReportComment = async (
  comment_id: string | undefined,
  content: string,
  media?: any
) => {
  try {
    const response = await axiosInstance.post("/report/reply", {
      comment_id,
      content,
      media,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error creating reports comment reply";
    throw new Error(errorMessage);
  }
};

export const EditNestedReportComment = async (
  comment_id: string,
  reply_id: string,
  content: string,
  media?: any
) => {
  try {
    const response = await axiosInstance.patch("/report/reply", {
      reply_id,
      comment_id,
      content,
      media,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error Editing reports comment reply";
    throw new Error(errorMessage);
  }
};

export const DeleteNestedReportComment = async (
  reply_id: string,
  comment_id: string
) => {
  try {
    const response = await axiosInstance.delete("/report/reply", {
      data: {
        reply_id,
        comment_id,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete reply. Please try again.";
    throw new Error(errorMessage);
  }
};

export const EchoNestedReportComment = async (
  comment_id: string,
  reply_id: string
) => {
  try {
    const response = await axiosInstance.post("/report/reply/echo", {
      reply_id,
      comment_id,
      number_of_echoes: 1,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error echoing reports comment reply";
    throw new Error(errorMessage);
  }
};

export const GetReportBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/report/blog/${slug}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports by slug";
    throw new Error(errorMessage);
  }
};

export const GetBookmarkedReport = async (page = 1, pageSize = 20) => {
  try {
    const response = await axiosInstance.get(
      `/report/blog/my-bookmarked-reports`,
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Error fetching reports bookmarks";
    throw new Error(errorMessage);
  }
};
