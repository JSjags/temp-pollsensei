"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  ComposedChart,
  Area,
  Rectangle,
  LabelList,
  Line,
} from "recharts";
import ReactWordcloud from "react-wordcloud";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertCircle,
  BarChart2,
  Cloud,
  CloudIcon,
  Info,
  LineChartIcon,
  MessageSquare,
  RectangleHorizontalIcon,
  RefreshCcw,
  ArrowLeft,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { ChartContainer, ChartLegend } from "@/components/ui/chart";
import { Alert, AlertDescription } from "../ui/alert";
import ViolinPlot from "./KruskalWallisChart";
import WordFrequencyAnalysisComponent from "./WordFrequencyAnalysis";
import Image from "next/image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FileDown } from "lucide-react";
import html2pdf from "html2pdf.js";
import { pollsensei_new_logo } from "@/assets/images";
import ChiSquareComponent from "./ChiSquare";
import SentimentAnalysisComponent from "./SentimentAnalysis";
import WilcoxonTestComponent from "./WilcoxonTest";
import MannWhitneyUComponent from "./MannWhitneyU";
import KruskalWallisComponent from "./KruskalWallis";
import { saveAs } from "file-saver";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  convertInchesToTwip,
} from "docx";
import html2canvas from "html2canvas";
import AnovaAnalysis from "./AnovaAnalysis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios-instance";
import { useRouter } from "next/navigation";

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
          <SentimentAnalysisComponent data={testData} />
        </div>
      );

    case "Word Frequency Analysis":
      return (
        <div {...chartProps}>
          <WordFrequencyAnalysisComponent data={testData} />
        </div>
      );

    case "Wilcoxon Signed-Rank Test":
      return (
        <div {...chartProps}>
          <WilcoxonTestComponent data={testData} />
        </div>
      );

    case "Mann-Whitney U Test":
      return (
        <div {...chartProps}>
          <MannWhitneyUComponent data={testData} />
        </div>
      );

    case "Kruskal-Wallis Test":
      return (
        <div {...chartProps}>
          <KruskalWallisComponent data={testData} />
        </div>
      );

    case "ANOVA (Analysis of Variance)":
      return (
        <div {...chartProps}>
          <AnovaAnalysis data={testData} />
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

const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #666",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#5B03B2",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  chart: {
    marginVertical: 15,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// const AnalysisPDFDocument = ({ data, survey }: Props) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       <View style={pdfStyles.header}>
//         <Text style={pdfStyles.title}>{survey.topic} - Analysis Report</Text>
//         <Text style={pdfStyles.text}>Generated by PollSensei</Text>
//       </View>
//       {data.test_results.map((testData, index) => (
//         <View key={index} style={pdfStyles.section}>
//           <Text style={pdfStyles.title}>{testData.test_name}</Text>
//           {Object.entries(testData.test_results || {}).map(
//             ([key, value], idx) => (
//               <View key={idx}>
//                 <Text style={pdfStyles.text}>
//                   {formatText(key)}:{" "}
//                   {typeof value === "object" ? JSON.stringify(value) : value}
//                 </Text>
//               </View>
//             )
//           )}
//         </View>
//       ))}
//     </Page>
//   </Document>
// );

interface ReportResponse {
  data: {
    survey_id: string;
    report_url: string;
  };
}

const DataVisualizationComponent = ({
  data,
  survey,
  rerunTests,
  onBack,
}: DataVisualizationProps) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const getReportMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post<ReportResponse>(
        `/survey/analysis/survey-report`,
        {
          survey_id: survey._id,
        }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      router.push((data as any).report_url);
    },
    onError: (error) => {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    },
  });

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
              onClick={() => getReportMutation.mutate()}
              disabled={getReportMutation.isPending}
              className="flex gap-2 items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none hover:from-purple-700 hover:to-indigo-700 active:scale-95 group w-full sm:w-auto"
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface MannTestResult {
  [key: string]: {
    u_statistic: number;
    p_value: number;
  };
}

interface MannWhitneyProps {
  test_name: string;
  test_results: MannTestResult[];
}

const DEFAULT_TEST_RESULT: MannTestResult[] = [
  {
    "example-comparison": {
      u_statistic: 300,
      p_value: 0.04,
    },
  },
];

