import axiosInstance from "@/lib/axios-instance";

export const getSurveySettings = async ({ surveyId }: { surveyId: string }) => {
  const { data } = await axiosInstance.get(`/survey/setting/${surveyId}`);
  return data;
};

export const updateSurveySettings = async (
  surveyId: string,
  data: {
    language: string;
    availabile_regions: string[];
    collect_email_addresses: boolean;
    collect_name_of_respondents: boolean;
    allow_survey_edit: boolean;
    receive_email_notification: boolean;
    response_threshold: number;
  }
) => {
  const response = await axiosInstance.patch(
    `/survey/setting/${surveyId}`,
    data
  );
  return response.data;
};
