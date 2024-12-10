import React from "react";
import Piechart from "../charts/Piechart";
import HorizontalBarChart from "../charts/Horizontalbat";
import BarChart from "../charts/BarChart";

interface SummaryProps {
  result: any[]; // assuming 'result' is an array of survey results
}

const chartData2 = {
  labels: ["Yes", "No"], // x-axis labels
  datasets: [
    {
      label: "Survey Responses",
      data: [65, 35], // Corresponding data for each label
      backgroundColor: ["#36A2EB", "#FF6384"], // Colors for each bar
    },
  ],
};

const Summary: React.FC<SummaryProps> = ({ result }) => {
  // Function to process each question's selected_options data for pie chart
  const transformDataForChart = (questionData: any) => {
    const optionCounts: Record<string, number> = {};

    // Count occurrences of each selected option
    questionData.selected_options?.forEach((option: string[]) => {
      const selectedOption = option[0]; // Assume the first item in the array is the selected option
      if (!optionCounts[selectedOption]) {
        optionCounts[selectedOption] = 1;
      } else {
        optionCounts[selectedOption]++;
      }
    });

    // List of colors for dynamic assignment (expand this as needed)
    const colorPalette = ['#4CAF50', '#F44336', '#FFC107', '#2196F3', '#9C27B0'];

    // Prepare labels, data, and background color for the pie chart
    const labels = Object.keys(optionCounts);
    const data = Object.values(optionCounts).map((count) => (count / questionData.total_responses) * 100);
    const backgroundColor = labels.map((_, index) => colorPalette[index % colorPalette.length]);

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

  console.log(result)

  return (
    <div>
      {result?.map((item, index) => {
        // Skip items that don't have selected options
        // if (!item.selected_options || item.selected_options.length === 0) {
        //   return null;
        // }

        const chartData = transformDataForChart(item);

        return (
          <div key={index}>
            {/* If the question has more than 2 options, show a Piechart, otherwise HorizontalBarChart */}
            {chartData.labels.length > 2 ? (
              <Piechart
                title={`Question ${index + 1}`}
                question={item.question}
                data={chartData}
              />
            ) : (
              <BarChart
              title={`Question ${index + 1}`}
              question={item.question}
              data={chartData}
              />
              // <HorizontalBarChart
              //   title={`Question ${index + 1}`}
              //   question={item.question}
              //   data={chartData.datasets[0].data.map((value, idx) => ({
              //     label: chartData.labels[idx],
              //     percentage: value,
              //     color: chartData.datasets[0].backgroundColor[idx],
              //   }))}
              // />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
