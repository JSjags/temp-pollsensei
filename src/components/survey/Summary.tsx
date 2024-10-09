// import React from "react";
// import Piechart from "../charts/Piechart";
// import HorizontalBarChart from "../charts/Horizontalbat";
// import LineChart from "../charts/SurveyLineChart";

// const data = {
//   labels: ["Excellent", "Good", "Fair", "Poor"],
//   datasets: [
//     {
//       data: [30, 35, 20, 15],
//       backgroundColor: ["#8B5CF6", "#FBBF24", "#3B82F6", "#EC4899"],
//     },
//   ],
// };

// const data1 = [
//   { label: "Less than 15 minutes", percentage: 80, color: "#8B5CF6" }, // Purple
//   { label: "15 - 30 minutes", percentage: 60, color: "#FBBF24" }, // Yellow
//   { label: "31 - 60 minutes", percentage: 40, color: "#EC4899" }, // Pink
//   { label: "More than 60 minutes", percentage: 20, color: "#3B82F6" }, // Blue
// ];

// const labels = [
//   "1 Oct",
//   "3 Oct",
//   "7 Oct",
//   "10 Oct",
//   "14 Oct",
//   "20 Oct",
//   "23 Oct",
//   "27 Oct",
//   "30 Oct",
// ];

// const datasets = [
//   {
//     label: "Wire transfer",
//     data: [1, 2, 1.5, 3, 4, 3.5, 2.5, 2, 3],
//     borderColor: "#8B5CF6", // Purple
//     backgroundColor: "rgba(139, 92, 246, 0.2)",
//   },
//   {
//     label: "Mobile payment",
//     data: [1, 1.5, 2, 2.5, 3.5, 3, 2.8, 2.2, 2.5],
//     borderColor: "#EC4899", // Pink
//     backgroundColor: "rgba(236, 72, 153, 0.2)",
//   },
// ];

// interface SummaryProps {
//   result: any; 
// }

// const Summary:React.FC<SummaryProps> = ({result}) => {

//   const transformData = (questionData: any) => {
//     const optionCounts: Record<string, number> = {};


//     questionData.selected_options?.forEach((option: string[]) => {
//       const selectedOption = option[0]; 
//       if (!optionCounts[selectedOption]) {
//         optionCounts[selectedOption] = 1;
//       } else {
//         optionCounts[selectedOption]++;
//       }
//     });


//     const colorPalette = ['#4CAF50', '#F44336', '#FFC107', '#2196F3', '#9C27B0'];

   
//     return Object.entries(optionCounts).map(([label, count], index) => ({
//       label,
//       percentage: (count / questionData.total_responses) * 100,
//       color: colorPalette[index % colorPalette.length],
//     }));
//   };

//   const chartData = transformData(result);

//   console.log(result)
//   // console.log(chartData)
  
//   return (
//     <div>
//       <Piechart
//         data={data}
//         title="Question 1"
//         question="How would you rate the overall quality of care received at the health center?"
//       />

// {result.map((item:any, index:number) => {
//         // Skip items that don't have selected options
//         if (!item.selected_options || item.selected_options.length === 0) {
//           return null;
//         }

//         const chartData = transformData(item);
//         return (
//           <HorizontalBarChart
//             key={index}
//             title={`Question ${index + 1}`}
//             question={item.question}
//             data={chartData}
//           />
//         );
//       })}

//       <LineChart
//         title="Question 3"
//         question="Which of the following best describes your wait time for an appointment?"
//         labels={labels}
//         datasets={datasets}
//       />
//     </div>
//   );
// };

// export default Summary;


import React from "react";
import Piechart from "../charts/Piechart";
import HorizontalBarChart from "../charts/Horizontalbat";

interface SummaryProps {
  result: any[]; // assuming 'result' is an array of survey results
}

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

  return (
    <div>
      {result.map((item, index) => {
        // Skip items that don't have selected options
        if (!item.selected_options || item.selected_options.length === 0) {
          return null;
        }

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
              <HorizontalBarChart
                title={`Question ${index + 1}`}
                question={item.question}
                data={chartData.datasets[0].data.map((value, idx) => ({
                  label: chartData.labels[idx],
                  percentage: value,
                  color: chartData.datasets[0].backgroundColor[idx],
                }))}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
