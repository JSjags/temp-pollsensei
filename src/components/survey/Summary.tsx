import React from "react";
import Piechart from "../charts/Piechart";
import HorizontalBarChart from "../charts/Horizontalbat";
import LineChart from "../charts/SurveyLineChart";

const data = {
  labels: ["Excellent", "Good", "Fair", "Poor"],
  datasets: [
    {
      data: [30, 35, 20, 15],
      backgroundColor: ["#8B5CF6", "#FBBF24", "#3B82F6", "#EC4899"],
    },
  ],
};

const data1 = [
  { label: "Less than 15 minutes", percentage: 80, color: "#8B5CF6" }, // Purple
  { label: "15 - 30 minutes", percentage: 60, color: "#FBBF24" }, // Yellow
  { label: "31 - 60 minutes", percentage: 40, color: "#EC4899" }, // Pink
  { label: "More than 60 minutes", percentage: 20, color: "#3B82F6" }, // Blue
];

const labels = [
  "1 Oct",
  "3 Oct",
  "7 Oct",
  "10 Oct",
  "14 Oct",
  "20 Oct",
  "23 Oct",
  "27 Oct",
  "30 Oct",
];

const datasets = [
  {
    label: "Wire transfer",
    data: [1, 2, 1.5, 3, 4, 3.5, 2.5, 2, 3],
    borderColor: "#8B5CF6", // Purple
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  {
    label: "Mobile payment",
    data: [1, 1.5, 2, 2.5, 3.5, 3, 2.8, 2.2, 2.5],
    borderColor: "#EC4899", // Pink
    backgroundColor: "rgba(236, 72, 153, 0.2)",
  },
];

const Summary = () => {
  
  return (
    <div>
      <Piechart
        data={data}
        title="Question 1"
        question="How would you rate the overall quality of care received at the health center?"
      />

      <HorizontalBarChart
        title="Question 2"
        question="Which of the following best describes your wait time for an appointment?"
        data={data1}
      />

      <LineChart
        title="Question 3"
        question="Which of the following best describes your wait time for an appointment?"
        labels={labels}
        datasets={datasets}
      />
    </div>
  );
};

export default Summary;
