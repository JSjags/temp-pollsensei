import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

type TestResult = Record<string, Record<string, number>>;
type WordFrequencyChartProps = {
  testData: TestResult[];
};

// Helper function to format text
const formatText = (text: string) => text.replace(/_/g, " ");

// Default test data
const defaultTestData: TestResult[] = [
  {
    benefits: { something: 5, nil: 2 },
    challenges: { nothing: 3, something: 7 },
  },
];

const WordFrequencyChart: React.FC<WordFrequencyChartProps> = ({
  testData = [],
}) => {
  // Use default data if the prop is an empty array

  const dataToUse = testData.length > 0 ? testData : defaultTestData;

  // Aggregate word frequencies from dataToUse
  const frequencyData = Object.values(dataToUse[0]).reduce((acc, category) => {
    Object.entries(category).forEach(([word, count]) => {
      const lowerCaseWord = word.toLowerCase(); // Normalize case
      acc[lowerCaseWord] = (acc[lowerCaseWord] || 0) + Number(count);
    });
    return acc;
  }, {} as Record<string, number>);

  // Map the aggregated data to a format suitable for the chart
  const chartData = Object.entries(frequencyData).map(([word, frequency]) => ({
    word: formatText(word),
    frequency,
  }));

  // Custom Tooltip (optional)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{ background: "#fff", border: "1px solid #ccc", padding: 10 }}
        >
          <p>{payload[0].payload.word}</p>
          <p>
            <strong>Frequency:</strong> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="word"
          type="category"
          width={150}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => formatText(value)} />
        <Bar dataKey="frequency" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WordFrequencyChart;
