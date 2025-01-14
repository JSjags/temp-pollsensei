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
import { Copy } from "lucide-react";

interface DuplicateSurveyProps {
  openModal: boolean;
  onClose: () => void;
  isDuplicating?: boolean;
  onDuplicatingSurvey?: () => void;
}

const DuplicateSurvey: React.FC<DuplicateSurveyProps> = ({
  openModal,
  onClose,
  isDuplicating,
  onDuplicatingSurvey,
}) => {
  return (
    <AlertDialog open={openModal} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
              <Copy className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Duplicate Survey
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500">
                Are you sure you want to duplicate this survey? A new copy will
                be created.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-3 pt-4">
          <AlertDialogCancel className="rounded-lg border border-gray-200 bg-white hover:bg-gray-50/90 transition-colors duration-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDuplicatingSurvey}
            disabled={isDuplicating}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 disabled:opacity-50"
          >
            {isDuplicating ? "Duplicating..." : "Duplicate Survey"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DuplicateSurvey;
