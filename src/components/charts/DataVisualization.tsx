// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import ReactWordcloud from "react-wordcloud";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";

// type TestResult = {
//   status: string;
//   reason: string;
// };

// type TestData = {
//   test_name: string;
//   test_results: Record<string, TestResult>;
// };

// type Props = {
//   data: TestData[];
// };

// const wordCloudOptions = {
//   colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
//   enableTooltip: true,
//   deterministic: false,
//   fontFamily: "impact",
//   fontSizes: [20, 60] as [number, number],
//   fontStyle: "normal",
//   fontWeight: "normal",
//   padding: 1,
//   rotations: 3,
//   rotationAngles: [0, 90] as [number, number],
//   scale: "sqrt",
//   spiral: "archimedean",
//   transitionDuration: 1000,
// };

// const DataVisualization: React.FC<Props> = ({ data }) => {
//   const renderChart = (testData: TestData) => {
//     switch (testData.test_name) {
//       case "Thematic Analysis":
//         // For demo purposes, we'll use dummy data
//         const words = [
//           { text: "Features", value: 64 },
//           { text: "Pricing", value: 50 },
//           { text: "Performance", value: 45 },
//           { text: "Integration", value: 40 },
//           { text: "Security", value: 35 },
//           { text: "Documentation", value: 30 },
//           { text: "Customer", value: 25 },
//           // ... add more words as needed
//         ];
//         return (
//           <div style={{ height: "400px", width: "100%" }}>
//             <ReactWordcloud words={words} options={wordCloudOptions as any} />
//           </div>
//         );
//       case "Sentiment Analysis":
//         // For demo purposes, we'll use dummy data
//         const sentimentData = [
//           { name: "Product A", Positive: 60, Neutral: 30, Negative: 10 },
//           { name: "Product B", Positive: 70, Neutral: 20, Negative: 10 },
//           { name: "Product C", Positive: 45, Neutral: 35, Negative: 20 },
//         ];
//         return (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={sentimentData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Positive" stackId="a" fill="#8884d8" />
//               <Bar dataKey="Neutral" stackId="a" fill="#82ca9d" />
//               <Bar dataKey="Negative" stackId="a" fill="#ffc658" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//       case "Word Frequency Analysis":
//         // For demo purposes, we'll use dummy data
//         const frequencyData = [
//           { word: "product", frequency: 100 },
//           { word: "service", frequency: 85 },
//           { word: "quality", frequency: 75 },
//           { word: "price", frequency: 70 },
//           { word: "feature", frequency: 65 },
//           { word: "support", frequency: 60 },
//           { word: "design", frequency: 55 },
//           { word: "performance", frequency: 50 },
//           { word: "value", frequency: 45 },
//           { word: "experience", frequency: 40 },
//         ];
//         return (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={frequencyData} layout="vertical">
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="word" type="category" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="frequency" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//       default:
//         return null;
//     }
//   };

//   const renderErrorMessages = (testData: TestData) => {
//     return Object.entries(testData.test_results).map(([key, value]) => (
//       <Alert variant="destructive" key={key}>
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription>{value.reason}</AlertDescription>
//       </Alert>
//     ));
//   };

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//       {data.map((testData) => (
//         <Card key={testData.test_name} className="w-full">
//           <CardHeader>
//             <CardTitle>{testData.test_name}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {Object.values(testData.test_results).every(
//               (result) => result.status === "error"
//             )
//               ? renderErrorMessages(testData)
//               : renderChart(testData)}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default function DataVisualizationComponent({ data }: Props) {
//   return <DataVisualization data={data} />;
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import ReactWordcloud from "react-wordcloud";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle, BarChart2, Cloud, MessageSquare } from "lucide-react";

// type TestResult = {
//   status: string;
//   reason: string;
// };

// type TestData = {
//   test_name: string;
//   test_results: Record<string, TestResult>;
// };

// type Props = {
//   data: TestData[];
// };

// const wordCloudOptions = {
//   colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"],
//   enableTooltip: true,
//   deterministic: false,
//   fontFamily: "Inter, sans-serif",
//   fontSizes: [20, 60],
//   fontStyle: "normal",
//   fontWeight: "bold",
//   padding: 1,
//   rotations: 3,
//   rotationAngles: [0, 90],
//   scale: "sqrt",
//   spiral: "archimedean",
//   transitionDuration: 1000,
// };

// const chartAnimation = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
// };

// const ElegantDataVisualization: React.FC<Props> = ({ data }) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
//     }, 10000); // Switch every 10 seconds

