import axiosInstance from "@/lib/axios-instance";

export const fetchAIAnalysisRate = async () => {
  try {
    const response = await axiosInstance.get(
      "purchases/service/rates/ai-analysis"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching ai-analysis rate:", error);
    throw error;
  }
};

export const fetchVoiceTranscriptionRate = async () => {
  try {
    const response = await axiosInstance.get(
      "/purchases/service/rates/voice-transcription"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching voice rate:", error);
    throw error;
  }
};

export const fetchAIReporting = async () => {
  try {
    const response = await axiosInstance.get(
      "purchases/service/rates/ai-reporting"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching ai-reporting rate:", error);
    throw error;
  }
};

export const fetchOCRDocumentRate = async () => {
  try {
    const response = await axiosInstance.get(
      "purchases/service/rates/ocr-document"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching ocr-document rate:", error);
    throw error;
  }
};

export const fetchAISurveyGenerationRate = async () => {
  try {
    const response = await axiosInstance.get(
      "purchases/service/rates/ai-survey-generation"
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching ai-survey generation rate:", error);
    throw error;
  }
};
