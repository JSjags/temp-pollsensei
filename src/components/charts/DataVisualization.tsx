"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Info,
  RefreshCcw,
  ArrowLeft,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import WordFrequencyAnalysisComponent from "./WordFrequencyAnalysis";
import ChiSquareComponent from "./ChiSquare";
import SentimentAnalysisComponent from "./SentimentAnalysis";
import WilcoxonTestComponent from "./WilcoxonTest";
import MannWhitneyUComponent from "./MannWhitneyU";
import KruskalWallisComponent from "./KruskalWallis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios-instance";
import { useRouter } from "next/navigation";
import AnovaAnalysisComponent from "./AnovaAnalysis";
import SpearmanCorrelation from "./SpearmanCorrelation";
import TTest from "./TTest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { X } from "lucide-react";
import { LoadingOverlay } from "../loaders/page-loaders/AnalysisPageLoader";
type TestResult = {
  status: string;
  reason: string;
};

type TestData = {
  test_name: string;
  test_results: Record<string, TestResult>[];
  variable_id: string;
  survey_id: string;
  data: Array<{
    [key: string]: {
      u_statistic: number;
      p_value: number;
    };
  }>;
  stats_test_result_id: string;
};

export type TSurvey = {
  _id: string;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  organization_id: {
    _id: string;
    organization_name: string;
    admin_email: string;
  };
  survey_type: string;
  topic: string;
  description: string;
  sections: Array<{
    questions: Array<{
      question: string;
      description: string;
      question_type: string;
      is_required: boolean;
      options: string[];
      rows: any[];
      columns: any[];
      _id: string;
    }>;
    _id: string;
  }>;
  status: string;
  theme: string;
  color_theme: string;
  logo_url: string;
  header_url: string;
  header_text: { name: string; size: number };
  question_text: { name: string; size: number };
  body_text: { name: string; size: number };
  public_id: string;
  shorturl: string;
  generated_by: string;
  conversation_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  response_count: number;
};

interface DataVisualizationProps {
  data: {
    test_results: any[];
    [key: string]: any;
  };
  survey: {
    _id: string;
    topic: string;
    description: string;
    [key: string]: any;
  };
  rerunTests: () => void;
  onBack?: () => void;
  selectedTestsData: Array<{
    test_name: string;
    test_variables: string[];
  }>;
}

interface DensityPoint {
  value: number;
  density: number;
}

interface ChartDataPoint {
  value: number;
  A: number;
  "A-mirror": number;
  B: number;
  "B-mirror": number;
  C: number;
  "C-mirror": number;
}