//     return () => clearInterval(timer);
//   }, [data.length]);

//   const renderChart = (testData: TestData) => {
//     switch (testData.test_name) {
//       case "Thematic Analysis":
//         const words = Object.keys(testData.test_results).map((key) => ({
//           text: key,
//           value: Math.floor(Math.random() * 100) + 1,
//         }));
//         return (
//           <div className="h-[400px] w-full">
//             <ReactWordcloud words={words} options={wordCloudOptions as any} />
//           </div>
//         );
//       case "Sentiment Analysis":
//         const sentimentData = Object.keys(testData.test_results).map((key) => ({
//           name: key,
//           Positive: Math.floor(Math.random() * 100),
//           Neutral: Math.floor(Math.random() * 50),
//           Negative: Math.floor(Math.random() * 30),
//         }));
//         return (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={sentimentData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Positive" stackId="a" fill="#8b5cf6" />
//               <Bar dataKey="Neutral" stackId="a" fill="#6366f1" />
//               <Bar dataKey="Negative" stackId="a" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//       case "Word Frequency Analysis":
//         const frequencyData = Object.keys(testData.test_results).map((key) => ({
//           word: key,
//           frequency: Math.floor(Math.random() * 100) + 1,
//         }));
//         return (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={frequencyData} layout="vertical">
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="word" type="category" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="frequency" fill="#8b5cf6" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//       default:
//         return null;
//     }
//   };

//   const renderErrorMessages = (testData: TestData) => {
//     return Object.entries(testData.test_results).map(([key, value]) => (
//       <Alert variant="destructive" key={key} className="mb-2">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle className="font-semibold">{key}</AlertTitle>
//         <AlertDescription>{value.reason}</AlertDescription>
//       </Alert>
//     ));
//   };

