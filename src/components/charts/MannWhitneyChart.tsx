import React from "react";
// import Plot from "react-plotly.js";

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
      u_statistic: 4218,
      p_value: 0.013,
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

  // Sample data
  const groupA = [0, 1, 1, 2, 2, 3, 4, 5, 6, 6, 7, 8];
  const groupB = [1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9];

  const formatPValue = (p: number): string => {
    if (p < 0.001) return "p < 0.001";
    return `p = ${p.toFixed(3)}`;
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4">{test_name}</h1>

      {/* <Plot
        data={[
          {
            x: groupA,
            type: "histogram",
            name: "Group A",
            opacity: 0.6,
            marker: { color: "rgba(139, 92, 246, 0.6)" }, // Light purple
            histnorm: "probability density",
          },
          {
            x: groupB,
            type: "histogram",
            name: "Group B",
            opacity: 0.6,
            marker: { color: "rgba(236, 72, 153, 0.6)" }, // Light pink
            histnorm: "probability density",
          },
        ]}
        layout={{
          title: {
            text: `U = ${testResult.u_statistic}, ${formatPValue(
              testResult.p_value
            )}`,
            font: { size: 16 },
            x: 0.5,
          },
          barmode: "overlay", // Overlap histograms
          xaxis: {
            title: "Value",
            range: [0, 10], // Adjust to match the range of your data
          },
          yaxis: {
            title: "Density",
          },
          legend: {
            title: { text: "Group" },
            orientation: "v",
            x: 1,
            y: 1,
          },
        }}
        config={{ responsive: true }}
      /> */}
    </div>
  );
};

export default MannWhitney;
