import axiosInstance from "@/lib/axios-instance";

export const getSurveyVariableNames = async ({
  page = 1,
  page_size = 10,
  surveyId,
}: {
  page?: number;
  page_size?: number;
  surveyId: string;
}) => {
  const { data } = await axiosInstance.get(
    `/survey/analysis/variables/${surveyId}`
  );
  return data;
};

export const getSurveyResponses = async ({
  page = 1,
  page_size = 10,
  surveyId,
}: {
  page?: number;
  page_size?: number;
  surveyId: string;
}) => {
  const { data } = await axiosInstance.get(
    `/response/individual/${surveyId}?page=${page}&page_size=${page_size}`
  );
  return data;
};
