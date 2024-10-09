"use client";

import { motion } from "framer-motion";
import React from "react";
import { AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ContentBlock = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg p-4 ${className}`}>
    <div className="h-4 bg-gray-300 rounded-full w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
  </div>
);

const ErrorOverlay = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="bg-white rounded-lg p-8 flex flex-col items-center max-w-sm w-full shadow-lg"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Error Occurred
      </h2>
      <p className="mt-2 text-sm text-gray-500 text-center">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Retry
      </button>
    </motion.div>
  </motion.div>
);

export default function AnalysisErrorComponent() {
  const queryClient = useQueryClient();
  const [showError, setShowError] = React.useState(true);

  const handleRetry = () => {
    // Simulating a retry action
    // setShowError(false);
    // setTimeout(() => setShowError(true), 1000);
    queryClient.refetchQueries({
      queryKey: ["survey-variables"],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
      {showError && (
        <ErrorOverlay
          message="An error occurred while processing your request. Please try again."
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
