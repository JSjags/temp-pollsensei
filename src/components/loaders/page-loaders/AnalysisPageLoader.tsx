"use client";

import { motion } from "framer-motion";
import React from "react";

const ContentBlock = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg p-4 ${className}`}>
    <div className="h-4 bg-gray-300 rounded-full w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
  </div>
);

export const Spinner = () => (
  <div className="inline-block size-20 relative">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="h-5 w-1.5 bg-purple-600 rounded-full absolute"
        style={{
          left: "50%",
          top: "30%",
          transform: `rotate(${i * 30}deg) translate(-50%, -100%)`,
          transformOrigin: "0% 100%",
          opacity: 1 - i * 0.07,
        }}
      ></div>
    ))}
  </div>
);

const ANALYSIS_STATES = [
  {
    title: "Analyzing Survey Responses",
    duration: 4000, // 4 seconds
  },
  {
    title: "Calculating Statistics",
    duration: 5000, // 5 seconds
  },
  {
    title: "Running Statistical Tests",
    duration: 4500, // 4.5 seconds
  },
  {
    title: "Generating Visualizations",
    duration: 6000, // 6 seconds
  },
  {
    title: "Preparing Insights",
    duration: 5500, // 5.5 seconds
  },
  {
    title: "Finalizing Analysis",
    duration: 4000, // 4 seconds
  },
];

const VARIABLE_EXTRACTION_STATES = [
  {
    title: "Scanning Document Structure",
    duration: 3500, // 3.5 seconds
  },
  {
    title: "Identifying Key Variables",
    duration: 5000, // 5 seconds
  },
  {
    title: "Processing Data Types",
    duration: 4000, // 4 seconds
  },
  {
    title: "Analyzing Response Patterns",
    duration: 5500, // 5.5 seconds
  },
  {
    title: "Mapping Variable Relationships",
    duration: 4500, // 4.5 seconds
  },
  {
    title: "Finalizing Variable Extraction",
    duration: 3500, // 3.5 seconds
  },
];

export const LoadingOverlay = ({
  title,
  subtitle,
  isAnalysing = false,
  isExtractingVariables = false,
}: {
  title?: string;
  subtitle?: string;
  isAnalysing?: boolean;
  isExtractingVariables?: boolean;
}) => {
  const [stateIndex, setStateIndex] = React.useState(0);

  React.useEffect(() => {
    // Reset state index when switching between modes
    setStateIndex(0);
  }, [isAnalysing, isExtractingVariables]);

  React.useEffect(() => {
    const states = isAnalysing ? ANALYSIS_STATES : VARIABLE_EXTRACTION_STATES;
    if (
      (!isAnalysing && !isExtractingVariables) ||
      stateIndex === states.length - 1
    )
      return;

    const timeout = setTimeout(() => {
      setStateIndex((prev) => prev + 1);
    }, states[stateIndex].duration);

    return () => clearTimeout(timeout);
  }, [isAnalysing, isExtractingVariables, stateIndex]);

  const getState = () => {
    if (isAnalysing) {
      return {
        title: ANALYSIS_STATES[stateIndex].title,
        subtitle: "Please wait while we conduct your analysis...",
      };
    }
    if (isExtractingVariables) {
      return {
        title: VARIABLE_EXTRACTION_STATES[stateIndex].title,
        subtitle: "Please wait while we extract your variables...",
      };
    }
    return {
      title: title ?? "Processing",
      subtitle: subtitle ?? "Hold on while we do the hard work for you.",
    };
  };

  const currentState = getState();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#00000070] z-[1000000] bg-opacity-75 flex items-center backdrop-blur-sm justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white z-[1000000] rounded-lg p-8 flex flex-col items-center max-w-sm w-full shadow-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Spinner />
        </motion.div>
        <motion.h2
          key={currentState.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-xl font-semibold text-gray-800"
        >
          {currentState.title}
        </motion.h2>
        <motion.p
          key={currentState.subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-gray-500 text-center"
        >
          {currentState.subtitle}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default function AnalysisLoadingScreen({
  isExtractingVariables = false,
}: {
  isAnalysing?: boolean;
  isExtractingVariables?: boolean;
}) {
  return (
    <div className="min-h-screen bg-gray-100 p-8 relative z-[100000]">
      <div className="space-y-6 max-w-7xl mx-auto">
        <ContentBlock className="h-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContentBlock className="h-64" />
          <ContentBlock className="h-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContentBlock className="h-48" />
          <ContentBlock className="h-48" />
          <ContentBlock className="h-48" />
        </div>
      </div>
      <LoadingOverlay isExtractingVariables={isExtractingVariables} />
    </div>
  );
}
