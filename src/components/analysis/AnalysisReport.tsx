import DynamicCharts from "./DynamicCharts";
import TestAnalysisReport from "./TestAnalysisReport";

export default function AnalysisReport({ testData }: { testData: any }) {
  const mockData = {
    variable_id: "var_001",
    survey_id: "survey_001",
    data: [
      {
        test_name:
          "How would you rate the overall quality of care received at the health center?",
        test_results: {
          overall_quality: {
            Excellent: 150,
            Good: 200,
            Fair: 100,
            Poor: 75,
          },
          country: null,
          address: null,
          age_range: null,
        },
      },
      {
        test_name:
          "Which of the following best describes your wait time for an appointment?",
        test_results: {
          overall_quality: null,
          country: null,
          address: null,
          age_range: {
            "Less than 15 minutes": 30,
            "15 - 30 minutes": 30,
            "31 - 60 minutes": 30,
            "More than 60 minutes": 10,
          },
        },
      },
    ],
    stats_test_result_id: "stats_001",
  };

  return (
    <div className="w-full mx-auto p-4 bg-[#F4F4F4]">
      {/* <TestAnalysisReport {...mockData} /> */}
      <DynamicCharts data={testData} />
    </div>
  );
}
