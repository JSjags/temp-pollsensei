import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Pencil } from "lucide-react";

interface RenameSurveyProps {
  onClose: () => void;
  openModal: boolean;
  isEditing?: boolean;
  onRenameSurvey?: () => void;
  surveyName?: string;
  setSurveyName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RenameSurvey: React.FC<RenameSurveyProps> = ({
  onClose,
  openModal,
  isEditing,
  onRenameSurvey,
  surveyName,
  setSurveyName,
}) => {
  const [showError, setShowError] = useState(false);
  const isNameValid = surveyName && surveyName.trim().length > 0;

  return (
    <AlertDialog open={openModal} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center shadow-inner">
              <Pencil className="h-6 w-6 text-purple-600 animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Rename Survey
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500">
                Give your survey a new identity
              </AlertDialogDescription>
            </div>
          </div>
          <div className="mt-4">
            <input
              value={surveyName}
              onChange={setSurveyName}
              onBlur={() => setShowError(true)}
              onFocus={() => setShowError(false)}
              type="text"
              placeholder="Enter new survey name"
              className="w-full rounded-lg border border-gray-200 bg-white/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            {showError && !isNameValid && surveyName !== undefined && (
              <p className="mt-2 text-sm text-red-500">
                Please enter a survey name
              </p>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-3 pt-6">
          <AlertDialogCancel className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50/90 transition-colors duration-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onRenameSurvey}
            disabled={isEditing || !isNameValid}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25 disabled:opacity-50"
          >
            {isEditing ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Renaming...
              </span>
            ) : (
              "Rename Survey"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RenameSurvey;