const MannWhitney: React.FC<MannWhitneyProps> = ({
  test_name,
  test_results = DEFAULT_TEST_RESULT,
}) => {
  const resultsToUse =
    test_results.length === 0 ? DEFAULT_TEST_RESULT : test_results;

  const firstResult = resultsToUse[0];
  const [variableName, testResult] = Object.entries(firstResult)[0];

  const formatPValue = (p: number): string => {
    if (p < 0.001) return "p < 0.001";
    return `p = ${p.toFixed(3)}`;
  };

  const isSignificant = testResult.p_value < 0.05;

  const getEffectSize = (u: number): string => {
    if (u < 200) return "Large";
    if (u < 400) return "Medium";
    return "Small";
  };

  const effectSize = getEffectSize(testResult.u_statistic);

  const getSignificanceColor = (significant: boolean): string => {
    return significant ? "bg-green-100" : "bg-yellow-100";
  };

  const isUsingDefault = test_results.length === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {test_name}
          <Info className="h-4 w-4 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUsingDefault && (
          <Alert className="bg-blue-50">
            <AlertDescription>
              Showing example data. No test results were provided.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-lg font-medium capitalize">
          Variable: {variableName.replace(/[-_]/g, " ")}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-gray-600">U Statistic</div>
            <div className="text-2xl font-bold">{testResult.u_statistic}</div>
            <div className="text-sm text-gray-600">
              Effect Size: {effectSize}
            </div>
          </div>

          <div
            className={`rounded-lg p-4 ${getSignificanceColor(isSignificant)}`}
          >
            <div className="text-sm text-gray-600">P-Value</div>
            <div className="text-2xl font-bold">
              {formatPValue(testResult.p_value)}
            </div>
            <div className="text-sm text-gray-600">
              {isSignificant ? "Statistically Significant" : "Not Significant"}
            </div>
          </div>
        </div>

        <Alert className="mt-4">
          <AlertDescription>
            {isSignificant
              ? `There is strong statistical evidence to suggest a significant difference between the groups (${formatPValue(
                  testResult.p_value
                )}). The test shows a ${effectSize.toLowerCase()} effect size based on the U statistic of ${
                  testResult.u_statistic
                }.`
              : `There is not enough statistical evidence to suggest a significant difference between the groups (${formatPValue(
                  testResult.p_value
                )}). The test shows a ${effectSize.toLowerCase()} effect size based on the U statistic of ${
                  testResult.u_statistic
                }.`}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

interface WilcoxinTestResult {
  [key: string]:
    | {
        w_statistic: number;
        p_value: number;
      }
    | string
    | null;
}

const generateDeterministicData = (wStatistic: number, pValue: number) => {
  const data = [];
  const effectSize = (wStatistic / 1000) * 2;
  const variance = Math.max(0.1, pValue) * 1.5;

  for (let i = 0; i < 50; i++) {
    const baseValue = (i / 50) * 12;
    const seed = Math.sin(i * 13.37);
    const variation = seed * variance;
    const before = baseValue + variation;
    const after = before + effectSize + seed * variance * 0.5;

    data.push({
      before: Math.max(0, Math.min(12, before)),
      after: Math.max(0, Math.min(12, after)),
    });
  }

  return data.sort((a, b) => a.before - b.before);
};

const Wilcoxon: React.FC<{ test_data: WilcoxinTestResult[] }> = ({
  test_data = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const resultsToUse =
    test_data.length === 0
      ? [
          {
            "product_experience-customer_service_quality": {
              w_statistic: 245,
              p_value: 0.03,
            },
          },
        ]
      : test_data;

  const validResults = resultsToUse.filter((result) => {
    const [_, value] = Object.entries(result)[0];
    return value !== null && typeof value !== "string";
  });

  const firstValidResult = validResults[0];
  const [comparisonName, stats] = firstValidResult
    ? Object.entries(firstValidResult)[0]
    : [null, null];

  const scatterData = useMemo(() => {
    if (stats && typeof stats !== "string") {
      return generateDeterministicData(
        (stats as any).w_statistic,
        (stats as any).p_value
      );
    }
    return generateDeterministicData(245, 0.03);
  }, [stats]);

  const isUsingDefault = test_data.length === 0;

  const aspectRatio = Math.min(1.2, Math.max(0.8, containerWidth / 800));
  const height = containerWidth * aspectRatio;

  const margins = {
    top: Math.max(20, containerWidth * 0.05),
    right: Math.max(15, containerWidth * 0.03),
    bottom: Math.max(20, containerWidth * 0.05),
    left: Math.max(40, containerWidth * 0.06),
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-center text-xl font-normal capitalize">
          {comparisonName?.split(/[-_]/).join(" vs ")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isUsingDefault && (
          <Alert className="mb-4 bg-blue-50">
            <AlertDescription>
              Showing example data. No valid test results were provided.
            </AlertDescription>
          </Alert>
        )}
        <div className="relative" ref={containerRef}>
          <div className="absolute left-8 top-4 z-10 rounded-md bg-purple-50 px-2 py-1 text-sm text-purple-900">
            {stats &&
            typeof stats !== "string" &&
            (stats as any).p_value !== undefined
              ? `W = ${(stats as any).w_statistic}, p ${
                  (stats as any).p_value < 0.001
                    ? "< 0.001"
                    : `= ${(stats as any).p_value.toFixed(3)}`
                }`
              : "Statistics not available"}
          </div>
          <div style={{ height: `${height}px`, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={margins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  type="number"
                  dataKey="before"
                  name="Before"
                  domain={[0, 12]}
                  tickCount={7}
                  stroke="#666"
                  label={{ value: "Before", position: "bottom", offset: 0 }}
                />
                <YAxis
                  type="number"
                  dataKey="after"
                  name="After"
                  domain={[0, 12]}
                  tickCount={7}
                  stroke="#666"
                  label={{
                    value: "After",
                    angle: -90,
                    position: "left",
                    offset: 20,
                  }}
                />
                <ZAxis range={[20, 60]} />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 12, y: 12 },
                  ]}
                  stroke="red"
                  strokeDasharray="5 5"
                  ifOverflow="extendDomain"
                />
                <Scatter data={scatterData} fill="#80008070" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualizationComponent;
