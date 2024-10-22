import { TestLibraryFormatted } from "@/components/analysis/AnalysisTests";
import axiosInstance from "@/lib/axios-instance";

export const getLatestSurveyMilestone = async () => {
  const { data } = await axiosInstance.get(`/survey/milestone/last`);
  return data;
};

export const getSurveyMilestoneById = async (surveyId: string) => {
  const { data } = await axiosInstance.get(`/survey/milestone/${surveyId}`);
  return data;
};

export const getSingleSurvey = async ({
  surveyId,
}: {
  page?: number;
  page_size?: number;
  surveyId: string;
}) => {
  const { data } = await axiosInstance.get(`/survey/${surveyId}`);
  return data;
};

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

export const getSurveyTestsLibrary = async () => {
  const { data } = await axiosInstance.get(`/survey/analysis/libraries`);
  return data;
};

export const createTests = async ({ surveyId }: { surveyId: string }) => {
  const { data } = await axiosInstance.get(
    `/survey/analysis/create-test/${surveyId}`
  );
  return data;
};

export const runTest = async ({
  testData,
}: {
  testData: TestLibraryFormatted;
}) => {
  const { data } = await axiosInstance.post(
    `/survey/analysis/run-test`,
    testData
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
