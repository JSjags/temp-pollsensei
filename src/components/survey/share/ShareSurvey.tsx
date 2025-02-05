import { DynamicDownloadPDF } from "@/components/reusable/DynamicPDFComponents";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface ShareSurveyProps {
  surveyId: string;
}

export function ShareSurvey({ surveyId }: ShareSurveyProps) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["survey-pdf", surveyId],
    queryFn: async () => {
      // Add API call here to get PDF URL
      return { url: "" };
    },
  });

  return (
    <Card className="p-4">
      <DynamicDownloadPDF
        url={data?.url}
        isLoading={isLoading}
        isSuccess={isSuccess}
      />
    </Card>
  );
}
