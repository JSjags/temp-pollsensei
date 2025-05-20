"use client";
import axios from "axios";
import { BuyPaidRespondentResponse } from "@/types/survey";
import { participants } from "@/data";
import { NullableType } from "joi";

const pollsenseiAPIEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}`;

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

export const fetchOTP = async (
  userAccessToken: string | null | undefined,
  phone: string
) => {
  const headers = new Headers({
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  });

  const body = JSON.stringify({
    phone_number: phone,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}auth/send-phone-verification`,
    requestOptions
  );
  const data = await response.json();
  return data;
};

export const confirmOTP = async (
  userAccessToken: string | null | undefined,
  phone: string,
  otp: string
) => {
  const headers = new Headers({
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json",
  });

  const body = JSON.stringify({
    phone_number: phone,
    otp,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}auth/verify-phone`,
    requestOptions
  );
  const data = await response.json();
  return data;
};

/************** BUY PAID RESPONDENT ***********/
export const GetUserSurveyData = async (
  userAccessToken: string | null | undefined
): Promise<BuyPaidRespondentResponse> => {
  try {
    const url = `${pollsenseiAPIEndpoint}survey`;

    const response = await axios.get(url, {
      params: {
        page: 1,
        page_size: 6,
      },
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    // consoel.log({response})
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const PurchasePaidRespondent = async (
  userAccessToken: string | null | undefined,
  surveyId: string,
  selectedRespondentsNumber: number
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify({
    surveyId,
    numberOfRespondents: selectedRespondentsNumber,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}purchases/respondents/standard`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const PurchaseQualifiedPaidRespondent = async (
  userAccessToken: string | null | undefined,
  surveyId: string,
  selectedRespondentsNumber: number,
  qualifyingTemplateId: string | null
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify({
    surveyId,
    numberOfRespondents: selectedRespondentsNumber,
    qualifyingTemplateId,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}purchases/respondents/qualifying`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const ScreenerSurveyPurchase = async (
  userAccessToken: string | null | undefined,
  surveyId: string,
  selectedRespondentsNumber: number,
  screenerId: string | null
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify({
    screenerId,
    surveyId,
    numberOfRespondents: selectedRespondentsNumber,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}screener-survey/purchase`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const FilterPaidRespondent = async (
  userAccessToken: string | null | undefined,
  payload: any
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify(payload);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}purchases/respondents/criteria`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetRespondentData = async (
  userAccessToken: string | null | undefined,
  activeTab: string
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}paid-respondent/section/${activeTab}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    // console.log({ data });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const GetRespondentSectionData = async (
  userAccessToken: string | null | undefined,
  section: string
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}paid-respondent/section/${section}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const data = await response.json();
    // console.log({ data });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const CreateScreenerSurvey = async (
  userAccessToken: string | undefined,
  payload: any
) => {
  try {
    const response = await axios.post(
      `${pollsenseiAPIEndpoint}screener-survey`,
      payload,
      {
        params: {
          page: 1,
          page_size: 10,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userAccessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating screener survey:", error);
    throw error;
  }
};

/************** EARN ***********/
export const fetchDailyReward = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}daily-login`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Daily reward api response - ", data);
  return data;
};

export const fetchLoginStreak = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}daily-login/streak`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Daily reward api response - ", data);
  return data;
};

export const fetchUnrestrictedBalance = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}wallet/user-balance`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Usere balance api response - ", data);
  return data;
};

export const fetchAvailableSurveys = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}survey-apply/recommendations`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Available Surveys api response - ", data);
  return data;
};

export const fetchApplySurveys = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}screener-survey/screened-surveys`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Apply Surveys api response - ", data);
  return data;
};

export const fetchApplicationSurveys = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}survey-apply/applications`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Apply Surveys api response - ", data);
  return data;
};

export const fetchScreenerSurveyById = async (
  accessToken: string | null | undefined,
  screenerId: string | null
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}screener-survey/${screenerId}`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Available Surveys api response - ", data);
  return data;
};

export const fetchScreenerSurveyBySurveyId = async (
  accessToken: string | null | undefined,
  surveyId: string | null
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}screener-survey/survey/${surveyId}`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Available Surveys api response - ", data);
  return data;
};

export const submitScreenerSurvey = async (
  userAccessToken: string | null | undefined,
  payload: any,
  surveyId: string
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify(payload);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}survey-apply/submit-screener/${surveyId}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const submitPaidSurvey = async (
  userAccessToken: string | null | undefined,
  payload: any
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify(payload);

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}ps/survey/respond`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const startPaidSurvey = async (
  userAccessToken: string | null | undefined,
  surveyId: string | null,
  screenerId: string | null
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify({
    screenerId: screenerId,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}survey-apply/start/${surveyId}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchSurveyById = async (
  accessToken: string | null | undefined,
  surveyId: string | null
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}survey/public/${surveyId}`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Apply Surveys api response - ", data);
  return data;
};

/************** SHOP ***********/

export const fetchTotalPurchasedRespondents = async (
  accessToken: string | null | undefined
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}purchases/respondents/history`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Total Surveys api response - ", data);
  return data;
};

/************** SURVEY BOARD ***********/

export const fetchScreenerParticipants = async (
  accessToken: string | null | undefined,
  surveyId: string | null,
  screenerId: string | null
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}screener-survey/participant-review/${surveyId}/${screenerId}`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Participants api response - ", data);
  return data;
};

export const fetchParticipantById = async (
  accessToken: string | null | undefined,
  participantId: string | null
) => {
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    `${pollsenseiAPIEndpoint}paid-respondent/${participantId}`,
    requestOptions
  );
  const data = await response.json();
  // console.log("Participants api response - ", data);
  return data;
};

export const submitReviewedParticipant = async (
  userAccessToken: string | null | undefined,
  participantID: any,
  status: string
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${userAccessToken}`,
  });

  const body = JSON.stringify({
    applicationIds: participantID,
    status,
  });

  const requestOptions: RequestInit = {
    method: "PATCH",
    headers,
    body,
  };

  try {
    const response = await fetch(
      `${pollsenseiAPIEndpoint}screener-survey/applications/bulk-update`,
      requestOptions
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
