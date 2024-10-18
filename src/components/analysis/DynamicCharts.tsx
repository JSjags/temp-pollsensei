import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useFetchASurveyQuery } from "@/services/survey.service";
import { useParams } from "next/navigation";

interface MannWhitneyResult {
  [key: string]: {
    u_statistic: number;
    p_value: number;
  };
}

interface SentimentResult {
  [key: string]: {
    polarity: number;
    subjectivity: number;
  };
}

interface ThematicResult {
  [key: string]: string | null;
}

interface TestResult {
  test_name: string;
  test_results:
    | MannWhitneyResult[]
    | SentimentResult
    | ThematicResult
    | Record<string, never>;
}

interface DynamicChartsProps {
  data: TestResult[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
];

const DynamicCharts: React.FC<DynamicChartsProps> = ({ data }) => {
  const params = useParams();
  const { data: surveyData, isLoading } = useFetchASurveyQuery(params.id);

  //   console.log(surveyData.data.topic);

  const renderChart = (testName: string, testResults: any) => {
    switch (testName) {
      case "Mann-Whitney U Test":
        if (Array.isArray(testResults) && testResults.length > 0) {
          const processedData = testResults.map((result: MannWhitneyResult) => {
            const key = Object.keys(result)[0];
            return {
              comparison: key.replace(/_/g, " "),
              u_statistic: result[key].u_statistic,
              p_value: result[key].p_value,
            };
          });

          return (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={processedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="comparison" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="u_statistic" fill="#8884d8" />
                <Bar dataKey="p_value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          );
        }
        return <p>No Mann-Whitney U Test data available.</p>;

      case "Sentiment Analysis":
        if (testResults && Object.keys(testResults).length > 0) {
          const sentimentData = Object.entries(testResults).map(
            ([category, values]: [string, any]) => ({
              category,
              polarity: values.polarity,
              subjectivity: values.subjectivity,
            })
          );

          return (
            <div className="grid grid-cols-2 gap-4">
              {sentimentData.map(({ category, polarity, subjectivity }) => (
                <div key={category} className="flex flex-col items-center">
                  <h3 className="text-center mb-2">
                    {category.replace(/_/g, " ")}
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Polarity", value: polarity },
                          { name: "Subjectivity", value: subjectivity },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          );
        }
        return <p>No Sentiment Analysis data available.</p>;

      case "Thematic Analysis":
        if (testResults && Object.keys(testResults).length > 0) {
          const themes = Object.entries(testResults).filter(
            ([_, value]) => value !== null
          );
          if (themes.length === 0) {
            return <p>No Thematic Analysis data available.</p>;
          }
          return (
            <div className="space-y-4">
              {themes.map(([theme, content]) => (
                <div key={theme} className="border p-4 rounded">
                  <h3 className="text-lg font-semibold mb-2">
                    {theme.replace(/_/g, " ")}
                  </h3>
                  <p>{content}</p>
                </div>
              ))}
            </div>
          );
        }
        return <p>No Thematic Analysis data available.</p>;

      case "Word Frequency Analysis":
        // Placeholder: You can implement a word cloud here if desired
        return <p>No Word Frequency Analysis data available.</p>;

      default:
        return <p>No chart available for this test.</p>;
    }
  };

  return (
    <div className="dynamic-charts space-y-8">
      <div className="space-y-8 max-w-4xl mx-auto">
        <Card className="w-full bg-transparent border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Survey Analysis
            </CardTitle>
            <span className="text-sm text-muted-foreground bg-purple-100 text-purple-800 px-2 py-1 rounded-full"></span>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-lg shadow-sm my-6">
              <h2 className="text-xl font-semibold mb-2">
                {surveyData.data.topic}
              </h2>
              <p className="text-gray-600">{surveyData.data.description}</p>
            </div>
            <div className="space-y-8">
              {data.map(({ test_name, test_results }) => (
                <Card key={test_name} className="mb-6 p-4">
                  <h2 className="text-2xl font-bold mb-4">{test_name}</h2>
                  {renderChart(test_name, test_results)}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center space-x-4">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Generate Report
          </Button>
          <Button variant="outline">Regenerate</Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicCharts;