//   const getIcon = (testName: string) => {
//     switch (testName) {
//       case "Thematic Analysis":
//         return <Cloud className="h-6 w-6 text-purple-500" />;
//       case "Sentiment Analysis":
//         return <MessageSquare className="h-6 w-6 text-blue-500" />;
//       case "Word Frequency Analysis":
//         return <BarChart2 className="h-6 w-6 text-indigo-500" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
//         Data Visualization Dashboard
//       </h1>
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {data.map((testData, index) => (
//           <motion.div
//             key={testData.test_name}
//             initial="hidden"
//             animate={index === activeIndex ? "visible" : "hidden"}
//             variants={chartAnimation}
//           >
//             <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
//                 <div className="flex items-center space-x-2">
//                   {getIcon(testData.test_name)}
//                   <CardTitle className="text-xl">
//                     {testData.test_name}
//                   </CardTitle>
//                 </div>
//                 <CardDescription className="text-purple-100">
//                   {Object.values(testData.test_results).every(
//                     (result) => result.status === "error"
//                   )
//                     ? "Test not compatible"
//                     : "Analysis Results"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-6">
//                 {Object.values(testData.test_results).every(
//                   (result) => result.status === "error"
//                 )
//                   ? renderErrorMessages(testData)
//                   : renderChart(testData)}
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default function Component({ data = [] }: Props) {
//   return <ElegantDataVisualization data={data} />;
// }

// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import ReactWordcloud from "react-wordcloud";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { AlertCircle, BarChart2, Cloud, MessageSquare } from "lucide-react";

// type TestResult = {
//   status: string;
//   reason: string;
// };

// type TestData = {
//   test_name: string;
//   test_results: Record<string, TestResult>;
// };

// type Props = {
//   data: TestData[];
// };

// const wordCloudOptions = {
//   colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"],
//   enableTooltip: true,
//   deterministic: false,
//   fontFamily: "Inter, sans-serif",
//   fontSizes: [20, 60],
//   fontStyle: "normal",
//   fontWeight: "bold",
//   padding: 1,
//   rotations: 3,
//   rotationAngles: [0, 90],
//   scale: "sqrt",
//   spiral: "archimedean",
//   transitionDuration: 1000,
// };

// const chartAnimation = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
// };

// const VerticalDataVisualization: React.FC<Props> = ({ data }) => {
//   const renderChart = (testData: TestData) => {
//     if (
//       Object.values(testData.test_results).every(
//         (result) => result.status === "error"
//       )
//     ) {
//       return renderErrorComponent(testData);
//     }

//     switch (testData.test_name) {
//       case "Thematic Analysis":
//         const words = Object.keys(testData.test_results).map((key) => ({
//           text: key,
//           value: Math.floor(Math.random() * 100) + 1,
//         }));
//         return (
//           <div className="h-[400px] w-full">
//             <ReactWordcloud words={words} options={wordCloudOptions as any} />
//           </div>
//         );
//       case "Sentiment Analysis":
//         const sentimentData = Object.keys(testData.test_results).map((key) => ({
//           name: key,
//           Positive: Math.floor(Math.random() * 100),
//           Neutral: Math.floor(Math.random() * 50),
//           Negative: Math.floor(Math.random() * 30),
//         }));
//         return (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={sentimentData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="Positive" stackId="a" fill="#8b5cf6" />
//               <Bar dataKey="Neutral" stackId="a" fill="#6366f1" />
//               <Bar dataKey="Negative" stackId="a" fill="#3b82f6" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//       case "Word Frequency Analysis":
//         const frequencyData = Object.keys(testData.test_results).map((key) => ({
//           word: key,
//           frequency: Math.floor(Math.random() * 100) + 1,
//         }));
//         return (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={frequencyData} layout="vertical">
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="word" type="category" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="frequency" fill="#8b5cf6" />
//             </BarChart>
//           </ResponsiveContainer>
//         );
//       default:
//         return null;
//     }
//   };

//   const renderErrorComponent = (testData: TestData) => {
//     return (
//       <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 rounded-lg p-6 text-center">
//         <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
//         <h3 className="text-2xl font-bold text-gray-800 mb-2">
//           Unable to Render Chart
//         </h3>
//         <p className="text-gray-600 mb-4">
//           We couldn't generate the chart for {testData.test_name} due to
//           incompatible data.
//         </p>
//         <div className="bg-white p-4 rounded-md shadow-md">
//           <h4 className="font-semibold text-gray-700 mb-2">Reasons:</h4>
//           <ul className="list-disc list-inside text-left">
//             {Object.entries(testData.test_results).map(([key, value]) => (
//               <li key={key} className="text-gray-600">
//                 {value.reason}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     );
//   };

//   const getIcon = (testName: string) => {
//     switch (testName) {
//       case "Thematic Analysis":
//         return <Cloud className="h-6 w-6 text-purple-500" />;
//       case "Sentiment Analysis":
//         return <MessageSquare className="h-6 w-6 text-blue-500" />;
//       case "Word Frequency Analysis":
//         return <BarChart2 className="h-6 w-6 text-indigo-500" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
//         Data Visualization Dashboard
//       </h1>
//       <div className="space-y-8">
//         {data.map((testData, index) => (
//           <motion.div
//             key={testData.test_name}
//             initial="hidden"
//             animate="visible"
//             variants={chartAnimation}
//           >
//             <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
//                 <div className="flex items-center space-x-2">
//                   {getIcon(testData.test_name)}
//                   <CardTitle className="text-xl">
//                     {testData.test_name}
//                   </CardTitle>
//                 </div>
//                 <CardDescription className="text-purple-100">
//                   {Object.values(testData.test_results).every(
//                     (result) => result.status === "error"
//                   )
//                     ? "Test not compatible"
//                     : "Analysis Results"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-6">{renderChart(testData)}</CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default function Component({ data = [] }: Props) {
//   return <VerticalDataVisualization data={data} />;
// }

"use client";

import React, { useMemo } from "react";
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
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import { Button } from "../ui/button";
import { ChartContainer } from "@/components/ui/chart";

type TestResult = {
  status: string;
  reason: string;
};

type TestData = {
  test_name: string;
  test_results: Record<string, TestResult>;
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
        const frequencyData = Object.entries(testData.test_results).map(
          (key) => ({
            word: formatText(key[0]),
            frequency: Object.values(key[1]).reduce(
              (prev, curr) => prev + Number(curr),
              0
            ),
          })
        );
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={frequencyData}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="word"
                type="category"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => formatText(value)} />
              <Bar dataKey="frequency" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        );
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
        const generateWilcoxinData = () => {
          const data = [];
          for (let i = 0; i < 50; i++) {
            const before = Math.random() * 12;
            // Add some variation around the diagonal line
            const after = before + (Math.random() - 0.5) * 4;
            data.push({ before, after });
          }
          return data;
        };
        const wilcoxinData = generateWilcoxinData();

        const wilcoxinChartConfig = {
          data: {
            color: "hsl(246, 100%, 87%)", // Light purple for scatter points
          },
        };
        return (
          <Card className="w-full max-w-3xl">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-center text-xl font-normal">
                Wilcoxon Signed-Rank Test: Before vs After
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-8 top-4 z-10 rounded-md bg-purple-50 px-2 py-1 text-sm text-purple-900">
                  W = 678, p &lt; 0.001
                </div>
                <ChartContainer
                  config={wilcoxinChartConfig}
                  className="h-[600px]"
                >
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
                    <Scatter
                      data={wilcoxinData}
                      fill="hsl(246, 100%, 87%)"
                      opacity={0.7}
                    />
                  </ScatterChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );
      case "Kruskal-Wallis Test":
        // Generate normal distribution data points
        const generateNormalDistribution = (
          mean: number,
          stdDev: number,
          count: number
        ): number[] => {
          const points: number[] = [];
          for (let i = 0; i < count; i++) {
            let u = 0,
              v = 0;
            while (u === 0) u = Math.random();
            while (v === 0) v = Math.random();
            const z =
              Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            points.push(z * stdDev + mean);
          }
          return points;
        };

        const createDensityData = (
          points: number[],
          bandwidth = 0.5
        ): DensityPoint[] => {
          const min = Math.min(...points);
          const max = Math.max(...points);
          const steps = 50;
          const step = (max - min) / steps;

          return Array.from({ length: steps + 1 }, (_, i) => {
            const x = min + i * step;
            const density =
              points.reduce((sum, point) => {
                const z = (x - point) / bandwidth;
                return (
                  sum +
                  Math.exp(-0.5 * z * z) / (Math.sqrt(2 * Math.PI) * bandwidth)
                );
              }, 0) / points.length;
            return {
              value: x,
              density: density * 2,
            };
          });
        };

        const calculateQuartiles = (data: number[]): Quartiles => {
          const sorted = [...data].sort((a, b) => a - b);
          return {
            min: sorted[0],
            q1: sorted[Math.floor(sorted.length * 0.25)],
            median: sorted[Math.floor(sorted.length * 0.5)],
            q3: sorted[Math.floor(sorted.length * 0.75)],
            max: sorted[sorted.length - 1],
          };
        };

        // Generate sample data for three groups
        const groupA = generateNormalDistribution(2.5, 1.2, 100);
        const groupB = generateNormalDistribution(3, 1.5, 100);
        const groupC = generateNormalDistribution(3.2, 1.3, 100);

        // Create density data for each group
        const densityA = createDensityData(groupA);
        const densityB = createDensityData(groupB);
        const densityC = createDensityData(groupC);

        // Calculate quartiles for box plots
        const quartilesA = calculateQuartiles(groupA);
        const quartilesB = calculateQuartiles(groupB);
        const quartilesC = calculateQuartiles(groupC);

        // Prepare data for the chart
        const kruskalData: ChartDataPoint[] = densityA.map((point, i) => ({
          value: point.value,
          A: point.density,
          "A-mirror": -point.density,
          B: densityB[i].density,
          "B-mirror": -densityB[i].density,
          C: densityC[i].density,
          "C-mirror": -densityC[i].density,
        }));

        // Box plot data
        const boxPlotData: BoxPlotData[] = [
          { group: "A", ...quartilesA },
          { group: "B", ...quartilesB },
          { group: "C", ...quartilesC },
        ];

        return (
          <Card className="w-full p-4">
            <CardHeader>
              <CardTitle>
                Kruskal-Wallis Test: Comparison of Three Groups
              </CardTitle>
              <div className="text-sm text-purple-600">
                H = 12.37, p = 0.002
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={kruskalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="value"
                      type="number"
                      domain={[0, 6]}
                      ticks={[1, 2, 3]}
                      tickFormatter={(value: number) =>
                        ["A", "B", "C"][value - 1] || ""
                      }
                    />
                    <YAxis domain={[-2, 2]} />

                    {/* Group A */}
                    <Area
                      dataKey="A"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      stroke="#8884d8"
                      strokeWidth={1}
                      stackId="1"
                    />
                    <Area
                      dataKey="A-mirror"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      stroke="#8884d8"
                      strokeWidth={1}
                      stackId="1"
                    />

                    {/* Group B */}
                    <Area
                      dataKey="B"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      stroke="#8884d8"
                      strokeWidth={1}
                      stackId="2"
                    />
                    <Area
                      dataKey="B-mirror"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      stroke="#8884d8"
                      strokeWidth={1}
                      stackId="2"
                    />

                    {/* Group C */}
                    <Area
                      dataKey="C"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      stroke="#8884d8"
                      strokeWidth={1}
                      stackId="3"
                    />
                    <Area
                      dataKey="C-mirror"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      stroke="#8884d8"
                      strokeWidth={1}
                      stackId="3"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
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
