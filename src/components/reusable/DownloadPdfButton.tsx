import React, { useEffect, useState } from "react";
import { GoDownload } from "react-icons/go";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SurveyState } from "@/redux/slices/survey.slice";
import SurveyPDFDocument from "./SurveyPDFDocument";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  console.log(
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })
  );

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface Props {
  surveyData?: {
    data?: SurveyState;
  };
  isSuccess?: boolean;
}

const DownloadPdfButton = ({ surveyData, isSuccess }: Props) => {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [headerBase64, setHeaderBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (surveyData?.data?.logo_url) {
          const base64 = await fetchImageAsBase64(
            surveyData.data.logo_url as string
          );
          setLogoBase64(base64);
        }
        if (surveyData?.data?.header_url) {
          const base64 = await fetchImageAsBase64(
            surveyData.data.header_url as string
          );
          setHeaderBase64(base64);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [surveyData?.data?.logo_url, surveyData?.data?.header_url]);

  if (!surveyData || !isSuccess) {
    return <Skeleton className="h-12 w-full" />;
  }

  if (isLoading) {
    return <div>Loading images...</div>;
  }

  return (
    <PDFDownloadLink
      document={
        <SurveyPDFDocument
          surveyData={
            {
              ...surveyData.data,
              logo_url: logoBase64,
              header_url: headerBase64,
            } as any
          }
        />
      }
      fileName={`${surveyData.data?.topic}.pdf`}
    >
      {/* @ts-ignore */}
      {({ loading }) =>
        (
          <Button
            className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-lg gap-2"
            disabled={loading}
          >
            <GoDownload size={20} />
            {loading ? "Generating PDF..." : "Download as PDF"}
          </Button>
        ) as any
      }
    </PDFDownloadLink>
  );
};

export default DownloadPdfButton;
