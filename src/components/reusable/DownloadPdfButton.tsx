import React, { useEffect, useState } from "react";
import { GoDownload } from "react-icons/go";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { SurveyState } from "@/redux/slices/survey.slice";
import SurveyPDFDocument from "./SurveyPDFDocument";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { getSurveySettings } from "@/services/survey";
import { useParams } from "next/navigation";

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
  surveyId: string;
}

const DownloadPdfButton = ({ surveyData, isSuccess, surveyId }: Props) => {
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [headerBase64, setHeaderBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    collect_email_addresses: false,
    collect_name_of_respondents: false,
  });

  const {
    data: surveySettings,
    isLoading: isSurveySettingsLoading,
    isSuccess: isSurveySettingsSuccess,
    isError: isSurveySettingsError,
    refetch: refetchSettings,
  } = useQuery<{
    regional_availability: {
      status: boolean;
      regions: string[];
    };
    survey_id: {
      _id: string;
      topic: string;
    };
    _id: string;
    language: string;
    collect_email_addresses: boolean;
    collect_name_of_respondents: boolean;
    allow_survey_edit: boolean;
    receive_email_notification: boolean;
    response_threshold: number;
    voice_response_duration_in_seconds: number;
  }>({
    queryKey: ["survey-settings", surveyId],
    queryFn: () => getSurveySettings({ surveyId }),
  });

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

  useEffect(() => {
    if (surveySettings) {
      setFormState({
        collect_email_addresses: surveySettings.collect_email_addresses,
        collect_name_of_respondents: surveySettings.collect_name_of_respondents,
      });
    }
  }, [surveySettings]);

  if (!surveyData || !isSuccess || isSurveySettingsLoading) {
    return <Skeleton className="h-12 w-full" />;
  }

  // if (isLoading) {
  //   return <div>Loading images...</div>;
  // }

  return (
    <>
      {isSurveySettingsSuccess && (
        <PDFDownloadLink
          document={
            <SurveyPDFDocument
              nameAndEmail={{
                email: formState.collect_email_addresses,
                name: formState.collect_name_of_respondents,
              }}
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
                {loading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  "Download as PDF"
                )}
              </Button>
            ) as any
          }
        </PDFDownloadLink>
      )}
      {isSurveySettingsError && (
        <div>PDF couldn't be generated, please try again later.</div>
      )}
    </>
  );
};

export default DownloadPdfButton;
