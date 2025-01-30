import React from "react";
import { GoDownload } from "react-icons/go";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SurveyState } from "@/redux/slices/survey.slice";
import { PDFDownloadLink } from "@react-pdf/renderer"; // Fix the import path
import SurveyPDFDocument from "./SurveyPDFDoucument";

// Define the props for SurveyPDFDocument
interface SurveyPDFDocumentProps {
  surveyData: {
    data?: SurveyState;
  };
}

// Define the props for DownloadPdfButton
interface Props {
  surveyData?: {
    data?: SurveyState;
  };
  isSuccess?: boolean;
}

const DownloadPdfButton = ({ surveyData, isSuccess }: Props) => {
  // Show a skeleton loader if data is not available
  if (!surveyData || !isSuccess) {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <PDFDownloadLink
      document={<SurveyPDFDocument surveyData={surveyData.data} />}
      fileName={`${surveyData.data?.topic}.pdf`}
    >
      {({ loading }) => (
        <Button
          className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-lg gap-2"
          disabled={loading}
        >
          <GoDownload size={20} />
          {loading ? "Generating PDF..." : "Download as PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadPdfButton;
