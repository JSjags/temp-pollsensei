import React from "react";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { Card } from "../ui/card";

const WordCloud = dynamic(() => import("react-wordcloud"), { ssr: false });

interface WordCloudWithLegendProps {
  words: { text: string; value: number }[];
  title: string;
  question: string;
  questionIndex: number;
  responsesCount: number;
  allowDownload: boolean;
}

// Define the color palette (same as in Summary.tsx)
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

const WordCloudWithLegend: React.FC<WordCloudWithLegendProps> = ({
  words,
  question,
  questionIndex,
  responsesCount,
  allowDownload,
  title,
}) => {
  const wordCloudId = `wordcloud-${questionIndex}`;
  const handleDownload = async () => {
    const element = document.getElementById(wordCloudId);
    if (element) {
      const canvas = await html2canvas(element, { backgroundColor: "#fff" });
      const link = document.createElement("a");
      link.download = `wordcloud-question-${questionIndex + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="my-6 rounded-lg">
      <Card className="p-6 flex flex-col items-center justify-between min-h-[200px] shadow w-full">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4 w-full">
            <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
            {allowDownload && (
              <Button
                onClick={handleDownload}
                variant="outline"
                size="icon"
                title="Download Word Cloud"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-gray-600 mb-4 w-full">{question}</p>
        </div>

        <div
          id={wordCloudId}
          className="w-full flex items-center justify-between"
        >
          <div className="w-fit max-w-[30%] flex flex-col gap-2 items-start mx-auto">
            {words.map((word) => (
              <div key={word.text} className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-400"></span>
                <span className="text-gray-700 font-bold">
                  {word.text} : <span className="">{word.value}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="w-full flex-1 h-80 mb-4">
            <WordCloud
              words={words}
              options={{
                fontSizes: [18, 48],
                rotations: 2,
                rotationAngles: [0, 90],
                colors: colorPalette,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WordCloudWithLegend;
