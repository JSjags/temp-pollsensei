"use client";
import axiosInstance from "@/lib/axios-instance";
import { BuyPaidRespondentResponse, SurveyData } from "@/types/survey";

/************** BECOME PAID RESPONDENT ***********/

export const getNationality = async () => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    "https://restcountries.com/v3.1/all",
    requestOptions
  );
  const data = await response.json();
  // console.log("Nationalities api response - ", data);
  return data;
};

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

export const fetchUnrestrictedBalance = async () => {
  try {
    const response = await axiosInstance.get("/wallet/user-balance");
    return response.data;
  } catch (error) {
    console.error("Error fetching unrestricted balance:", error);
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

export const quickSurvey = async (
  surveyId: string,
  numberOfRespondents: string
) => {
  try {
    const response = await axiosInstance.post("/quick-survey", {
      survey_id: surveyId,
      target_responses: Number(numberOfRespondents),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};
