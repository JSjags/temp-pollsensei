import React from "react";
import Piechart from "../charts/Piechart";
import HorizontalBarChart from "../charts/Horizontalbat";
import BarChart from "../charts/BarChart";

interface SummaryProps {
  result: any[]; // assuming 'result' is an array of survey results
}

const colorPalette = [
  "#4CAF50",
  "#F44336",
  "#FFC107",
  "#2196F3",
  "#9C27B0",
  "#FF9800",
  "#795548",
  "#607D8B",
  "#E91E63",
  "#9E9E9E",
];

const Summary: React.FC<SummaryProps> = ({ result }) => {
  const transformDataForChart = (questionData: any) => {
    const { question_type } = questionData;
    let optionCounts: Record<string, number> = {};
    let totalCount = 0;

    switch (question_type) {
      case "single_choice":
      case "multiple_choice":
        questionData.selected_options?.forEach((option: string[]) => {
          option.forEach((choice) => {
            optionCounts[choice] = (optionCounts[choice] || 0) + 1;
            totalCount++;
          });
        });
        break;

      case "checkbox":
        questionData.selected_options?.forEach((options: string[]) => {
          options.forEach((option) => {
            const normalizedOption = option.toLowerCase().trim();
            optionCounts[normalizedOption] =
              (optionCounts[normalizedOption] || 0) + 1;
            totalCount++;
          });
        });
        break;

      case "boolean":
        const booleanResponses = questionData.boolean_responses || [];
        const yesCount = booleanResponses.filter((x: boolean) => x).length;
        const noCount = booleanResponses.filter((x: boolean) => !x).length;
        optionCounts = {
          Yes: yesCount,
          No: noCount,
        };
        totalCount = yesCount + noCount;
        break;

      case "rating_scale":
      case "likert_scale":
        questionData.scale_responses?.forEach((response: string) => {
          optionCounts[response] = (optionCounts[response] || 0) + 1;
          totalCount++;
        });
        break;

      case "drop_down":
        questionData.drop_down_responses?.forEach((response: string) => {
          optionCounts[response] = (optionCounts[response] || 0) + 1;
          totalCount++;
        });
        break;

      case "number":
        const numbers = questionData.number_responses || [];
        if (numbers.length) {
          const min = Math.min(...numbers);
          const max = Math.max(...numbers);
          const range = max - min;
          const bucketSize = range / 5;

          numbers.forEach((num: number) => {
            const bucketIndex = Math.floor((num - min) / bucketSize);
            const bucketStart = min + bucketIndex * bucketSize;
            const bucketEnd = bucketStart + bucketSize;
            const label = `${Math.round(bucketStart)}-${Math.round(bucketEnd)}`;
            optionCounts[label] = (optionCounts[label] || 0) + 1;
            totalCount++;
          });
        }
        break;

      default:
        return null;
    }

    // Calculate percentages using the total count of actual responses
    const labels = Object.keys(optionCounts);
    const data = Object.values(optionCounts).map(
      (count) => (count / totalCount) * 100
    );
    const backgroundColor = labels.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
        },
      ],
    };
  };

  return (
    <div>
      {result?.map((item, index) => {
        const chartData = transformDataForChart(item);

        if (!chartData) return null;

        const shouldUsePieChart =
          item.question_type === "single_choice" ||
          item.question_type === "multiple_choice" ||
          (chartData.labels.length > 2 && item.question_type !== "number");

        return (
          <div key={index}>
            {shouldUsePieChart ? (
              <Piechart
                title={`Question ${index + 1}`}
                question={item.question}
                data={chartData}
                allowDownload
              />
            ) : (
              <BarChart
                title={`Question ${index + 1}`}
                question={item.question}
                data={chartData}
                allowDownload
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
