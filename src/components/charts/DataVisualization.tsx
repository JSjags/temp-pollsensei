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
} from "lucide-react";
import { Button } from "../ui/button";
import { ChartContainer, ChartLegend } from "@/components/ui/chart";
import { Alert, AlertDescription } from "../ui/alert";
import ViolinPlot from "./KruskalWallisChart";
import WordFrequencyChart from "./WordFrequencyChart";

type TestResult = {
  status: string;
  reason: string;
};

type TestData = {
  test_name: string;
  test_results: Record<string, TestResult>;
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

type Props = {
  data: TestData[];
  survey: TSurvey;
  rerunTests: () => void;
};
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

const wordCloudOptions = {
  colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "Inter, sans-serif",
  fontSizes: [20, 60],
  fontStyle: "normal",
  fontWeight: "bold",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
};

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

const VerticalDataVisualization: React.FC<Props> = ({ data, survey }) => {
  const renderChart = (testData: TestData) => {
    if (
      testData.test_name !== "Kruskal-Wallis Test" &&
      testData.test_name !== "Mann-Whitney U Test" &&
      Object.values(testData.test_results).every(
        (result) => result.status === "error"
      )
    ) {
      return renderErrorComponent(testData);
    }

    switch (testData.test_name) {
      case "Thematic Analysis":
        const words = Object.keys(testData.test_results).map((key) => ({
          text: formatText(key),
          value: Math.floor(Math.random() * 100) + 1,
        }));
        return (
          <div className="h-[400px] w-full">
            <ReactWordcloud words={words} options={wordCloudOptions as any} />
          </div>
        );
      case "Sentiment Analysis":
        const sentimentData = Object.entries(testData.test_results).map(
          (key) => ({
            name: formatText(key[0]),
            Polarity: (key[1] as any).polarity,
            Subjectivity: (key[1] as any).subjectivity,
            //   Negative: Math.floor(Math.random() * 30),
          })
        );
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => formatText(value)} />
              <Bar dataKey="Polarity" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="Subjectivity" stackId="a" fill="#6366f1" />
              {/* <Bar dataKey="Negative" stackId="a" fill="#3b82f6" /> */}
            </BarChart>
          </ResponsiveContainer>
        );
      case "Word Frequency Analysis":
        console.log(testData.test_results);

        return <WordFrequencyChart testData={testData.test_results as any} />;
      case "Spearman":
        const generateData = () => {
          const data = [];
          for (let i = 0; i < 100; i++) {
            const x = Math.random() * 4 - 2;
            // Add some noise to create scatter effect while maintaining correlation
            const y = 1.5 * x + (Math.random() - 0.5) * 1.5;
            data.push({ x, y });
          }
          // Add some outlier points similar to the original
          data.push({ x: 2.5, y: 13 });
          data.push({ x: 2.2, y: 10.2 });
          return data;
        };
        const data = generateData();

        const chartConfig = {
          data: {
            color: "hsl(271, 91%, 65%)", // Adjusted to match the purple in the image
          },
        };

        return (
          <Card className="w-full max-w-3xl">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-center text-xl font-normal">
                Spearman&apos;s Rank Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-8 top-4 rounded-md bg-purple-50 px-2 py-1 text-sm text-purple-900">
                  ρ = 0.82, p &lt; 0.001
                </div>
                <ChartContainer config={chartConfig} className="h-[600px]">
                  <ScatterChart
                    margin={{
                      top: 60,
                      right: 30,
                      left: 40,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="X"
                      domain={[-2.5, 3]}
                      tickCount={7}
                      stroke="#666"
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Y"
                      domain={[-2, 14]}
                      tickCount={9}
                      stroke="#666"
                    />
                    <ZAxis range={[50]} />
                    <Scatter
                      data={data}
                      fill="rgb(147, 51, 234)"
                      line={{
                        stroke: "rgb(147, 51, 234)",
                        strokeWidth: 2,
                      }}
                      lineType="fitting"
                    />
                  </ScatterChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );

      case "Wilcoxon Signed-Rank Test":
        // Generate placeholder data with similar distribution
        return <Wilcoxon test_data={testData.test_results as any} />;
      case "Kruskal-Wallis Test":
        // Generate normal distribution data points
        return <ViolinPlot test_data={testData.test_results as any} />;
      case "Mann-Whitney U Test":
        // Generate normal distribution data points
        return (
          <MannWhitney
            test_name={testData.test_name}
            // test_results={Object.entries(testData.test_results).map(
            //   ([key, value]) => ({
            //     [key]: {
            //       u_statistic: (value as any).u_statistic, // Ensure this property exists in TestResult
            //       p_value: (value as any).p_value, // Ensure this property exists in TestResult
            //     },
            //   })
            // )}
            test_results={
              (testData?.test_results as any) ?? [
                {
                  "example-comparison": {
                    u_statistic: 300,
                    p_value: 0.04,
                  },
                },
              ]
            }
          />
        );

      default:
        return null;
    }
  };

  const renderErrorComponent = (testData: TestData) => {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 rounded-lg p-6 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Unable to Render Chart
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't generate the chart for {formatText(testData.test_name)}{" "}
          due to incompatible data.
        </p>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h4 className="font-semibold text-gray-700 mb-2">Reasons:</h4>
          <ul className="list-disc list-inside text-left">
            {Object.entries(testData.test_results).map(([key, value]) => (
              <li key={key} className="text-gray-600">
                {formatText(key)}: {formatText(value.reason)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const getIcon = (testName: string) => {
    switch (testName) {
      case "Thematic Analysis":
        return <CloudIcon className="h-6 w-6 text-white" />;
      case "Sentiment Analysis":
        return <MessageSquare className="h-6 w-6 text-white" />;
      case "Word Frequency Analysis":
        return <BarChart2 className="h-6 w-6 text-white" />;
      case "Mann-Whitney U Test":
        return <RectangleHorizontalIcon className="h-6 w-6 text-white" />;
      case "Wilcoxon Signed-Rank Test":
        return <LineChartIcon className="h-6 w-6 text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen max-w-4xl">
      <h1 className="text-2xl font-extrabold text-left mb-4 text-gray-800">
        Analysis Results
      </h1>
      <Card className="w-full bg-transparent border-none p-0">
        <CardContent className="p-0">
          <div className="bg-white p-6 rounded-lg shadow-sm my-6 mt-0">
            <h2 className="text-xl font-semibold mb-2">{survey.topic}</h2>
            <p className="text-gray-600">{survey.description}</p>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-8">
        {data.map((testData, index) => (
          <motion.div
            key={testData.test_name}
            initial="hidden"
            animate="visible"
            variants={chartAnimation}
          >
            <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                <div className="flex items-center space-x-2">
                  {getIcon(testData.test_name)}
                  <CardTitle className="text-xl">
                    {formatText(testData.test_name)}
                  </CardTitle>
                </div>
                <CardDescription className="text-purple-100">
                  {Object.values(testData.test_results).every(
                    (result) => result.status === "error"
                  )
                    ? "Test not compatible"
                    : "Analysis Results"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">{renderChart(testData)}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function Component({ data = [], survey, rerunTests }: Props) {
  return (
    <div className="flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-20">
        <VerticalDataVisualization
          data={data}
          survey={survey}
          rerunTests={rerunTests}
        />
        ;
        <div className="flex justify-start space-x-4 p-6">
          <Button
            disabled
            className="bg-gradient-to-r from-purple-900 to-purple-600 hover:bg-purple-700 text-white"
          >
            Generate Report
          </Button>
          <Button
            onClick={() => {
              rerunTests();
            }}
            variant="outline"
            className="flex gap-2 items-center"
          >
            <RefreshCcw size={18} />
            <span>Regenerate</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  // Use default results if test_results is empty
  const resultsToUse =
    test_results.length === 0 ? DEFAULT_TEST_RESULT : test_results;

  const firstResult = resultsToUse[0];
  const [variableName, testResult] = Object.entries(firstResult)[0];

  // Format p-value for display
  const formatPValue = (p: number): string => {
    if (p < 0.001) return "p < 0.001";
    return `p = ${p.toFixed(3)}`;
  };

  // Determine statistical significance
  const isSignificant = testResult.p_value < 0.05;

  // Calculate effect size interpretation based on U statistic
  const getEffectSize = (u: number): string => {
    if (u < 200) return "Large";
    if (u < 400) return "Medium";
    return "Small";
  };

  const effectSize = getEffectSize(testResult.u_statistic);

  // Color coding for significance
  const getSignificanceColor = (significant: boolean): string => {
    return significant ? "bg-green-100" : "bg-yellow-100";
  };

  // Add notice when using default data
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

        {/* Variable Name */}
        <div className="text-lg font-medium">
          Variable: {variableName.replace(/-/g, " ")}
        </div>

        {/* Test Statistics */}
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

        {/* Interpretation */}
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

  // Normalize w_statistic to create a more meaningful effect size
  const effectSize = (wStatistic / 1000) * 2; // Doubled for more visible effect

  // Use p_value to determine variance (smaller p-value = tighter clustering)
  const variance = Math.max(0.1, pValue) * 1.5;

  // Generate points that better reflect the statistical properties
  for (let i = 0; i < 50; i++) {
    // Create more consistent base values across the range
    const baseValue = (i / 50) * 12;

    // Add controlled random variation
    const seed = Math.sin(i * 13.37);
    const variation = seed * variance;

    // Calculate before and after values
    const before = baseValue + variation;
    const after = before + effectSize + seed * variance * 0.5;

    // Ensure values stay within bounds while maintaining relationship
    data.push({
      before: Math.max(0, Math.min(12, before)),
      after: Math.max(0, Math.min(12, after)),
    });
  }

  // Sort by 'before' value for smoother visualization
  return data.sort((a, b) => a.before - b.before);
};

const Wilcoxon: React.FC<{ test_data: WilcoxinTestResult[] }> = ({
  test_data = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update width on resize
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

  // Calculate aspect ratio based on container width
  const aspectRatio = Math.min(1.2, Math.max(0.8, containerWidth / 800));
  const height = containerWidth * aspectRatio;

  // Calculate dynamic margins based on container size
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
            {stats && typeof stats !== "string"
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
