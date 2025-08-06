"use client";

import { motion } from "framer-motion";
import React from "react";
import { AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function AnalysisErrorComponent({
  externalRetry,
}: {
  externalRetry?: () => void;
}) {
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
    <AlertDialog open={showError}>
      <AlertDialogContent
        className="max-w-sm w-full z-[100000]"
        overlayClassName="z-[100000]"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <AlertDialogTitle className="mt-4 text-xl font-semibold text-gray-800 text-center">
          Error Occurred
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-sm text-gray-500 text-center">
          An error occurred while processing your request. Please try again.
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-6 flex justify-center">
          {externalRetry ? (
            <Button
              onClick={() => {
                externalRetry();
                setShowError(false);
              }}
              className="px-4 py-2 !bg-purple-600 text-white rounded-md hover:!bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Retry
            </Button>
          ) : (
            <Button
              onClick={() => {
                window.location.reload();
              }}
              className="px-4 py-2 !bg-purple-600 text-white rounded-md hover:!bg-purple-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reload
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
