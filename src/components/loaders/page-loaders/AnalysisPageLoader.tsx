"use client";

import { motion } from "framer-motion";
import React from "react";

const ContentBlock = ({ className }: { className?: string }) => (
  <div className={`bg-gray-200 rounded-lg p-4 ${className}`}>
    <div className="h-4 bg-gray-300 rounded-full w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded-full w-1/2"></div>
  </div>
);

const Spinner = () => (
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

const LoadingOverlay = () => (
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
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Spinner />
      </motion.div>
      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Extracting Variables
      </h2>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Hold on while we do the hard work for you.
      </p>
    </motion.div>
  </motion.div>
);

export default function AnalysisLoadingScreen() {
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
      <LoadingOverlay />
    </div>
  );
}
