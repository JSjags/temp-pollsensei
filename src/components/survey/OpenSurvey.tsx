import React from "react";
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
import { AlertCircle } from "lucide-react";

interface OpenSurveyProps {
  onClose: () => void;
  openModal: boolean;
  isOpening?: boolean;
  onOpenSurvey?: () => void;
}

const OpenSurvey: React.FC<OpenSurveyProps> = ({
  onClose,
  openModal,
  onOpenSurvey,
  isOpening,
}) => {
  return (
    <AlertDialog open={openModal} onOpenChange={onClose}>
      <AlertDialogContent
        className="sm:max-w-[425px] z-[100000]"
        overlayClassName="z-[100000]"
      >
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                Open survey?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500">
                Are you sure you want to start receiving responses for this
                survey?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-3 pt-4">
          <AlertDialogCancel onClick={onClose} className="hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onOpenSurvey}
            disabled={isOpening}
            className="bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
          >
            {isOpening ? "Opening..." : "Open Survey"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OpenSurvey;
