import React from "react";
import Piechart from "../charts/Piechart";
import HorizontalBarChart from "../charts/Horizontalbat";
import BarChart from "../charts/BarChart";
import { Card } from "../ui/card";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import WordCloudWithLegend from "./WordCloudWithLegend";

// Dynamically import react-wordcloud to avoid SSR issues
const WordCloud = dynamic(() => import("react-wordcloud"), { ssr: false });

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

const stopwords = [
  "the",
  "is",
  "in",
  "at",
  "of",
  "a",
  "and",
  "to",
  "for",
  "on",
  "with",
  "as",
  "by",
  "an",
  "be",
  "are",
  "was",
  "were",
  "it",
  "that",
  "this",
  "has",
  "have",
  "from",
  "or",
  "but",
  "not",
  "no",
  "so",
  "if",
  "then",
  "than",
  "about",
  "only",
  "also",
  "should",
  "do",
  "does",
  "did",
  "can",
  "will",
  "would",
  "could",
  "may",
  "might",
  "into",
  "out",
  "up",
  "down",
  "over",
  "under",
  "such",
  "their",
  "there",
  "which",
  "who",
  "whom",
  "whose",
  "what",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "each",
  "other",
  "some",
  "more",
  "most",
  "many",
  "much",
  "very",
  "just",
  "like",
  "get",
  "got",
  "make",
  "made",
  "use",
  "used",
  "using",
  "i",
  "me",
  "my",
  "we",
  "us",
  "our",
  "you",
  "your",
  "he",
  "him",
  "his",
  "she",
  "her",
  "they",
  "them",
  "their",
  "its",
  "it's",
  "don't",
  "didn't",
  "doesn't",
  "can't",
  "won't",
  "shouldn't",
  "couldn't",
  "wouldn't",
  "tbh",
  "n/a",
  "nil",
  "nill",
  "no idea",
  "not sure",
  "na",
  "none",
];

function getTopWords(textResponses: string[], topN: number = 10) {
  // Merge all responses into one string
  const merged = textResponses.join(" ").toLowerCase();
  // Remove punctuation and split into words
  const words = merged.replace(/[^a-zA-Z0-9\s']/g, "").split(/\s+/);
  // Count occurrences, ignoring stopwords and short words
  const freq: Record<string, number> = {};
  for (const word of words) {
    const w = word.trim();
    if (w.length < 3 || stopwords.includes(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  // Sort by frequency and take top N
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([text, value]) => ({ text, value }));
  return sorted;
}

const Summary: React.FC<SummaryProps> = ({ result }) => {
  // console.log("result", result);

  const transformDataForChart = (questionData: any) => {
    const { question_type } = questionData;
    let optionCounts: Record<string, number> = {};
    let totalCount = 0;

    switch (question_type) {
      case "single_choice":
      case "multiple_choice":
        if (!questionData.selected_options?.length) return null;
        questionData.selected_options?.forEach((option: string[]) => {
          option.forEach((choice) => {
            optionCounts[choice] = (optionCounts[choice] || 0) + 1;
            totalCount++;
          });
        });
        break;

      case "checkbox":
        if (!questionData.selected_options?.length) return null;
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
        if (!booleanResponses.length) return null;
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
        if (!questionData.scale_responses?.length) return null;
        questionData.scale_responses?.forEach((response: string) => {
          optionCounts[response] = (optionCounts[response] || 0) + 1;
          totalCount++;
        });
        break;

      case "slider":
        if (!questionData.scale_responses?.length) return null;
        questionData.scale_responses?.forEach((response: string) => {
          optionCounts[response] = (optionCounts[response] || 0) + 1;
          totalCount++;
        });
        break;

      case "drop_down":
        if (!questionData.drop_down_responses?.length) return null;
        questionData.drop_down_responses?.forEach((response: string) => {
          optionCounts[response] = (optionCounts[response] || 0) + 1;
          totalCount++;
        });
        break;

      case "long_text":
        if (!questionData.text_responses?.length) return null;
        // For long text, we'll show a simple "Responses Received" count
        optionCounts = {
          "Responses Received": questionData.text_responses.length,
        };
        totalCount = questionData.text_responses.length;
        break;

      case "number":
        const numbers = questionData.number_responses || [];
        if (!numbers.length) return null;
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
        break;

      default:
        return null;
    }

    if (totalCount === 0) return null;

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

  if (!result || result.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-muted-foreground max-w-sm">
          There are no responses to analyze yet. Check back once users start
          responding to your survey.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {result?.map((item, index) => {
        const chartData = transformDataForChart(item);

        if (!chartData) {
          return (
            <div key={index} className="my-6 rounded-lg">
              <Card className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center shadow">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
                <h4 className="text-base font-medium mb-2">
                  Question {index + 1}
                </h4>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Not enough responses to generate a meaningful summary. More
                  data is needed to create statistical visualizations.
                </p>
              </Card>
            </div>
          );
        }

        const shouldUsePieChart =
          item.question_type === "single_choice" ||
          item.question_type === "multiple_choice" ||
          (chartData.labels.length > 2 && item.question_type !== "number");

        if (
          item.question_type === "long_text" &&
          item.text_responses?.length > 1
        ) {
          const topWords = getTopWords(item.text_responses, 10);
          return (
            <WordCloudWithLegend
              words={topWords}
              question={item.question}
              questionIndex={index}
              responsesCount={item.text_responses.length}
              title={`Question ${index + 1}`}
              allowDownload
            />
          );
        }

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