interface Quartiles {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

interface BoxPlotData extends Quartiles {
  group: string;
}

const chartAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const formatText = (text: string) => {
  return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded shadow-md border border-gray-200">
        <p className="font-bold">{formatText(label)}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${formatText(entry.name)}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TestChartRenderer = ({ testData }: { testData: any }) => {
  const { test_name, test_results } = testData;

  const chartProps = {
    "data-test-id": test_name,
  };

  switch (test_name) {
    case "Chi-Square Test":
      return (
        <div {...chartProps}>
          <ChiSquareComponent data={testData} />
        </div>
      );

    case "Sentiment Analysis":
      return (
        <div {...chartProps}>
          <SentimentAnalysisComponent
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "Word Frequency Analysis":
      return (
        <div {...chartProps}>
          <WordFrequencyAnalysisComponent
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "Wilcoxon Signed-Rank Test":
      return (
        <div {...chartProps}>
          <WilcoxonTestComponent
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "Mann-Whitney U Test":
      return (
        <div {...chartProps}>
          <MannWhitneyUComponent
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "Kruskal-Wallis Test":
      return (
        <div {...chartProps}>
          <KruskalWallisComponent
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "ANOVA (Analysis of Variance)":
      return (
        <div {...chartProps}>
          <AnovaAnalysisComponent
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "Spearman's Rank Correlation":
      return (
        <div {...chartProps}>
          <SpearmanCorrelation
            test_name={test_name}
            test_results={test_results}
          />
        </div>
      );

    case "T-tests":
      return (
        <div {...chartProps}>
          <TTest test_name={test_name} test_results={test_results} />
        </div>
      );

    default:
      return (
        <Card className="p-6" {...chartProps}>
          <div className="flex items-center gap-4 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p>Chart visualization not yet implemented for {test_name}</p>
          </div>
        </Card>
      );
  }
};

const VerticalDataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  survey,
  rerunTests,
  onBack,
  selectedTestsData,
}) => {
  return (
    <div className="space-y-8 p-0 ">
      {data?.test_results.map((testData, index) => (
        <motion.div
          key={index}
          initial="hidden"
          animate="visible"
          variants={chartAnimation}
        >
          <TestChartRenderer testData={testData} />
        </motion.div>
      ))}
    </div>
  );
};

interface ReportResponse {
  data: {
    survey_id: string;
    report_url: string;
  };
}

interface ReportPayload {
  survey_id: string;
  conversation_id: string;
  variable_id: string;
  data: Array<{
    test_name: string;
    test_variables: string[];
  }>;
}

const DataVisualizationComponent = ({
  data,
  survey,
  rerunTests,
  onBack,
  selectedTestsData,
}: DataVisualizationProps) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedTests, setSelectedTests] = useState<
    Array<{
      test_name: string;
      test_variables: string[];
    }>
  >(selectedTestsData);

  useEffect(() => {
    setSelectedTests(selectedTestsData);
  }, [selectedTestsData]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedTests(selectedTestsData);
    }
    setShowReportDialog(open);
  };

  const getReportMutation = useMutation({
    mutationFn: async () => {
      const payload: ReportPayload = {
        survey_id: survey._id,
        conversation_id: survey.conversation_id,
        variable_id: data.variable_id,
        data: selectedTests,
      };

      const response = await axiosInstance.post<ReportResponse>(
        `/survey/analysis/survey-report`,
        payload
      );
      return response.data;
    },
    onSuccess: async (data) => {
      router.push((data as any).report_url);
      setShowReportDialog(false);
      toast.success("Report downloaded successfully!");
    },
    onError: (error) => {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    },
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleRemoveTest = (testName: string) => {
    setSelectedTests((prev) =>
      prev.filter((test) => test.test_name !== testName)
    );
  };

  const handleRemoveVariable = (testName: string, variable: string) => {
    setSelectedTests((prev) =>
      prev.map((test) =>
        test.test_name === testName
          ? {
              ...test,
              test_variables: test.test_variables.filter((v) => v !== variable),
            }
          : test
      )
    );
  };

  console.log(survey);
  console.log(data);

  return (
    <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-10 max-w-">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 sm:mb-10">
          <div className="w-full flex items-center">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="flex gap-2 items-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 hover:text-purple-700 active:scale-95"
              >
                <ArrowLeft
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                <span className="font-medium">Back to Test Suite</span>
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-end">
            <Button
              onClick={rerunTests}
              variant="outline"
              className="flex gap-2 items-center justify-center"
            >
              <RefreshCcw
                size={18}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
              <span className="font-medium">Regenerate</span>
            </Button>
            <Button
              onClick={() => setShowReportDialog(true)}
              disabled={getReportMutation.isPending}
              className="flex gap-2 items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white border-none hover:from-[#5B03B2] hover:to-[#9D50BB] active:scale-95 group w-full sm:w-auto"
            >
              {getReportMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-8 gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {survey.topic}
                </h1>
                <p>{survey.description}</p>
              </div>
            </div>
          </div>

          <div ref={contentRef} className="mb-20">
            <VerticalDataVisualization
              data={data}
              survey={survey}
              rerunTests={rerunTests}
              onBack={onBack}
              selectedTestsData={selectedTestsData}
            />
          </div>
        </div>
      </div>

      {getReportMutation.isPending && (
        <LoadingOverlay
          title="Downloading Report"
          subtitle="Hold on! Let PollSensei cook."
          isAnalysing
        />
      )}

      <Dialog open={showReportDialog} onOpenChange={handleDialogChange}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] flex flex-col z-[1000000]"
          overlayClassName="z-[1000000]"
        >
          <DialogHeader>
            <DialogTitle>Download Analysis Report</DialogTitle>
            <DialogDescription>
              Review and modify the tests and variables to include in your
              report
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto py-4 bg-gray-100 rounded-lg px-4 shadow-[inset_0_-8px_16px_-8px_rgba(0,0,0,0.3)]">
            <div className="space-y-4">
              {selectedTests.map((test) => (
                <div
                  key={test.test_name}
                  className="border rounded-lg p-4 space-y-2 bg-white"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{test.test_name}</h3>
                    <button
                      onClick={() => handleRemoveTest(test.test_name)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {test.test_variables.map((variable) => (
                      <div
                        key={variable}
                        className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <span>{variable}</span>
                        <button
                          onClick={() =>
                            handleRemoveVariable(test.test_name, variable)
                          }
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-4 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => getReportMutation.mutate()}
              disabled={getReportMutation.isPending}
              className="flex gap-2 items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white border-none hover:from-[#5B03B2] hover:to-[#9D50BB] active:scale-95 group w-full sm:w-auto"
            >
              {getReportMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Download Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataVisualizationComponent;
