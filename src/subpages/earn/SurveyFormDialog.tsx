"use client";
import React, { FC } from "react";
import { IoClose } from "react-icons/io5";
import PublicResponse from "@/subpages/survey/PublicResponseClone";
import { useSelector } from "react-redux";
import { selectSurveyID } from "@/redux/slices/earnDialogSlice";

interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurveyFormDialog: FC<SurveyDialogProps> = ({ open, onOpenChange }) => {
  const surveyID = useSelector(selectSurveyID);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[1000000] flex items-center justify-center w-full h-full">
          <div className="fixed left-[50%] top-[50%] z-[1000000] grid w-full max-w-[90%] min-h-[95vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-auto">
            <IoClose
              onClick={() => onOpenChange(false)}
              className="text-xl text-black cursor-pointer absolute top-2 right-2"
            />
            <PublicResponse surveyId={surveyID} />
          </div>
        </div>
      )}
    </>
  );
};
export default SurveyFormDialog;
