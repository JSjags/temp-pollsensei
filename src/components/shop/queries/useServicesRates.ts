import { fetchAIAnalysisRate, fetchAIReporting, fetchAISurveyGenerationRate, fetchOCRDocumentRate, fetchVoiceTranscriptionRate } from "@/services/api/getServicesRate";
import { useQuery } from "@tanstack/react-query";

export const useAIAnalysisRate = () => {
  return useQuery({
    queryKey: ["ai-analysis-rate"],
    queryFn: fetchAIAnalysisRate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAISurveyGenerationRate = () => {
  return useQuery({
    queryKey: ["ai-survey-rate"],
    queryFn: fetchAISurveyGenerationRate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAIReportingRate = () => {
  return useQuery({
    queryKey: ["ai-reporting-rate"],
    queryFn: fetchAIReporting,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOCRDocumentRate = () => {
  return useQuery({
    queryKey: ["ocr-document"],
    queryFn: fetchOCRDocumentRate,
    staleTime: 1000 * 60 * 5,
  });
};


export const useVoiceTranscriptionRate = () => {
  return useQuery({
    queryKey: ["voice-transcription-rate"],
    queryFn: fetchVoiceTranscriptionRate,
    staleTime: 1000 * 60 * 5,
  });
};


