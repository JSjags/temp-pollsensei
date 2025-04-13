import { fetchAIAnalysisRate, fetchAIReporting, fetchAISurveyGenerationRate, fetchOCRDocumentRate, fetchVoiceTranscriptionRate } from "@/services/api/getServicesRate";
import { useQuery } from "@tanstack/react-query";

export const useAIAnalysisRate = () => {
  return useQuery({
    queryKey: ["aiAnalysisRate"],
    queryFn: fetchAIAnalysisRate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAISurveyGenerationRate = () => {
  return useQuery({
    queryKey: ["aiSurveyRate"],
    queryFn: fetchAISurveyGenerationRate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAIReportingRate = () => {
  return useQuery({
    queryKey: ["aiReportingRate"],
    queryFn: fetchAIReporting,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOCRDocumentRate = () => {
  return useQuery({
    queryKey: ["ocrDocument"],
    queryFn: fetchOCRDocumentRate,
    staleTime: 1000 * 60 * 5,
  });
};


export const useVoiceTranscriptionRate = () => {
  return useQuery({
    queryKey: ["aiAnalysisRate"],
    queryFn: fetchVoiceTranscriptionRate,
    staleTime: 1000 * 60 * 5,
  });
};


