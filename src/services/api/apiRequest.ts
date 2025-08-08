"use client";
import axiosInstance from "@/lib/axios-instance";
import { BuyPaidRespondentResponse, SurveyData } from "@/types/survey";

/************** BECOME PAID RESPONDENT ***********/

export const fetchOTP = async (phone: string) => {
  try {
    const response = await axiosInstance.post("/auth/send-phone-verification", {
      phone_number: phone,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching OTP:", error);
    throw error;
  }
};

export const confirmOTP = async (phone: string, otp: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify-phone", {
      phone_number: phone,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error confirming OTP:", error);
    throw error;
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
    } catch (error) {
      console.error("Error fetching user survey data:", error);
      throw error;
    }
  };

export const GetUserSurveysArray = async (): Promise<SurveyData[]> => {
  try {
    const response = await GetUserSurveyData();
    return response.data;
  } catch (error) {
    console.error("Error fetching user surveys array:", error);
    throw error;
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
  } catch (error) {
    console.error("Error purchasing paid respondent:", error);
    throw error;
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
  } catch (error) {
    console.error("Error purchasing qualified paid respondent:", error);
    throw error;
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
  } catch (error) {
    console.error("Error purchasing screener survey:", error);
    throw error;
  }
};

export const FilterPaidRespondent = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      "/purchases/respondents/criteria",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering paid respondent:", error);
    throw error;
  }
};

export const GetRespondentData = async (activeTab: string) => {
  try {
    const response = await axiosInstance.get(
      `/paid-respondent/section/${activeTab}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching respondent data:", error);
    throw error;
  }
};

export const GetRespondentSectionData = async (section: string) => {
  try {
    const response = await axiosInstance.get(
      `/paid-respondent/section/${section}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching respondent section data:", error);
    throw error;
  }
};

export const fetchPaidRespondentStatus = async () => {
  try {
    const response = await axiosInstance.get("/paid-respondent/check-status");
    return response.data;
  } catch (error) {
    console.error("Error fetching paid respondent status:", error);
    throw error;
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
  } catch (error) {
    console.error("Error creating screener survey:", error);
    throw error;
  }
};

export const fetchPurchasedRespondentsStats = async () => {
  try {
    const response = await axiosInstance.get("/paid-respondent/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching purchased respondents stats:", error);
    throw error;
  }
};

/************** EARN ***********/
export const fetchDailyReward = async () => {
  try {
    const response = await axiosInstance.get("/daily-login");
    return response.data;
  } catch (error) {
    console.error("Error fetching daily reward:", error);
    throw error;
  }
};

export const fetchLoginStreak = async () => {
  try {
    const response = await axiosInstance.get("/daily-login/streak");
    return response.data;
  } catch (error) {
    console.error("Error fetching login streak:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching available surveys:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching apply surveys:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching application surveys:", error);
    throw error;
  }
};

export const fetchScreenerSurveyById = async (screenerId: string | null) => {
  try {
    const response = await axiosInstance.get(`/screener-survey/${screenerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching screener survey by ID:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching screener survey by survey ID:", error);
    throw error;
  }
};

export const submitScreenerSurvey = async (payload: any, surveyId: string) => {
  try {
    const response = await axiosInstance.post(
      `/survey-apply/submit-screener/${surveyId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting screener survey:", error);
    throw error;
  }
};

export const submitPaidSurvey = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/ps/survey/respond", payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting paid survey:", error);
    throw error;
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
  } catch (error) {
    console.error("Error starting paid survey:", error);
    throw error;
  }
};

export const fetchSurveyById = async (surveyId: string | null) => {
  try {
    const response = await axiosInstance.get(`/survey/public/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching survey by ID:", error);
    throw error;
  }
};

/************** SHOP ***********/
export const fetchTotalPurchasedRespondents = async () => {
  try {
    const response = await axiosInstance.get("/purchases/respondents/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching total purchased respondents:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching screener participants:", error);
    throw error;
  }
};

export const fetchParticipantById = async (participantId: string | null) => {
  try {
    const response = await axiosInstance.get(
      `/paid-respondent/${participantId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching participant by ID:", error);
    throw error;
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
  } catch (error) {
    console.error("Error submitting reviewed participant:", error);
    throw error;
  }
};

/************** QUICK SURVEY ***********/

export const CreateQuickSurvey = async (surveyId: string | null) => {
  try {
    const response = await axiosInstance.post("/quick-survey", {
      survey_id: surveyId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
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
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
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
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
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
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};

/************** REPORTS ***********/

export const GetUserReportsCategories = async () => {
  try {
    const response = await axiosInstance.get(`/report/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetUserReportsInterest = async () => {
  try {
    const response = await axiosInstance.get(`/report/interests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
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
  } catch (error) {
    console.error("Error purchasing screener survey:", error);
    throw error;
  }
};

export const GetLatestReport = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/latest`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetMostRecentReport = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/recent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetPopularReport = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/popular`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetReportDetailsById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/report/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetReportCommentsAndReplies = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/report/blog/${id}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetReportBookmark = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `/report/blog/bookmark-status/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetReportStats = async () => {
  try {
    const response = await axiosInstance.get(`/report/blog/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const ReportBookmark = async (reportId: string) => {
  try {
    const response = await axiosInstance.post(`/report/blog/bookmark`, {
      report_id: reportId,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const EchoReportComment = async (comment_id: string) => {
  try {
    const response = await axiosInstance.post("/report/comment/echo", {
      comment_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const NestedReportComment = async (
  comment_id: string,
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const EditNestedReportComment = async (
  reply_id: string,
  comment_id: string,
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
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const DeleteNestedReportComment = async (
  reply_id: string,
  comment_id: string
) => {
  try {
    const response = await axiosInstance.delete("/report/comment", {
      data: {
        reply_id,
        comment_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const EchoNestedReportComment = async (
  reply_id: string,
  comment_id: string
) => {
  try {
    const response = await axiosInstance.post("/report/reply/echo", {
      reply_id,
      comment_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export const GetReportBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/report/blog/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};
